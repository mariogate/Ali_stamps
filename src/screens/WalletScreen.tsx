import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Text, Card, Button, ActivityIndicator, Snackbar, ProgressBar, useTheme, Searchbar, Chip } from 'react-native-paper';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { MainTabParamList, RootStackParamList } from '../types/navigation';
import SearchAndFilter, { SortOption } from '../components/SearchAndFilter';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { getMerchantLogo } from '../utils/merchantLogos';
import AppHeader from '../components/AppHeader';
import StampsLogo from '../../assets/Design/STLR logos and icons/logo.png';

// Define interfaces for our data structures
interface ILoyaltyProgramDetails {
  stampsRequired: number;
  reward: string;
}

interface IMerchantDetails {
  _id: string;
  name: string;
  logo?: string;
  category: string;
  loyaltyProgram: ILoyaltyProgramDetails;
}

interface ILoyaltyCard {
  _id: string;
  merchantId: IMerchantDetails;
  merchantName: string;
  merchantLogo?: string;
  merchantCategory: string;
  stamps: number;
  totalStamps: number;
  lastStamp?: string;
  createdAt: string;
}

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Cards'>,
  NativeStackScreenProps<RootStackParamList>
>;

const LOYALTY_CARD_COLORS: { [key: string]: string } = {
  'Subway': '#4CAF50', // Green
  'Mola': '#D32F2F', // Red
  'Hirds': '#1976D2', // Blue
  'Seecoz': '#90A4AE', // Light blue/gray
  // Add more mappings as needed
};

const WalletScreen = ({ navigation }: Props) => {
  const { token } = useAuth();
  const [cards, setCards] = useState<ILoyaltyCard[]>([]);
  const [filteredCards, setFilteredCards] = useState<(ILoyaltyCard | { isAddButton: true })[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const theme = useTheme();

  const fetchCards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching loyalty cards with token:', token);
      const res = await fetch('http://10.0.2.2:3001/api/customer/loyalty-cards', {
        headers: {
          'Authorization': `Bearer ${token || ''}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || 'Failed to fetch loyalty cards');
      }

      console.log('Loyalty cards API response:', JSON.stringify(data, null, 2));
      
      // Filter out any cards that might have null or invalid merchant data
      const validCards = (data as any[]).filter((card): card is ILoyaltyCard => 
        card && card.merchantId && typeof card.merchantId === 'object' && card.merchantId.name
      );

      if (validCards.length !== data.length) {
        console.warn(`Filtered out ${data.length - validCards.length} invalid cards`);
      }

      const cardsWithAddButton = [...validCards, { isAddButton: true }];
      setCards(validCards);
      // We apply search filter here again in case there was a search query before refresh
      const filtered = validCards.filter(card =>
        card.merchantId.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCards([...filtered, { isAddButton: true }]);
      setError(null);
    } catch (err) {
      console.error('Error fetching loyalty cards:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load loyalty cards';
      setError(errorMessage);
      setSnackbarMessage(errorMessage);
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, searchQuery]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  // Use focus effect to refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchCards();
    }, [fetchCards])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCards();
  }, [fetchCards]);

  useEffect(() => {
    const filtered = cards.filter(({ merchantId }: ILoyaltyCard) =>
      merchantId.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCards([...filtered, { isAddButton: true }]);
  }, [searchQuery, cards]);

  const styles = getStyles(theme);

  const getGridDimensions = (stampsRequired: number) => {
    let bestRows = 1;
    let bestCols = stampsRequired;
    let minArea = stampsRequired * 2;
    for (let rows = 1; rows <= stampsRequired; rows++) {
      const cols = Math.ceil(stampsRequired / rows);
      const area = rows * cols;
      if (area < minArea && area >= stampsRequired) {
        bestRows = rows;
        bestCols = cols;
        minArea = area;
      } else if (area === minArea && Math.abs(rows - cols) < Math.abs(bestRows - bestCols)) {
        bestRows = rows;
        bestCols = cols;
      }
    }
    return { rows: bestRows, cols: bestCols };
  };

  const getCardSize = (rows: number, cols: number) => {
    const width = Math.max(120, cols * 28 + 24);
    const height = Math.max(180, rows * 32 + 80);
    return { width, height };
  };

  const renderCard = ({ item }: { item: ILoyaltyCard | { isAddButton: true } }) => {
    if ('isAddButton' in item) {
      return (
        <TouchableOpacity style={[styles.loyaltyCardContainer, { opacity: 0.6 }]} onPress={() => navigation.navigate('Merchants')}>
          <View style={[styles.stampCard, { backgroundColor: '#E0E0E0', width: 150, height: 200, justifyContent: 'center', alignItems: 'center' }]}>
            <Ionicons name="add" size={80} color="#9E9E9E" />
          </View>
        </TouchableOpacity>
      );
    }
    
    const card = item as ILoyaltyCard;
    const { stamps, merchantId } = card;
    const { stampsRequired } = merchantId.loyaltyProgram;

    const { rows, cols } = getGridDimensions(stampsRequired);
    const { width, height } = getCardSize(rows, cols);

    const LOYALTY_CARD_COLORS: { [key: string]: string } = {
      'Subway': '#00843D',
      'Mola': '#D32F2F',
      'Hirds': '#1976D2',
      'Seecoz': '#607D8B',
    };
    
    const cardBackgroundColor = LOYALTY_CARD_COLORS[merchantId.name] || '#FFFFFF';
    const isHirds = merchantId.name.toLowerCase().includes('hirds');
    const logoStyle = isHirds
      ? [styles.stampCardLogo, { width: 80, height: 48 }]
      : styles.stampCardLogo;

    return (
      <View style={styles.loyaltyCardContainer}>
        <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('CardDetails', { cardId: card._id })}>
          <View style={[styles.stampCard, { backgroundColor: cardBackgroundColor, width, height }]}>
            <View style={styles.stampCardLogoRow}>
              <Image
                source={getMerchantLogo(merchantId.name || '')}
                style={logoStyle}
                resizeMode="contain"
              />
            </View>
            <View style={styles.stampCardGrid}>
              {Array.from({ length: rows }).map((_, rowIdx) => (
                <View key={rowIdx} style={styles.stampCardGridRow}>
                  {Array.from({ length: cols }).map((_, colIdx) => {
                    const idx = rowIdx * cols + colIdx;
                    if (idx >= stampsRequired) return <View key={colIdx} style={styles.stampCardGridCell} />;
                    return (
                      <View
                        key={colIdx}
                        style={[
                          styles.stampCardGridCell,
                          idx < stamps ? styles.stampCardStampFilled : styles.stampCardStampEmpty,
                        ]}
                      />
                    );
                  })}
                </View>
              ))}
            </View>
            <Text style={styles.stampCardMerchantName}>{merchantId.name}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator style={styles.loader} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader leftIcon="menu" rightIcon="location-outline" />
      <View style={styles.container}>
        <Text style={styles.title}>My Cards</Text>

        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            iconColor={theme.colors.primary}
          />
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text variant="bodyLarge" style={styles.errorText}>
              {error}
            </Text>
            <Button
              mode="contained"
              onPress={fetchCards}
              style={styles.retryButton}
            >
              Retry
            </Button>
          </View>
        ) : (
          <FlatList
            data={filteredCards}
            renderItem={renderCard}
            keyExtractor={(item) => 'isAddButton' in item ? 'add-button' : item._id}
            numColumns={2}
            contentContainerStyle={styles.listContentContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="white" />
            }
          />
        )}

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
};

const getStyles = (theme: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#081D43',
  },
  container: {
    flex: 1,
    backgroundColor: '#0A0D28', // Figma's dark blue background
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    borderRadius: 30,
    elevation: 3,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
  },
  listContentContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
    alignItems: 'center',
  },
  loyaltyCardContainer: {
    alignItems: 'center',
    margin: 8,
  },
  stampCard: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  stampCardLogoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  stampCardLogo: {
    width: 60,
    height: 60,
  },
  stampCardGrid: {
    paddingHorizontal: 12,
  },
  stampCardGridRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stampCardGridCell: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  stampCardStampFilled: {
    backgroundColor: theme.colors.primary,
  },
  stampCardStampEmpty: {
    backgroundColor: '#E0E0E0',
  },
  stampCardMerchantName: {
    textAlign: 'center',
    marginTop: 8,
    color: 'white',
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 20,
  },
  retryButton: {
    minWidth: 120,
  },
});

export default WalletScreen; 