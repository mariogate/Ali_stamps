import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Text, Card, Button, useTheme, Snackbar } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../contexts/AuthContext';
import { getMerchantLogo } from '../utils/merchantLogos';
import { getPromotionalImage } from '../utils/offerImages';
import { useFocusEffect } from '@react-navigation/native';

interface IReward {
  _id: string;
  merchantId: {
    _id: string;
    name: string;
    logo?: string;
  };
  name: string;
  description: string;
  pointsRequired: number;
  imageUrl?: string;
}

type Props = NativeStackScreenProps<RootStackParamList, 'Rewards'>;

export default function RewardsScreen({ navigation }: Props) {
  const theme = useTheme();
  const { token, user, signIn } = useAuth(); // Get token, user, and signIn from context
  const [rewards, setRewards] = useState<IReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false); // Added state for redemption loading
  const [error, setError] = useState<string | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [points, setPoints] = useState(0);

  const fetchPoints = useCallback(async () => {
    try {
      const res = await fetch('http://10.0.2.2:3001/api/customer/stats', {
        headers: { Authorization: `Bearer ${token || ''}` }
      });
      const data = await res.json();
      if (res.ok && typeof data === 'object' && data !== null) {
        setPoints(data.points ?? 0);
      } else {
        setPoints(0);
      }
    } catch (err) {
      setPoints(0);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      fetchPoints();
    }, [fetchPoints])
  );

  const fetchRewards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('http://10.0.2.2:3001/api/rewards', {
        headers: {
          'Authorization': `Bearer ${token || ''}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || 'Failed to fetch rewards');
      }

      setRewards(data);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load rewards';
      setError(errorMessage);
      setSnackbarMessage(errorMessage);
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  const handleRedeemReward = async (rewardId: string) => {
    if (!user) return; // Cannot redeem if user is not logged in (shouldn't happen with auth)

    setRedeeming(true); // Start redemption loading
    try {
      console.log('Attempting to redeem reward:', rewardId);
      const res = await fetch('http://10.0.2.2:3001/api/rewards/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`
        },
        body: JSON.stringify({ rewardId })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || 'Failed to redeem reward');
      }

      // Update user's points in the AuthContext
      // Assuming backend returns the updated user object or at least the new points
      if (data.userPoints !== undefined) {
          // Create a new user object with updated points
          const updatedUser = { ...user, points: data.userPoints };
          // Use signIn to update the user in the context. 
          // Note: This might require adjusting your signIn to only update user data if token is not changing.
          // For simplicity here, we'll assume signIn can handle just user data update if token is null/same.
          // A better approach might be a separate updateUserPoints function in AuthContext.
          signIn(token || '', updatedUser); // Update context
          console.log('User points updated in context. New points:', data.userPoints);
      } else {
           // If backend doesn't return updated points, refetch profile or rely on subsequent data fetches
           console.warn('Backend did not return updated user points.');
           // Optionally refetch user data here
           // fetchProfile(); // If you have a fetchProfile function in AuthContext or here
      }

      setSnackbarMessage('Reward redeemed successfully!');
      setSnackbarVisible(true);

      // Optionally refetch rewards after redemption if redemption affects availability
      // fetchRewards();

    } catch (err) {
      console.error('Redemption error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to redeem reward';
      setSnackbarMessage(`Redemption failed: ${errorMessage}`);
      setSnackbarVisible(true);
    } finally {
      setRedeeming(false); // End redemption loading
    }
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator animating={true} color={theme.colors.primary} size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={{ color: theme.colors.error }}>{error}</Text>
        <Button onPress={fetchRewards} style={{ marginTop: 16 }}>Retry</Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.pointsCard}>
        <Card.Content style={styles.pointsCardContent}>
          <Text variant="titleMedium">Your Points</Text>
          <Text variant="headlineMedium" style={styles.pointsText}>
            {points}
          </Text>
        </Card.Content>
      </Card>

      <Text variant="titleLarge" style={styles.rewardsTitle}>Available Rewards</Text>

      {rewards.length > 0 ? (
        rewards.map((reward) => (
          <Card key={reward._id} style={styles.rewardCard}>
            {reward.imageUrl && (
              <Card.Cover 
                source={getPromotionalImage(reward.imageUrl)} 
                style={styles.rewardImage} 
              />
            )}
            <Card.Content>
              <View style={styles.rewardHeader}>
                 {/* Placeholder for Merchant Logo if available */}
                 {/* {reward.merchantId?.logo && (
                   <Image source={{ uri: reward.merchantId.logo }} style={styles.merchantLogo} />
                 )} */}
                <View style={styles.rewardTitleContainer}>
                   <Text variant="titleMedium">{reward.name}</Text>
                   <Text variant="bodySmall">from {reward.merchantId.name}</Text>
                </View>
              </View>
              <Text variant="bodyMedium" style={styles.rewardDescription}>
                {reward.description}
              </Text>
              <Text variant="bodySmall" style={styles.pointsRequiredText}>
                Points Required: {reward.pointsRequired}
              </Text>
              <Button
                mode="contained"
                onPress={() => handleRedeemReward(reward._id)}
                disabled={(user?.points ?? 0) < reward.pointsRequired || redeeming}
                loading={redeeming}
                style={styles.redeemButton}
              >
                Redeem
              </Button>
            </Card.Content>
          </Card>
        ))
      ) : (
        <View style={styles.noRewardsContainer}>
           <Text variant="bodyMedium" style={styles.noRewardsText}>No rewards available at the moment.</Text>
        </View>
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
    padding: 16,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointsCard: {
    marginBottom: 16,
    backgroundColor: '#E3F2FD', // Light blue background
    elevation: 2,
  },
   pointsCardContent: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
   },
  pointsText: {
    color: '#1976D2', // Darker blue color
    fontWeight: 'bold',
  },
  rewardsTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  rewardCard: {
    marginBottom: 16,
    elevation: 2,
  },
  rewardHeader: {
     flexDirection: 'row',
     alignItems: 'center',
     marginBottom: 8,
  },
  merchantLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  rewardTitleContainer: {
     flex: 1,
  },
  rewardDescription: {
    marginBottom: 8,
    opacity: 0.8,
  },
  pointsRequiredText: {
    marginBottom: 12,
    fontWeight: 'bold',
    color: '#E91E63', // Pink color for points required
  },
  redeemButton: {
    marginTop: 8,
  },
   noRewardsContainer: {
     padding: 24,
     alignItems: 'center',
   },
   noRewardsText: {
     opacity: 0.6,
     fontStyle: 'italic',
   },
   rewardImage: {
     height: 150,
     width: '100%',
     borderTopLeftRadius: 8,
     borderTopRightRadius: 8,
   },
}); 