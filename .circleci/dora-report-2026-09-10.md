# DORA Metrics Report — 2026-09-10

**Reporting window (UTC):** 2026-09-03T00:00:00Z → 2026-09-10T07:08:05Z (past 7 days)
**Project:** gh/hidetaka-cci/demo-cci-react-app-to-s3
**Branch:** main
**Note:** No Slack MCP tool is available in this run — the report is published here and in the PR body instead.

---

## Summary of Pipeline Activity (past 7 days on main)

| # | Created (UTC) | Workflow | Status |
|---|---|---|---|
| 280 | 2026-09-10 07:07:37 | setup-workflow + chunk-task | setup=success, chunk-task=running |
| 279 | 2026-09-09 09:07:38 | nightly-audit | failed |
| 278 | 2026-09-08 09:07:38 | nightly-audit | failed |
| 277 | 2026-09-07 09:07:38 | nightly-audit | failed |
| 276 | 2026-09-04 09:07:38 | nightly-audit | failed |
| 275 | 2026-09-03 09:07:38 | nightly-audit | failed |
| 273 | 2026-09-03 07:07:37 | setup-workflow + chunk-task | success |

Total: 7 pipelines — 5 failed, 2 succeeded.

---

## Metrics

### 1. Deployment Frequency
- **Value:** 0 deploys / 7 days
- **Tier:** Low (< 1/month)
- **WoW delta:** 0 (previous week also 0)

The CircleCI config defines a deploy job (`deploy-artifact` in the `build-react-app` workflow) that only runs on pushes to `main`. No such push occurred in the window — every pipeline was a `scheduled_pipeline` trigger running either the `nightly-audit` workflow or the `chunk-task` workflow, none of which contain a job matching `deploy|release|publish|ship`.

### 2. Change Failure Rate
- **Value:** Insufficient data (0 deploys, threshold is ≥ 3)
- **Tier:** N/A
- **WoW delta:** N/A

### 3. Mean Time to Recovery (MTTR)
- **Value:** ~89.19 hours (~3.72 days)
- **Tier:** Medium (< 1 week)
- **WoW delta:** -0.07 hrs vs previous week (~89.26 hrs) — essentially flat

Per-failure recovery durations (from failure `stopped_at` to next successful pipeline on main):

| Failed pipeline | Stopped (UTC) | Next success | Recovery |
|---|---|---|---|
| #275 | 2026-09-03 09:07:55 | #280 setup-workflow (09-10 07:08:06) | 166.00 hrs |
| #276 | 2026-09-04 09:11:23 | #280 (09-10 07:08:06) | 141.95 hrs |
| #277 | 2026-09-07 09:07:52 | #280 (09-10 07:08:06) | 70.00 hrs |
| #278 | 2026-09-08 09:07:54 | #280 (09-10 07:08:06) | 46.00 hrs |
| #279 | 2026-09-09 09:08:29 | #280 (09-10 07:08:06) | 21.99 hrs |

**Caveat:** All five failures are the same recurring `nightly-audit` failure. The "recovery" is credited to pipeline #280's `setup-workflow` succeeding — the `nightly-audit` workflow itself has not recovered. If we scope MTTR to the failing workflow only, MTTR is effectively unbounded (open incident spanning the full window).

---

## Tier Snapshot

| Metric | Current | Tier | Previous week | WoW delta |
|---|---|---|---|---|
| Deployment Frequency | 0/wk | Low | 0/wk | 0 |
| Change Failure Rate | insufficient data | — | insufficient data | — |
| MTTR | 89.19 hrs | Medium | 89.26 hrs | -0.07 hrs |

_Lead Time for Changes: omitted (not calculable from CircleCI data alone.)_

---

## Recommendation

**Deployment Frequency is Low, MTTR is Medium** — both are dominated by the same root cause: the `nightly-audit` workflow has been failing continuously for at least 14 consecutive days without human triage, and no code has been merged to `main` (so the deploy workflow never triggers).

**Concrete action:** Investigate and fix the `audit` job in the `nightly-audit` workflow (pipelines #275–#279 all failed within ~15–225 seconds — likely a consistent failure such as a broken CLI invocation, missing secret, or a network error). Once the audit is green, either (a) route real changes through `main` so the `build-react-app` deploy workflow triggers, or (b) add a scheduled trigger for `build-react-app` if the intent is scheduled releases. This single fix will restore MTTR (unbounded → near-zero for scheduled runs) and unblock the deploy pipeline.
