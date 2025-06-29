import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { Text, Card, Button, useTheme, ActivityIndicator, Snackbar, ProgressBar } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { mockApi, IReward, IUserStats } from '../data/staticData';
import AppHeader from '../components/AppHeader';

type Props = NativeStackScreenProps<RootStackParamList, 'Rewards'>;

export default function RewardsScreen({ navigation }: Props) {
  const theme = useTheme();
  const [rewards, setRewards] = useState<IReward[]>([]);
  const [userStats, setUserStats] = useState<IUserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rewardsData, statsData] = await Promise.all([
        mockApi.getRewards(),
        mockApi.getUserStats()
      ]);
      setRewards(rewardsData);
      setUserStats(statsData);
    } catch (error) {
      console.error('Error fetching rewards data:', error);
      setSnackbarMessage('Failed to load rewards');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemReward = async (rewardId: string) => {
    try {
      setRedeeming(rewardId);
      const result = await mockApi.redeemReward(rewardId);
      setSnackbarMessage(result.message);
      setSnackbarVisible(true);
      // Refresh data after redemption
      fetchData();
    } catch (error) {
      console.error('Error redeeming reward:', error);
      setSnackbarMessage('Failed to redeem reward');
      setSnackbarVisible(true);
    } finally {
      setRedeeming(null);
    }
  };

  const renderRewardItem = ({ item }: { item: IReward }) => (
    <Card style={styles.rewardCard}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.rewardInfo}>
          <MaterialCommunityIcons 
            name="gift" 
            size={40} 
            color={item.available ? '#4CAF50' : '#9E9E9E'} 
          />
          <View style={styles.rewardDetails}>
            <Text style={styles.rewardName}>{item.name}</Text>
            <Text style={styles.rewardDescription}>{item.description}</Text>
            <View style={styles.pointsRequired}>
              <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
              <Text style={styles.pointsText}>{item.pointsRequired} points required</Text>
            </View>
          </View>
        </View>
        
        <Button
          mode="contained"
          onPress={() => handleRedeemReward(item._id)}
          loading={redeeming === item._id}
          disabled={!item.available || redeeming !== null}
          style={[
            styles.redeemButton,
            { backgroundColor: item.available ? '#4CAF50' : '#9E9E9E' }
          ]}
        >
          {item.available ? 'Redeem' : 'Unavailable'}
        </Button>
      </Card.Content>
    </Card>
  );

  const styles = getStyles(theme);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <AppHeader />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#081D43" />
          <Text style={styles.loadingText}>Loading rewards...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />
      
      {/* Stats Section */}
      {userStats && (
        <Card style={styles.statsCard}>
          <Card.Content>
            <Text style={styles.statsTitle}>Your Progress</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="cards" size={24} color="#2196F3" />
                <Text style={styles.statValue}>{userStats.totalCards}</Text>
                <Text style={styles.statLabel}>Total Cards</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="sticker-check" size={24} color="#4CAF50" />
                <Text style={styles.statValue}>{userStats.totalStamps}</Text>
                <Text style={styles.statLabel}>Total Stamps</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="star" size={24} color="#FFD700" />
                <Text style={styles.statValue}>{userStats.totalPoints}</Text>
                <Text style={styles.statLabel}>Points</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="trophy" size={24} color="#FF9800" />
                <Text style={styles.statValue}>{userStats.completedCards}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Rewards Section */}
      <View style={styles.rewardsSection}>
        <Text style={styles.sectionTitle}>Available Rewards</Text>
        <FlatList
          data={rewards}
          renderItem={renderRewardItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.rewardsList}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
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
  statsCard: {
    margin: 16,
    elevation: 2,
    borderRadius: 12,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  rewardsSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  rewardsList: {
    padding: 16,
  },
  rewardCard: {
    marginBottom: 12,
    elevation: 2,
    borderRadius: 12,
  },
  cardContent: {
    padding: 16,
  },
  rewardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rewardDetails: {
    flex: 1,
    marginLeft: 16,
  },
  rewardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  rewardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  pointsRequired: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  redeemButton: {
    borderRadius: 8,
  },
  snackbar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
}); 