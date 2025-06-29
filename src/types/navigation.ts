import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Home: undefined;
  Cards: undefined;
  Leaderboard: undefined;
  Settings: undefined;
  Account: undefined;
};

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  Merchants: undefined;
  MerchantDetails: { merchantId: string };
  CardDetails: { cardId: string };
  AccountSettings: undefined;
  Rewards: undefined;
  MerchantScan: undefined;
  MerchantLogin: undefined;
}; 