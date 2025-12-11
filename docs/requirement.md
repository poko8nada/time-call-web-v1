## 時刻読み上げサービス要件定義書 (requirement.md)

---

### 1. 概要 (Overview)

本プロジェクトは、Web技術を用いて指定した間隔で現在時刻を読み上げるシンプルな時報サービスを開発する。

フェーズ1ではブラウザ機能のみでMVPを達成し、フェーズ2で高品質な音声合成と安定性を実現する。

- サービス名
  - 時刻読み上げサービス (仮)
- 目的
  - シンプルなWeb技術のリハビリと、高品質な時報機能の提供。
- ターゲット
  - 作業中の時間管理、キッチンタイマー代わりなど、視覚に頼らず時刻を確認したいユーザー。

---

### 2. 技術スタック (Technology Stack)

- フェーズ: フェーズ 1 (MVP)
  - フロントエンド: Next.js
  - バックエンド: なし (クライアントサイド完結)
  - ホスティング: Vercel
  - 音声合成: Web Speech API
- フェーズ: フェーズ 2 (製品)
  - フロントエンド: Next.js
  - バックエンド: Cloud Run (VOICEVOX Core)
  - ホスティング: Vercel
  - 音声合成: VOICEVOX

---

### 3. 機能要件 (Functional Requirements)

> **原則**: 1ファイル = 1機能要件。各ファイルの責務を明確化し、テスト可能な単位で設計する。

#### 3.1. 時刻管理 (Time Management)

1. **FR-01: `useClock.ts`**
   - 要件: 現在時刻の取得とリアルタイム更新
   - 詳細:
     - `Date`オブジェクトで現在時刻を取得
     - `setTimeout`または`requestAnimationFrame`で1秒ごとに更新
     - `setInterval`は、スタック問題を避けるため使用しない
     - Reactの状態管理で現在時刻を保持
   - 戻り値: `{ currentTime: Date }`
   - テスト観点: 時刻が1秒ごとに更新されること、クリーンアップが正しく動作すること

2. **FR-02: `formatTime.ts`**
   - 要件: 時刻フォーマット変換
   - 詳細:
     - `Date`を"HH:MM:SS"形式の文字列に変換
     - `Date`を"〇時〇分です。"形式の日本語文字列に変換
     - ゼロパディング処理を含む
   - 関数: `formatDigitalTime(date: Date): string`, `formatSpeechTime(date: Date): string`
   - テスト観点: 各種時刻パターンで正しくフォーマットされること

#### 3.2. タイマー制御 (Timer Control)

3. **FR-03: `useTimeCallTimer.ts`**
   - 要件: 読み上げタイマーのロジック制御
   - 詳細:
     - 指定間隔（分単位）で次回読み上げ時刻を計算
     - 読み上げ時刻の3秒前にビープ音トリガー発火
     - 読み上げ時刻にスピーチトリガー発火
     - 開始/停止状態の管理
   - 戻り値: `{ isRunning: boolean, startTimer: () => void, stopTimer: () => void, interval: number, setInterval: (min: number) => void, nextCallTime: Date | null }`
   - テスト観点: タイマーが正確に動作すること、開始/停止が正しく機能すること

4. **FR-04: `IntervalSelector.tsx`**
   - 要件: 読み上げ間隔選択UI
   - 詳細:
     - 1, 5, 10, 15, 30, 60分の選択肢を提供
     - ラジオボタンまたはドロップダウンで選択
     - タイマー実行中は選択不可（disabled）
   - Props: `{ interval: number, onChange: (min: number) => void, disabled: boolean }`
   - テスト観点: 各選択肢が正しく動作すること、disabled状態が反映されること

5. **FR-05: `ControlButton.tsx`**
   - 要件: 開始/停止ボタンUI
   - 詳細:
     - 実行状態に応じてボタンラベル変更（"開始" / "停止"）
     - クリックで開始/停止コールバック実行
     - 視覚的フィードバック（色・アイコン変更）
   - Props: `{ isRunning: boolean, onStart: () => void, onStop: () => void }`
   - テスト観点: ボタンクリックで正しいコールバックが呼ばれること

#### 3.3. 音声出力 (Audio Output)

6. **FR-06: `useBeepSound.ts`**
   - 要件: 予報音（ビープ音）の再生
   - 詳細:
     - `/public/sounds/beep-sequence.mp3`を再生
     - `HTMLAudioElement`で音量調整（0.0〜1.0）
     - 3秒間のビープ音シーケンス再生機能
     - 再生中の中断機能
     - 音源: OtoLogic (CC BY 4.0) - https://otologic.jp
   - 戻り値: `{ playBeep: () => Promise<Result<void, string>>, stopBeep: () => void, setBeepVolume: (v: number) => void }`
   - テスト観点: ビープ音が正しいタイミングで再生されること、音量調整が反映されること

7. **FR-07: `useSpeechSynthesis.ts`**
   - 要件: Web Speech APIによる音声合成
   - 詳細:
     - `speechSynthesis.getVoices()`でja-JP音声リスト取得
     - 選択された音声で`SpeechSynthesisUtterance`を生成
     - 音量調整（0.0〜1.0）
     - テキスト読み上げ実行（`Promise<Result<void, string>>`を返す）
     - 読み上げ中断機能（cancel）
     - エラーハンドリング（interrupted は警告レベル、その他はエラーレベル）
   - 戻り値: `{ isSupported: boolean, playSpeech: (text: string) => Promise<Result<void, string>>, voices: SpeechSynthesisVoice[], selectedVoice: SpeechSynthesisVoice | null, setSelectedVoice: (voice: SpeechSynthesisVoice | null) => void, setSpeechVolume: (v: number) => void, cancelSpeech: () => void }`
   - テスト観点: 音声リストが取得できること、読み上げが実行されること、Promiseが正しく解決されること、中断機能が動作すること

#### 3.4. UI表示 (UI Display)

8. **FR-08: `DigitalClock.tsx`**
   - 要件: デジタル時計の表示
   - 詳細:
     - `formatDigitalTime`を使用してHH:MM:SS形式で表示
     - 大きく読みやすいフォントで表示
     - アクセシビリティ対応（aria-label）
   - Props: `{ currentTime: Date }`
   - テスト観点: 時刻が正しくフォーマットされて表示されること

9. **FR-09: `VolumeControl.tsx`**
   - 要件: 音量調整スライダー（マスターボリューム統一）
   - 詳細:
     - 0〜100の範囲で調整（内部的には0.0〜1.0に変換）
     - ラベル表示（"音量"）- ビープ音と読み上げ音の統一ボリュームコントロール
     - リアルタイムフィードバック（現在の音量値表示）
   - Props: `{ masterVolume: number, onSetMasterVolume: (volume: number) => void, label: string, disabled?: boolean, description?: string }`
   - テスト観点: スライダー操作で正しい値が渡されること、ビープ音と読み上げ音の両方に反映されること

10. **FR-09.5: `VoiceSelector.tsx`**
    - 要件: 音声選択UIコンポーネント
    - 詳細:
      - `useSpeechSynthesis`から取得した音声リストをドロップダウンで表示
      - 選択された音声を「音声名 (言語コード)」形式で表示
      - マウント後のみレンダリング（hydration対応）
      - 音声リストが空またはサポートされていない場合は非表示
    - Props: `{ voices: SpeechSynthesisVoice[], selectedVoice: SpeechSynthesisVoice | null, onVoiceChange: (voice: SpeechSynthesisVoice) => void, isSupported: boolean }`
    - テスト観点: 音声リストが正しく表示されること、選択で正しいコールバックが呼ばれること

#### 3.2.1 タイマーUI統合

- **FR-03.5: `TimerControls.tsx`**
  - 要件: 間隔選択と開始/停止ボタンの統合UI
  - 詳細:
    - `IntervalSelector` と `ControlButton` を組み合わせたコンポーネント
    - Props drilling を避ける（composition パターン）
    - Props: `{ interval: number, onIntervalChange: (min: number) => void, isRunning: boolean, onStart: () => void, onStop: () => void, disabled: boolean }`
  - 機能: タイマー制御UI の統合
  - テスト観点: 各ボタン・選択肢が正しく動作すること

#### 3.5. 統合・設定 (Integration & Settings)

10. **FR-10: `TimeCallService.tsx`**
    - 要件: 時報サービス全体の統合
    - 詳細:
      - `useClock`, `useTimeCallTimer`, `useBeepSound`, `useSpeechSynthesis`を統合
      - タイマートリガーでビープ音→読み上げの連携制御
      - `DigitalClock`, `IntervalSelector`, `ControlButton`を配置
      - エラーハンドリング（音声再生失敗時の通知）
    - 機能: 全体のオーケストレーション
    - テスト観点: 各フック・コンポーネントが正しく連携すること

11. **FR-11: `SettingsPanel.tsx`**
    - 要件: 設定パネル - UIプリミティブコンポーネント
    - 詳細:
      - Composition パターンで `children` を受け取りレイアウト提供
      - `VolumeControl` + `VoiceSelector` などの子コンポーネントを配置
      - Hydration 対策：マウント前は空のレイアウトを表示
      - Props drilling を避ける（children パターン）
    - Props: `{ children?: React.ReactNode }`
    - 機能: 設定UI群のレイアウトコンテナ
    - テスト観点: 子コンポーネントが正しく表示されること、hydration エラーが発生しないこと

#### 3.6. ページ構成 (Pages)

13. **FR-12: `page.tsx`**
    - 要件: トップページ
    - 詳細:
      - Server Componentとして実装
      - `TimeCallService`を配置
      - レスポンシブレイアウト
    - 機能: ページ全体の構成

14. **FR-13: `layout.tsx`**
    - 要件: Root Layout
    - 詳細:
      - メタデータ設定（title, description）
      - `globals.css`読み込み
      - フォント設定
    - 機能: アプリ全体のレイアウト基盤

#### 3.7. ライセンス表示 (License Attribution)

15. **FR-14: ライセンスクレジット表示**
    - 要件: 使用素材のライセンス表記
    - 詳細:
      - ページフッターにOtoLogicへのクレジット表示
      - CC BY 4.0ライセンスの明示
      - リンク: https://otologic.jp
    - 配置: `app/page.tsx`のフッター部分
    - テスト観点: クレジット表示が正しく表示されること

---

### 4. 非機能要件 (Non-Functional Requirements)

- 項目: パフォーマンス
  - 詳細: 予報音と読み上げのタイミングは±100ms以内の精度を保つこと。UI更新は60fps以上を維持すること。
- 項目: 互換性
  - 詳細: 主要なモダンブラウザ（Chrome 90+, Firefox 88+, Safari 14+）で動作すること。
- 項目: アクセシビリティ
  - 詳細: WCAG 2.1 Level AA準拠。キーボード操作、スクリーンリーダー対応を行うこと。
- 項目: テスタビリティ
  - 詳細: ビジネスロジックと重要な関数のみテスト対象とする。UIコンポーネントや自明なコードはテスト不要。テストファイルはソースファイルに隣接して配置。
- 項目: セキュリティ
  - 詳細: フェーズ2移行時、VOICEVOX APIキーなどの機密情報をフロントエンドに公開しないこと。
- 項目: アーキテクチャ
  - 詳細: フェーズ1のロジックは、フェーズ2への移行時にコアロジックの変更なしに置き換え可能であること。（抽象化の徹底）
- 項目: ライセンスコンプライアンス
  - 詳細: 使用する全ての外部リソース（音源、フォント、画像等）のライセンスを遵守し、必要なクレジット表記を行うこと。

---

### 5. フェーズ間の移行戦略 (Migration Strategy)

- 段階: フェーズ 1
  - 実装対象: Web Speech API
  - 理由: MVPを最速で達成するため。
- 段階: 事前準備
  - 実装対象: Interface抽象化
  - 理由: `useSpeechSynthesis`を`useSpeaker`にリファクタリング可能な設計とする。音声出力の実装詳細を隠蔽し、フェーズ2での切り替えコストを最小化。
- 段階: フェーズ 2
  - 実装対象: Cloud Run + Server Actions
  - 理由: 高品質な音声と安定したサービスを提供するため、VOICEVOXへの切り替えを行う。CORS回避のためにServer Actionsを活用する。
  - 追加ファイル: `app/_actions/generateSpeech.ts`
  - 拡張項目: アナログ時計の実装
  - 詳細: フェーズ2で必要性が確認でき次第、アナログ表示（秒針を含む高精度な同期）の実装を予定します。実装では requestAnimationFrame や高精度タイマーを用いた秒針同期、パフォーマンス最適化、およびアクセシビリティへの配慮を行います。

---

### 6. ディレクトリ構成と作成ファイル (Directory Structure & Files)

#### 6.1. フェーズ1: MVP実装時のディレクトリ構成

```
time-call-web-v1/
├─ app/
│  ├─ layout.tsx                    # FR-13: Root layout (Server Component)
│  ├─ page.tsx                      # FR-12: Top page (Server Component)
│  ├─ globals.css                   # Global styles
│  ├─ _components/                  # Route-specific UI components (Client)
│  │  ├─ DigitalClock.tsx          # FR-08: デジタル時計表示
│  │  ├─ IntervalSelector.tsx      # FR-04: 読み上げ間隔選択UI
│  │  ├─ ControlButton.tsx         # FR-05: 開始/停止ボタン
│  │  ├─ VolumeControl.tsx         # FR-09: 音量調整スライダー
│  │  ├─ VoiceSelector.tsx         # FR-09.5: 音声選択ドロップダウン
│  │  └─ SettingsPanel.tsx         # FR-11: 設定パネル（UIプリミティブ）
│  ├─ _features/                    # Route-specific features (Client)
│  │  └─ TimeCallService/          # 時報サービス統合 (コロケーション)
│  │     ├─ index.tsx              # FR-10: 時報サービス全体の統合UI
│  │     ├─ useTimeCallTimer.ts    # FR-03: 読み上げタイマー制御（Feature内ロジック）
│  │     ├─ useTimeCallTimer.test.ts
│  │     ├─ TimerControls.tsx      # FR-03.5: 開始/停止・間隔選択統合
│  │     └─ AudioSettings.tsx      # 音量・音声設定統合
│  └─ _hooks/                       # Route-specific hooks
│     ├─ useClock.ts               # FR-01: 現在時刻取得・更新
│     ├─ useClock.test.ts
│     ├─ useBeepSound.ts           # FR-06: 予報音再生
│     └─ useSpeechSynthesis.ts     # FR-07: Web Speech API wrapper
│
├─ utils/                            # Global utilities
│  ├─ types.ts                      # Global types (Result<T, E>)
│  ├─ formatTime.ts                 # FR-02: 時刻フォーマット関数
│  ├─ formatTime.test.ts
│  └─ audioContext.ts               # Web Audio API ヘルパー（環境判定・singleton管理）
│
├─ components/                       # Global shared UI (if needed)
├─ hooks/                            # Global shared hooks (if needed)
└─ public/                           # Static assets
   └─ sounds/
      └─ beep-sequence.mp3          # OtoLogic (CC BY 4.0)
```

**Note:** `TimeCallService` ディレクトリにて、タイマーロジック（useTimeCallTimer.ts）と統合UIを同じディレクトリに配置することで、
Feature内のロジック・UIの完全なコロケーション を実現している。これにより保守性と関連ファイルの発見性が向上。

```

#### 6.2. 実装順序 (Implementation Order)

**Phase 1: 基盤構築**

1. `utils/types.ts` - 型定義
2. `utils/formatTime.ts` + `formatTime.test.ts` - 時刻フォーマット（ビジネスロジック）
3. `app/_hooks/useClock.ts` + `useClock.test.ts` - 時刻管理（重要な関数）

**Phase 2: 音声機能**

4. `/public/sounds/beep-sequence.mp3` - 音源配置（OtoLogic, CC BY 4.0）
5. `app/_hooks/useBeepSound.ts` - ビープ音再生（テスト不要：UI連携）
6. `app/_hooks/useSpeechSynthesis.ts` - 音声合成（テスト不要：ブラウザAPI wrapper）
7. `utils/audioContext.ts` - Web Audio API ヘルパー

**Phase 3: タイマー機能**

8. `app/_features/TimeCallService/useTimeCallTimer.ts` + `useTimeCallTimer.test.ts` - タイマー制御（重要なロジック）

**Phase 4: UIコンポーネント**

9. `app/_components/DigitalClock.tsx` - 時計表示
10. `app/_components/VolumeControl.tsx` - 音量調整
11. `app/_components/VoiceSelector.tsx` - 音声選択
12. `app/_components/IntervalSelector.tsx` - 間隔選択
13. `app/_components/ControlButton.tsx` - 開始/停止
14. `app/_components/SettingsPanel.tsx` - 設定パネル（UIプリミティブ）

**Phase 5: 統合**

15. `app/_features/TimeCallService/TimerControls.tsx` - タイマーコントロール統合
16. `app/_features/TimeCallService/AudioSettings.tsx` - オーディオ設定統合
17. `app/_features/TimeCallService/index.tsx` - サービス統合
18. `app/page.tsx` + ライセンスクレジット表示 (FR-14) - ページ構成

#### 6.3. フェーズ2への拡張ポイント

**追加予定ファイル:**

- `app/_actions/generateSpeech.ts`: VOICEVOX APIを呼び出してオーディオデータを取得
- `app/_hooks/useSpeaker.ts`: 音声出力の抽象Interface（Web Speech API / VOICEVOX切り替え可能）

**リファクタリング:**

- `useSpeechSynthesis.ts` → `useSpeaker.ts` へ抽象化
- Interface分離により実装の切り替えを容易に

**インフラ:**

- 環境変数管理 (VOICEVOX_API_KEY)
```
