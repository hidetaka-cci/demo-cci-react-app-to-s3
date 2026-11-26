# DORA Metrics Report
**Project**: demo-cci-react-app-to-s3  
**Report period**: 2026-11-19 to 2026-11-26 (past 7 days)  
**Generated**: 2026-11-26 UTC

---

## Summary

| Metric | This Week | WoW Delta | Tier |
|---|---|---|---|
| Deployment Frequency | 0 deploys | 0 (no change) | 🔴 Low |
| Change Failure Rate | — | — | ⚠️ Insufficient data |
| MTTR | Ongoing (30+ days) | — | 🔴 Low |

> **Lead Time for Changes** is not calculable from CircleCI data alone — omitted.

---

## Deployment Frequency

**Current**: 0 successful deploys in the past 7 days  
**Previous week**: 0 successful deploys  
**WoW delta**: 0 (no change)  
**Tier**: 🔴 Low (<1/month)

**Detail**: The `build-react-app` workflow (which contains the `deploy-artifact` job) had **0 runs** in both the past 7 days and the past 30 days. All pipeline activity on main this week was limited to scheduled `nightly-audit` and `chunk-task` workflows — no code push triggered a deployment pipeline.

---

## Change Failure Rate

**Status**: ⚠️ Insufficient data  
**Total deploy pipelines (7 days)**: 0  

Fewer than 3 deploy pipelines ran this week. Change Failure Rate cannot be calculated.

---

## Mean Time to Recovery (MTTR)

**Current**: Not calculable — no recovery event observed  
**Ongoing failure duration**: 30+ days (since ~2026-10-27)  
**Tier**: 🔴 Low (>1 week unresolved)

**Detail**: The `nightly-audit` workflow's `audit` job has been failing on every run for 30+ consecutive days:
- Last 7 days: 5 runs, 5 failed, 0 successful (0% success rate)
- Last 30 days: 22 runs, 22 failed, 0 successful (0% success rate)

No successful recovery pipeline has followed any failure. MTTR is immeasurable because no recovery has occurred; the incident is ongoing and classified as Low tier.

---

## Recommendations

### 1. Investigate missing deployments (Deployment Frequency: Low)
The `deploy-artifact` job has not run in 30+ days despite recent code merges (PR #13 merged). Likely causes:
- Webhook trigger from GitHub to CircleCI may be misconfigured or failing silently
- The `build-react-app` workflow may be filtered out at the pipeline level before jobs run
- **Action**: Check CircleCI project webhook settings in GitHub, verify that pushes to `main` create a webhook-triggered pipeline (not just scheduled ones), and confirm the `build-react-app` workflow filter is correct.

### 2. Fix the failing `audit` job immediately (MTTR: Low)
The `nightly-audit` workflow has had a 0% success rate for over 30 days. This is a critical CI health issue:
- **Action**: Review the `audit` job logs, identify the root cause of the persistent failure, and apply a fix. Until this workflow is green, pipeline health metrics are not meaningful and the team has no nightly visibility into security/audit issues.

---

## Data Sources

| Workflow | Jobs (7-day) | Failures | Successes | Success Rate |
|---|---|---|---|---|
| build-react-app | 0 | — | — | N/A |
| nightly-audit | 5 | 5 | 0 | 0% |
| chunk-task | ~2 | 0 | 2 | 100% |

> **Note**: Slack posting was skipped — no Slack MCP integration is configured in this environment. This report was saved as `dora-report.md` in the repository root instead.
