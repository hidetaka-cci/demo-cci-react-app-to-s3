'use strict';

const fs = require('fs');

const MAX_LEN = 2600;
const TRUNC_NOTE =
  '\n\n…（以下省略）詳細は artifact の audit-report.json または CircleCI ログを参照してください。';
const FALLBACK =
  'audit-report.json を解釈できませんでした。CircleCI のログを確認してください。';

const severityRank = {
  critical: 5,
  high: 4,
  moderate: 3,
  low: 2,
  info: 1,
};

function rank(sev) {
  return severityRank[sev] ?? 0;
}

function worse(a, b) {
  return rank(a) >= rank(b) ? a : b;
}

/** Slack mrkdwn のリンクラベル向けに整形 */
function slackLinkLabel(s) {
  return String(s)
    .replace(/\r?\n/g, ' ')
    .replace(/\|/g, '｜')
    .replace(/</g, '‹')
    .replace(/>/g, '›')
    .trim()
    .slice(0, 120);
}

function formatAudit(data) {
  if (!data || typeof data !== 'object') return FALLBACK;

  if (data.error) {
    const code = data.error.code ? String(data.error.code) : '';
    const summary = data.error.summary ? String(data.error.summary) : '';
    const detail = [code, summary].filter(Boolean).join(' — ') || JSON.stringify(data.error);
    return `npm audit エラー: ${detail.slice(0, 800)}`;
  }

  const vulns = data.vulnerabilities;
  if (!vulns || typeof vulns !== 'object') return FALLBACK;

  const meta = data.metadata && data.metadata.vulnerabilities;
  const lines = [];

  if (meta) {
    lines.push('*件数サマリ*');
    lines.push(`・合計: ${meta.total ?? '—'}`);
    lines.push(
      `・critical: ${meta.critical ?? 0}, high: ${meta.high ?? 0}, moderate: ${meta.moderate ?? 0}, low: ${meta.low ?? 0}, info: ${meta.info ?? 0}`,
    );
    lines.push('');
  }

  const entries = Object.entries(vulns).map(([key, v]) => {
    let worst = typeof v.severity === 'string' ? v.severity : 'low';
    const advisories = [];
    const seen = new Set();

    if (Array.isArray(v.via)) {
      for (const item of v.via) {
        if (item && typeof item === 'object') {
          worst = worse(worst, typeof item.severity === 'string' ? item.severity : worst);
          const url = item.url;
          if (url && !seen.has(url)) {
            seen.add(url);
            advisories.push({
              title: item.title || item.name || 'advisory',
              url: String(url),
            });
          }
        }
      }
    }

    const name = typeof v.name === 'string' ? v.name : key;
    const range = typeof v.range === 'string' ? v.range : '';
    const nodes = Array.isArray(v.nodes) ? v.nodes.slice(0, 2) : [];

    return {
      name,
      worst,
      range: range.slice(0, 120),
      fixAvailable: Boolean(v.fixAvailable),
      advisories: advisories.slice(0, 3),
      nodes,
    };
  });

  entries.sort((a, b) => rank(b.worst) - rank(a.worst));

  lines.push('*検出パッケージ（重要度順）*');
  for (const e of entries) {
    let head = `• *${e.name}* (${e.worst})`;
    if (e.range) head += ` \`${e.range}\``;
    if (e.fixAvailable) head += ' — `npm audit fix` 候補あり';
    lines.push(head);
    for (const adv of e.advisories) {
      const label = slackLinkLabel(adv.title);
      lines.push(`  ◦ <${adv.url}|${label}>`);
    }
    if (e.nodes.length) {
      lines.push(`  _${e.nodes.join(', ')}_`);
    }
  }

  let text = lines.join('\n');
  if (text.length > MAX_LEN) {
    text = text.slice(0, MAX_LEN - TRUNC_NOTE.length) + TRUNC_NOTE;
  }
  return text;
}

function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    process.stderr.write('Usage: node format-npm-audit-for-slack.cjs <audit-report.json>\n');
    process.exit(2);
  }

  let raw;
  try {
    raw = fs.readFileSync(filePath, 'utf8');
  } catch {
    console.log(FALLBACK);
    return;
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    console.log(FALLBACK);
    return;
  }

  console.log(formatAudit(data));
}

main();
