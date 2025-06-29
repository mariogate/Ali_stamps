import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Image, TextInput, SafeAreaView } from 'react-native';
import { Text, ActivityIndicator, Snackbar } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../contexts/AuthContext';
import { getMerchantLogo } from '../utils/merchantLogos';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import StampsLogo from '../../assets/Design/STLR logos and icons/wite logo.png';

interface IMerchant {
  _id: string;
  name: string;
  loyaltyProgram: {
    stampsRequired: number;
    reward: string;
  };
}

type Props = NativeStackScreenProps<RootStackParamList, 'Merchants'>;

export default function MerchantScreen({ navigation }: Props) {
  const { token } = useAuth();
  const [merchants, setMerchants] = useState<IMerchant[]>([]);
  const [filteredMerchants, setFilteredMerchants] = useState<IMerchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const fetchMerchants = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('http://10.0.2.2:3001/api/customer/merchants', {
        headers: { 'Authorization': `Bearer ${token || ''}` }
      });
      if (!res.ok) throw new Error('Failed to fetch merchants');
      const data = await res.json();
      setMerchants(data);
      setFilteredMerchants(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setSnackbarMessage(message);
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMerchants();
  }, [fetchMerchants]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMerchants();
  }, [fetchMerchants]);

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredMerchants(merchants);
    } else {
      const filtered = merchants.filter(merchant =>
        merchant.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMerchants(filtered);
    }
  };

  const addLoyaltyCard = async (merchantId: string) => {
    try {
      const res = await fetch('http://10.0.2.2:3001/api/customer/loyalty-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`,
        },
        body: JSON.stringify({ merchantId }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add card');
      }
      setSnackbarMessage('Loyalty card added successfully!');
      setSnackbarVisible(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not add card';
      setSnackbarMessage(message);
      setSnackbarVisible(true);
    }
  };

  const renderMerchant = ({ item }: { item: IMerchant }) => (
    <View style={styles.merchantRow}>
      <Image source={getMerchantLogo(item.name)} style={styles.merchantLogo} resizeMode="contain" />
          <View style={styles.merchantInfo}>
        <Text style={styles.merchantName}>{item.name}</Text>
        <Text style={styles.rewardText}>
          {`Free ${item.loyaltyProgram.reward} after ${item.loyaltyProgram.stampsRequired} stamps`}
        </Text>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={() => addLoyaltyCard(item._id)}>
        <Ionicons name="add" size={24} color="#888" />
      </TouchableOpacity>
        </View>
  );

    return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader leftIcon="arrow-back" onLeftPress={() => navigation.goBack()} rightIcon="location-outline" />
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
            <TextInput
              placeholder="Search"
              style={styles.searchInput}
              onChangeText={handleSearch}
            />
      </View>

          <Text style={styles.title}>Find Merchants</Text>
      
          {loading ? (
            <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredMerchants}
          renderItem={renderMerchant}
          keyExtractor={item => item._id}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
        </View>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#081D43',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    paddingHorizontal: 20,
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginTop: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#081D43',
    marginTop: 24,
    marginBottom: 16,
  },
  merchantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  merchantLogo: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  merchantInfo: {
    flex: 1,
  },
  merchantName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  rewardText: {
    fontSize: 14,
    color: '#A6A6A6',
    marginTop: 2,
  },
  addButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginLeft: 56, // Align with start of text
  },
});
