# MVP実装タスク (tasks_mvp.md)

> **原則**: requirement.mdの実装順序（Phase 1-5）に基づき、1タスク最大5ファイルで構成。各タスクに具体的なファイル名とFR番号を明記。

---

## Phase 1: 基盤構築 (Foundation)

### Task 1: 型定義とユーティリティ基盤

- [x] `utils/types.ts` - グローバル型定義（Result<T, E>など）
- [x] `utils/formatTime.ts` - 時刻フォーマット関数 **(FR-02)**
- [x] `utils/formatTime.test.ts` - 最小限の単体テスト（ビジネスロジック）
- [x] `utils/audioContext.ts` - Web Audio API ヘルパー

**依存関係**: なし  
**成果物**: 共通型定義、時刻フォーマット関数、Audio コンテキスト管理  
**完了条件**: 型エラーなし、`pnpm test formatTime.test.ts`がパス

---

## Phase 2: 時刻管理 (Time Management)

### Task 2: 時刻取得・更新システム

- [x] `app/_hooks/useClock.ts` - 現在時刻の取得とリアルタイム更新 **(FR-01)**
- [x] `app/_hooks/useClock.test.ts` - 最小限の単体テスト（重要な関数）

**依存関係**: Task 1  
**成果物**: 1秒ごとに更新される現在時刻管理フック  
**完了条件**: `pnpm test useClock.test.ts`がパス、実ブラウザで動作確認

---

## Phase 3: 音声機能 (Audio Features)

### Task 3: ビープ音（予報音）システム

- [x] `/public/sounds/beep-sequence.mp3` - OtoLogicから音源ダウンロード・配置（CC BY 4.0）
- [x] `app/_hooks/useBeepSound.ts` - MP3音源再生 **(FR-06)**

**依存関係**: Task 1  
**成果物**: `playBeep: () => Promise<Result<void, string>>` を実装した予報音再生機能、`stopBeep: () => void` で再生停止、`setBeepVolume(volume: number)` で音量調整  
**完了条件**: 実ブラウザでビープ音が正しく再生されること、音量調整が反映されること、Promise ベースのエラーハンドリングが Result 型で動作すること  
**テスト**: 単体テスト不要（UI連携コード）  
**ライセンス**: CC BY 4.0 (OtoLogic - https://otologic.jp) - クレジット表記必須

### Task 4: 音声合成システム

- [x] `app/_hooks/useSpeechSynthesis.ts` - Web Speech APIラッパー **(FR-07)**

**依存関係**: Task 1  
**成果物**: 日本語音声リスト取得、音声選択、`playSpeech: (text: string) => Promise<Result<void, string>>` を実装した読み上げ実行機能、`cancelSpeech()` で読み上げ中止、`setSpeechVolume(volume: number)` で音量調整  
**完了条件**: 実ブラウザで ja-JP 音声が取得できること、読み上げが実行されること、Promise ベースのエラーハンドリングが Result 型で動作すること、中止機能が動作すること  
**テスト**: 単体テスト不要（ブラウザ API wrapper）

---

## Phase 4: タイマー機能 (Timer Control)

### Task 5: 読み上げタイマー制御システム

- [x] `app/_features/TimeCallService/useTimeCallTimer.ts` - タイマーロジック **(FR-03)**
- [x] `app/_features/TimeCallService/useTimeCallTimer.test.ts` - 最小限の単体テスト（重要なロジック）

**依存関係**: Task 2, Task 3, Task 4  
**成果物**: 指定間隔での読み上げタイマー、ビープ音→読み上げの連携制御。戻り値: `{ isRunning: boolean, startTimer: () => void, stopTimer: () => void, interval: number, setInterval: (min: number) => void, nextCallTime: Date | null }`  
**完了条件**: `pnpm test useTimeCallTimer.test.ts`がパス、実ブラウザでタイマーが正確に動作すること

---

## Phase 5: UIコンポーネント (UI Components)

### Task 6: 時計表示と音量調整UI

- [x] `app/_components/DigitalClock.tsx` - HH:MM:SS形式デジタル時計 **(FR-08)**
- [x] `app/_components/VolumeControl.tsx` - 音量調整スライダー **(FR-09)**

**依存関係**: Task 1, Task 2  
**成果物**: デジタル時計表示コンポーネント、音量調整スライダーコンポーネント。Props: `{ masterVolume: number, onSetMasterVolume: (volume: number) => void, label: string, disabled?: boolean, description?: string }`  
**完了条件**: 実ブラウザで時刻が正しく表示されること、スライダーで音量が調整できること  
**テスト**: 単体テスト不要（UIコンポーネント）

### Task 7: タイマー制御UI と音声選択

- [x] `app/_components/IntervalSelector.tsx` - 読み上げ間隔選択 **(FR-04)**
- [x] `app/_components/ControlButton.tsx` - 開始/停止ボタン **(FR-05)**
- [x] `app/_components/VoiceSelector.tsx` - 音声選択ドロップダウン **(FR-09.5)**

**依存関係**: Task 5, Task 4  
**成果物**: 間隔選択コンポーネント（1, 5, 10, 15, 30, 60分）、開始/停止ボタンコンポーネント、音声選択コンポーネント  
**完了条件**: 実ブラウザで間隔選択が動作すること、ボタンで開始/停止ができること、音声選択が動作すること  
**テスト**: 単体テスト不要（UIコンポーネント）

---

## Phase 6: 統合・ページ構成 (Integration & Pages)

### Task 8: 設定パネル統合

- [x] `app/_components/SettingsPanel.tsx` - 設定パネル（UIプリミティブ） **(FR-11)**

**依存関係**: Task 6 (VolumeControl.tsx), Task 7 (VoiceSelector.tsx)  
**成果物**: UI プリミティブ コンテナで、子コンポーネント（VolumeControl, VoiceSelector）を composition パターンで配置。Props: `{ children?: React.ReactNode }`  
**完了条件**: 実ブラウザで子コンポーネントが正しく表示されること、hydration エラーが発生しないこと  
**テスト**: 単体テスト不要（UIプリミティブ）

### Task 9: 時報サービス統合

- [x] `app/_features/TimeCallService/index.tsx` - サービス全体統合 **(FR-10)**
- [x] `app/_features/TimeCallService/TimerControls.tsx` - タイマー制御UI統合 **(FR-03.5)**
- [x] `app/_features/TimeCallService/AudioSettings.tsx` - オーディオ設定統合
- [ ] NextCallTimeDisplay と CurrentIntervalDisplay の統合 **(FR-15, FR-16)**

**依存関係**: Task 5 (useTimeCallTimer.ts), Task 6 (DigitalClock.tsx, VolumeControl.tsx), Task 7 (IntervalSelector.tsx, ControlButton.tsx, VoiceSelector.tsx), Task 8 (SettingsPanel.tsx), Task 13 (NextCallTimeDisplay.tsx, CurrentIntervalDisplay.tsx)  
**成果物**: 全フック・コンポーネントの統合、タイマー連携制御。TimeCallService/index.tsx が完全な統合を実現し、TimerControls.tsx と AudioSettings.tsx がUI群を組織化。NextCallTimeDisplay と CurrentIntervalDisplay を配置  
**完了条件**: 実ブラウザでデジタル時計→間隔選択→開始/停止→次の読み上げ時刻表示→現在間隔表示→ビープ音→読み上げの一連の流れが動作すること  
**テスト**: 単体テスト不要（統合UI）

### Task 13: プリセット音声定義と Next Call Time 表示

- [x] `utils/voicePresets.ts` - 推奨音声プリセット定義 **(FR-17)**
- [x] `app/_components/NextCallTimeDisplay.tsx` - 次の読み上げ時刻表示 **(FR-16)**
- [x] `app/_components/CurrentIntervalDisplay.tsx` - タイマー実行中の現在間隔表示 **(FR-15)**
- [x] `app/_hooks/useSpeechSynthesis.ts` - プリセット音声フィルタリング機能と優先度設定 **(FR-07 Enhanced)**

**依存関係**: Task 4 (useSpeechSynthesis.ts の基礎), Task 5 (useTimeCallTimer.ts)  
**成果物**:

- `voicePresets.ts`: ハードコードされた推奨音声配列（優先度順）。形式: `const VOICE_PRESETS = [{ name: string, lang: string }, ...]`。配列の上から順がプライオリティを定義
- `NextCallTimeDisplay.tsx`: `nextCallTime`を「次の読み上げ: HH:MM:SS」形式で表示。Props: `{ nextCallTime: Date | null, isRunning: boolean }`
- `CurrentIntervalDisplay.tsx`: 実行中に「現在: ○分間隔」と表示。Props: `{ isRunning: boolean, interval: number }`
- `useSpeechSynthesis.ts` 更新: `loadVoices()`後にプリセットリストでフィルタリング、フィルタ済み音声リストの最初の要素を自動選択（`selectPreferredVoice()` 関数削除、プリセット優先度に統一）

**完了条件**:

- プリセット音声取得後、フィルタリングが正しく動作すること（VOICE_PRESETS順序に従う）
- フィルタ済み音声リストの最初の音声が自動選択されること
- NextCallTimeDisplay が実行中のみ表示されること
- CurrentIntervalDisplay が実行中のみ表示されること
- プリセット音声がない場合は`voices`が空配列になること
- 実ブラウザで全機能が動作確認できること

**テスト**: 単体テスト不要（UI連携）

### Task 17: Voice Unavailable Error Handling

- [ ] `app/_components/VoiceUnavailableDialog.tsx` - エラーダイアログコンポーネント **(FR-18)**
- [ ] `app/_hooks/useSpeechSynthesis.ts` - `isAvailable` フラグ追加 **(FR-18 Enhanced)**
- [ ] `app/_features/TimeCallService/index.tsx` - エラーダイアログ統合 **(FR-18 Integration)**
- [ ] `app/_features/TimeCallService/TimerControls.tsx` - start button disabled prop **(FR-18 Integration)**

**依存関係**: Task 13 (voicePresets.ts 完成), Task 9 (TimeCallService)  
**成果物**:

- `VoiceUnavailableDialog.tsx`: voices が空の場合に表示するエラーダイアログコンポーネント。Props: `{ isOpen: boolean }`
- `useSpeechSynthesis.ts` 更新: `isAvailable: boolean` を返す（`voices.length > 0` の場合 true）、`playSpeech()` が voices 空の場合にエラーを返す
- `TimeCallService/index.tsx` 更新: `useSpeechSynthesis` から `isAvailable` を受け取り、false の場合 `VoiceUnavailableDialog` を表示
- `TimerControls.tsx` 更新: `disabled` prop を受け取り、start button に反映

**完了条件**:

- voices が空の場合、ページロード直後にエラーダイアログが表示されること
- エラーダイアログが表示されている間、start button が disabled になること
- `playSpeech()` が voices 空の場合にエラーを返すこと
- 実ブラウザで empty voices 環境にて確認できること

**テスト**: 単体テスト不要（UI連携・エラーハンドリング）

### Task 10: ページ構成・スタイリング

- [x] `app/page.tsx` - トップページ **(FR-12)**
- [x] `app/layout.tsx` - Root Layout **(FR-13)**
- [x] `app/globals.css` - グローバルスタイル
- [x] ライセンスクレジット表示 - フッターにOtoLogic (CC BY 4.0)を表記 **(FR-14)**

**依存関係**: Task 9 (TimeCallService), Task 17 (Voice Error Handling)  
**成果物**: 完成したトップページ、レスポンシブレイアウト、ライセンス表記。FR-14 は page.tsx フッター内に実装済み
**完了条件**: 実ブラウザで PC・スマホで正しく表示されること、ライセンスクレジットが正しく表示されること  
**テスト**: 単体テスト不要（ページ構成）

### Task 14: UI/UX & Design Polish (Phase 6-7統合)

- [ ] デザインシステム統合
  - 色パレット統一（primary, secondary, background, text）
  - タイポグラフィスケール確認（font-size, font-weight, line-height）
  - スペーシング確認（4px/8px グリッド準拠）
- [ ] レスポンシブ改善
  - sm (640px), md (768px), lg (1024px) でのレイアウト確認
  - モバイル・タブレット・PCでの表示確認
- [ ] アクセシビリティ確認
  - キーボードナビゲーション動作確認
  - Screen reader対応確認（aria-label, role属性）
  - 色コントラスト確認（WCAG 2.1 AA基準）

**依存関係**: Task 13 (NextCallTimeDisplay, CurrentIntervalDisplay), Task 17 (Voice Error Dialog)  
**成果物**: デザインシステム統一、レスポンシブ確認、アクセシビリティ基準達成  
**完了条件**: PC・タブレット・スマホで正しく表示されること、axe DevTools で A基準合格  
**テスト**: 手動確認のみ

---

## Phase 7: 検証・最適化・デプロイ (Validation & Deployment)

### Task 15: ブラウザ互換性・パフォーマンス確認

- [ ] ブラウザ互換性テスト（手動確認）
  - Chrome 90+: 全機能動作確認（プリセット音声フィルタリング、Next Call Time、Current Interval表示）
  - Firefox 88+: 全機能動作確認
  - Safari 14+: 全機能動作確認
- [ ] パフォーマンス測定
  - タイマー精度（±100ms以内）
  - UI更新フレームレート（60fps以上）
  - Chrome DevTools で確認
- [ ] アクセシビリティ監査（axe DevTools）
- [ ] 最小限の単体テスト実行
  - `pnpm test` - 全テストがパス

**依存関係**: Task 14完了, Task 17完了
**成果物**: 互換性レポート、パフォーマンスレポート
**完了条件**: 全ブラウザで動作確認完了、最小限のテストがパス  
**注**: E2E テストは実施しない（copilot-instructions.md ポリシー準拠）

### Task 16: デプロイ準備・本番環境確認

- [ ] Vercel デプロイ設定
  - 環境変数設定（必要に応じて）
  - ビルド設定確認
- [ ] OGP 画像作成・配置
  - `/public/og.png` (1200x630px)
  - メタデータ設定（layout.tsx）
- [ ] Favicon 準備・追加
  - `/public/favicon.ico`
  - `/app/icon.png` (App Router形式)
- [ ] 本番環境での動作確認
  - 全機能の動作確認
  - 音声再生の確認
  - レスポンシブ表示確認
- [ ] フェーズ2準備ドキュメント作成
  - VOICEVOX 移行計画
  - Server Actions 設計書
  - Cloud Run 構成案

**依存関係**: Task 15完了  
**成果物**: デプロイ済み MVP、運用ドキュメント  
**完了条件**: 本番環境で全機能（プリセット音声、Next Call Time、Current Interval表示含む）が動作すること

---

## 進捗管理 (Progress Tracking)

### 全体スケジュール

- **Phase 1-2**: 完了（基盤・時刻管理）
- **Phase 3-4**: 完了（音声・タイマー）
- **Phase 5-6**: 進行中（UI・統合・プリセット音声）
- **Phase 7**: 進行中（テスト・デプロイ）

### Critical Path

```
Task 1 → Task 2 → Task 3/4 (並行) → Task 5 → Task 6/7 (並行) → Task 8 → Task 9
→ Task 13 (プリセット音声・Next Call Time・Current Interval) → Task 9更新統合
→ Task 17 (Voice Error Handling) → Task 14 (UI/UX Polish) → Task 15 (互換性確認) → Task 16 (デプロイ)
```

### リスク管理

| リスク                     | 影響度 | 発生確率 | 対策                                             |
| -------------------------- | ------ | -------- | ------------------------------------------------ |
| Web Speech API互換性問題   | 高     | 中       | Task 11 でブラウザ互換性テスト実施               |
| タイマー精度の問題         | 中     | 低       | Task 11 でパフォーマンス測定、必要に応じて最適化 |
| アクセシビリティ要件未達   | 中     | 中       | Task 11 で axe 監査実施、修正タスク追加          |
| デプロイ時の予期せぬエラー | 低     | 低       | Task 12 前にステージング環境で確認               |

---

## チェックリスト（デプロイ前最終確認）

- [ ] 最小限の単体テストがパス（`pnpm test`）
- [ ] 全ブラウザで手動動作確認完了（Chrome, Firefox, Safari）
  - [ ] プリセット音声フィルタリングが動作すること
  - [ ] Next Call Time が正しく表示されること
  - [ ] Current Interval が実行中のみ表示されること
- [ ] アクセシビリティ監査合格（axe DevTools）
- [ ] パフォーマンス基準達成（タイマー精度±100ms以内）
- [ ] OGP画像・Favicon設置完了
- [ ] 本番環境で音声再生確認（プリセット音声のみ利用可能か）
- [ ] エラーハンドリング動作確認（プリセット音声がない場合の挙動）
- [ ] レスポンシブ表示確認（スマホ・タブレット・PC）
- [ ] コンソールエラー・警告なし
- [ ] Lighthouse スコア90以上（Performance, Accessibility）
- [ ] ライセンスクレジット表示確認（OtoLogic CC BY 4.0）
- [ ] デザインシステム統一確認（色・タイポグラフィ・スペーシング）
