# 要件定義書：VTuber観光ガイドアプリ

## 1. プロジェクト概要

### 1.1 アプリ名（仮）
**Live2D観光ガイド** （正式名称は後日決定）

### 1.2 コンセプト
Live2Dで動くVTuberアバターが、観光地の魅力を音声・モーション付きで紹介するスマートフォンアプリ。
観光案内所のキオスク端末や、個人の観光ガイドとして利用する。

### 1.3 ターゲットユーザー
- 観光地を訪れる旅行者（国内・インバウンド）
- 観光案内所の来訪者
- 旅行を計画中のユーザー

---

## 2. 技術スタック

| 項目 | 技術 |
|------|------|
| フレームワーク | React Native（CLI or Expo検討） |
| Live2D描画 | WebView + Cubism SDK for Web |
| 言語 | TypeScript |
| 状態管理 | React Context / Zustand |
| ナビゲーション | React Navigation |
| 多言語対応 | i18next / react-i18next |
| 音声再生 | react-native-sound / expo-av |
| 地図（将来） | react-native-maps |
| 対応OS | iOS 15+ / Android 10+ |

---

## 3. 機能要件

### 3.1 コア機能（プロトタイプ）

#### F-01: Live2Dアバター表示
- WebView内でLive2Dモデルを描画する
- アイドルモーション（待機中の動き）を常時再生
- 表情差分（笑顔、驚き、案内中など）の切り替え

#### F-02: 観光スポット紹介（音声ガイド）
- スポット選択時にアバターが事前録音された音声で紹介する
- 音声に合わせたリップシンク（口パク）を行う
- 音声に合わせたモーション（手振り、指差し等）を再生する
- 紹介中にテキスト（字幕）を表示する

#### F-03: スポット一覧・詳細画面
- 5箇所の観光スポットをリスト/カード形式で表示
- 各スポットの詳細画面に以下を含む：
  - スポット名
  - 説明文
  - 写真ギャラリー（複数枚スワイプ）
  - 住所・アクセス情報
  - 営業時間・料金
  - おすすめポイント

#### F-04: 多言語対応
- 日本語・英語・中国語（簡体字）の3言語
- UI テキストの切り替え
- 音声ガイドも各言語で用意（事前録音）
- 言語設定画面から切り替え可能

### 3.2 追加機能（MVP以降）

#### F-05: リッチコンテンツ
- 動画埋め込み（スポットの紹介動画）
- おすすめグルメ・お土産情報
- 季節ごとの見どころ情報
- ユーザーレビュー/口コミ表示

#### F-06: GPS連動（優先度：低）
- 現在地の取得
- 近くの観光スポットを通知/ハイライト
- スポットまでの距離・方角表示
- 地図上でのスポット表示

#### F-07: お気に入り・履歴（優先度：低）
- スポットのお気に入り登録（ローカル保存）
- 閲覧履歴
- ※認証不要。端末ローカルに保存

---

## 4. 非機能要件

### 4.1 パフォーマンス
- Live2Dモデルの描画は30fps以上を維持
- スポット詳細画面の表示は2秒以内
- 音声再生開始まで1秒以内

### 4.2 オフライン対応
- コンテンツはアプリ内に埋め込み
- ネットワーク接続がなくても全機能利用可能
- 将来的にサーバー配信に移行する可能性あり

### 4.3 対応端末
- iOS 15以上
- Android 10（API 29）以上
- 画面サイズ：4.7インチ〜6.7インチ（iPhone SE〜iPhone Pro Max）

### 4.4 アクセシビリティ
- フォントサイズ調整対応（将来）
- 字幕表示（音声ガイドのテキスト表示）

---

## 5. 画面構成

```
[スプラッシュ画面]
    │
    ▼
[ホーム画面]
    ├── アバター表示エリア（上部）
    │     └── Live2D WebView
    ├── スポット一覧（下部スクロール）
    │     └── カード形式で5スポット表示
    └── 設定ボタン
          └── [設定画面]
                ├── 言語切り替え
                └── アプリ情報

[スポット詳細画面]（スポットカードタップで遷移）
    ├── アバター表示エリア（上部）
    │     └── 音声ガイド再生中のアバター
    ├── 音声ガイド再生ボタン
    ├── 字幕テキスト表示
    ├── 写真ギャラリー
    ├── スポット情報（住所・営業時間等）
    └── リッチコンテンツ（動画・グルメ等）
```

---

## 6. データモデル

### 6.1 観光スポット（Spot）
```typescript
interface Spot {
  id: string;
  name: LocalizedText;        // 多言語対応テキスト
  description: LocalizedText;
  images: string[];            // 画像パス（バンドル内）
  address: LocalizedText;
  accessInfo: LocalizedText;   // アクセス方法
  businessHours: string;
  admission: LocalizedText;    // 料金情報
  highlights: LocalizedText[]; // おすすめポイント
  audioGuide: {
    ja: string;  // 音声ファイルパス
    en: string;
    zh: string;
  };
  motion: string;              // アバターモーションID
  coordinate?: {               // GPS座標（将来用）
    latitude: number;
    longitude: number;
  };
}

interface LocalizedText {
  ja: string;
  en: string;
  zh: string;
}
```

### 6.2 アバター設定（AvatarConfig）
```typescript
interface AvatarConfig {
  modelPath: string;           // Live2Dモデルファイルパス
  defaultMotion: string;       // アイドルモーション
  expressions: {               // 表情一覧
    [key: string]: string;     // 名前 → 表情ファイルパス
  };
  motions: {                   // モーション一覧
    [key: string]: string;     // 名前 → モーションファイルパス
  };
}
```

---

## 7. Live2D + WebView アーキテクチャ

```
┌─────────────────────────────────────┐
│         React Native App            │
│                                     │
│  ┌───────────────────────────────┐  │
│  │      WebView (Live2D)         │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │  Cubism SDK for Web     │  │  │
│  │  │  + pixi.js / canvas     │  │  │
│  │  │  + リップシンク制御     │  │  │
│  │  └─────────────────────────┘  │  │
│  └───────┬───────────────────────┘  │
│          │ postMessage / injectedJS │
│  ┌───────▼───────────────────────┐  │
│  │   React Native UI             │  │
│  │   - スポット一覧              │  │
│  │   - 音声再生制御              │  │
│  │   - ナビゲーション           │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘

通信方式:
  RN → WebView: webViewRef.postMessage(JSON)
  WebView → RN: window.ReactNativeWebView.postMessage(JSON)
```

### 7.1 WebView通信プロトコル
```typescript
// RN → WebView に送るコマンド
type WebViewCommand =
  | { type: 'SET_MODEL'; modelPath: string }
  | { type: 'PLAY_MOTION'; motionId: string }
  | { type: 'SET_EXPRESSION'; expressionId: string }
  | { type: 'START_LIP_SYNC'; audioData: number[] }
  | { type: 'STOP_LIP_SYNC' }
  | { type: 'RESET' };

// WebView → RN に送るイベント
type WebViewEvent =
  | { type: 'MODEL_LOADED' }
  | { type: 'MOTION_FINISHED'; motionId: string }
  | { type: 'ERROR'; message: string };
```

---

## 8. 開発フェーズ

### Phase 1: プロトタイプ（最優先）
- [ ] プロジェクトセットアップ（React Native）
- [ ] WebView + Live2D モデル表示
- [ ] アイドルモーション再生
- [ ] RN ↔ WebView 通信基盤
- [ ] スポット一覧画面（ダミーデータ）
- [ ] 1スポットの音声ガイド再生 + リップシンク

### Phase 2: コア機能完成
- [ ] 5スポット分のコンテンツ実装
- [ ] 多言語対応（日・英・中）
- [ ] スポット詳細画面（写真ギャラリー・情報表示）
- [ ] 表情・モーションの充実
- [ ] 字幕表示

### Phase 3: リッチコンテンツ
- [ ] 動画コンテンツ
- [ ] おすすめグルメ・お土産
- [ ] 季節ごとの見どころ
- [ ] お気に入り・履歴機能

### Phase 4: GPS連動・拡張
- [ ] GPS現在地取得
- [ ] 近隣スポット通知
- [ ] 地図表示
- [ ] コンテンツのサーバー配信化検討

---

## 9. アセット要件

### 9.1 Live2Dモデル
- オリジナルVTuberキャラクター 1体
- 必要ファイル：
  - .moc3（モデルファイル）
  - .model3.json（モデル設定）
  - テクスチャファイル一式
  - 表情ファイル（.exp3.json）× 複数
  - モーションファイル（.motion3.json）× 複数

### 9.2 音声ファイル
- 各スポット × 3言語 = 15音声ファイル（最低）
- 形式：MP3 or AAC
- フォーマット：44.1kHz, 128kbps以上推奨

### 9.3 画像
- 各スポット 3〜5枚 = 15〜25枚
- 形式：JPEG / WebP
- 推奨サイズ：1080×720px以上

---

## 10. リスクと対策

| リスク | 影響度 | 対策 |
|--------|--------|------|
| WebView内Live2Dのパフォーマンス不足 | 高 | プロトタイプで早期検証。ダメならUnityに移行 |
| リップシンクの品質 | 中 | 音素解析ライブラリの事前調査。簡易的な音量ベースの口パクから開始 |
| アプリサイズ肥大化 | 中 | 画像圧縮、音声圧縮で対応。段階的にコンテンツ追加 |
| 多言語音声の録音コスト | 中 | Phase1は日本語のみ。英・中は Phase2 で対応 |
| Cubism SDK ライセンス | 低 | 商用利用の場合はLive2D社のライセンス確認が必要 |

---

## 11. 前提条件・制約

- Live2Dモデルのデザイン・制作は別途（イラストレーター/モデラーが必要）
- 音声収録は別途（声優/ナレーターの手配が必要）
- 観光スポットの写真・情報は事前に用意が必要
- Cubism SDK for Web は出版許諾契約が必要（商用利用の場合）
