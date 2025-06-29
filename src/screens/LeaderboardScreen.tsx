import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { Text, Card, Avatar, useTheme, ActivityIndicator } from 'react-native-paper';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from '../types/navigation';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { mockApi, ILeaderboardEntry } from '../data/staticData';
import AppHeader from '../components/AppHeader';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Leaderboard'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function LeaderboardScreen({ navigation }: Props) {
  const theme = useTheme();
  const [leaderboard, setLeaderboard] = useState<ILeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await mockApi.getLeaderboard();
      setLeaderboard(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <MaterialCommunityIcons name="trophy" size={24} color="#FFD700" />;
      case 2:
        return <MaterialCommunityIcons name="trophy" size={24} color="#C0C0C0" />;
      case 3:
        return <MaterialCommunityIcons name="trophy" size={24} color="#CD7F32" />;
      default:
        return <Text style={styles.rankText}>{rank}</Text>;
    }
  };

  const renderLeaderboardItem = ({ item, index }: { item: ILeaderboardEntry; index: number }) => (
    <Card style={styles.leaderboardCard}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.rankContainer}>
          {getRankIcon(item.rank)}
        </View>
        
        <Avatar.Text 
          size={50} 
          label={item.name.charAt(0)} 
          style={styles.avatar}
        />
        
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userPoints}>{item.points} points</Text>
        </View>
        
        <View style={styles.pointsContainer}>
          <MaterialCommunityIcons name="star" size={20} color="#FFD700" />
          <Text style={styles.pointsText}>{item.points}</Text>
        </View>
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
          <Text style={styles.loadingText}>Loading leaderboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <Text style={styles.subtitle}>Top performers this month</Text>
      </View>
      
      <FlatList
        data={leaderboard}
        renderItem={renderLeaderboardItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
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
  listContainer: {
    padding: 16,
  },
  leaderboardCard: {
    marginBottom: 12,
    elevation: 2,
    borderRadius: 12,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  avatar: {
    backgroundColor: '#081D43',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userPoints: {
    fontSize: 14,
    color: '#666',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginLeft: 4,
  },
}); 