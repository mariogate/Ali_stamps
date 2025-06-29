import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, Dimensions, Image, SafeAreaView } from 'react-native';
import { Text, useTheme, Card, Title, Paragraph, Button } from 'react-native-paper';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { MainTabParamList, RootStackParamList } from '../types/navigation';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { getMerchantLogo } from '../utils/merchantLogos';
import { getOfferImage } from '../utils/offerImages';
import AppHeader from '../components/AppHeader';
import BurgerMenuModal from '../components/BurgerMenuModal';
import { mockApi, IMerchant, ILoyaltyCard, IOffer } from '../data/staticData';

// Import local assets
import StampsLogo from '../../assets/Design/STLR logos and icons/logo.png';

const MERCHANT_LOGOS: { [key: string]: any } = {
  'Daily Dose': { uri: 'https://placehold.co/150x150/FFC107/FFFFFF?text=Daily+Dose' },
  'Munch & Shake': { uri: 'https://placehold.co/150x150/8BC34A/FFFFFF?text=Munch+%26+Shake' },
  'Granita': { uri: 'https://placehold.co/150x150/03A9F4/FFFFFF?text=Granita' },
  'Hirds': { uri: 'https://placehold.co/150x150/9C27B0/FFFFFF?text=Hirds' },
  'Mola' : { uri: 'https://placehold.co/150x150/E91E63/FFFFFF?text=Mola' },
  'Subway': { uri: 'https://placehold.co/150x150/4CAF50/FFFFFF?text=Subway' },
  'test coffee shop': { uri: 'https://placehold.co/150x150/795548/FFFFFF?text=Coffee+Shop' },
  // Add more mappings for your merchants here
};

const LOYALTY_CARD_COLORS: { [key: string]: { background: string; stamp: string } } = {
  'Subway': { background: '#00843D', stamp: '#FFC72C' }, // Green card, yellow stamp
  'Mola': { background: '#D32F2F', stamp: '#FFFFFF' },   // Red card, white stamp
  'Default': { background: '#FFFFFF', stamp: '#081D43' } // Default
};

const { width } = Dimensions.get('window');
const MERCHANT_ITEM_WIDTH = width * 0.4; // Approximately 40% of screen width
const CARD_ITEM_WIDTH = width * 0.6; // Approximately 60% of screen width
const OFFER_ITEM_WIDTH = width * 0.8; // Approximately 80% of screen width

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function HomeScreen({ navigation }: Props) {
  const theme = useTheme();
  const { token } = useAuth(); // Get the token from AuthContext

  const [merchants, setMerchants] = useState<IMerchant[]>([]);
  const [loadingMerchants, setLoadingMerchants] = useState(true);
  const [errorMerchants, setErrorMerchants] = useState<string | null>(null);

  const [loyaltyCards, setLoyaltyCards] = useState<ILoyaltyCard[]>([]); // State for loyalty cards
  const [loadingCards, setLoadingCards] = useState(true); // State for cards loading
  const [errorCards, setErrorCards] = useState<string | null>(null); // State for cards error

  const [offers, setOffers] = useState<IOffer[]>([]); // State for offers
  const [loadingOffers, setLoadingOffers] = useState(true); // State for offers loading
  const [errorOffers, setErrorOffers] = useState<string | null>(null); // State for offers error

  const [burgerMenuVisible, setBurgerMenuVisible] = useState(false);

  const fetchMerchants = useCallback(async () => {
    try {
      setLoadingMerchants(true);
      setErrorMerchants(null);
      console.log('Fetching merchants with static data');
      const data = await mockApi.getMerchants();
      setMerchants(data);
    } catch (err) {
      console.error('Error fetching merchants:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load merchants';
      setErrorMerchants(errorMessage);
    } finally {
      setLoadingMerchants(false);
    }
  }, []);

  const fetchLoyaltyCards = useCallback(async () => { // Function to fetch loyalty cards
    try {
      setLoadingCards(true);
      setErrorCards(null);
      console.log('Fetching loyalty cards with static data');
      const data = await mockApi.getLoyaltyCards();
      console.log('Loyalty cards static data:', JSON.stringify(data, null, 2));
      setLoyaltyCards(data);
    } catch (err) {
      console.error('Error fetching loyalty cards:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load loyalty cards';
      setErrorCards(errorMessage);
    } finally {
      setLoadingCards(false);
    }
  }, []); // No dependencies needed for static data

  const fetchOffers = useCallback(async () => { // Function to fetch offers
    try {
      setLoadingOffers(true);
      setErrorOffers(null);
      console.log('Fetching offers with static data');
      const data = await mockApi.getOffers();
      setOffers(data);
    } catch (err) {
      console.error('Error fetching offers:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load offers';
      setErrorOffers(errorMessage);
    } finally {
      setLoadingOffers(false);
    }
  }, []); // No dependencies needed for static data

  // Use focus effect to refresh loyalty cards when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchMerchants();
      fetchLoyaltyCards();
      fetchOffers();
    }, [fetchMerchants, fetchLoyaltyCards, fetchOffers])
  );

  useEffect(() => {
    fetchMerchants();
    fetchLoyaltyCards();
    fetchOffers(); // Fetch offers when component mounts
  }, [fetchMerchants, fetchLoyaltyCards, fetchOffers]);

  const renderMerchantItem = ({ item }: { item: IMerchant }) => (
    <TouchableOpacity onPress={() => navigation.navigate('MerchantDetails', { merchantId: item._id })} style={styles.merchantContainer}>
      <View style={styles.merchantCard}>
        <View style={styles.merchantLogoContainer}>
          <Image source={getMerchantLogo(item.name)} style={styles.merchantLogo} resizeMode="contain" />
        </View>
      </View>
      <Text style={styles.merchantName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const getGridDimensions = (stampsRequired: number) => {
    // Find the grid with the smallest area that fits all stamps, preferring square or nearly-square
    let bestRows = 1;
    let bestCols = stampsRequired;
    let minArea = stampsRequired * 2; // Start with a large area
    for (let rows = 1; rows <= stampsRequired; rows++) {
      const cols = Math.ceil(stampsRequired / rows);
      const area = rows * cols;
      if (area < minArea && area >= stampsRequired) {
        bestRows = rows;
        bestCols = cols;
        minArea = area;
      } else if (area === minArea && Math.abs(rows - cols) < Math.abs(bestRows - bestCols)) {
        // Prefer more square grids
        bestRows = rows;
        bestCols = cols;
      }
    }
    return { rows: bestRows, cols: bestCols };
  };

  const getCardSize = (rows: number, cols: number) => {
    // Each cell is 28px tall/wide (24px + margin), plus padding and logo space
    const width = Math.max(120, cols * 28 + 24); // 24px padding
    const height = Math.max(180, rows * 32 + 80); // 80px for logo, name, and padding
    return { width, height };
  };

  const renderLoyaltyCardItem = ({ item }: { item: ILoyaltyCard | { isAddButton: boolean } }) => {
    if ('isAddButton' in item && item.isAddButton) {
      return (
        <TouchableOpacity style={styles.addCardButton} onPress={() => navigation.navigate('Merchants')}>
          <Ionicons name="add" size={48} color="#081D43" />
        </TouchableOpacity>
      );
    }

    const card = item as ILoyaltyCard;
    if (!card.merchantId) {
        return null; 
    }
    
    const cardStyle = LOYALTY_CARD_COLORS[card.merchantId.name] || LOYALTY_CARD_COLORS.Default;
    const logoUri = getMerchantLogo(card.merchantId.name);
    const stampsRequired = card.merchantId.loyaltyProgram.stampsRequired || 9;
    
    return (
      <TouchableOpacity onPress={() => navigation.navigate('CardDetails', { cardId: card._id })}>
        <View style={[styles.loyaltyCard, { backgroundColor: cardStyle.background }]}>
          <View style={styles.merchantLogoContainer}>
            <Image source={logoUri} style={styles.merchantLogo} resizeMode="contain" />
          </View>
          <View style={styles.stampGrid}>
            {[...Array(stampsRequired)].map((_, i) => (
              <View key={i} style={styles.stampPlaceholder}>
                {i < card.stamps ? (
                  <Ionicons name="star" size={18} color={cardStyle.stamp} />
                ) : (
                  <Ionicons name="star-outline" size={18} color={cardStyle.stamp} style={{ opacity: 0.5 }} />
                )}
              </View>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderOfferItem = ({ item }: { item: IOffer }) => {
    if (!item.merchantId) {
        return null;
    }
    const offerImageUri = getMerchantLogo(item.merchantId.name);
    const validUntil = item.validUntil ? new Date(item.validUntil) : null;
    const formattedDate = validUntil ? `Valid until ${validUntil.toLocaleString('default', { month: 'long', day: 'numeric' })}` : '';

    return (
      <TouchableOpacity onPress={() => { /* Navigate to offer details if exists */ }}>
        <View style={styles.offerCard}>
          <View style={styles.offerImageContainer}>
            <Image source={offerImageUri} style={styles.offerImage} resizeMode="contain" />
          </View>
          <View style={styles.offerDetails}>
            <Text style={styles.offerTitle}>{item.title}</Text>
            <Text style={styles.offerMerchant}>{item.merchantId.name}</Text>
             {validUntil && (
              <View style={styles.offerTag}>
                <Text style={styles.offerTagText}>{formattedDate}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = (title: string, onSeeAll: () => void) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity onPress={onSeeAll}>
        <Text style={styles.seeAllText}>See All <Ionicons name="chevron-forward" size={16} color="#2D62EA" /></Text>
      </TouchableOpacity>
    </View>
  );

  const ListHeader = () => (
    <>
      {/* Our Merchants Section */}
      {renderSectionHeader('Our Merchants', () => navigation.navigate('Merchants'))}
      {loadingMerchants ? (
        <ActivityIndicator style={{ height: 120 }} />
      ) : (
        <FlatList
          data={merchants}
          renderItem={renderMerchantItem}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />
      )}
      
      {/* My Cards Section */}
      {renderSectionHeader('My Cards', () => navigation.navigate('Cards'))}
      {loadingCards ? (
        <ActivityIndicator style={{ height: 120 }}/>
      ) : (
        <FlatList
          data={[...loyaltyCards, { isAddButton: true, _id: 'add' }]}
          renderItem={renderLoyaltyCardItem}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />
      )}

      {/* Offers & Promotions Section Header */}
      {renderSectionHeader('Offers & Promotions', () => {})}
    </>
  );

  const handleMenuItem = (item: string) => {
    setBurgerMenuVisible(false);
    // Optionally navigate or show a placeholder
    // Example: navigation.navigate(item)
  };

  const burgerMenuItems = [
    { label: 'About STLR', onPress: () => handleMenuItem('AboutSTLR') },
    { label: 'How it works', onPress: () => handleMenuItem('HowItWorks') },
    { label: 'Manage Notifications', onPress: () => handleMenuItem('ManageNotifications') },
    { label: 'Help', onPress: () => handleMenuItem('Help') },
    { label: 'FAQs', onPress: () => handleMenuItem('FAQs') },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader leftIcon="menu" rightIcon="location-outline" onLeftPress={() => setBurgerMenuVisible(true)} />
      <BurgerMenuModal
        visible={burgerMenuVisible}
        onClose={() => setBurgerMenuVisible(false)}
        items={burgerMenuItems}
      />
      <View style={styles.container}>
        <FlatList
          data={offers}
          renderItem={renderOfferItem}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={ListHeader}
          ListFooterComponent={<View style={{ height: 20 }} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContentContainer}
          onRefresh={() => {
            fetchMerchants();
            fetchLoyaltyCards();
            fetchOffers();
          }}
          refreshing={loadingMerchants || loadingCards || loadingOffers}
        />
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
    backgroundColor: '#F4F4F9',
  },
  listContentContainer: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#081D43',
  },
  seeAllText: {
    fontSize: 16,
    color: '#2D62EA',
    fontWeight: '500',
  },
  horizontalList: {
    paddingBottom: 10,
  },
  // Merchant Styles
  merchantContainer: {
    alignItems: 'center',
    marginRight: 12,
  },
  merchantCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  merchantLogoContainer: {
    width: 76,
    height: 76,
    backgroundColor: 'white',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  merchantLogo: {
    width: '100%',
    height: '100%',
    minWidth: 100,
    minHeight: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  merchantName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#081D43',
  },
  // Loyalty Card Styles
  loyaltyCard: {
    borderRadius: 16,
    width: width * 0.4,
    height: width * 0.38, // Made taller to fit content
    marginRight: 12,
    padding: 10,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  stampGrid: {
    height: '60%', // Relative height
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around', // Distribute stamps evenly
    alignItems: 'center',
  },
  stampPlaceholder: {
    height: '30%', // Relative to grid height
    aspectRatio: 1,
    borderRadius: 50,
    backgroundColor: '#E0E0E0', // Light gray for visibility
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D1D1', // Subtle border for extra contrast
  },
  addCardButton: {
    width: width * 0.4,
    height: width * 0.38, // Match card dimensions
    borderRadius: 16,
    backgroundColor: '#E9E9F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Offer Styles
  offerCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  offerImageContainer: {
    width: 56,
    height: 56,
    backgroundColor: 'white',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    padding: 6,
  },
  offerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  offerDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#081D43',
    marginBottom: 2,
  },
  offerMerchant: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  offerTag: {
    backgroundColor: '#FFE2CF',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  offerTagText: {
    color: '#EA7E38',
    fontSize: 12,
    fontWeight: '600',
  },
}); 