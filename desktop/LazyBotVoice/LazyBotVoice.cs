/*
 * Kuroop - a Jarvis-style voice assistant for LazyTools.io.
 *
 * Wake word: say "Hey Kuroop". He wakes, pops onto your desktop, and greets
 * you. Then ask (or type) anything about the site - status, health, score,
 * how many tools are left to the target, privacy, findings - and he reads the
 * LIVE audit ledger from GitHub and speaks the answer. He can also open the
 * visual dashboard, and log a task back into the repo for Claude Code to pick
 * up in chat.
 *
 * Offline speech (Windows System.Speech) - no API keys, no installs. The only
 * network calls are fetching the public ledger JSON and opening the dashboard.
 * Built for .NET Framework 4 (C# 5) so it runs on any Windows with zero deps.
 *
 * Args:  --active  start awake (skip the wake word).
 */
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Net;
using System.Runtime.InteropServices;
using System.Text;
using System.Speech.Recognition;
using System.Speech.Synthesis;
using System.Web.Script.Serialization;

class Kuroop
{
    const string LEDGER_URL = "https://raw.githubusercontent.com/Synth88Labs/lazytools.io/main/audits/ledger.json";
    const string DASHBOARD_URL = "https://raw.githack.com/Synth88Labs/lazytools.io/main/audits/dashboard.html";
    const int BUILD_TARGET = 1500;
    // Where spoken tasks are logged for Claude Code to read in chat.
    const string REPO_INBOX = @"C:\Users\rupak\OneDrive\Desktop\Claude Code Projects\LazyTools\desktop\LazyBotVoice\tasks-inbox.md";

    static readonly SpeechSynthesizer Tts = new SpeechSynthesizer();
    static readonly object Gate = new object();
    static volatile bool Active = false;
    static volatile bool Capturing = false;

    static SpeechRecognitionEngine Rec;
    static Grammar CmdGrammar, DictGrammar;

    static readonly string[] Wake = { "hey kuroop", "hi kuroop", "hello kuroop", "okay kuroop", "kuroop", "hey kurup", "hey karoop", "hey kuru", "hey group" };
    static readonly string[] Sleep = { "go to sleep", "goodbye", "never mind", "that's all", "stand by", "sleep now" };

    [DllImport("kernel32.dll")] static extern IntPtr GetConsoleWindow();
    [DllImport("user32.dll")] static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
    [DllImport("user32.dll")] static extern bool SetForegroundWindow(IntPtr hWnd);
    const int SW_RESTORE = 9;

    static void Main(string[] args)
    {
        try { ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072 | (SecurityProtocolType)12288; } catch { }
        Console.Title = "Kuroop - say 'Hey Kuroop'";
        try { Tts.SetOutputToDefaultAudioDevice(); Tts.Rate = 1; } catch { }
        TryPickVoice();

        bool startActive = false;
        foreach (string a in args) if (a != null && a.ToLowerInvariant().Contains("active")) startActive = true;

        Banner();

        try
        {
            Rec = new SpeechRecognitionEngine(new CultureInfo("en-US"));
            List<string> phrases = new List<string>();
            phrases.AddRange(Wake);
            phrases.AddRange(Sleep);
            phrases.AddRange(new string[] {
                "status", "update", "daily update", "give me an update", "summary", "report", "briefing",
                "health", "website health", "how are we doing", "how is the website", "are we healthy",
                "findings", "issues", "problems", "bugs",
                "score", "quality", "average score",
                "how many tools", "how many are built", "how far are we", "how many left", "how much is left", "to target", "build progress",
                "coverage", "how many audited",
                "privacy", "trackers", "any trackers",
                "challenged", "anything stuck", "what needs me",
                "open the dashboard", "show me the dashboard", "load the dashboard", "open dashboard", "show dashboard",
                "log a task", "add a task", "remind me", "note this", "tell claude", "send to claude",
                "help", "what can you do", "exit", "quit"
            });
            GrammarBuilder gb = new GrammarBuilder(new Choices(phrases.ToArray()));
            gb.Culture = new CultureInfo("en-US");
            CmdGrammar = new Grammar(gb);
            DictGrammar = new DictationGrammar();
            DictGrammar.Enabled = false;
            Rec.LoadGrammar(CmdGrammar);
            Rec.LoadGrammar(DictGrammar);
            Rec.SetInputToDefaultAudioDevice();
            Rec.SpeechRecognized += OnSpeech;
            Rec.RecognizeAsync(RecognizeMode.Multiple);
            Console.WriteLine("[mic] Listening for the wake word...\n");
        }
        catch (Exception ex)
        {
            Console.WriteLine("[mic] Voice input unavailable (" + ex.Message + "). You can still type commands.\n");
        }

        if (startActive) Activate();
        else Speak("Kuroop standing by. Say, Hey Kuroop, whenever you need me, sir.");

        while (true)
        {
            string line = Console.ReadLine();
            if (line == null) { System.Threading.Thread.Sleep(250); continue; }
            RouteTyped(line);
        }
    }

    static void OnSpeech(object sender, SpeechRecognizedEventArgs e)
    {
        if (e.Result == null) return;
        string t = e.Result.Text.ToLowerInvariant();
        float c = e.Result.Confidence;

        if (Capturing) { FinishCapture(e.Result.Text); return; }

        if (!Active)
        {
            if (Matches(t, Wake) && c >= 0.55f) { Console.WriteLine("\n[heard] " + e.Result.Text); Activate(); }
            return;
        }

        if (c < 0.5f) return;
        Console.WriteLine("\n[heard] " + e.Result.Text);
        if (Matches(t, Sleep)) GoToSleep();
        else HandleIntent(t);
    }

    static void RouteTyped(string line)
    {
        string raw = line.Trim();
        string t = raw.ToLowerInvariant();
        if (t.Length == 0) return;
        if (Capturing) { FinishCapture(raw); return; }
        if (Matches(t, Wake)) { Activate(); return; }
        if (!Active) Active = true;
        // typed shortcut: "task: buy milk" logs directly
        if (t.StartsWith("task:") || t.StartsWith("task ") || t.StartsWith("remind me")) { LogTask(StripLead(raw)); return; }
        if (Matches(t, Sleep)) { GoToSleep(); return; }
        HandleIntent(t);
    }

    static void Activate()
    {
        lock (Gate)
        {
            Active = true;
            try { IntPtr h = GetConsoleWindow(); if (h != IntPtr.Zero) { ShowWindow(h, SW_RESTORE); SetForegroundWindow(h); } } catch { }
            Speak("At your service. Kuroop online. How may I help?");
        }
    }

    static void GoToSleep()
    {
        lock (Gate)
        {
            Speak("Very good. I'll be listening for, Hey Kuroop.");
            Active = false;
        }
    }

    // ---- intent router (broad, so it answers whatever you ask about the site) ----
    static void HandleIntent(string t)
    {
        lock (Gate)
        {
            if (Has(t, "exit") || Has(t, "quit") || Has(t, "shut down") || Has(t, "power down"))
            {
                Speak("Powering down. Goodbye for now, sir.");
                Environment.Exit(0);
            }
            else if (Has(t, "help") || Has(t, "what can you do"))
                Speak("Ask me for status, health, the quality score, build progress, privacy, findings, or what needs your attention. I can open the dashboard, or log a task for Claude. Say go to sleep for standby, or exit to close me.");
            else if (Has(t, "dashboard") || Has(t, "load the page") || Has(t, "show me the"))
                OpenDashboard();
            else if (Has(t, "log a task") || Has(t, "add a task") || Has(t, "remind") || Has(t, "note this") || Has(t, "tell claude") || Has(t, "send to claude"))
                BeginCapture();
            else if (Has(t, "health") || Has(t, "how are we") || Has(t, "healthy"))
                HealthReport();
            else if (Has(t, "privacy") || Has(t, "tracker"))
                PrivacyReport();
            else if (Has(t, "score") || Has(t, "quality") || Has(t, "average"))
                ScoreReport();
            else if (Has(t, "coverage") || Has(t, "audited"))
                CoverageReport();
            else if (Has(t, "challenged") || Has(t, "stuck") || Has(t, "needs me") || Has(t, "attention"))
                ChallengedReport();
            else if (Has(t, "how many tool") || Has(t, "how far") || Has(t, "left") || Has(t, "to target") || Has(t, "build") || Has(t, "remaining") || Has(t, "progress"))
                BuildReport();
            else if (Has(t, "finding") || Has(t, "issue") || Has(t, "problem") || Has(t, "bug"))
                FindingsReport();
            else if (Has(t, "status") || Has(t, "update") || Has(t, "summary") || Has(t, "report") || Has(t, "brief"))
                StatusReport();
            else
                Speak("I'm afraid I didn't catch that. You can ask for status, health, the score, build progress, privacy, findings, the dashboard, or to log a task.");
        }
    }

    // ---- task relay to Claude Code chat -------------------------------------
    static void BeginCapture()
    {
        Capturing = true;
        try { if (DictGrammar != null) DictGrammar.Enabled = true; if (CmdGrammar != null) CmdGrammar.Enabled = false; } catch { }
        Speak("Go ahead - what's the task?");
    }

    static void FinishCapture(string text)
    {
        Capturing = false;
        try { if (DictGrammar != null) DictGrammar.Enabled = false; if (CmdGrammar != null) CmdGrammar.Enabled = true; } catch { }
        if (text == null || text.Trim().Length == 0) { Speak("No task captured."); return; }
        LogTask(text.Trim());
    }

    static void LogTask(string task)
    {
        string stamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm", CultureInfo.InvariantCulture);
        string line = "- [ ] " + stamp + " - " + task + Environment.NewLine;
        bool ok = TryAppend(REPO_INBOX, line);
        if (!ok)
        {
            string local = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "tasks-inbox.md");
            ok = TryAppend(local, line);
        }
        if (ok) Speak("Logged. I've noted the task for Claude - ask Claude to check the task inbox in chat and it'll pick it up.");
        else Speak("I couldn't write the task file, sir.");
    }

    static bool TryAppend(string path, string line)
    {
        try
        {
            if (!File.Exists(path))
                File.WriteAllText(path, "# Kuroop task inbox\n\nSpoken tasks land here. In Claude Code chat, say \"check the task inbox\" and Claude will action open items.\n\n", new UTF8Encoding(false));
            File.AppendAllText(path, line, new UTF8Encoding(false));
            Console.WriteLine("[task] " + line.Trim());
            return true;
        }
        catch { return false; }
    }

    static void OpenDashboard()
    {
        try { Process.Start(new ProcessStartInfo(DASHBOARD_URL) { UseShellExecute = true }); Speak("Opening the control room dashboard."); }
        catch (Exception ex) { Speak("I couldn't open the dashboard. " + ex.Message); }
    }

    // ---- reports -------------------------------------------------------------
    static void StatusReport()
    {
        Dictionary<string, object> root = Fetch(); if (root == null) return;
        Stats s = Compute(root);
        StringBuilder sb = new StringBuilder();
        sb.Append("Here is the LazyTools report");
        if (s.RunDate.Length > 0) sb.Append(" for " + SpokenDate(s.RunDate));
        sb.Append(", sir. ");
        if (s.HasRun) sb.Append("The auditor checked " + s.RunTools + " tools, scoring " + s.RunAvg + " percent on average, and logged " + s.RunIssues + " issues. ");
        sb.Append("Across all audits, " + s.Open + " findings are open");
        if (s.High > 0) sb.Append(", " + s.High + " of them high priority");
        sb.Append(". The fixer has " + s.Verifying + " awaiting verification, " + s.Complete + " completed");
        sb.Append(s.Challenged > 0 ? (" and " + s.Challenged + " challenged. ") : " and nothing challenged. ");
        if (s.Catalogue > 0) sb.Append("The catalogue stands at " + s.Catalogue + " tools, about " + s.BuildPct + " percent toward the " + BUILD_TARGET + " target.");
        Speak(sb.ToString());
    }

    static void HealthReport()
    {
        Dictionary<string, object> root = Fetch(); if (root == null) return;
        Stats s = Compute(root);
        int score = s.HasRun ? s.RunAvg : 0;
        string rating = score >= 90 ? "excellent" : score >= 80 ? "good" : score >= 70 ? "fair" : score > 0 ? "in need of attention" : "not yet measured";
        StringBuilder sb = new StringBuilder();
        sb.Append("Website health is " + rating + ", sir. ");
        if (s.HasRun) sb.Append("The latest average quality score is " + score + " percent across " + s.RunTools + " audited tools. ");
        sb.Append(s.High + " high priority " + (s.High == 1 ? "issue is" : "issues are") + " open");
        if (s.Privacy > 0) sb.Append(", including " + s.Privacy + " privacy " + (s.Privacy == 1 ? "flag" : "flags") + " worth your attention");
        sb.Append(". ");
        sb.Append(s.Challenged > 0 ? (s.Challenged + " fixes are challenged and need a human. ") : "No fixes are stuck. ");
        Speak(sb.ToString());
    }

    static void FindingsReport()
    {
        Dictionary<string, object> root = Fetch(); if (root == null) return;
        Stats s = Compute(root);
        StringBuilder sb = new StringBuilder();
        sb.Append(s.Open + " open findings, sir. " + s.High + " high, " + s.Medium + " medium, " + s.Low + " low. ");
        if (s.TopCategory.Length > 0) sb.Append("The most common area is " + Spoken(s.TopCategory) + ", with " + s.TopCategoryCount + " findings. ");
        if (s.Privacy > 0) sb.Append(s.Privacy + " are privacy related. ");
        Speak(sb.ToString());
    }

    static void BuildReport()
    {
        Dictionary<string, object> root = Fetch(); if (root == null) return;
        Stats s = Compute(root);
        int left = BUILD_TARGET - s.Catalogue; if (left < 0) left = 0;
        Speak("We're at " + s.Catalogue + " tools, sir - about " + s.BuildPct + " percent of the " + BUILD_TARGET + " target, with " + left + " to go.");
    }

    static void ScoreReport()
    {
        Dictionary<string, object> root = Fetch(); if (root == null) return;
        Stats s = Compute(root);
        if (s.HasRun) Speak("The latest average quality score is " + s.RunAvg + " percent, over " + s.RunTools + " tools audited on " + SpokenDate(s.RunDate) + ".");
        else Speak("No score has been recorded yet, sir.");
    }

    static void CoverageReport()
    {
        Dictionary<string, object> root = Fetch(); if (root == null) return;
        Stats s = Compute(root);
        int pct = s.Catalogue > 0 ? (int)Math.Round((double)s.Audited * 100.0 / s.Catalogue) : 0;
        Speak("Audit coverage is " + s.Audited + " of " + s.Catalogue + " tools, about " + pct + " percent, on a rolling ten-per-day sweep.");
    }

    static void PrivacyReport()
    {
        Dictionary<string, object> root = Fetch(); if (root == null) return;
        Stats s = Compute(root);
        if (s.Privacy > 0) Speak(s.Privacy + " privacy " + (s.Privacy == 1 ? "finding is" : "findings are") + " open, sir - most are the third party ad tracker flagged on tool pages. I'd recommend clearing it.");
        else Speak("No open privacy findings, sir. All clear.");
    }

    static void ChallengedReport()
    {
        Dictionary<string, object> root = Fetch(); if (root == null) return;
        Stats s = Compute(root);
        if (s.Challenged > 0) Speak(s.Challenged + " " + (s.Challenged == 1 ? "item is" : "items are") + " challenged and need a human, sir.");
        else if (s.High > 0) Speak("Nothing is challenged, but " + s.High + " high priority findings are open and worth a look.");
        else Speak("Nothing needs your attention right now, sir. All under control.");
    }

    // ---- data ----------------------------------------------------------------
    class Stats
    {
        public int Open, High, Medium, Low, Verifying, Complete, Challenged, Privacy;
        public int Catalogue, Audited, BuildPct;
        public bool HasRun;
        public string RunDate = "";
        public int RunTools, RunAvg, RunIssues, RunResolved;
        public string TopCategory = "";
        public int TopCategoryCount;
    }

    static Stats Compute(Dictionary<string, object> root)
    {
        Stats s = new Stats();
        Dictionary<string, object> findings = Get(root, "findings") as Dictionary<string, object>;
        Dictionary<string, int> catTally = new Dictionary<string, int>();
        if (findings != null)
        {
            foreach (object v in findings.Values)
            {
                Dictionary<string, object> f = v as Dictionary<string, object>;
                if (f == null) continue;
                string st = Str(f, "status"); string sev = Str(f, "severity"); string cat = Str(f, "category");
                if (st == "open")
                {
                    s.Open++;
                    if (sev == "high" || sev == "critical") s.High++;
                    else if (sev == "medium") s.Medium++;
                    else s.Low++;
                    if (cat == "privacy") s.Privacy++;
                    if (cat.Length > 0) { int c; catTally.TryGetValue(cat, out c); catTally[cat] = c + 1; }
                }
                else if (st == "verifying" || st == "fixed") s.Verifying++;
                else if (st == "complete") s.Complete++;
                else if (st == "challenged") s.Challenged++;
            }
        }
        foreach (KeyValuePair<string, int> kv in catTally)
            if (kv.Value > s.TopCategoryCount) { s.TopCategoryCount = kv.Value; s.TopCategory = kv.Key; }
        object[] runs = Get(root, "runs") as object[];
        if (runs != null && runs.Length > 0)
        {
            Dictionary<string, object> last = runs[runs.Length - 1] as Dictionary<string, object>;
            if (last != null)
            {
                s.HasRun = true; s.RunDate = Str(last, "date");
                s.RunTools = Int(last, "tools"); s.RunAvg = Int(last, "avg");
                s.RunIssues = Int(last, "issues"); s.RunResolved = Int(last, "resolved");
            }
        }
        s.Catalogue = Int(root, "catalogueSize");
        object[] at = Get(root, "auditedTools") as object[];
        s.Audited = at == null ? 0 : at.Length;
        if (s.Catalogue > 0) s.BuildPct = (int)Math.Round((double)s.Catalogue * 100.0 / BUILD_TARGET);
        return s;
    }

    static Dictionary<string, object> Fetch()
    {
        try
        {
            Console.WriteLine("[net] fetching live status...");
            using (WebClient wc = new WebClient())
            {
                wc.Encoding = Encoding.UTF8;
                wc.Headers.Add("User-Agent", "Kuroop/1.0");
                wc.Headers.Add("Cache-Control", "no-cache");
                string json = wc.DownloadString(LEDGER_URL + "?t=" + DateTime.UtcNow.Ticks);
                JavaScriptSerializer js = new JavaScriptSerializer(); js.MaxJsonLength = 64 * 1024 * 1024;
                return js.DeserializeObject(json) as Dictionary<string, object>;
            }
        }
        catch (Exception ex) { Speak("Sorry, I couldn't reach the status page. " + ex.Message); return null; }
    }

    // ---- helpers -------------------------------------------------------------
    static object Get(Dictionary<string, object> d, string k) { object v; return (d != null && d.TryGetValue(k, out v)) ? v : null; }
    static string Str(Dictionary<string, object> d, string k) { object v = Get(d, k); return v == null ? "" : v.ToString(); }
    static int Int(Dictionary<string, object> d, string k) { object v = Get(d, k); if (v == null) return 0; try { return Convert.ToInt32(v, CultureInfo.InvariantCulture); } catch { return 0; } }
    static bool Has(string h, string n) { return h.IndexOf(n, StringComparison.Ordinal) >= 0; }
    static bool Matches(string t, string[] set) { foreach (string p in set) if (t.IndexOf(p, StringComparison.Ordinal) >= 0) return true; return false; }
    static string StripLead(string raw)
    {
        string t = raw.TrimStart();
        string[] leads = { "task:", "task ", "remind me to ", "remind me ", "note this ", "note " };
        foreach (string l in leads) if (t.ToLowerInvariant().StartsWith(l)) return t.Substring(l.Length).Trim();
        return t;
    }
    static string Spoken(string c)
    {
        switch (c) { case "seo": return "search engine optimization"; case "a11y": return "accessibility"; case "io": return "input and output"; case "perf": return "performance"; default: return c; }
    }
    static string SpokenDate(string ymd)
    {
        DateTime dt;
        if (DateTime.TryParseExact(ymd, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out dt)) return dt.ToString("MMMM d", CultureInfo.InvariantCulture);
        return ymd;
    }
    static void TryPickVoice()
    {
        try
        {
            foreach (InstalledVoice iv in Tts.GetInstalledVoices())
            {
                if (iv.Enabled && iv.VoiceInfo != null && iv.VoiceInfo.Name.IndexOf("David", StringComparison.OrdinalIgnoreCase) >= 0)
                { Tts.SelectVoice(iv.VoiceInfo.Name); return; }
            }
        }
        catch { }
    }
    static void Speak(string text)
    {
        Console.WriteLine("[Kuroop] " + text + "\n");
        try { Tts.Speak(text); } catch { }
    }
    static void Banner()
    {
        Console.WriteLine("=================================================");
        Console.WriteLine("   K U R O O P   -   wake word: \"Hey Kuroop\"");
        Console.WriteLine("=================================================");
        Console.WriteLine("Ask: status | health | score | build progress |");
        Console.WriteLine("     privacy | findings | coverage | dashboard |");
        Console.WriteLine("     log a task    (\"go to sleep\" / \"exit\")");
        Console.WriteLine("You can also type any of these below.");
        Console.WriteLine();
    }
}
