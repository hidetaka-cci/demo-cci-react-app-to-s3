# DORA Metrics Report — Week of 2026-11-12 to 2026-11-19

Generated: 2026-11-19 UTC  
Branch: `main`  
Project: `hidetaka-cci/demo-cci-react-app-to-s3`

---

## Summary

| Metric | Value | Tier | WoW Delta |
|---|---|---|---|
| Deployment Frequency | 0 deployments/week | 🔴 Low | — (no data prior week) |
| Change Failure Rate | N/A — insufficient data | — | — |
| MTTR | Unresolved (5 failures, 0 recoveries) | 🔴 Low | — |

---

## Deployment Frequency

**Value:** 0 deployments in the past 7 days  
**Tier: Low** (< 1/month)

The CI config defines a `build-react-app` workflow containing a `deploy-artifact` job (deploys to S3). This workflow has had **zero runs in the last 30 days** on `main`. All pipelines observed this week were scheduled triggers (`nightly-audit`, `chunk-task`) — none were code-push triggered deploys.

**Week-over-week:** No change (0 → 0; deploy-artifact has not run in 30+ days).

---

## Change Failure Rate

**Value:** Insufficient data  
Fewer than 3 deploy pipelines ran this week. Change Failure Rate cannot be calculated.

---

## Mean Time to Recovery (MTTR)

**Value:** No recovery observed — persistent failure  
**Tier: Low** (failure duration > 1 week if unresolved)

The `nightly-audit` workflow (`audit` job) has a **100% failure rate** this week:

| Date | Pipeline | Status |
|---|---|---|
| 2026-11-12 | #340 | ❌ failed |
| 2026-11-13 | #341 | ❌ failed |
| 2026-11-16 | #342 | ❌ failed |
| 2026-11-17 | #343 | ❌ failed |
| 2026-11-18 | #344 | ❌ failed |

5 consecutive failures with no successful run → MTTR is undefined for this window (no recovery event to measure from).

---

## Recommendations

### Deployment Frequency (Low tier)
The `deploy-artifact` job has not run in 30+ days. The most likely cause is that no commits have been pushed to `main` — the last commit was the merge of PR #13 (`fix: resolve all npm security vulnerabilities`). To improve:
- Establish a regular merge-to-main cadence with feature work so the `build-react-app` → `deploy-artifact` workflow executes at least weekly.
- If deployments are intentionally paused, consider adding a gate (manual approval job) rather than letting the pipeline go dormant — a dormant pipeline masks config drift.

### MTTR / nightly-audit (Low tier)
The `audit` job has been failing every day since at least Nov 12 with no remediation. To recover:
- Inspect the `audit` job logs (job #505 on workflow `aecd8fa0`) to identify the specific failure.
- Given recent history (PR #13 fixed npm security vulnerabilities), it's likely residual vulnerabilities or a misconfigured audit threshold.
- Fix the underlying npm audit issue or tune the severity threshold in the audit step, then verify the nightly-audit workflow passes.

---

## Notes
- Lead Time for Changes is not calculable from CircleCI pipeline data alone — omitted per spec.
- All timestamps are UTC.
- No Slack MCP tool was detected in this environment; report delivered as a PR instead.
