/**
 * PIXI.js セットアップ
 *
 * pixi-live2d-display は window.PIXI がグローバルに存在することを前提としている。
 * このモジュールを最初にインポートすることで、PIXI をグローバルに登録する。
 */
import * as PIXI from 'pixi.js';

// pixi-live2d-display が参照する window.PIXI を設定
(window as any).PIXI = PIXI;

export { PIXI };
