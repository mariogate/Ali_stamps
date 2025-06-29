import React, { useState } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useTheme, Button, ActivityIndicator, TextInput } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'MerchantScan'>;

export default function MerchantScanScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(false);
  const [cardId, setCardId] = useState('');
  const theme = useTheme();
  const { token } = useAuth();

  const handleAddStamp = async () => {
    if (!cardId) {
      Alert.alert('Error', 'Please enter a customer card ID.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://10.0.2.2:3001/api/merchant/stamps/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ loyaltyCardId: cardId }),
      });

      const result = await res.json();

      if (!res.ok) {
        Alert.alert('Stamp Failed', result.error || result.message || 'Could not add stamp.');
      } else {
        Alert.alert('Stamp Added!', 'Stamp successfully added to the loyalty card.');
        setCardId('');
      }
    } catch (error) {
      console.error('Error sending stamp request:', error);
      Alert.alert('Error', 'An error occurred while adding the stamp.');
    } finally {
      setLoading(false);
    }
  };

  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Stamp Manually</Text>
      <TextInput
        label="Customer Card ID"
        value={cardId}
        onChangeText={setCardId}
        style={styles.input}
        autoCapitalize="none"
      />
      <Button
        mode="contained"
        onPress={handleAddStamp}
        disabled={loading}
        style={styles.button}
      >
        {loading ? <ActivityIndicator animating={true} color={'white'} /> : 'Confirm & Add Stamp'}
      </Button>
    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 20,
  },
  button: {
    paddingVertical: 8,
  },
}); 