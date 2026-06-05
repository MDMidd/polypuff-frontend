// ============================================================================
// WEEKLY EMAIL DIGEST
// ============================================================================
// POST /api/digest
//
// Receives the student's weekly progress summary from the frontend.
// Formats it as a rich HTML email and sends via the existing feedbackTransporter.
// Falls back to file logging if email is not configured (same pattern as feedback).
//
// Body:
//   {
//     studentName:   string,
//     email:         string,          // student's email — required
//     cefrLevel:     string,          // e.g. "B1"
//     xp:            number,
//     streak:        number,
//     overallAvg:    number,          // 0-100
//     totalSessions: number,
//     exercises: [                    // one entry per exercise
//       {
//         id:       string,
//         label:    string,
//         avg:      number,
//         best:     number,
//         sessions: number,
//         lastDate: string,
//       }
//     ],
//     topMistakes: [                  // top weak areas across all exercises
//       { category: string, frequency: number }
//     ],
//     weekStartDate: string,          // ISO date string
//   }
//
// Response: { success: true } or { success: false, error: "..." }
// ============================================================================

const digestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,                    // max 5 digest emails per hour per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many digest requests. Please try again later.' },
});

// File-based digest log (same pattern as feedback log)
const DIGEST_FILE = path.join(reportsDir, 'digest-log.json');

app.post('/api/digest', digestLimiter, async (req, res) => {
  try {
    const {
      studentName,
      email,
      cefrLevel,
      xp,
      streak,
      overallAvg,
      totalSessions,
      exercises = [],
      topMistakes = [],
      weekStartDate,
    } = req.body;

    // Validate required fields
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'A valid email address is required to send the weekly digest.' });
    }

    const cleanName    = sanitize(studentName || 'Student', 100);
    const cleanEmail   = sanitize(email, 254);
    const weekLabel    = weekStartDate
      ? new Date(weekStartDate).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })
      : new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });

    // ── Score colour helper ───────────────────────────────────────────────────
    function scoreColour(score) {
      if (score >= 90) return '#10B981'; // emerald
      if (score >= 75) return '#3B82F6'; // blue
      if (score >= 60) return '#F59E0B'; // amber
      return '#EF4444';                  // red
    }
    function scoreLabel(score) {
      if (score >= 90) return 'Excellent';
      if (score >= 75) return 'Good';
      if (score >= 60) return 'Fair';
      return 'Needs work';
    }

    // ── Build exercise rows ───────────────────────────────────────────────────
    const exerciseRows = exercises
      .filter(ex => ex.sessions > 0)
      .map(ex => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #1F2937;color:#F9FAFB;font-size:14px;">${sanitize(ex.label, 60)}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #1F2937;text-align:center;">
            <span style="background:${scoreColour(ex.avg || 0)}20;color:${scoreColour(ex.avg || 0)};font-weight:700;font-size:14px;padding:3px 10px;border-radius:8px;">${ex.avg !== null ? ex.avg + '%' : '—'}</span>
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #1F2937;text-align:center;color:#9CA3AF;font-size:13px;">${ex.best !== null ? ex.best + '%' : '—'}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #1F2937;text-align:center;color:#9CA3AF;font-size:13px;">${ex.sessions}</td>
        </tr>
      `).join('');

    // ── Build mistake rows ────────────────────────────────────────────────────
    const mistakeRankColors = ['#EF4444','#FB923C','#FBBF24','#34D399','#60A5FA'];
    const mistakeRows = topMistakes.slice(0, 5).map((m, i) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #1F2937;">
          <span style="background:${mistakeRankColors[i]}20;color:${mistakeRankColors[i]};font-weight:700;font-size:11px;padding:2px 8px;border-radius:6px;">#${i+1}</span>
        </td>
        <td style="padding:8px 12px;border-bottom:1px solid #1F2937;color:#F9FAFB;font-size:14px;">${sanitize(m.category, 60)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #1F2937;color:#9CA3AF;font-size:13px;text-align:right;">${m.frequency}×</td>
      </tr>
    `).join('');

    // ── Study recommendation ──────────────────────────────────────────────────
    let recommendation = '';
    if (overallAvg < 60) {
      recommendation = 'Focus on foundational grammar. Try the Grammar Practice section daily — even 10 minutes makes a big difference.';
    } else if (overallAvg < 80) {
      recommendation = `Good progress! Target your top weak area (${topMistakes[0]?.category || 'grammar'}) specifically this week. Consistency is key.`;
    } else {
      recommendation = 'Excellent work! Challenge yourself with higher CEFR levels and try the intensive placement test.';
    }

    // ── XP level label ────────────────────────────────────────────────────────
    const xpLevels = [
      { label: 'Beginner',          min: 0    },
      { label: 'Elementary',        min: 100  },
      { label: 'Pre-Intermediate',  min: 300  },
      { label: 'Intermediate',      min: 600  },
      { label: 'Upper-Intermediate',min: 1000 },
      { label: 'Advanced',          min: 1500 },
      { label: 'Proficient',        min: 2200 },
      { label: 'Master',            min: 3000 },
    ];
    const xpLevel = xpLevels.slice().reverse().find(l => (xp || 0) >= l.min) || xpLevels[0];

    // ── HTML email ────────────────────────────────────────────────────────────
    const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Your Weekly Poly-Puff Digest</title>
</head>
<body style="margin:0;padding:0;background:#0A0E1A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0E1A;padding:24px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:580px;background:#111827;border-radius:16px;overflow:hidden;border:1px solid #1F2937;">

        <!-- Header -->
        <tr>
          <td style="background:#0F172A;padding:28px 32px;border-bottom:1px solid #1F2937;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:2px;color:#6B7280;text-transform:uppercase;">Weekly Digest</p>
                  <h1 style="margin:4px 0 0;font-size:22px;font-weight:800;color:#FFFFFF;">
                    🐡 Poly-Puff Progress Report
                  </h1>
                  <p style="margin:4px 0 0;font-size:13px;color:#6B7280;">Week of ${weekLabel}</p>
                </td>
                <td align="right" style="vertical-align:top;">
                  <div style="background:#00D9FF20;border:1px solid #00D9FF40;border-radius:10px;padding:8px 16px;display:inline-block;">
                    <p style="margin:0;font-size:11px;color:#00D9FF;font-weight:700;letter-spacing:0.5px;">CEFR LEVEL</p>
                    <p style="margin:2px 0 0;font-size:24px;font-weight:900;color:#00D9FF;">${sanitize(cefrLevel || 'A1', 3)}</p>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Student banner -->
        <tr>
          <td style="padding:20px 32px;border-bottom:1px solid #1F2937;">
            <p style="margin:0;font-size:13px;color:#9CA3AF;">Hello,</p>
            <p style="margin:4px 0 0;font-size:18px;font-weight:700;color:#FFFFFF;">${cleanName} 👋</p>
            <p style="margin:8px 0 0;font-size:13px;color:#9CA3AF;line-height:1.6;">Here's your weekly ESL progress summary. Keep up the great work!</p>
          </td>
        </tr>

        <!-- Stats row -->
        <tr>
          <td style="padding:20px 32px;border-bottom:1px solid #1F2937;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="background:#0F172A;border-radius:12px;padding:16px 8px;border:1px solid #1F2937;">
                  <p style="margin:0;font-size:24px;font-weight:800;color:${scoreColour(overallAvg || 0)};">${overallAvg || 0}%</p>
                  <p style="margin:4px 0 0;font-size:10px;font-weight:700;letter-spacing:0.5px;color:#6B7280;text-transform:uppercase;">Avg Accuracy</p>
                </td>
                <td width="8"></td>
                <td align="center" style="background:#0F172A;border-radius:12px;padding:16px 8px;border:1px solid #1F2937;">
                  <p style="margin:0;font-size:24px;font-weight:800;color:${streak > 0 ? '#FB923C' : '#6B7280'};">${streak || 0}d</p>
                  <p style="margin:4px 0 0;font-size:10px;font-weight:700;letter-spacing:0.5px;color:#6B7280;text-transform:uppercase;">Streak</p>
                </td>
                <td width="8"></td>
                <td align="center" style="background:#0F172A;border-radius:12px;padding:16px 8px;border:1px solid #1F2937;">
                  <p style="margin:0;font-size:24px;font-weight:800;color:#F59E0B;">${(xp || 0).toLocaleString()}</p>
                  <p style="margin:4px 0 0;font-size:10px;font-weight:700;letter-spacing:0.5px;color:#6B7280;text-transform:uppercase;">Total XP</p>
                </td>
                <td width="8"></td>
                <td align="center" style="background:#0F172A;border-radius:12px;padding:16px 8px;border:1px solid #1F2937;">
                  <p style="margin:0;font-size:24px;font-weight:800;color:#A78BFA;">${totalSessions || 0}</p>
                  <p style="margin:4px 0 0;font-size:10px;font-weight:700;letter-spacing:0.5px;color:#6B7280;text-transform:uppercase;">Sessions</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- XP level bar -->
        <tr>
          <td style="padding:16px 32px;border-bottom:1px solid #1F2937;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="margin:0;font-size:12px;color:#9CA3AF;">
                    ⚡ XP Level: <strong style="color:#00D9FF;">${xpLevel.label}</strong>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Exercise performance -->
        ${exerciseRows ? `
        <tr>
          <td style="padding:20px 32px;border-bottom:1px solid #1F2937;">
            <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#9CA3AF;letter-spacing:1px;text-transform:uppercase;">📊 Exercise Performance</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:10px;overflow:hidden;border:1px solid #1F2937;">
              <tr style="background:#0F172A;">
                <th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:700;letter-spacing:0.5px;color:#6B7280;text-transform:uppercase;">Exercise</th>
                <th style="padding:8px 12px;text-align:center;font-size:11px;font-weight:700;letter-spacing:0.5px;color:#6B7280;text-transform:uppercase;">Avg</th>
                <th style="padding:8px 12px;text-align:center;font-size:11px;font-weight:700;letter-spacing:0.5px;color:#6B7280;text-transform:uppercase;">Best</th>
                <th style="padding:8px 12px;text-align:center;font-size:11px;font-weight:700;letter-spacing:0.5px;color:#6B7280;text-transform:uppercase;">Sessions</th>
              </tr>
              ${exerciseRows}
            </table>
          </td>
        </tr>
        ` : ''}

        <!-- Top mistakes -->
        ${mistakeRows ? `
        <tr>
          <td style="padding:20px 32px;border-bottom:1px solid #1F2937;">
            <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#9CA3AF;letter-spacing:1px;text-transform:uppercase;">🎯 Top Areas to Improve</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:10px;overflow:hidden;border:1px solid #1F2937;">
              ${mistakeRows}
            </table>
          </td>
        </tr>
        ` : ''}

        <!-- Recommendation -->
        <tr>
          <td style="padding:20px 32px;border-bottom:1px solid #1F2937;">
            <div style="background:#0F2D1A;border-radius:12px;padding:16px;border-left:3px solid #10B981;">
              <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:1px;color:#6B7280;text-transform:uppercase;">💡 This Week's Focus</p>
              <p style="margin:0;font-size:14px;color:#D1FAE5;line-height:1.6;">${recommendation}</p>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;background:#0F172A;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="margin:0;font-size:12px;color:#4B5563;">Poly-Puff ESL Trainer &nbsp;·&nbsp; polypuff.app</p>
                  <p style="margin:4px 0 0;font-size:11px;color:#374151;">
                    You're receiving this because you enabled weekly digests in the app.<br>
                    To unsubscribe, open Poly-Puff → Settings → Weekly Digest → Off.
                  </p>
                </td>
                <td align="right" style="vertical-align:bottom;">
                  <p style="margin:0;font-size:20px;">🐡</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    // ── Always log to file ────────────────────────────────────────────────────
    const digestEntry = {
      id:          `digest_${Date.now()}`,
      studentName: cleanName,
      email:       cleanEmail,
      weekLabel,
      overallAvg:  overallAvg || 0,
      totalSessions: totalSessions || 0,
      cefrLevel:   cefrLevel || 'A1',
      xp:          xp || 0,
      streak:      streak || 0,
      topMistakes: topMistakes.slice(0, 5),
      timestamp:   new Date().toISOString(),
      emailSent:   false,
    };

    let digestLog = [];
    try {
      if (fs.existsSync(DIGEST_FILE)) digestLog = JSON.parse(fs.readFileSync(DIGEST_FILE, 'utf8'));
    } catch { digestLog = []; }
    digestLog.push(digestEntry);
    if (digestLog.length > 500) digestLog = digestLog.slice(-500);
    fs.writeFileSync(DIGEST_FILE, JSON.stringify(digestLog, null, 2));

    // ── Respond immediately, send email in background ─────────────────────────
    res.json({ success: true });

    if (feedbackTransporter) {
      feedbackTransporter.sendMail({
        from:    `"Poly-Puff Weekly Digest" <${process.env.FEEDBACK_EMAIL}>`,
        to:      cleanEmail,
        subject: `📊 Your Weekly Progress · ${cleanName} · ${weekLabel}`,
        html:    htmlBody,
      }).then(() => {
        digestEntry.emailSent = true;
        // Update log entry
        try {
          const log = JSON.parse(fs.readFileSync(DIGEST_FILE, 'utf8'));
          const idx = log.findIndex(e => e.id === digestEntry.id);
          if (idx >= 0) { log[idx].emailSent = true; fs.writeFileSync(DIGEST_FILE, JSON.stringify(log, null, 2)); }
        } catch {}
        console.log(`📧 Weekly digest sent to ${cleanEmail} for ${cleanName}`);
      }).catch((err) => {
        console.error(`📧 Digest email failed (logged to file): ${err.message}`);
      });
    } else {
      console.log(`📧 DIGEST RECEIVED (no email configured) — ${cleanName} <${cleanEmail}>`);
    }

  } catch (error) {
    console.error('Digest error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to send digest. Please try again.' });
  }
});
