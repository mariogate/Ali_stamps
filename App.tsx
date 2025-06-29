import React from 'react';
import { NavigationContainer, Theme as NavigationTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, DefaultTheme, MD3Theme } from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import WalletScreen from './src/screens/WalletScreen';
import MerchantScreen from './src/screens/MerchantScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import CardDetailsScreen from './src/screens/CardDetailsScreen';
import MerchantDetailsScreen from './src/screens/MerchantDetailsScreen';
import AccountSettingsScreen from './src/screens/AccountSettingsScreen';
import RewardsScreen from './src/screens/RewardsScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import MerchantScanScreen from './src/screens/MerchantScanScreen';
import MerchantLoginScreen from './src/screens/MerchantLoginScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';

// Import contexts
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

// Import types
import { RootStackParamList, MainTabParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Paper theme
const paperTheme: MD3Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2196F3',
    background: '#F5F5F5',
  },
};

// Navigation theme
const navigationTheme: NavigationTheme = {
  dark: false,
  colors: {
    primary: '#2196F3',
    background: '#F5F5F5',
    card: '#FFFFFF',
    text: '#000000',
    border: '#E0E0E0',
    notification: '#FF3B30',
  },
  fonts: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    bold: {
      fontFamily: 'System',
      fontWeight: '700',
    },
    heavy: {
      fontFamily: 'System',
      fontWeight: '900',
    },
  },
};

// Main tab navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name'];

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Cards':
              iconName = focused ? 'wallet' : 'wallet-outline';
              break;
            case 'Leaderboard':
              iconName = focused ? 'poll' : 'poll';
              break;
            case 'Settings':
              iconName = focused ? 'cog' : 'cog-outline';
              break;
            case 'Account':
              iconName = focused ? 'account-circle' : 'account-circle-outline';
              break;
            default:
              iconName = 'help-circle-outline';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#081D43', // Exact Navy Blue from Figma
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white', // As per figma
          borderTopWidth: 0, // No border
          elevation: 10,
          shadowOpacity: 0.1,
        },
        tabBarLabelStyle: {
          fontWeight: 'bold',
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Cards" component={WalletScreen} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="Settings" component={AccountSettingsScreen} />
      <Tab.Screen name="Account" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Navigation component that handles auth state
function Navigation() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Group>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="MerchantLogin" component={MerchantLoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Group>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="Merchants" component={MerchantScreen} />
            <Stack.Screen name="CardDetails" component={CardDetailsScreen} />
            <Stack.Screen name="MerchantDetails" component={MerchantDetailsScreen} />
            <Stack.Screen name="MerchantScan" component={MerchantScanScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <PaperProvider theme={paperTheme}>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </PaperProvider>
  );
}
