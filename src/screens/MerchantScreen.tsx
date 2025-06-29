import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { Text, Card, useTheme, ActivityIndicator, Searchbar } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { mockApi, IMerchant, ILoyaltyCard } from '../data/staticData';
import AppHeader from '../components/AppHeader';

type Props = NativeStackScreenProps<RootStackParamList, 'Merchants'>;

export default function MerchantScreen({ navigation }: Props) {
  const theme = useTheme();
  const [merchants, setMerchants] = useState<IMerchant[]>([]);
  const [userCards, setUserCards] = useState<ILoyaltyCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [merchantsData, cardsData] = await Promise.all([
        mockApi.getMerchants(),
        mockApi.getLoyaltyCards()
      ]);
      setMerchants(merchantsData);
      setUserCards(cardsData);
    } catch (error) {
      console.error('Error fetching merchant data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMerchants = merchants.filter(merchant =>
    merchant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasUserCard = (merchantId: string) => {
    return userCards.some(card => card.merchantId._id === merchantId);
  };

  const renderMerchantItem = ({ item }: { item: IMerchant }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('MerchantDetails', { merchantId: item._id })}
      activeOpacity={0.7}
    >
      <Card style={styles.merchantCard}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.merchantInfo}>
            <View style={styles.merchantLogo}>
              <MaterialCommunityIcons name="store" size={40} color="#081D43" />
            </View>
            <View style={styles.merchantDetails}>
              <Text style={styles.merchantName}>{item.name}</Text>
              <Text style={styles.merchantDescription}>{item.description}</Text>
              <View style={styles.loyaltyInfo}>
                <MaterialCommunityIcons name="sticker-check" size={16} color="#4CAF50" />
                <Text style={styles.loyaltyText}>
                  {item.loyaltyProgram.stampsRequired} stamps for {item.loyaltyProgram.reward}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.cardStatus}>
            {hasUserCard(item._id) ? (
              <View style={styles.hasCardContainer}>
                <MaterialCommunityIcons name="cards" size={20} color="#4CAF50" />
                <Text style={styles.hasCardText}>You have a card</Text>
              </View>
            ) : (
              <View style={styles.noCardContainer}>
                <MaterialCommunityIcons name="plus-circle" size={20} color="#FF9800" />
                <Text style={styles.noCardText}>Get a card</Text>
              </View>
            )}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const styles = getStyles(theme);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <AppHeader />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#081D43" />
          <Text style={styles.loadingText}>Loading merchants...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />
      
      <View style={styles.header}>
        <Text style={styles.title}>Merchants</Text>
        <Text style={styles.subtitle}>Discover loyalty programs</Text>
      </View>

      <Searchbar
        placeholder="Search merchants..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        iconColor="#666"
      />

      <FlatList
        data={filteredMerchants}
        renderItem={renderMerchantItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.merchantsList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  searchBar: {
    margin: 16,
    elevation: 2,
    borderRadius: 12,
  },
  merchantsList: {
    padding: 16,
  },
  merchantCard: {
    marginBottom: 12,
    elevation: 2,
    borderRadius: 12,
  },
  cardContent: {
    padding: 16,
  },
  merchantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  merchantLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  merchantDetails: {
    flex: 1,
  },
  merchantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  merchantDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  loyaltyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loyaltyText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 4,
  },
  cardStatus: {
    marginTop: 12,
    alignItems: 'flex-end',
  },
  hasCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  hasCardText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 4,
    fontWeight: 'bold',
  },
  noCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  noCardText: {
    fontSize: 12,
    color: '#FF9800',
    marginLeft: 4,
    fontWeight: 'bold',
  },
});
