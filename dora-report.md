# DORA Metrics Report

**Window (UTC):** 2026-09-10 → 2026-09-17
**Branch:** main
**Project:** gh/hidetaka-cci/demo-cci-react-app-to-s3

## Summary

| Metric | Value | Tier | WoW Δ |
|---|---|---|---|
| Deployment Frequency | 0 / week | Low (<1/month) | 0 |
| Change Failure Rate | N/A — insufficient data | N/A | — |
| MTTR | Ongoing (>7 days, unrecovered) | Low (>1 week) | 0 |

## Pipeline Inventory (past 7 days)

| Pipeline | Time (UTC) | Workflow | Job | Status |
|---|---|---|---|---|
| 287 | 2026-09-17 07:07 | chunk-task | chunk-task | running |
| 286 | 2026-09-16 09:07 | nightly-audit | audit | failed |
| 285 | 2026-09-15 09:07 | nightly-audit | audit | failed |
| 284 | 2026-09-14 09:07 | nightly-audit | audit | failed |
| 283 | 2026-09-11 09:07 | nightly-audit | audit | failed |
| 282 | 2026-09-10 09:07 | nightly-audit | audit | failed |
| 280 | 2026-09-10 07:07 | chunk-task | chunk-task | success |

## Findings

- No job names matching `deploy|release|publish|ship` executed in the window. The `deploy-artifact` job defined in `.circleci/config.yml` (workflow `build-react-app`) did not run — only scheduled pipelines (nightly-audit, chunk-task) triggered.
- The `nightly-audit` workflow has failed every day of the window with no successful recovery, so all 5 failures remain open (>7 days).
- Deploy count = 0, so Change Failure Rate is undefined per the "<3 deploys → insufficient data" rule.
- Prior week (2026-09-03 → 2026-09-09) showed the same pattern: 0 deploys, 5 nightly-audit failures, no recoveries. WoW deltas are all 0.

## Recommendations

1. **Deployment Frequency (Low):** Trigger the `build-react-app` workflow on merges to `main` so `deploy-artifact` actually runs. Today only scheduled workflows fire; push/PR-merge events aren't producing pipelines with deploy jobs.
2. **MTTR (Low):** Root-cause the `audit` job failure that has been recurring since at least 2026-09-10. Until it returns to green, recovery time keeps growing.

## Notes

- Slack MCP tools are not available in this run; the report is delivered via this file and the accompanying PR body.
- Lead Time for Changes omitted (not derivable from CircleCI data alone).
