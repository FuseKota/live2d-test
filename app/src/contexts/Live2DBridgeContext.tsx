/**
 * Live2DBridge コンテキスト
 * ブリッジフックをアプリ全体で共有するためのコンテキスト
 */

import React, { createContext, useContext } from 'react';
import { Live2DBridge } from '../hooks/useLive2DBridge';

const Live2DBridgeContext = createContext<Live2DBridge | null>(null);

interface Live2DBridgeProviderProps {
  bridge: Live2DBridge;
  children: React.ReactNode;
}

export const Live2DBridgeProvider: React.FC<Live2DBridgeProviderProps> = ({
  bridge,
  children,
}) => {
  return (
    <Live2DBridgeContext.Provider value={bridge}>
      {children}
    </Live2DBridgeContext.Provider>
  );
};

/**
 * Live2DBridgeコンテキストを使用するフック
 * App.tsxのLive2DBridgeProvider内でのみ使用可能
 */
export const useLive2DBridgeContext = (): Live2DBridge => {
  const context = useContext(Live2DBridgeContext);
  if (!context) {
    throw new Error(
      'useLive2DBridgeContext must be used within a Live2DBridgeProvider'
    );
  }
  return context;
};
