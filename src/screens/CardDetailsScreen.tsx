import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Image, Alert, SafeAreaView } from 'react-native';
import { Text, useTheme, ActivityIndicator, Button, Snackbar } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { getMerchantLogo } from '../utils/merchantLogos';
import AppHeader from '../components/AppHeader';

interface ILoyaltyCard {
  _id: string;
  merchantId: {
    _id:string;
    name: string;
    logo?: string;
    description: string;
    instagram?: string;
    facebook?: string;
    phoneNumber?: string;
    website?: string;
    loyaltyProgram: {
      stampsRequired: number;
      reward: string;
    };
  };
  stamps: number;
}

type Props = NativeStackScreenProps<RootStackParamList, 'CardDetails'>;

const LOYALTY_CARD_COLORS: { [key: string]: string } = {
  'Subway': '#00843D',
  'Mola': '#D32F2F',
  'Hirds': '#1976D2',
  'Seecoz': '#607D8B',
  'Default': '#607D8B'
};

const CardDetailsScreen = ({ route, navigation }: Props) => {
  const { cardId } = route.params;
  const theme = useTheme();
  const { token } = useAuth();
  const [card, setCard] = useState<ILoyaltyCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStamping, setIsStamping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
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

  const flipCard = () => {
    setIsFlipped(!isFlipped);
    Animated.timing(animatedValue, {
      toValue: isFlipped ? 0 : 180,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  const fetchCardDetails = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      const res = await fetch(`http://10.0.2.2:3001/api/customer/loyalty-cards/${cardId}`, {
        headers: { 'Authorization': `Bearer ${token || ''}` },
      });
      if (!res.ok) throw new Error('Failed to fetch card details');
      const data = await res.json();
      setCard(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      if (showLoader) setLoading(false);
    }
  }, [cardId, token]);

  useEffect(() => {
    fetchCardDetails();
  }, [fetchCardDetails]);

  const handleSimulateNFC = () => {
    setIsStamping(true);

    // Simulate NFC tap delay
    setTimeout(async () => {
      try {
        const res = await fetch(`http://10.0.2.2:3001/api/customer/loyalty-cards/${cardId}/stamps`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token || ''}`,
            'Content-Type': 'application/json',
          },
        });
        
        const result = await res.json();

        if (!res.ok) {
           Alert.alert('Stamp Failed', result.error || 'Could not add stamp.');
        } else {
           Alert.alert('Stamp Added!', 'A new stamp has been successfully added to your card.');
           // Refresh card details without the full page loader
           await fetchCardDetails(false);
        }
      } catch (err) {
        Alert.alert('Error', 'An error occurred while adding the stamp.');
      } finally {
        setIsStamping(false);
      }
    }, 2500); // 2.5 second delay
  };

  const handleRedeem = () => {
    setSnackbarMessage('Redemption feature coming soon!');
    setSnackbarVisible(true);
  };

  const renderStamp = (index: number, filled: boolean) => (
    <View key={index} style={styles.stamp}>
      {filled ? (
        <Ionicons name="star" size={30} color="#FFD700" />
      ) : (
        <Ionicons name="star-outline" size={30} color="white" />
      )}
    </View>
  );

  if (loading) return <ActivityIndicator style={styles.loader} />;
  if (error) return <Text style={styles.errorText}>{error}</Text>;
  if (!card) return <Text style={styles.errorText}>Card not found</Text>;

  const { merchantId, stamps } = card;
  const { name, logo, loyaltyProgram, instagram, facebook, phoneNumber, website } = merchantId;
  const { reward, stampsRequired } = loyaltyProgram;
  const cardColor = LOYALTY_CARD_COLORS[name] || LOYALTY_CARD_COLORS['Default'];

  const frontAnimatedStyle = { transform: [{ rotateY: frontInterpolate }] };
  const backAnimatedStyle = { transform: [{ rotateY: backInterpolate }] };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader leftIcon="arrow-back" onLeftPress={() => navigation.goBack()} rightIcon="information-circle-outline" onRightPress={flipCard} />
      <View style={styles.container}>
        <Text style={styles.title}>{`My ${name} Card`}</Text>
        <View style={styles.cardScene}>
          <Animated.View style={[styles.cardContainer, frontAnimatedStyle, { backgroundColor: cardColor }]}> 
            <View style={styles.cardFace}>
              <Image source={getMerchantLogo(name)} style={styles.merchantLogo} resizeMode="contain" />
              <Text style={styles.rewardText}>{`Collect ${stampsRequired} Stamps, Enjoy a Free ${reward}`}</Text>
              <View style={styles.stampsGrid}>{
                Array.from({ length: stampsRequired }).map((_, i) => renderStamp(i, i < stamps))
              }</View>
            </View>
          </Animated.View>
          <Animated.View style={[styles.cardContainer, styles.cardBack, backAnimatedStyle, { backgroundColor: cardColor }]}> 
            <Text style={styles.cardTitle}>Locations & Contact</Text>
            <View style={styles.infoRow}>
              <Ionicons name="logo-instagram" size={24} color="white" />
              <Text style={styles.infoText}>{instagram || 'Not available'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="logo-facebook" size={24} color="white" />
              <Text style={styles.infoText}>{facebook || 'Not available'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={24} color="white" />
              <Text style={styles.infoText}>{phoneNumber || 'Not available'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="globe-outline" size={24} color="white" />
              <Text style={styles.infoText}>{website || 'Not available'}</Text>
            </View>
          </Animated.View>
        </View>
        {stamps >= stampsRequired ? (
          <Button mode="contained" onPress={handleRedeem} style={styles.redeemButton}>
            REDEEM
          </Button>
        ) : (
          <Button 
            mode="contained" 
            onPress={handleSimulateNFC}
            style={{ marginTop: 24, backgroundColor: '#2D62EA' }}
            disabled={isStamping}
            loading={isStamping}
          >
            {isStamping ? 'Simulating NFC...' : 'Simulate NFC Stamp'}
          </Button>
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0D28',
  },
  container: {
    flex: 1,
    backgroundColor: '#0A0D28',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerButton: {
    padding: 8,
  },
  logo: {
    height: 40,
    width: 150,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
  cardScene: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorText: {
    flex: 1,
    textAlign: 'center',
    marginTop: 50,
    color: 'red'
  },
  cardContainer: {
    width: '100%',
    height: 450,
    borderRadius: 20,
    padding: 20,
    backfaceVisibility: 'hidden',
  },
  cardFace: {
    alignItems: 'center',
  },
  cardBack: {
    position: 'absolute',
    top: 0,
  },
  merchantLogo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  rewardText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  stampsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  stamp: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  infoText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 15,
  },
  redeemButton: {
    marginTop: 24,
    backgroundColor: '#4CAF50',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  }
});

export default CardDetailsScreen; 