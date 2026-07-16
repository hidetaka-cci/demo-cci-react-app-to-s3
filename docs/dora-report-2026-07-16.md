# DORA Metrics Report — Week of 2026-07-09 → 2026-07-16 (UTC)

Project: `gh/hidetaka-cci/demo-cci-react-app-to-s3`
Branch: `main`
Generated: 2026-07-16 (UTC)

> Note: This report was intended to be posted to Slack, but no Slack MCP tools
> are configured for this environment. The report is delivered via PR instead.

## Summary

| Metric | Current | Prior Week | WoW Delta | Tier |
|---|---|---|---|---|
| Deployment Frequency | 0 / week | 0 / week | 0 | **Low** |
| Change Failure Rate | N/A (insufficient data) | N/A (insufficient data) | — | — |
| MTTR | N/A (no failures) | N/A (no failures) | — | — |

Lead Time for Changes is not calculable from CircleCI data alone and is omitted.

## Deployment Frequency

- **Value:** 0 deploys on main in the past 7 days.
- **Tier:** Low (`<1/month`).
- **Pipelines observed on main (7):** #227, #226, #225, #224, #223, #222, #220.
- **Workflows executed:** `nightly-audit` (5), `chunk-task` (2), `setup-workflow` (2).
- **Deploy jobs matched (deploy / release / publish / ship):** 0.

The `.circleci/config.yml` defines a `deploy-artifact` job in the
`build-react-app` workflow, but that workflow did not execute in any pipeline
this week. Every pipeline on main was either the scheduled `nightly-audit` or
a Chunk agent `chunk-task` run.

**Prior week (2026-07-02 → 2026-07-08):** Same pattern — 6 pipelines
(#219, #218, #217, #216, #215, #214), 0 deploys. WoW delta: **0**.

## Change Failure Rate

- **Value:** **Insufficient data** — fewer than 3 deploy pipelines ran this
  week (0 deploys observed).
- **Tier:** N/A.

## Mean Time to Recovery (MTTR)

- **Value:** N/A — no pipeline failures on main were observed in the past 7
  days. All 7 pipelines succeeded (pipeline #227 is still running at the time
  this report was generated, but its `setup-workflow` succeeded).
- **Tier:** N/A (no recovery events to measure).

## Recommendation

**Deployment Frequency is at the Low tier.** The `deploy-artifact` job exists
in the CircleCI config but is only wired into the `build-react-app` workflow,
which is not being triggered on main by the recent scheduled pipelines or
Chunk agent runs. To move up a tier:

- Verify that pushes/merges to `main` are actually starting the
  `build-react-app` workflow (not just the scheduled `nightly-audit`).
- If the intent is that scheduled runs should also redeploy, add
  `deploy-artifact` as a job in the scheduled workflow, or wire a
  post-merge trigger that runs `build-react-app` on every merge to main.
- Confirm the `aws-oidc` context is populated so the job doesn't get skipped
  silently.

## Data Sources

- CircleCI pipelines listed via `list_pipelines` (branch=main).
- Workflows per pipeline via `list_workflows`.
- Jobs per workflow via `get_workflow_jobs` (spot-checked; no deploy names).
- Config reference: `.circleci/config.yml` (defines `deploy-artifact`).
