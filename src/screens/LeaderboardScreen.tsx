import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { Text, useTheme, ActivityIndicator, Card, Avatar } from 'react-native-paper';
import { useFocusEffect, CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import StampsLogo from '../../assets/Design/STLR logos and icons/logo.png';

interface LeaderboardUser {
  _id: string;
  name: string;
  totalStamps: number;
}

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Leaderboard'>,
  NativeStackScreenProps<RootStackParamList>
>;

const LeaderboardScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('http://10.0.2.2:3001/api/auth/leaderboard');
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || 'Failed to fetch leaderboard');
      }

      setLeaderboard(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load leaderboard';
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  useFocusEffect(
    useCallback(() => {
      fetchLeaderboard();
    }, [fetchLeaderboard])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const renderItem = ({ item, index }: { item: LeaderboardUser; index: number }) => (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <Text style={styles.rank}>{index + 1}</Text>
        <Avatar.Text size={40} label={item.name.charAt(0)} style={styles.avatar} />
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.stamps}>{item.totalStamps}</Text>
      </Card.Content>
    </Card>
  );

  if (loading && !refreshing) {
    return <ActivityIndicator style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader leftIcon="arrow-back" onLeftPress={() => navigation.goBack()} rightIcon="location-outline" />
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={styles.title}>Leaderboard</Text>
        <FlatList
          data={leaderboard}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#081D43',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    flex: 1,
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
  },
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 16,
    minWidth: 25,
    textAlign: 'center',
  },
  avatar: {
    marginRight: 16,
  },
  name: {
    flex: 1,
    fontSize: 16,
  },
  stamps: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LeaderboardScreen; 