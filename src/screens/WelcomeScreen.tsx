import React from 'react';
import { View, StyleSheet, SafeAreaView, Image } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import StampsLogo from '../../assets/Design/STLR logos and icons/logo.png';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const WelcomeScreen = ({ navigation }: Props) => {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#0A0D28' }]}>
      <View style={styles.container}>
        <Image source={StampsLogo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Welcome to STAMPS</Text>
        <Text style={styles.subtitle}>Your Digital Loyalty Card Wallet</Text>
        
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Login')}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            I'm a Customer
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('MerchantLogin')}
            style={[styles.button, { backgroundColor: 'transparent', borderColor: theme.colors.primary, borderWidth: 1 }]}
            labelStyle={[styles.buttonLabel, { color: theme.colors.primary }]}
          >
            I'm a Merchant
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    marginBottom: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen; 