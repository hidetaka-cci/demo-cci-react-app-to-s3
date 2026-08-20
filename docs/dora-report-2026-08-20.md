# DORA Metrics Report — main branch

**Report date:** 2026-08-20 (UTC)
**Window:** past 7 days (2026-08-13 00:00:00Z → 2026-08-20 23:59:59Z)
**Prior window (for W-o-W):** 2026-08-06 → 2026-08-13
**Project:** gh/hidetaka-cci/demo-cci-react-app-to-s3
**Data source:** CircleCI (pipelines on `main`)

> Lead Time for Changes is not calculable from CircleCI data alone and is omitted, per spec.

---

## Summary table

| Metric | Value | Tier | W-o-W delta |
|---|---|---|---|
| Deployment Frequency | 0 deploys / week | Low (<1/month) | 0 → 0 (no change) |
| Change Failure Rate | Insufficient data (<3 deploys) | n/a | n/a |
| MTTR | Ongoing incident — no recovery yet within window (≥166 h and counting) | Low (>1 week) | prior recovery took ≈166 h (Low) |

---

## Data extracted

### Current window (past 7 days) — 7 pipelines on `main`

| # | Created (UTC) | Workflow(s) | Jobs | Overall |
|---|---|---|---|---|
| 260 | 2026-08-20 07:07:37 | `setup-workflow` (success), `chunk-task` (running) | `chunk-task` (running) | in progress |
| 259 | 2026-08-19 09:07:38 | `nightly-audit` (failed) | `audit` (failed) | failed |
| 258 | 2026-08-18 09:07:38 | `nightly-audit` (failed) | `audit` (failed) | failed |
| 257 | 2026-08-17 09:07:38 | `nightly-audit` (failed) | `audit` (failed) | failed |
| 256 | 2026-08-14 09:07:37 | `nightly-audit` (failed) | `audit` (failed) | failed |
| 255 | 2026-08-13 09:07:38 | `nightly-audit` (failed) | `audit` (failed) | failed |
| 253 | 2026-08-13 07:07:37 | `setup-workflow` (success), `chunk-task` (success) | `chunk-task` (success) | success |

### Prior window (2026-08-06 → 2026-08-13) — 6 pipelines on `main`

| # | Created (UTC) | Workflow(s) | Jobs | Overall |
|---|---|---|---|---|
| 252 | 2026-08-12 09:07:38 | `nightly-audit` (failed) | `audit` (failed) | failed |
| 251 | 2026-08-11 09:07:37 | `nightly-audit` (failed) | `audit` (failed) | failed |
| 250 | 2026-08-10 09:07:38 | `nightly-audit` (failed) | `audit` (failed) | failed |
| 249 | 2026-08-07 09:07:38 | `nightly-audit` (failed) | `audit` (failed) | failed |
| 248 | 2026-08-06 09:07:38 | `nightly-audit` (failed) | `audit` (failed) | failed |
| 247 | 2026-08-06 07:07:37 | `setup-workflow` (success), `chunk-task` (success) | `chunk-task` (success) | success |

---

## Metric details

### Deployment Frequency — **0 / week (Low)**

- Definition applied: successful pipelines on `main` containing a job whose name matches `deploy|release|publish|ship`.
- Observed job names in current-window pipelines: `chunk-task`, `audit`, `setup-workflow`. **No matches.**
- The `.circleci/config.yml` in the repo defines a `deploy-artifact` job under the `build-react-app` workflow (which would match `deploy`), but that workflow did not run in any pipeline within the current or prior 7-day window — every scheduled trigger produced `setup-workflow` → `chunk-task` or `nightly-audit` instead.
- **Result: 0 deploys / 7 days → Low tier (<1/month).**
- **W-o-W:** prior window also had 0 qualifying deploys → Δ = 0.

### Change Failure Rate — **Insufficient data**

- Fewer than 3 deploy pipelines ran in the current window (0), so per spec CFR is not computed.

### MTTR — **Ongoing (Low tier trajectory)**

Chronology of pipeline outcomes on `main` (last ~2 weeks):

```
2026-08-06 07:07  247  ✅
2026-08-06 09:07  248  ❌  ← incident A opens
2026-08-07 09:07  249  ❌
2026-08-10 09:07  250  ❌
2026-08-11 09:07  251  ❌
2026-08-12 09:07  252  ❌
2026-08-13 07:07  253  ✅  ← incident A recovers (duration ≈ 6d 22h 3m ≈ 166.05 h)
2026-08-13 09:07  255  ❌  ← incident B opens
2026-08-14 09:07  256  ❌
2026-08-17 09:07  257  ❌
2026-08-18 09:07  258  ❌
2026-08-19 09:07  259  ❌
2026-08-20 07:07  260  ⏳  (chunk-task still running as of report time)
```

- **Failures within the current window (5):** 255, 256, 257, 258, 259 — none have been followed by a successful pipeline yet.
- **Ongoing incident B duration** (from first failure 255 stopped_at 2026-08-13 09:07:54 → report time 2026-08-20 07:08:00): **≈ 166.0 hours (≈ 6d 22h)** and still counting.
- Once >168 h (7 days) elapses without recovery, MTTR crosses into Low (>1 week). At report time it is on the threshold.
- **Tier: Low** (recovery >1 week is imminent; no completed recovery event to report inside the window).
- **W-o-W:** the incident that closed at pipeline 253 (2026-08-13 07:10:57) began at pipeline 248 (2026-08-06 09:07:58), a duration of ≈ 166.05 h — also Low. So the current trajectory is not worse than last week's, but not better either.

---

## Recommendations (metrics in Medium/Low)

1. **Deployment Frequency (Low) — restore the `build-react-app` deploy workflow on `main`.**
   The `.circleci/config.yml` defines `deploy-artifact`, but every recent pipeline on `main` came from a scheduled trigger that only ran `setup-workflow`/`chunk-task`/`nightly-audit`. Root-cause why the main workflow does not trigger for `main` pushes (setup dynamic-config likely gates on trigger type or actor). Once fixed, each merge to `main` will register as a deploy and this metric becomes measurable.

2. **MTTR (Low) — fix the failing `nightly-audit` `audit` job.**
   The `audit` job has been red every night since 2026-08-13. That is what is keeping the recovery clock running. Pull the failing step's log (`get_condensed_step_output` on job `acda5b0d-33cc-41c4-85f1-b29fc16d4dd4` for pipeline 259 is a good starting point) and land a fix; the next successful nightly run closes the incident.

3. **Change Failure Rate (n/a — data gap) — same root cause as #1.**
   Once deploy pipelines are running, CFR becomes calculable. Consider tagging rollback pipelines explicitly (e.g. a `rollback` job name or a workflow parameter) so the 1-hour follow-up heuristic is reliable.

---

## Delivery note

The task specified posting this report to a Slack channel. No Slack MCP tool is available in this environment (only `chunk-circleci` and `chunk-git` MCP tools are exposed), so the report is delivered as this checked-in artifact and via the accompanying pull request. To enable automated Slack posting on future runs, configure a Slack MCP integration (or an incoming-webhook URL via the CircleCI `slack` orb) and wire it into this schedule.
