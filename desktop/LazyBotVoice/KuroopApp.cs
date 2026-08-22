/*
 * Kuroop — background tray assistant for LazyTools.io (WinForms).
 *
 * Runs in the system tray (no console). Activate three ways:
 *   • Global hotkey  Ctrl+Alt+K   (100% reliable)
 *   • Say the wake word "Hey Kuroop" (offline, best-effort)
 *   • Double-click the tray icon
 *
 * Then ask by voice or type/click: status, health, team, research, tokens,
 * build progress, privacy, findings, or any free-form question (Claude brain).
 * "Dashboard" opens the live command deck in a chromeless in-app window.
 *
 * Offline speech via System.Speech. Optional Claude brain via ANTHROPIC_API_KEY
 * (env or %LOCALAPPDATA%\Kuroop\apikey.txt). Builds with the .NET Framework csc.
 */
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Globalization;
using System.IO;
using System.Net;
using System.Runtime.InteropServices;
using System.Text;
using System.Windows.Forms;
using System.Speech.Recognition;
using System.Speech.Synthesis;
using System.Web.Script.Serialization;

class KuroopForm : Form
{
    const string LEDGER_URL = "https://raw.githubusercontent.com/Synth88Labs/lazytools.io/main/audits/ledger.json";
    const string DASHBOARD_URL = "https://htmlpreview.github.io/?https://github.com/Synth88Labs/lazytools.io/blob/main/audits/dashboard.html";
    const string ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
    const int BUILD_TARGET = 1500;
    const string REPO_INBOX = @"C:\Users\rupak\OneDrive\Desktop\Claude Code Projects\LazyTools\desktop\LazyBotVoice\tasks-inbox.md";

    [DllImport("user32.dll")] static extern bool RegisterHotKey(IntPtr hWnd, int id, uint fsModifiers, uint vk);
    [DllImport("user32.dll")] static extern bool UnregisterHotKey(IntPtr hWnd, int id);
    const int WM_HOTKEY = 0x0312, HOTKEY_ID = 0xB0B, MOD_ALT = 0x1, MOD_CONTROL = 0x2;

    readonly SpeechSynthesizer Tts = new SpeechSynthesizer();
    SpeechRecognitionEngine Rec;
    NotifyIcon Tray;
    RichTextBox Log;
    TextBox Input;
    Label Status;
    static readonly string[] Wake = {
        "hey kuroop","hi kuroop","hello kuroop","okay kuroop","ok kuroop","yo kuroop",
        "kuroop","kuru","kuroob","karoop","curoop","koroop","kaloop","kuroopa","kurup","crew loop",
        "hey kurup","hey karoop","hey kuru","hey koroop","hey curoop","hey group","hey crew","wake up","computer"
    };

    [STAThread]
    static void Main()
    {
        try { ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072 | (SecurityProtocolType)12288; } catch { }
        Application.EnableVisualStyles();
        Application.SetCompatibleTextRenderingDefault(false);
        Application.Run(new KuroopForm());
    }

    public KuroopForm()
    {
        // ---- window ----
        Text = "Kuroop";
        Size = new Size(560, 560);
        StartPosition = FormStartPosition.CenterScreen;
        BackColor = Color.FromArgb(7, 11, 22);
        ForeColor = Color.FromArgb(219, 234, 254);
        Font = new Font("Segoe UI", 9.5f);
        MinimumSize = new Size(420, 420);

        var title = new Label { Text = "◤  K U R O O P", Dock = DockStyle.Top, Height = 44, ForeColor = Color.FromArgb(34, 211, 238), Font = new Font("Segoe UI", 15f, FontStyle.Bold), TextAlign = ContentAlignment.MiddleLeft, Padding = new Padding(14, 0, 0, 0) };
        Status = new Label { Dock = DockStyle.Top, Height = 24, ForeColor = Color.FromArgb(125, 141, 179), TextAlign = ContentAlignment.MiddleLeft, Padding = new Padding(16, 0, 0, 0), Text = "starting…" };

        Log = new RichTextBox { Dock = DockStyle.Fill, ReadOnly = true, BorderStyle = BorderStyle.None, BackColor = Color.FromArgb(11, 17, 30), ForeColor = Color.FromArgb(219, 234, 254), Font = new Font("Consolas", 9.5f), Margin = new Padding(12) };

        var btns = new FlowLayoutPanel { Dock = DockStyle.Top, Height = 78, Padding = new Padding(10, 8, 10, 4), BackColor = Color.FromArgb(7, 11, 22) };
        AddBtn(btns, "Status", () => Respond(StatusReport()));
        AddBtn(btns, "Health", () => Respond(HealthReport()));
        AddBtn(btns, "Team", () => Respond(TeamReport()));
        AddBtn(btns, "Research", () => Respond(ResearchReport()));
        AddBtn(btns, "Tokens", () => Respond(TokenReport()));
        AddBtn(btns, "Build", () => Respond(BuildReport()));
        AddBtn(btns, "Privacy", () => Respond(PrivacyReport()));
        AddBtn(btns, "📊 Dashboard", ShowDashboard);

        var bottom = new Panel { Dock = DockStyle.Bottom, Height = 40, Padding = new Padding(10, 6, 10, 8), BackColor = Color.FromArgb(7, 11, 22) };
        Input = new TextBox { Dock = DockStyle.Fill, BackColor = Color.FromArgb(17, 26, 46), ForeColor = Color.White, BorderStyle = BorderStyle.FixedSingle };
        Input.KeyDown += (s, e) => { if (e.KeyCode == Keys.Enter) { e.SuppressKeyPress = true; string q = Input.Text.Trim(); Input.Clear(); if (q.Length > 0) HandleText(q); } };
        var send = MakeButton("Ask ▸"); send.Dock = DockStyle.Right; send.Click += (s, e) => { string q = Input.Text.Trim(); Input.Clear(); if (q.Length > 0) HandleText(q); };
        bottom.Controls.Add(Input); bottom.Controls.Add(send);

        Controls.Add(Log); Controls.Add(btns); Controls.Add(Status); Controls.Add(title); Controls.Add(bottom);

        // ---- tray ----
        var menu = new ContextMenuStrip();
        menu.Items.Add("Open Kuroop", null, (s, e) => ShowWindow());
        menu.Items.Add("Dashboard", null, (s, e) => ShowDashboard());
        menu.Items.Add("Status", null, (s, e) => { ShowWindow(); Respond(StatusReport()); });
        menu.Items.Add("-");
        menu.Items.Add("Quit", null, (s, e) => { Tray.Visible = false; Application.Exit(); });
        Tray = new NotifyIcon { Icon = SystemIcons.Information, Visible = true, Text = "Kuroop — Ctrl+Alt+K or say 'Hey Kuroop'", ContextMenuStrip = menu };
        Tray.DoubleClick += (s, e) => ShowWindow();

        try { Tts.SetOutputToDefaultAudioDevice(); Tts.Rate = 1; } catch { }
        FormClosing += OnClosing;

        Log_("Kuroop", "Online. Press Ctrl+Alt+K anytime, or say \"Hey Kuroop\". Type a question below, or use the buttons.");
        Log_("sys", BrainKey() != null ? "Claude brain: ENABLED." : "Claude brain: off (set ANTHROPIC_API_KEY to ask free-form questions).");

        var _ = Handle;      // force handle creation so the hotkey + speech callbacks work while hidden
        StartSpeech();
        try { Tray.ShowBalloonTip(4000, "Kuroop", "Running in the tray. Press Ctrl+Alt+K, or say \"Hey Kuroop\".", ToolTipIcon.Info); } catch { }
    }

    bool _allowShow;
    protected override void SetVisibleCore(bool value) { base.SetVisibleCore(_allowShow && value); } // start hidden in the tray

    // ---- speech ----
    void StartSpeech()
    {
        try
        {
            Rec = new SpeechRecognitionEngine(new CultureInfo("en-US"));
            var phrases = new List<string>();
            phrases.AddRange(Wake);
            phrases.AddRange(new string[] {
                "status","update","summary","report","health","how are we","team","performance","ratings","manager",
                "research","new tools","build queue","developer","tokens","budget","spend","cost","score","quality",
                "build progress","how many left","coverage","privacy","trackers","findings","issues","dashboard",
                "help","go to sleep","exit","quit"
            });
            var gb = new GrammarBuilder(new Choices(phrases.ToArray())); gb.Culture = new CultureInfo("en-US");
            Rec.LoadGrammar(new Grammar(gb));
            Rec.SetInputToDefaultAudioDevice();
            Rec.SpeechRecognized += OnSpeech;
            Rec.RecognizeAsync(RecognizeMode.Multiple);
            SetStatus("Listening — Ctrl+Alt+K or say \"Hey Kuroop\".");
        }
        catch (Exception ex) { SetStatus("Mic unavailable — use Ctrl+Alt+K, the buttons, or type. (" + ex.Message + ")"); }
    }

    void OnSpeech(object sender, SpeechRecognizedEventArgs e)
    {
        if (e.Result == null) return;
        string raw = e.Result.Text; string t = raw.ToLowerInvariant(); float c = e.Result.Confidence;
        BeginInvoke((Action)(() =>
        {
            SetStatus("heard: \"" + raw + "\"  (" + c.ToString("0.00") + ")");
            if (Matches(t, Wake) && c >= 0.3f) { WakeUp(); return; }
            if (c < 0.45f) return;
            if (Has(t, "sleep")) { ShowInTaskbar = true; Hide(); return; }
            HandleText(t);
        }));
    }

    // ---- activation / window ----
    protected override void OnHandleCreated(EventArgs e) { base.OnHandleCreated(e); try { RegisterHotKey(Handle, HOTKEY_ID, MOD_CONTROL | MOD_ALT, (uint)Keys.K); } catch { } }
    protected override void WndProc(ref Message m) { if (m.Msg == WM_HOTKEY && (int)m.WParam == HOTKEY_ID) WakeUp(); base.WndProc(ref m); }

    void WakeUp() { ShowWindow(); Respond("At your service. How may I help?"); }
    void ShowWindow() { _allowShow = true; ShowInTaskbar = true; Show(); WindowState = FormWindowState.Normal; Activate(); BringToFront(); Input.Focus(); }
    void OnClosing(object s, FormClosingEventArgs e) { if (e.CloseReason == CloseReason.UserClosing) { e.Cancel = true; Hide(); } else { try { UnregisterHotKey(Handle, HOTKEY_ID); } catch { } if (Tray != null) Tray.Visible = false; } }

    void ShowDashboard()
    {
        string[] edges = { Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86) + @"\Microsoft\Edge\Application\msedge.exe", Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles) + @"\Microsoft\Edge\Application\msedge.exe" };
        foreach (string ex in edges)
            if (File.Exists(ex)) { try { System.Diagnostics.Process.Start(ex, "--app=" + DASHBOARD_URL + " --window-size=1180,860"); Log_("Kuroop", "Opening the command deck."); return; } catch { } }
        try { System.Diagnostics.Process.Start(DASHBOARD_URL); } catch { }
    }

    // ---- intents ----
    void HandleText(string raw)
    {
        string t = raw.ToLowerInvariant();
        if (Has(t, "exit") || Has(t, "quit")) { Tray.Visible = false; Application.Exit(); return; }
        if (Matches(t, Wake)) { WakeUp(); return; }
        Log_("you", raw);
        if (t.StartsWith("task:") || t.StartsWith("task ") || t.StartsWith("remind me")) { LogTask(StripLead(raw)); return; }
        if (Has(t, "help")) { Respond("Ask me for status, health, team, research, tokens, build progress, privacy, or findings. Say dashboard to open it, or type any question."); return; }
        if (Has(t, "dashboard") || Has(t, "show me the")) { ShowDashboard(); return; }
        if (Has(t, "team") || Has(t, "performance") || Has(t, "rating") || Has(t, "manager") || Has(t, "who is working")) { Respond(TeamReport()); return; }
        if (Has(t, "token") || Has(t, "budget") || Has(t, "spend") || Has(t, "cost")) { Respond(TokenReport()); return; }
        if (Has(t, "research") || Has(t, "new tool") || Has(t, "developer") || Has(t, "build queue")) { Respond(ResearchReport()); return; }
        if (Has(t, "health") || Has(t, "how are we")) { Respond(HealthReport()); return; }
        if (Has(t, "privacy") || Has(t, "tracker")) { Respond(PrivacyReport()); return; }
        if (Has(t, "score") || Has(t, "quality")) { Respond(ScoreReport()); return; }
        if (Has(t, "coverage") || Has(t, "audited")) { Respond(CoverageReport()); return; }
        if (Has(t, "how many tool") || Has(t, "how far") || Has(t, "left") || Has(t, "build") || Has(t, "progress")) { Respond(BuildReport()); return; }
        if (Has(t, "finding") || Has(t, "issue")) { Respond(FindingsReport()); return; }
        if (Has(t, "status") || Has(t, "update") || Has(t, "summary") || Has(t, "report")) { Respond(StatusReport()); return; }
        TryBrain(raw);
    }

    // ---- reports (return spoken text) ----
    string StatusReport()
    {
        var r = Fetch(); if (r == null) return "I couldn't reach the status page.";
        var s = Compute(r);
        var sb = new StringBuilder("LazyTools report");
        if (s.RunDate.Length > 0) sb.Append(" for " + SpokenDate(s.RunDate));
        sb.Append(". ");
        if (s.HasRun) sb.Append("Auditor checked " + s.RunTools + " tools at " + s.RunAvg + " percent, " + s.RunIssues + " issues. ");
        sb.Append(s.Open + " findings open, " + s.High + " high. Fixer: " + s.Verifying + " verifying, " + s.Complete + " complete. ");
        if (s.Catalogue > 0) sb.Append("Catalogue " + s.Catalogue + " tools, " + s.BuildPct + " percent to " + BUILD_TARGET + ".");
        return sb.ToString();
    }
    string HealthReport()
    {
        var r = Fetch(); if (r == null) return "I couldn't reach the status page.";
        var s = Compute(r); int sc = s.HasRun ? s.RunAvg : 0;
        string rating = sc >= 90 ? "excellent" : sc >= 80 ? "good" : sc >= 70 ? "fair" : sc > 0 ? "in need of attention" : "not yet measured";
        var sb = new StringBuilder("Website health is " + rating + ". ");
        if (s.HasRun) sb.Append("Average score " + sc + " percent over " + s.RunTools + " tools. ");
        sb.Append(s.High + " high priority open");
        if (s.Privacy > 0) sb.Append(", including " + s.Privacy + " privacy flags");
        sb.Append(". "); sb.Append(s.Challenged > 0 ? (s.Challenged + " challenged.") : "Nothing stuck.");
        return sb.ToString();
    }
    string FindingsReport() { var r = Fetch(); if (r == null) return "No data."; var s = Compute(r); var sb = new StringBuilder(s.Open + " open findings. " + s.High + " high, " + s.Medium + " medium, " + s.Low + " low. "); if (s.TopCategory.Length > 0) sb.Append("Most common: " + Spoken(s.TopCategory) + ", " + s.TopCategoryCount + " findings."); return sb.ToString(); }
    string BuildReport() { var r = Fetch(); if (r == null) return "No data."; var s = Compute(r); int left = Math.Max(0, BUILD_TARGET - s.Catalogue); return "We're at " + s.Catalogue + " tools, " + s.BuildPct + " percent of the " + BUILD_TARGET + " target, with " + left + " to go."; }
    string ScoreReport() { var r = Fetch(); if (r == null) return "No data."; var s = Compute(r); return s.HasRun ? ("Latest average quality score is " + s.RunAvg + " percent over " + s.RunTools + " tools.") : "No score recorded yet."; }
    string CoverageReport() { var r = Fetch(); if (r == null) return "No data."; var s = Compute(r); int pct = s.Catalogue > 0 ? (int)Math.Round((double)s.Audited * 100.0 / s.Catalogue) : 0; return "Audit coverage is " + s.Audited + " of " + s.Catalogue + " tools, about " + pct + " percent."; }
    string PrivacyReport() { var r = Fetch(); if (r == null) return "No data."; var s = Compute(r); return s.Privacy > 0 ? (s.Privacy + " privacy findings are open — mostly the third-party ad tracker. I'd clear it.") : "No open privacy findings. All clear."; }
    string TeamReport()
    {
        var r = Fetch(); if (r == null) return "No data.";
        var ag = Get(r, "agents") as Dictionary<string, object>;
        var aud = ag != null ? Get(ag, "auditor") as Dictionary<string, object> : null;
        var fix = ag != null ? Get(ag, "fixer") as Dictionary<string, object> : null;
        if (aud == null || fix == null) return "Team ratings aren't available yet.";
        var sb = new StringBuilder("Manager's ratings. Auditor " + Num(ScoreOf(aud, "daily")) + " out of 5, Fixer " + Num(ScoreOf(fix, "daily")) + ". ");
        var res = ag != null ? Get(ag, "researcher") as Dictionary<string, object> : null;
        if (res != null) sb.Append("Researcher " + Num(ScoreOf(res, "weekly")) + ". ");
        string at = Str(aud, "task"); if (at.Length > 0) sb.Append("Auditor: " + at + " ");
        return sb.ToString();
    }
    string ResearchReport()
    {
        var r = Fetch(); if (r == null) return "No data.";
        var research = Get(r, "research") as Dictionary<string, object>;
        var items = research != null ? Get(research, "items") as object[] : null;
        if (items == null || items.Length == 0) return "No research yet — the Researcher runs weekly.";
        int approved = 0, proposals = 0; double sum = 0; int rated = 0; var names = new List<string>();
        foreach (object o in items) { var it = o as Dictionary<string, object>; if (it == null) continue; string st = Str(it, "status"); if (st == "approved" || st == "proposed-build") { approved++; if (names.Count < 3) names.Add(Str(it, "name")); } if (st == "proposed-build") proposals++; object mr = Get(it, "managerRating"); if (mr != null) { try { sum += Convert.ToDouble(mr, CultureInfo.InvariantCulture); rated++; } catch { } } }
        var sb = new StringBuilder("Researcher proposed " + items.Length + " ideas. Manager approved " + approved + ", averaging " + Num(rated > 0 ? sum / rated : 0) + " out of 5. ");
        if (names.Count > 0) sb.Append("Top: " + string.Join(", ", names.ToArray()) + ". ");
        if (proposals > 0) sb.Append("Developer drafted " + proposals + " build proposal(s).");
        return sb.ToString();
    }
    string TokenReport()
    {
        var r = Fetch(); if (r == null) return "No data.";
        var ag = Get(r, "agents") as Dictionary<string, object>;
        var mgr = ag != null ? Get(ag, "manager") as Dictionary<string, object> : null;
        var k = mgr != null ? Get(mgr, "kpis") as Dictionary<string, object> : null;
        if (k == null) return "Token usage isn't available yet.";
        int used = Int(k, "tokensToday"), cap = Int(k, "tokenCap"); double cost = 0; object c = Get(k, "costUsd"); if (c != null) { try { cost = Convert.ToDouble(c, CultureInfo.InvariantCulture); } catch { } }
        int pct = cap > 0 ? (int)Math.Round((double)used * 100.0 / cap) : 0;
        return "Today the agents used " + used.ToString("N0", CultureInfo.InvariantCulture) + " tokens, about " + pct + " percent of the " + cap.ToString("N0", CultureInfo.InvariantCulture) + " budget, roughly " + cost.ToString("0.00", CultureInfo.InvariantCulture) + " dollars. " + (used >= cap ? "LLM agents throttled." : "Within budget.");
    }

    // ---- brain ----
    void TryBrain(string q)
    {
        string key = BrainKey();
        if (key == null) { Respond("I didn't catch a command. Try status, health, team, research, tokens, or the dashboard. To answer free-form questions, set an ANTHROPIC API key."); return; }
        var r = Fetch(); if (r == null) return; var s = Compute(r);
        SetStatus("thinking…");
        try
        {
            string model = Environment.GetEnvironmentVariable("KUROOP_MODEL"); if (string.IsNullOrEmpty(model)) model = "claude-haiku-4-5";
            var js = new JavaScriptSerializer();
            var body = new Dictionary<string, object>(); body["model"] = model; body["max_tokens"] = 400;
            body["system"] = "You are Kuroop, a concise Jarvis-style assistant for LazyTools.io. Answer the user's question using ONLY the live status data provided, in 1-3 short sentences suitable to read aloud. No lists or markdown.";
            var um = new Dictionary<string, object>(); um["role"] = "user"; um["content"] = "Live status data:\n" + BrainContext(r, s) + "\n\nQuestion: " + q;
            body["messages"] = new List<object> { um };
            using (var wc = new WebClient()) { wc.Encoding = Encoding.UTF8; wc.Headers.Add("x-api-key", key); wc.Headers.Add("anthropic-version", "2023-06-01"); wc.Headers.Add("content-type", "application/json"); string resp = wc.UploadString(ANTHROPIC_URL, "POST", js.Serialize(body)); var rj = js.DeserializeObject(resp) as Dictionary<string, object>; string ans = ExtractText(rj); Respond(ans.Length > 0 ? ans : "I couldn't form an answer."); }
        }
        catch (Exception ex) { Respond("My brain hit a problem. " + ex.Message); }
        SetStatus("Listening.");
    }
    string ExtractText(Dictionary<string, object> rj) { var sb = new StringBuilder(); var content = Get(rj, "content") as object[]; if (content != null) foreach (object c in content) { var b = c as Dictionary<string, object>; if (b != null && Str(b, "type") == "text") sb.Append(Str(b, "text")); } return sb.ToString().Trim(); }
    string BrainContext(Dictionary<string, object> root, Stats s)
    {
        var sb = new StringBuilder();
        sb.Append("catalogue_tools=" + s.Catalogue + " build_target=" + BUILD_TARGET + " build_percent=" + s.BuildPct + " remaining=" + Math.Max(0, BUILD_TARGET - s.Catalogue) + "\n");
        if (s.HasRun) sb.Append("latest_run date=" + s.RunDate + " tools=" + s.RunTools + " avg=" + s.RunAvg + "% issues=" + s.RunIssues + "\n");
        sb.Append("open=" + s.Open + " high=" + s.High + " medium=" + s.Medium + " low=" + s.Low + " verifying=" + s.Verifying + " complete=" + s.Complete + " challenged=" + s.Challenged + " privacy=" + s.Privacy + "\n");
        var ag = Get(root, "agents") as Dictionary<string, object>;
        if (ag != null) foreach (string nm in new string[] { "manager", "auditor", "fixer", "researcher", "developer" }) { var a = Get(ag, nm) as Dictionary<string, object>; if (a == null) continue; sb.Append("- " + nm + ": " + Str(a, "status") + "; " + Str(a, "task") + "\n"); }
        return sb.ToString();
    }

    // ---- task relay ----
    void LogTask(string task)
    {
        string line = "- [ ] " + DateTime.Now.ToString("yyyy-MM-dd HH:mm", CultureInfo.InvariantCulture) + " - " + task + Environment.NewLine;
        try { if (!File.Exists(REPO_INBOX)) File.WriteAllText(REPO_INBOX, "# Kuroop task inbox\n\n", new UTF8Encoding(false)); File.AppendAllText(REPO_INBOX, line, new UTF8Encoding(false)); Respond("Logged. Ask Claude to check the task inbox in chat."); }
        catch { Respond("I couldn't write the task file."); }
    }

    // ---- data ----
    class Stats { public int Open, High, Medium, Low, Verifying, Complete, Challenged, Privacy, Catalogue, Audited, BuildPct; public bool HasRun; public string RunDate = ""; public int RunTools, RunAvg, RunIssues; public string TopCategory = ""; public int TopCategoryCount; }
    Stats Compute(Dictionary<string, object> root)
    {
        var s = new Stats();
        var findings = Get(root, "findings") as Dictionary<string, object>;
        var tally = new Dictionary<string, int>();
        if (findings != null) foreach (object v in findings.Values) { var f = v as Dictionary<string, object>; if (f == null) continue; string st = Str(f, "status"), sev = Str(f, "severity"), cat = Str(f, "category"); if (st == "open") { s.Open++; if (sev == "high" || sev == "critical") s.High++; else if (sev == "medium") s.Medium++; else s.Low++; if (cat == "privacy") s.Privacy++; if (cat.Length > 0) { int c; tally.TryGetValue(cat, out c); tally[cat] = c + 1; } } else if (st == "verifying" || st == "fixed") s.Verifying++; else if (st == "complete") s.Complete++; else if (st == "challenged") s.Challenged++; }
        foreach (var kv in tally) if (kv.Value > s.TopCategoryCount) { s.TopCategoryCount = kv.Value; s.TopCategory = kv.Key; }
        var runs = Get(root, "runs") as object[];
        if (runs != null && runs.Length > 0) { var last = runs[runs.Length - 1] as Dictionary<string, object>; if (last != null) { s.HasRun = true; s.RunDate = Str(last, "date"); s.RunTools = Int(last, "tools"); s.RunAvg = Int(last, "avg"); s.RunIssues = Int(last, "issues"); } }
        s.Catalogue = Int(root, "catalogueSize"); var at = Get(root, "auditedTools") as object[]; s.Audited = at == null ? 0 : at.Length;
        if (s.Catalogue > 0) s.BuildPct = (int)Math.Round((double)s.Catalogue * 100.0 / BUILD_TARGET);
        return s;
    }
    Dictionary<string, object> Fetch()
    {
        try { using (var wc = new WebClient()) { wc.Encoding = Encoding.UTF8; wc.Headers.Add("User-Agent", "Kuroop/2.0"); wc.Headers.Add("Cache-Control", "no-cache"); string json = wc.DownloadString(LEDGER_URL + "?t=" + DateTime.UtcNow.Ticks); var js = new JavaScriptSerializer(); js.MaxJsonLength = 64 * 1024 * 1024; return js.DeserializeObject(json) as Dictionary<string, object>; } }
        catch (Exception ex) { Respond("Sorry, I couldn't reach the status page. " + ex.Message); return null; }
    }

    // ---- helpers ----
    static string BrainKey() { string k = Environment.GetEnvironmentVariable("ANTHROPIC_API_KEY"); if (!string.IsNullOrEmpty(k)) return k.Trim(); try { string f = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Kuroop", "apikey.txt"); if (File.Exists(f)) { string v = File.ReadAllText(f).Trim(); if (v.Length > 0) return v; } } catch { } return null; }
    static object Get(Dictionary<string, object> d, string k) { object v; return (d != null && d.TryGetValue(k, out v)) ? v : null; }
    static string Str(Dictionary<string, object> d, string k) { object v = Get(d, k); return v == null ? "" : v.ToString(); }
    static int Int(Dictionary<string, object> d, string k) { object v = Get(d, k); if (v == null) return 0; try { return Convert.ToInt32(v, CultureInfo.InvariantCulture); } catch { return 0; } }
    static double ScoreOf(Dictionary<string, object> a, string which) { var sc = Get(a, "score") as Dictionary<string, object>; if (sc == null) return 0; object v = Get(sc, which); if (v == null) return 0; try { return Convert.ToDouble(v, CultureInfo.InvariantCulture); } catch { return 0; } }
    static bool Has(string h, string n) { return h.IndexOf(n, StringComparison.Ordinal) >= 0; }
    static bool Matches(string t, string[] set) { foreach (string p in set) if (t.IndexOf(p, StringComparison.Ordinal) >= 0) return true; return false; }
    static string StripLead(string raw) { string t = raw.TrimStart(); foreach (string l in new string[] { "task:", "task ", "remind me to ", "remind me " }) if (t.ToLowerInvariant().StartsWith(l)) return t.Substring(l.Length).Trim(); return t; }
    static string Num(double d) { return d.ToString("0.#", CultureInfo.InvariantCulture); }
    static string Spoken(string c) { switch (c) { case "seo": return "search engine optimization"; case "a11y": return "accessibility"; case "io": return "input and output"; case "perf": return "performance"; default: return c; } }
    static string SpokenDate(string ymd) { DateTime dt; if (DateTime.TryParseExact(ymd, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out dt)) return dt.ToString("MMMM d", CultureInfo.InvariantCulture); return ymd; }

    void Respond(string text) { Log_("Kuroop", text); try { Tts.SpeakAsync(text); } catch { } }
    void Log_(string who, string text)
    {
        if (Log.InvokeRequired) { BeginInvoke((Action)(() => Log_(who, text))); return; }
        Color col = who == "Kuroop" ? Color.FromArgb(34, 211, 238) : who == "you" ? Color.FromArgb(163, 230, 53) : Color.FromArgb(125, 141, 179);
        Log.SelectionColor = col; Log.AppendText((who == "sys" ? "" : who + ": "));
        Log.SelectionColor = Color.FromArgb(219, 234, 254); Log.AppendText(text + "\n\n");
        Log.SelectionStart = Log.TextLength; Log.ScrollToCaret();
    }
    void SetStatus(string s) { if (Status.InvokeRequired) { BeginInvoke((Action)(() => SetStatus(s))); return; } Status.Text = s; }

    Button MakeButton(string text) { var b = new Button { Text = text, AutoSize = false, Height = 30, FlatStyle = FlatStyle.Flat, BackColor = Color.FromArgb(17, 26, 46), ForeColor = Color.FromArgb(219, 234, 254) }; b.FlatAppearance.BorderColor = Color.FromArgb(40, 55, 85); return b; }
    void AddBtn(FlowLayoutPanel p, string text, Action onClick) { var b = MakeButton(text); b.Width = 118; b.Margin = new Padding(4); b.Click += (s, e) => { try { onClick(); } catch (Exception ex) { Log_("sys", ex.Message); } }; p.Controls.Add(b); }
}
