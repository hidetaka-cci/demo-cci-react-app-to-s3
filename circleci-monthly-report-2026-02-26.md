# CircleCI 月次詳細レポート（過去30日）

- **対象期間**: 2026-01-27 〜 2026-02-26（過去30日）
- **組織ID**: `0ffedcab-0755-4ea2-a76e-7f8a0b082494`
- **組織名（Usage APIより）**: `hidetaka-cci`
- **対象プロジェクト**:
  - `demo-cci-react-app-to-s3`
  - `practice-vite-app`
  - `cci-nodejs-container-app`
  - `tutorial-circleci-react`

> 注記: 参照指定の `circleci-usage-report.md` がこのワークスペース内で見つからなかったため、本レポートは要求された章立て（使用状況/失敗/コンフィグ/フレーキー/発見と推奨）に準拠する形で Markdown を構成しています。

---

## 使用状況レポート（組織全体・プロジェクト別）

### 組織全体サマリ（Usage API）

- **ジョブ実行数**: 8
- **合計実行時間**: 186 秒（約 3.1 分）
- **合計クレジット**: 66
  - **Compute credits**: 66
  - **DLC / Storage / Network / User credits**: 0（当該CSV上は計上なし）

### プロジェクト別サマリ（Usage API）

| プロジェクト | ジョブ数 | 合計実行時間(秒) | 合計クレジット | Resource class | Executor | トリガー |
|---|---:|---:|---:|---|---|---|
| `practice-vite-app` | 4 | 96 | 34 | `large`(4) | `machine`(2), `docker`(2) | `scheduled_pipeline`(4) |
| `cci-nodejs-container-app` | 4 | 90 | 32 | `large`(4) | `docker`(2), `machine`(2) | `scheduled_pipeline`(4) |
| `demo-cci-react-app-to-s3` | 0 | 0 | 0 | - | - | - |
| `tutorial-circleci-react` | 0 | 0 | 0 | - | - | - |

### 補足（Usage APIの観測範囲）

- この期間の Usage API CSV には `practice-vite-app` と `cci-nodejs-container-app` のみが含まれていました。
- `demo-cci-react-app-to-s3` と `tutorial-circleci-react` は「期間内にジョブ実行が無い」か「Usage API 取得データに含まれない条件」が考えられます（少なくとも当該CSVには行がありません）。

---

## ビルド失敗レポート（各プロジェクト）

### `demo-cci-react-app-to-s3`

- **失敗ログ取得結果**: `build-react-app`, `deploy-artifact` ともに **No steps found**
- **解釈**: 過去30日内に「取得可能な失敗ログが無い」か、または失敗ログ取得APIがステップ情報を返しませんでした。

### `practice-vite-app`

- **失敗ログ取得結果**: `setup`, `fix-flaky-tests` ともに **No steps found**
- **解釈**: 同上

### `cci-nodejs-container-app`

- **失敗ログ取得結果**: `setup`, `fix-flaky-tests` ともに **No steps found**
- **解釈**: 同上

### `tutorial-circleci-react`

- **失敗ログ取得結果**: `setup`, `chunk-task` ともに **No steps found**
- **解釈**: 同上

---

## コンフィグレポート（各プロジェクトの検証結果）

### `demo-cci-react-app-to-s3`

- **`.circleci/config.yml`**: 取得できました（このワークスペースのリポジトリ）
- **config_helper 検証**: **valid**

### `cci-nodejs-container-app`

- **`.circleci/config.yml`**: 取得できました（GitHub raw から取得）
- **config_helper 検証**: **valid**

### `practice-vite-app`

- **`.circleci/config.yml`**: **取得できませんでした**
  - GitHub raw (`main/.circleci/config.yml`) が 404
  - `git clone` も `Repository not found`（現時点でリポジトリが非公開/削除/権限不足の可能性）
- **config_helper 検証**: 未実施（入力となるconfigが取得できないため）

### `tutorial-circleci-react`

- **`.circleci/config.yml`**: **リポジトリ内に見当たりませんでした**（少なくとも `main` の先頭コミット状態では `.circleci/` が存在しません）
- **config_helper 検証**: 未実施（入力となるconfigが取得できないため）

---

## フレーキーテスト（該当プロジェクト）

CircleCI のフレーキーテスト取得結果は以下の通りです。

- `demo-cci-react-app-to-s3`: **No flaky tests found**
- `practice-vite-app`: **No flaky tests found**
- `cci-nodejs-container-app`: **No flaky tests found**
- `tutorial-circleci-react`: **No flaky tests found**

---

## 主な発見・推奨事項

### 主な発見

- **Usage API 上の実行は2プロジェクトのみ**（`practice-vite-app`, `cci-nodejs-container-app`）。
- **全ジョブが `scheduled_pipeline` 起点**で実行されていました（当該CSV範囲）。
- **Resource class が全件 `large`** でした（当該CSV範囲）。
- **失敗ログは取得できる内容がありませんでした**（No steps found）。
- **フレーキーテストは検出されませんでした**。

### 推奨事項

- **リソースクラスの適正化を試行**:
  - 当該期間のジョブ実行時間は短く（合計でも数分）、かつ `large` 固定のため、コスト最適化余地がある可能性があります。
  - ただし、CSV上の CPU/RAM 利用率列が `\\N` で欠落しており、定量判断は困難です。まずは `small/medium` 等への段階的変更を小規模ジョブから試すのが安全です。
- **`practice-vite-app` / `tutorial-circleci-react` の設定所在を整理**:
  - リポジトリに `.circleci/config.yml` が無い/取得できない状態だと、設定検証や改善提案が止まります。
  - CircleCI 側でプロジェクトが存在する場合、現在の設定ソース（VCS上のconfig有無、セットアップワークフロー利用有無）を確認し、VCS上に設定を置く運用へ寄せることを推奨します。

