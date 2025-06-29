import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Linking, Image, Animated } from 'react-native';
import { Text, Card, Button, useTheme, ActivityIndicator, Snackbar, List, Divider } from 'react-native-paper';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { getMerchantLogo } from '../utils/merchantLogos';
import LoyaltyCardView from '../components/LoyaltyCardView';

interface IBusinessHours {
  day: string;
  open: string;
  close: string;
}

interface IAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface IMerchantDetails {
  _id: string;
  name: string;
  description: string;
  logo?: string;
  website?: string;
  phone?: string;
  instagram?: string;
  facebook?: string;
  address?: IAddress;
  category?: string;
  businessHours?: IBusinessHours[];
  loyaltyProgram: {
    stampsRequired: number;
    reward: string;
    description?: string;
  };
  hasCard?: boolean; // Whether the user already has a card for this merchant
}

type Props = NativeStackScreenProps<RootStackParamList, 'MerchantDetails'>;

const formatAddress = (address: { street: string; city: string; state: string; zipCode: string; country: string }) => {
  return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
};

export default function MerchantDetailsScreen({ route, navigation }: Props) {
  const { merchantId } = route.params;
  const theme = useTheme();
  const { token } = useAuth();
  const [merchant, setMerchant] = useState<IMerchantDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [addingToWallet, setAddingToWallet] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });
  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const fetchMerchantDetails = useCallback(async () => {
    try {
      console.log('Fetching merchant details with token:', token);
      const res = await fetch(`http://10.0.2.2:3001/api/customer/merchants/${merchantId}`, {
        headers: {
          'Authorization': `Bearer ${token || ''}`
        }
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch merchant details');
      }
      
      const data = await res.json();
      setMerchant(data);
      setError(null);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load merchant details';
      setError(errorMessage);
      setSnackbarMessage(errorMessage);
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [merchantId, token]);

  useEffect(() => {
    fetchMerchantDetails();
  }, [fetchMerchantDetails]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMerchantDetails();
  }, [fetchMerchantDetails]);

  const handleAddToWallet = async () => {
    if (!merchant) return;

    try {
      setAddingToWallet(true);
      const res = await fetch('http://10.0.2.2:3001/api/customer/loyalty-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`
        },
        body: JSON.stringify({ merchantId: merchant._id }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to add card to wallet');
      }

      // Update merchant data to reflect the new card
      await fetchMerchantDetails();
      setSnackbarMessage('Card added to wallet successfully!');
      setSnackbarVisible(true);
      // Navigate back to wallet screen after a short delay to show the success message
      setTimeout(() => {
        navigation.navigate('MainTabs', { screen: 'Cards' });
      }, 1000);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to add card to wallet';
      setSnackbarMessage(errorMessage);
      setSnackbarVisible(true);
    } finally {
      setAddingToWallet(false);
    }
  };

  const handleOpenWebsite = async () => {
    if (merchant?.website) {
      try {
        await Linking.openURL(merchant.website);
      } catch (err) {
        console.error(err);
        setSnackbarMessage('Could not open website');
        setSnackbarVisible(true);
      }
    }
  };

  const handleCallPhone = async () => {
    if (merchant?.phone) {
      try {
        await Linking.openURL(`tel:${merchant.phone}`);
      } catch (err) {
        console.error(err);
        setSnackbarMessage('Could not make phone call');
        setSnackbarVisible(true);
      }
    }
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
    Animated.timing(animatedValue, {
      toValue: isFlipped ? 0 : 180,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator style={styles.loader} />
      </View>
    );
  }

  if (!merchant) {
    return (
      <View style={styles.container}>
        <Card style={styles.errorCard}>
          <Card.Content>
            <Text variant="bodyLarge" style={styles.errorText}>
              {error || 'Merchant not found'}
            </Text>
            <Button
              mode="contained"
              onPress={fetchMerchantDetails}
              style={styles.retryButton}
            >
              Retry
            </Button>
          </Card.Content>
        </Card>
      </View>
    );
  }

  const LOYALTY_CARD_COLORS: { [key: string]: string } = {
    'Subway': '#00843D',
    'Mola': '#D32F2F',
    'Hirds': '#1976D2',
    'Seecoz': '#607D8B',
    'Default': '#1976D2',
  };
  const cardColor = LOYALTY_CARD_COLORS[merchant.name] || LOYALTY_CARD_COLORS['Default'];

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#2196F3']}
          tintColor="#2196F3"
        />
      }
    >
      {/* Card-like view (copied from CardDetailsScreen) */}
      <View style={{ alignItems: 'center', marginTop: 24, marginBottom: 16, width: '100%' }}>
        <View>
          <Animated.View style={[styles.cardContainer, { backgroundColor: cardColor }, { transform: [{ rotateY: frontInterpolate }] }]}> 
            <View style={styles.cardFace}>
              <Image source={getMerchantLogo(merchant.name)} style={styles.merchantLogo} resizeMode="contain" />
              <Text style={styles.rewardText}>{`Collect ${merchant.loyaltyProgram.stampsRequired} Stamps, Enjoy a Free ${merchant.loyaltyProgram.reward}`}</Text>
              <View style={styles.stampsGrid}> {
                Array.from({ length: merchant.loyaltyProgram.stampsRequired }).map((_, i) => (
                  <View key={i} style={styles.stamp}>
                    <Ionicons name="star-outline" size={30} color="white" />
                  </View>
                ))
              }</View>
            </View>
          </Animated.View>
          <Animated.View style={[styles.cardContainer, styles.cardBack, { backgroundColor: cardColor }, { transform: [{ rotateY: backInterpolate }] }]}> 
            <Text style={styles.cardTitle}>Locations & Contact</Text>
            <View style={styles.infoRow}>
              <Ionicons name="logo-instagram" size={24} color="white" />
              <Text style={styles.infoText}>{merchant.instagram || 'Not available'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="logo-facebook" size={24} color="white" />
              <Text style={styles.infoText}>{merchant.facebook || 'Not available'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={24} color="white" />
              <Text style={styles.infoText}>{merchant.phone || 'Not available'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="globe-outline" size={24} color="white" />
              <Text style={styles.infoText}>{merchant.website || 'Not available'}</Text>
            </View>
          </Animated.View>
        </View>
        <Button
          mode="contained"
          onPress={handleAddToWallet}
          loading={addingToWallet}
          disabled={addingToWallet || merchant.hasCard}
          style={{ marginTop: 24, backgroundColor: merchant.hasCard ? '#aaa' : '#2D62EA', width: '90%' }}
        >
          {merchant.hasCard ? 'Card in Wallet' : 'Add Card'}
        </Button>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Loyalty Program
          </Text>
          <View style={styles.loyaltyInfo}>
            <View style={styles.loyaltyItem}>
              <Ionicons name="ticket" size={24} color="#2196F3" />
              <Text variant="bodyMedium" style={styles.loyaltyText}>
                {merchant.loyaltyProgram.stampsRequired} stamps for a {merchant.loyaltyProgram.reward}
              </Text>
            </View>
            {merchant.loyaltyProgram.description && (
              <Text variant="bodyMedium" style={styles.loyaltyDescription}>
                {merchant.loyaltyProgram.description}
              </Text>
            )}
          </View>
        </Card.Content>
      </Card>

      {(merchant.address || merchant.phone || merchant.website) && (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Contact Information
            </Text>
            <List.Section>
              {merchant.address && (
                <List.Item
                  title="Address"
                  description={formatAddress(merchant.address)}
                  left={props => <List.Icon {...props} icon="map-marker" />}
                />
              )}
              {merchant.phone && (
                <List.Item
                  title="Phone"
                  description={merchant.phone}
                  left={props => <List.Icon {...props} icon="phone" />}
                  onPress={handleCallPhone}
                />
              )}
              {merchant.website && (
                <List.Item
                  title="Website"
                  description={merchant.website}
                  left={props => <List.Icon {...props} icon="web" />}
                  onPress={handleOpenWebsite}
                />
              )}
            </List.Section>
          </Card.Content>
        </Card>
      )}

      {merchant.businessHours && merchant.businessHours.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Business Hours
            </Text>
            {merchant.businessHours.map((hours, index) => (
              <React.Fragment key={hours.day}>
                <View style={styles.hoursItem}>
                  <Text variant="bodyMedium" style={styles.dayText}>
                    {hours.day}
                  </Text>
                  <Text variant="bodyMedium">
                    {hours.open} - {hours.close}
                  </Text>
                </View>
                {index < merchant.businessHours!.length - 1 && (
                  <Divider style={styles.divider} />
                )}
              </React.Fragment>
            ))}
          </Card.Content>
        </Card>
      )}

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  card: {
    margin: 16,
    marginTop: 8,
    elevation: 4,
  },
  merchantHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  merchantLogo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  merchantName: {
    textAlign: 'center',
    marginBottom: 4,
  },
  category: {
    opacity: 0.7,
  },
  description: {
    marginBottom: 16,
    opacity: 0.7,
  },
  addButton: {
    marginTop: 8,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  loyaltyInfo: {
    marginBottom: 8,
  },
  loyaltyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  loyaltyText: {
    marginLeft: 12,
  },
  loyaltyDescription: {
    opacity: 0.7,
    marginTop: 8,
  },
  hoursItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  dayText: {
    fontWeight: '500',
  },
  divider: {
    marginVertical: 4,
  },
  loader: {
    marginTop: 20,
  },
  errorCard: {
    margin: 16,
    marginTop: 8,
  },
  errorText: {
    textAlign: 'center',
    color: '#FF5252',
  },
  retryButton: {
    marginTop: 16,
  },
  cardContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backfaceVisibility: 'hidden',
  },
  cardFace: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBack: {
    transform: [{ rotateY: '180deg' }],
  },
  rewardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  stampsGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stamp: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 15,
  },
}); 