# MVP実装タスク (tasks_mvp.md)

> **原則**: requirement.mdの実装順序（Phase 1-5）に基づき、1タスク最大5ファイルで構成。各タスクに具体的なファイル名とFR番号を明記。

---

## Phase 1: 基盤構築 (Foundation)

### Task 1: 型定義とユーティリティ基盤

- [x] `utils/types.ts` - グローバル型定義（Result<T, E>など）
- [x] `utils/formatTime.ts` - 時刻フォーマット関数 **(FR-02)**
- [x] `utils/formatTime.test.ts` - 最小限の単体テスト（ビジネスロジック）
- [x] `utils/audioContext.ts` - Web Audio API初期化ヘルパー **(FR-06)**

**依存関係**: なし  
**成果物**: 共通型定義、時刻フォーマット関数、Audio API初期化  
**完了条件**: 型エラーなし、`pnpm test formatTime.test.ts`がパス

---

## Phase 2: 時刻管理 (Time Management)

### Task 2: 時刻取得・更新システム

- [x] `app/_hooks/useClock.ts` - 現在時刻の取得とリアルタイム更新 **(FR-01)**
- [x] `app/_hooks/useClock.test.ts` - 最小限の単体テスト（重要な関数）

**依存関係**: Task 1 (formatTime.ts)  
**成果物**: 1秒ごとに更新される現在時刻管理フック  
**完了条件**: `pnpm test useClock.test.ts`がパス、実ブラウザで動作確認

---

## Phase 3: 音声機能 (Audio Features)

### Task 3: ビープ音（予報音）システム

- [ ] `app/_hooks/useBeepSound.ts` - Web Audio APIによる予報音生成・再生 **(FR-07)**

**依存関係**: Task 1 (audioContext.ts)  
**成果物**: 5秒間のビープ音シーケンス再生機能、音量調整機能  
**完了条件**: 実ブラウザでビープ音が1秒間隔で5回再生されること、音量調整が反映されること  
**テスト**: 単体テスト不要（UI連携コード）

### Task 4: 音声合成システム

- [ ] `app/_hooks/useSpeechSynthesis.ts` - Web Speech APIラッパー **(FR-08)**

**依存関係**: Task 1 (formatTime.ts - speechTime用)  
**成果物**: 日本語音声リスト取得、音声選択、読み上げ実行機能  
**完了条件**: 実ブラウザでja-JP音声が取得できること、読み上げが実行されること  
**テスト**: 単体テスト不要（ブラウザAPI wrapper）

---

## Phase 4: タイマー機能 (Timer Control)

### Task 5: 読み上げタイマー制御システム

- [ ] `app/_hooks/useTimeCallTimer.ts` - タイマーロジック **(FR-03)**
- [ ] `app/_hooks/useTimeCallTimer.test.ts` - 最小限の単体テスト（重要なロジック）

**依存関係**: Task 2 (useClock.ts), Task 3 (useBeepSound.ts), Task 4 (useSpeechSynthesis.ts)  
**成果物**: 指定間隔での読み上げタイマー、ビープ音→読み上げの連携制御  
**完了条件**: `pnpm test useTimeCallTimer.test.ts`がパス、実ブラウザでタイマーが正確に動作すること

---

## Phase 5: UIコンポーネント (UI Components)

### Task 6: 時計表示と音量調整UI

- [ ] `app/_components/DigitalClock.tsx` - HH:MM:SS形式デジタル時計 **(FR-09)**
- [ ] `app/_components/VolumeControl.tsx` - 音量調整スライダー **(FR-10)**

**依存関係**: Task 1 (formatTime.ts), Task 2 (useClock.ts)  
**成果物**: デジタル時計表示コンポーネント、音量調整スライダーコンポーネント  
**完了条件**: 実ブラウザで時刻が正しく表示されること、スライダーで音量が調整できること  
**テスト**: 単体テスト不要（UIコンポーネント）

### Task 7: タイマー制御UI

- [ ] `app/_components/IntervalSelector.tsx` - 読み上げ間隔選択 **(FR-04)**
- [ ] `app/_components/ControlButton.tsx` - 開始/停止ボタン **(FR-05)**

**依存関係**: Task 5 (useTimeCallTimer.ts)  
**成果物**: 間隔選択コンポーネント（1, 5, 10, 30, 60分）、開始/停止ボタンコンポーネント  
**完了条件**: 実ブラウザで間隔選択が動作すること、ボタンで開始/停止ができること  
**テスト**: 単体テスト不要（UIコンポーネント）

---

## Phase 6: 統合・ページ構成 (Integration & Pages)

### Task 8: 設定パネル統合

- [ ] `app/_features/SettingsPanel.tsx` - 設定パネル **(FR-12)**

**依存関係**: Task 6 (VolumeControl.tsx), Task 4 (useSpeechSynthesis.ts)  
**成果物**: 音量調整×2（ビープ・読み上げ）+ 音声選択の統合パネル  
**完了条件**: 実ブラウザで全ての設定が正しく動作すること  
**テスト**: 単体テスト不要（統合UI）

### Task 9: 時報サービス統合

- [ ] `app/_features/TimeCallService.tsx` - サービス全体統合 **(FR-11)**

**依存関係**: Task 5 (useTimeCallTimer.ts), Task 6 (DigitalClock.tsx), Task 7 (IntervalSelector.tsx, ControlButton.tsx)  
**成果物**: 全フック・コンポーネントの統合、タイマー連携制御  
**完了条件**: 実ブラウザでデジタル時計→間隔選択→開始/停止→ビープ音→読み上げの一連の流れが動作すること  
**テスト**: 単体テスト不要（統合UI）

### Task 10: ページ構成・スタイリング

- [ ] `app/page.tsx` - トップページ **(FR-13)**
- [ ] `app/layout.tsx` - Root Layout **(FR-14)**
- [ ] `app/globals.css` - グローバルスタイル

**依存関係**: Task 8 (SettingsPanel.tsx), Task 9 (TimeCallService.tsx)  
**成果物**: 完成したトップページ、レスポンシブレイアウト  
**完了条件**: 実ブラウザでPC・スマホで正しく表示されること、axe監査でアクセシビリティ基準を満たすこと  
**テスト**: 単体テスト不要（ページ構成）

---

## Phase 7: 検証・最適化・デプロイ (Validation & Deployment)

### Task 11: ブラウザ互換性・パフォーマンス確認

- [ ] ブラウザ互換性テスト（手動確認）
  - Chrome 90+: 全機能動作確認
  - Firefox 88+: 全機能動作確認
  - Safari 14+: 全機能動作確認
- [ ] パフォーマンス測定
  - タイマー精度（±100ms以内）
  - UI更新フレームレート（60fps以上）
  - Chrome DevToolsで確認
- [ ] アクセシビリティ監査（axe DevTools）
- [ ] 最小限の単体テスト実行
  - `pnpm test` - 全テストがパス

**依存関係**: Task 10完了  
**成果物**: 互換性レポート、パフォーマンスレポート  
**完了条件**: 全ブラウザで動作確認完了、最小限のテストがパス  
**注**: E2Eテストは実施しない（copilot-instructions.mdポリシー準拠）

### Task 12: デプロイ準備・本番環境確認

- [ ] Vercelデプロイ設定
  - 環境変数設定（必要に応じて）
  - ビルド設定確認
- [ ] OGP画像作成・配置
  - `/public/og.png` (1200x630px)
  - メタデータ設定（layout.tsx）
- [ ] Favicon準備・追加
  - `/public/favicon.ico`
  - `/app/icon.png` (App Router形式)
- [ ] 本番環境での動作確認
  - 全機能の動作確認
  - 音声再生の確認
  - レスポンシブ表示確認
- [ ] フェーズ2準備ドキュメント作成
  - VOICEVOX移行計画
  - Server Actions設計書
  - Cloud Run構成案

**依存関係**: Task 11完了  
**成果物**: デプロイ済みMVP、運用ドキュメント  
**完了条件**: 本番環境で全機能が動作すること

---

## 進捗管理 (Progress Tracking)

### 全体スケジュール

- **Phase 1-2**: 2日（基盤・時刻管理）
- **Phase 3-4**: 3日（音声・タイマー）
- **Phase 5-6**: 4日（UI・統合）
- **Phase 7**: 3日（テスト・デプロイ）
- **合計**: 約12日

### Critical Path

```
Task 1 → Task 2 → Task 3/4 (並行) → Task 5 → Task 6/7 (並行) → Task 9 → Task 10 → Task 11 → Task 12
```

### マイルストーン

1. **Week 1 (Day 5)**: Phase 4完了 - タイマー制御システム完成
2. **Week 2 (Day 9)**: Phase 6完了 - UI統合完成
3. **Week 2 (Day 12)**: Phase 7完了 - MVP完成・デプロイ

### リスク管理

| リスク                     | 影響度 | 発生確率 | 対策                                                   |
| -------------------------- | ------ | -------- | ------------------------------------------------------ |
| Web Speech API互換性問題   | 高     | 中       | Task 4完了時点で全ブラウザ確認実施                     |
| タイマー精度の問題         | 中     | 低       | Task 5でパフォーマンス測定、必要に応じてWorker使用検討 |
| アクセシビリティ要件未達   | 中     | 中       | Task 10でaxe監査実施、修正タスク追加                   |
| デプロイ時の予期せぬエラー | 低     | 低       | Task 12前にステージング環境で確認                      |

---

## チェックリスト（デプロイ前最終確認）

- [ ] 最小限の単体テストがパス（`pnpm test`）
- [ ] 全ブラウザで手動動作確認完了（Chrome, Firefox, Safari）
- [ ] アクセシビリティ監査合格（axe DevTools）
- [ ] パフォーマンス基準達成（タイマー精度±100ms以内）
- [ ] OGP画像・Favicon設置完了
- [ ] 本番環境で音声再生確認
- [ ] エラーハンドリング動作確認
- [ ] レスポンシブ表示確認（スマホ・タブレット・PC）
- [ ] コンソールエラー・警告なし
- [ ] Lighthouse スコア90以上（Performance, Accessibility）
