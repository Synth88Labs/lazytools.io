/*
 * Kuroop - a Jarvis-style voice assistant for LazyTools.io.
 *
 * Wake word: say "Hey Kuroop". He wakes, pops onto your desktop, and greets
 * you. Then ask (or type) anything about the site. Common questions are
 * answered instantly by an offline intent engine; anything else is passed to
 * a Claude brain (Anthropic Messages API) that reasons over the live data -
 * so you can genuinely "ask him anything".
 *
 * Speech is offline (Windows System.Speech). The Claude brain is optional and
 * only used for questions the offline engine doesn't recognise; it needs an
 * API key in the ANTHROPIC_API_KEY environment variable (or
 * %LOCALAPPDATA%\Kuroop\apikey.txt). The key is NEVER stored in the repo.
 *
 * Built for .NET Framework 4 (C# 5) so it runs on any Windows with zero deps.
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
    const string DASHBOARD_URL = "https://htmlpreview.github.io/?https://github.com/Synth88Labs/lazytools.io/blob/main/audits/dashboard.html";
    const string ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
    const int BUILD_TARGET = 1500;
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
        Console.WriteLine(BrainKey() != null ? "[brain] Claude brain: ENABLED (fallback for free-form questions)\n" : "[brain] Claude brain: off (set ANTHROPIC_API_KEY to enable free-form Q&A)\n");

        try
        {
            Rec = new SpeechRecognitionEngine(new CultureInfo("en-US"));
            List<string> phrases = new List<string>();
            phrases.AddRange(Wake);
            phrases.AddRange(Sleep);
            phrases.AddRange(new string[] {
                "status", "update", "daily update", "give me an update", "summary", "report", "briefing",
                "health", "website health", "how are we doing", "how is the website", "are we healthy",
                "findings", "issues", "problems", "bugs", "score", "quality", "average score",
                "how many tools", "how many are built", "how far are we", "how many left", "how much is left", "to target", "build progress",
                "coverage", "how many audited", "privacy", "trackers", "any trackers",
                "team", "the team", "performance", "ratings", "how is the team", "how are the bots", "manager", "who is working on what",
                "research", "researcher", "new tools", "new ideas", "what are we building", "build queue", "developer",
                "tokens", "token usage", "budget", "spend", "how much are we spending",
                "challenged", "anything stuck", "what needs me",
                "open the dashboard", "show me the dashboard", "load the dashboard", "open dashboard", "show dashboard",
                "log a task", "add a task", "remind me", "note this", "tell claude", "send to claude",
                "help", "what can you do", "exit", "quit"
            });
            GrammarBuilder gb = new GrammarBuilder(new Choices(phrases.ToArray()));
            gb.Culture = new CultureInfo("en-US");
            CmdGrammar = new Grammar(gb);
            DictGrammar = new DictationGrammar();
            Rec.LoadGrammar(CmdGrammar);
            Rec.LoadGrammar(DictGrammar);
            ApplyGrammarState();
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

    // When awake, use free-form dictation so you can ask anything; the offline
    // engine still catches common intents, and the rest goes to the Claude brain.
    static void ApplyGrammarState()
    {
        try
        {
            if (CmdGrammar != null) CmdGrammar.Enabled = !Capturing;
            if (DictGrammar != null) DictGrammar.Enabled = Active; // free speech only while awake
        }
        catch { }
    }

    static void OnSpeech(object sender, SpeechRecognizedEventArgs e)
    {
        if (e.Result == null) return;
        string raw = e.Result.Text;
        string t = raw.ToLowerInvariant();
        float c = e.Result.Confidence;

        if (Capturing) { FinishCapture(raw); return; }

        if (!Active)
        {
            if (Matches(t, Wake) && c >= 0.55f) { Console.WriteLine("\n[heard] " + raw); Activate(); }
            return;
        }

        if (c < 0.35f) return; // dictation confidence runs lower than grammar
        Console.WriteLine("\n[heard] " + raw);
        if (Matches(t, Sleep)) GoToSleep();
        else HandleIntent(t, raw);
    }

    static void RouteTyped(string line)
    {
        string raw = line.Trim();
        string t = raw.ToLowerInvariant();
        if (t.Length == 0) return;
        if (Capturing) { FinishCapture(raw); return; }
        if (Matches(t, Wake)) { Activate(); return; }
        if (!Active) { Active = true; ApplyGrammarState(); }
        if (t.StartsWith("task:") || t.StartsWith("task ") || t.StartsWith("remind me")) { LogTask(StripLead(raw)); return; }
        if (Matches(t, Sleep)) { GoToSleep(); return; }
        HandleIntent(t, raw);
    }

    static void Activate()
    {
        lock (Gate)
        {
            Active = true; ApplyGrammarState();
            try { IntPtr h = GetConsoleWindow(); if (h != IntPtr.Zero) { ShowWindow(h, SW_RESTORE); SetForegroundWindow(h); } } catch { }
            Speak("At your service. Kuroop online. How may I help?");
        }
    }

    static void GoToSleep()
    {
        lock (Gate)
        {
            Speak("Very good. I'll be listening for, Hey Kuroop.");
            Active = false; ApplyGrammarState();
        }
    }

    // ---- intent router: offline fast-paths, then Claude brain fallback ------
    static void HandleIntent(string t, string raw)
    {
        lock (Gate)
        {
            if (Has(t, "exit") || Has(t, "quit") || Has(t, "shut down") || Has(t, "power down"))
            { Speak("Powering down. Goodbye for now, sir."); Environment.Exit(0); }
            else if (Has(t, "help") || Has(t, "what can you do"))
                Speak("Ask me anything about the site - status, health, the quality score, build progress, privacy, findings, or what needs your attention. I can open the dashboard, or log a task for Claude. Say go to sleep for standby, or exit to close me.");
            else if (Has(t, "dashboard") || Has(t, "load the page"))
                OpenDashboard();
            else if (Has(t, "log a task") || Has(t, "add a task") || Has(t, "remind") || Has(t, "note this") || Has(t, "tell claude") || Has(t, "send to claude"))
                BeginCapture();
            // A longer, sentence-like question wants reasoning: send it to the brain
            // (if configured) rather than letting a stray keyword hit a canned report.
            else if (BrainKey() != null && WordCount(t) > 6)
                TryBrain(raw);
            else if (Has(t, "team") || Has(t, "performance") || Has(t, "rating") || Has(t, "manager") || Has(t, "who is working") || Has(t, "how are the bots") || Has(t, "out of 5") || Has(t, "out of five"))
                TeamReport();
            else if (Has(t, "token") || Has(t, "budget") || Has(t, "spend") || Has(t, "spending") || Has(t, "cost"))
                TokenReport();
            else if (Has(t, "research") || Has(t, "new tool") || Has(t, "new idea") || Has(t, "developer") || Has(t, "build queue") || Has(t, "what are we building"))
                ResearchReport();
            else if (Has(t, "health") || Has(t, "how are we") || Has(t, "healthy"))
                HealthReport();
            else if (Has(t, "privacy") || Has(t, "tracker"))
                PrivacyReport();
            else if (Has(t, "score") || Has(t, "quality") || Has(t, "average"))
                ScoreReport();
            else if (Has(t, "coverage") || Has(t, "audited"))
                CoverageReport();
            else if (Has(t, "challenged") || Has(t, "stuck") || Has(t, "needs me"))
                ChallengedReport();
            else if (Has(t, "how many tool") || Has(t, "how far") || Has(t, "left") || Has(t, "to target") || Has(t, "build") || Has(t, "remaining") || Has(t, "progress"))
                BuildReport();
            else if (Has(t, "finding") || Has(t, "issue") || Has(t, "problem") || Has(t, "bug"))
                FindingsReport();
            else if (Has(t, "status") || Has(t, "update") || Has(t, "summary") || Has(t, "report") || Has(t, "brief"))
                StatusReport();
            else
                TryBrain(raw); // anything else -> Claude reasons over the live data
        }
    }

    // ---- Claude brain (optional, for free-form questions) -------------------
    static void TryBrain(string question)
    {
        string key = BrainKey();
        if (key == null)
        {
            Speak("I'm afraid I didn't catch a known command, sir. To let me answer free-form questions, enable my Claude brain by setting the ANTHROPIC underscore API underscore KEY. For now, try status, health, build progress, privacy, findings, or the dashboard.");
            return;
        }
        Dictionary<string, object> root = Fetch();
        if (root == null) return;
        Stats s = Compute(root);
        string context = BrainContext(root, s);
        Console.WriteLine("[brain] thinking...");
        try
        {
            string model = Environment.GetEnvironmentVariable("KUROOP_MODEL");
            if (string.IsNullOrEmpty(model)) model = "claude-haiku-4-5"; // fast + cheap for quick spoken Q&A

            JavaScriptSerializer js = new JavaScriptSerializer();
            Dictionary<string, object> body = new Dictionary<string, object>();
            body["model"] = model;
            body["max_tokens"] = 400;
            body["system"] = "You are Kuroop, a concise Jarvis-style voice assistant for the LazyTools.io website. Answer the user's spoken question using ONLY the live status data provided. Reply in 1 to 3 short sentences, conversational and suitable to be spoken aloud; occasionally address the user as 'sir'. Do not use lists, markdown, or emoji. If the data doesn't contain the answer, say so briefly.";
            List<object> msgs = new List<object>();
            Dictionary<string, object> um = new Dictionary<string, object>();
            um["role"] = "user";
            um["content"] = "Live LazyTools status data:\n" + context + "\n\nQuestion: " + question;
            msgs.Add(um);
            body["messages"] = msgs;
            string payload = js.Serialize(body);

            using (WebClient wc = new WebClient())
            {
                wc.Encoding = Encoding.UTF8;
                wc.Headers.Add("x-api-key", key);
                wc.Headers.Add("anthropic-version", "2023-06-01");
                wc.Headers.Add("content-type", "application/json");
                string resp = wc.UploadString(ANTHROPIC_URL, "POST", payload);
                Dictionary<string, object> rj = js.DeserializeObject(resp) as Dictionary<string, object>;
                string answer = ExtractText(rj);
                if (answer.Length == 0) answer = "I couldn't form an answer, sir.";
                Speak(answer);
            }
        }
        catch (WebException wex)
        {
            string detail = ReadError(wex);
            Speak("My Claude brain returned an error. " + detail);
        }
        catch (Exception ex)
        {
            Speak("My Claude brain hit a problem. " + ex.Message);
        }
    }

    static string ExtractText(Dictionary<string, object> rj)
    {
        StringBuilder sb = new StringBuilder();
        object[] content = Get(rj, "content") as object[];
        if (content != null)
            foreach (object c in content)
            {
                Dictionary<string, object> blk = c as Dictionary<string, object>;
                if (blk != null && Str(blk, "type") == "text") sb.Append(Str(blk, "text"));
            }
        return sb.ToString().Trim();
    }

    static string ReadError(WebException wex)
    {
        try
        {
            if (wex.Response != null)
                using (StreamReader r = new StreamReader(wex.Response.GetResponseStream()))
                {
                    string body = r.ReadToEnd();
                    if (body.IndexOf("authentication", StringComparison.OrdinalIgnoreCase) >= 0 || body.IndexOf("401") >= 0)
                        return "The API key looks invalid.";
                    if (body.IndexOf("credit", StringComparison.OrdinalIgnoreCase) >= 0 || body.IndexOf("billing", StringComparison.OrdinalIgnoreCase) >= 0)
                        return "There may be a billing or credit issue on the account.";
                    return "Please check the key and your connection.";
                }
        }
        catch { }
        return wex.Message;
    }

    static string BrainContext(Dictionary<string, object> root, Stats s)
    {
        StringBuilder sb = new StringBuilder();
        sb.Append("catalogue_tools=" + s.Catalogue + "; build_target=" + BUILD_TARGET + "; build_percent=" + s.BuildPct + "; tools_remaining=" + Math.Max(0, BUILD_TARGET - s.Catalogue) + "\n");
        sb.Append("audit_coverage=" + s.Audited + "/" + s.Catalogue + " tools\n");
        if (s.HasRun) sb.Append("latest_run date=" + s.RunDate + " tools_audited=" + s.RunTools + " avg_score=" + s.RunAvg + "% issues=" + s.RunIssues + "\n");
        sb.Append("findings open=" + s.Open + " (high=" + s.High + " medium=" + s.Medium + " low=" + s.Low + ") verifying=" + s.Verifying + " complete=" + s.Complete + " challenged=" + s.Challenged + " privacy_open=" + s.Privacy + "\n");
        // three-agent team (Manager/Auditor/Fixer) + Manager's ratings
        Dictionary<string, object> agents = Get(root, "agents") as Dictionary<string, object>;
        if (agents != null)
        {
            sb.Append("team (Manager governs; rates Auditor & Fixer out of 5):\n");
            string[] names = { "manager", "auditor", "fixer" };
            foreach (string nm in names)
            {
                Dictionary<string, object> a = Get(agents, nm) as Dictionary<string, object>;
                if (a == null) continue;
                sb.Append("- " + nm + ": status=" + Str(a, "status") + "; task=" + Str(a, "task"));
                Dictionary<string, object> sc = Get(a, "score") as Dictionary<string, object>;
                if (sc != null) sb.Append("; score_daily=" + Str(sc, "daily") + " score_weekly=" + Str(sc, "weekly"));
                sb.Append("\n");
            }
        }
        // top open findings for grounding
        Dictionary<string, object> findings = Get(root, "findings") as Dictionary<string, object>;
        if (findings != null)
        {
            sb.Append("top_open_findings:\n");
            int n = 0;
            foreach (object v in findings.Values)
            {
                Dictionary<string, object> f = v as Dictionary<string, object>;
                if (f == null || Str(f, "status") != "open") continue;
                sb.Append("- " + Str(f, "tool") + " | " + Str(f, "category") + " | " + Str(f, "severity") + " | " + Str(f, "check") + (Str(f, "detail").Length > 0 ? (" | " + Str(f, "detail")) : "") + "\n");
                if (++n >= 25) break;
            }
        }
        return sb.ToString();
    }

    // ---- task relay to Claude Code chat -------------------------------------
    static void BeginCapture()
    {
        Capturing = true; ApplyGrammarState();
        Speak("Go ahead - what's the task?");
    }

    static void FinishCapture(string text)
    {
        Capturing = false; ApplyGrammarState();
        if (text == null || text.Trim().Length == 0) { Speak("No task captured."); return; }
        LogTask(text.Trim());
    }

    static void LogTask(string task)
    {
        string stamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm", CultureInfo.InvariantCulture);
        string line = "- [ ] " + stamp + " - " + task + Environment.NewLine;
        bool ok = TryAppend(REPO_INBOX, line);
        if (!ok) ok = TryAppend(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "tasks-inbox.md"), line);
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

    static void TeamReport()
    {
        Dictionary<string, object> root = Fetch(); if (root == null) return;
        Dictionary<string, object> agents = Get(root, "agents") as Dictionary<string, object>;
        Dictionary<string, object> mgr = agents != null ? Get(agents, "manager") as Dictionary<string, object> : null;
        Dictionary<string, object> aud = agents != null ? Get(agents, "auditor") as Dictionary<string, object> : null;
        Dictionary<string, object> fix = agents != null ? Get(agents, "fixer") as Dictionary<string, object> : null;
        if (aud == null || fix == null) { Speak("The team ratings aren't available yet, sir - the Manager runs after each audit."); return; }

        double aD = ScoreOf(aud, "daily"), aW = ScoreOf(aud, "weekly");
        double fD = ScoreOf(fix, "daily"), fW = ScoreOf(fix, "weekly");
        StringBuilder sb = new StringBuilder();
        sb.Append("The Manager's ratings, sir. The Auditor scores " + Num(aD) + " out of 5 today, " + Num(aW) + " this week. The Fixer scores " + Num(fD) + " today, " + Num(fW) + " this week. ");
        string aT = Str(aud, "task"); if (aT.Length > 0) sb.Append("The Auditor is " + Lower1(aT) + " ");
        string fT = Str(fix, "task"); if (fT.Length > 0) sb.Append("The Fixer: " + fT + " ");
        if (mgr != null)
        {
            Dictionary<string, object> k = Get(mgr, "kpis") as Dictionary<string, object>;
            int od = k != null ? Int(k, "overdue") : 0;
            if (od > 0) sb.Append("The Manager is reconciling " + od + " overdue " + (od == 1 ? "item" : "items") + ".");
            else sb.Append("The Manager reports everything within SLA.");
        }
        Speak(sb.ToString());
    }

    static void ResearchReport()
    {
        Dictionary<string, object> root = Fetch(); if (root == null) return;
        Dictionary<string, object> research = Get(root, "research") as Dictionary<string, object>;
        object[] items = research != null ? Get(research, "items") as object[] : null;
        if (items == null || items.Length == 0) { Speak("No research this cycle yet, sir - the Researcher runs weekly."); return; }
        int approved = 0, proposals = 0; double sum = 0; int rated = 0;
        var names = new List<string>();
        foreach (object o in items)
        {
            Dictionary<string, object> it = o as Dictionary<string, object>; if (it == null) continue;
            string st = Str(it, "status");
            if (st == "approved" || st == "proposed-build") { approved++; if (names.Count < 3) names.Add(Str(it, "name")); }
            if (st == "proposed-build") proposals++;
            object mr = Get(it, "managerRating"); if (mr != null) { try { sum += Convert.ToDouble(mr, CultureInfo.InvariantCulture); rated++; } catch { } }
        }
        double avg = rated > 0 ? sum / rated : 0;
        StringBuilder sb = new StringBuilder();
        sb.Append("The Researcher proposed " + items.Length + " new tool ideas, sir. The Manager approved " + approved + ", averaging " + Num(avg) + " out of 5. ");
        if (names.Count > 0) sb.Append("Top picks: " + string.Join(", ", names.ToArray()) + ". ");
        if (proposals > 0) sb.Append("The Developer has drafted " + proposals + " build " + (proposals == 1 ? "proposal" : "proposals") + " for review.");
        else sb.Append("The Developer builds the approved ones weekly.");
        Speak(sb.ToString());
    }

    static void TokenReport()
    {
        Dictionary<string, object> root = Fetch(); if (root == null) return;
        Dictionary<string, object> agents = Get(root, "agents") as Dictionary<string, object>;
        Dictionary<string, object> mgr = agents != null ? Get(agents, "manager") as Dictionary<string, object> : null;
        Dictionary<string, object> k = mgr != null ? Get(mgr, "kpis") as Dictionary<string, object> : null;
        if (k == null) { Speak("Token usage isn't available yet, sir."); return; }
        int used = Int(k, "tokensToday"), cap = Int(k, "tokenCap");
        double cost = 0; object c = Get(k, "costUsd"); if (c != null) { try { cost = Convert.ToDouble(c, CultureInfo.InvariantCulture); } catch { } }
        int pct = cap > 0 ? (int)Math.Round((double)used * 100.0 / cap) : 0;
        StringBuilder sb = new StringBuilder();
        sb.Append("Today the agents have used " + used.ToString("N0", CultureInfo.InvariantCulture) + " tokens, sir - about " + pct + " percent of the " + cap.ToString("N0", CultureInfo.InvariantCulture) + " daily budget, roughly " + cost.ToString("0.00", CultureInfo.InvariantCulture) + " dollars. ");
        sb.Append(used >= cap ? "The Manager has throttled the LLM agents until reset." : "Well within budget.");
        Speak(sb.ToString());
    }

    static double ScoreOf(Dictionary<string, object> agent, string which)
    {
        Dictionary<string, object> sc = Get(agent, "score") as Dictionary<string, object>;
        if (sc == null) return 0;
        object v = Get(sc, which); if (v == null) return 0;
        try { return Convert.ToDouble(v, CultureInfo.InvariantCulture); } catch { return 0; }
    }
    static string Num(double d) { return d.ToString("0.#", CultureInfo.InvariantCulture); }
    static string Lower1(string s) { return s.Length > 0 ? char.ToLowerInvariant(s[0]) + s.Substring(1) : s; }

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
    static string BrainKey()
    {
        string k = Environment.GetEnvironmentVariable("ANTHROPIC_API_KEY");
        if (!string.IsNullOrEmpty(k)) return k.Trim();
        try
        {
            string f = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Kuroop", "apikey.txt");
            if (File.Exists(f)) { string v = File.ReadAllText(f).Trim(); if (v.Length > 0) return v; }
        }
        catch { }
        return null;
    }

    static object Get(Dictionary<string, object> d, string k) { object v; return (d != null && d.TryGetValue(k, out v)) ? v : null; }
    static string Str(Dictionary<string, object> d, string k) { object v = Get(d, k); return v == null ? "" : v.ToString(); }
    static int Int(Dictionary<string, object> d, string k) { object v = Get(d, k); if (v == null) return 0; try { return Convert.ToInt32(v, CultureInfo.InvariantCulture); } catch { return 0; } }
    static bool Has(string h, string n) { return h.IndexOf(n, StringComparison.Ordinal) >= 0; }
    static int WordCount(string t) { return t.Split(new char[] { ' ', '\t' }, StringSplitOptions.RemoveEmptyEntries).Length; }
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
                if (iv.Enabled && iv.VoiceInfo != null && iv.VoiceInfo.Name.IndexOf("David", StringComparison.OrdinalIgnoreCase) >= 0)
                { Tts.SelectVoice(iv.VoiceInfo.Name); return; }
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
        Console.WriteLine("Ask anything about the site (voice or type):");
        Console.WriteLine("  status | health | score | build progress |");
        Console.WriteLine("  privacy | findings | coverage | dashboard |");
        Console.WriteLine("  log a task   ...or any free-form question.");
        Console.WriteLine("  (\"go to sleep\" / \"exit\")");
        Console.WriteLine();
    }
}
