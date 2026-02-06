/**
 * React Navigation 型定義
 */

export type RootStackParamList = {
  Home: undefined;
  SpotDetail: { spotId: string };
  Settings: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
