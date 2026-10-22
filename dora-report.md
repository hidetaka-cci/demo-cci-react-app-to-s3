# DORA Metrics Report
**Project:** hidetaka-cci/demo-cci-react-app-to-s3  
**Period:** Oct 15–22, 2026 (UTC)  
**Generated:** 2026-10-22

---

## Summary

| Metric | Value | Tier | WoW Delta |
|---|---|---|---|
| Deployment Frequency | 0 / week | 🔴 Low | — (no change) |
| Change Failure Rate | N/A | — | — |
| MTTR | Unresolved (∞) | 🔴 Low | — (no change) |

*Lead Time for Changes is not calculable from CircleCI data alone — omitted.*

---

## Deployment Frequency

**Value:** 0 deployments in the past 7 days  
**Tier:** 🔴 Low (<1/month)  
**Week-over-week:** No change (0 last week as well)

**Finding:** No jobs named `deploy`, `release`, `publish`, or `ship` were found in any workflow on the `main` branch. The only job names observed are `audit`, `chunk-task`, and `setup`. Deployments are either not happening through CircleCI or are not named in a way that is trackable under DORA conventions.

---

## Change Failure Rate

**Value:** N/A — Insufficient data  
**Tier:** —

**Finding:** Zero deploy pipelines were detected this week (or over the full 90-day history). Change Failure Rate cannot be calculated without at least 3 deploy pipelines. See Deployment Frequency recommendation.

---

## Mean Time to Recovery (MTTR)

**Value:** No recovery observed — effectively unbounded  
**Tier:** 🔴 Low (>1 week)  
**Week-over-week:** No change; this failure pattern persists for at least 90 days

**Finding:** The `nightly-audit` workflow (job: `audit`) has failed on **every single run** — 64 consecutive failures over 90 days with a 0% success rate. In the past 7 days, it failed on: Oct 15, 16, 19, 20, and 21. There has been no successful run to recover to, so MTTR is effectively undefined/infinite.

---

## Pipeline Summary — Past 7 Days

| Pipeline | Date (UTC) | Workflow | Status |
|---|---|---|---|
| #320 | 2026-10-22 | chunk-task | running |
| #320 | 2026-10-22 | setup-workflow | success |
| #319 | 2026-10-21 | nightly-audit | **failed** |
| #318 | 2026-10-20 | nightly-audit | **failed** |
| #317 | 2026-10-19 | nightly-audit | **failed** |
| #316 | 2026-10-16 | nightly-audit | **failed** |
| #315 | 2026-10-15 | nightly-audit | **failed** |
| #313 | 2026-10-15 | chunk-task | success |
| #313 | 2026-10-15 | setup-workflow | success |

---

## Recommendations

### 1. Add a Deployment Job — Deployment Frequency: Low

The pipeline has no deployment step. Add a job named `deploy` (or `release`) to the workflow that runs after tests pass on `main`. Without a deploy job, CircleCI cannot serve as a deployment frequency signal, and the DORA pipeline metric is permanently blind.

**Concrete action:** Extend the existing workflow with a deploy job that pushes the built app to S3 (this is a React-to-S3 project). Example:

```yaml
deploy:
  executor: aws-cli/default
  steps:
    - aws-cli/setup
    - run: aws s3 sync build/ s3://$S3_BUCKET --delete
```

### 2. Fix the `audit` Job — MTTR: Low

The `nightly-audit` workflow's `audit` job has a **100% failure rate across 64 runs over 90 days**. This is the primary driver of the Low MTTR tier. Despite the recent npm security fix (PR #13), the audit job is still failing (most recently Oct 21).

**Concrete action:** Inspect the audit job output to determine the root cause. It may be that:
- `npm audit` is still finding vulnerabilities at a severity threshold the job rejects
- The audit job itself has a configuration error unrelated to vulnerabilities

Run `npm audit` locally and resolve any remaining moderate/high/critical findings, or adjust the audit threshold with `npm audit --audit-level=high` if low-severity findings are acceptable.

---

*Note: No Slack MCP tool was available in this environment. This report has been committed as `dora-report.md` instead.*
