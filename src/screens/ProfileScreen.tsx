import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Text, List, useTheme, ActivityIndicator, Snackbar } from 'react-native-paper';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from '../types/navigation';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';

interface IUserProfile {
  name: string;
  email: string;
  stats: {
    totalCards: number;
    totalStamps: number;
    points: number;
  };
}

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Account'>,
  NativeStackScreenProps<RootStackParamList>
>;

const StatDisplay = ({ iconName, value, label, color }: { iconName: any, value: number, label: string, color: string }) => (
  <View style={styles.statItem}>
    <View style={[styles.statIconContainer, {backgroundColor: `${color}30`}]}>
        <Ionicons name={iconName} size={30} color={color} />
        <View style={styles.statValueContainer}>
            <Text style={[styles.statValue, { color }]}>{value}</Text>
        </View>
    </View>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export default function ProfileScreen({ navigation }: Props) {
  const theme = useTheme();
  const { signOut, token } = useAuth();
  const [profile, setProfile] = useState<IUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch('http://10.0.2.2:3001/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${token || ''}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch profile');
      setProfile(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) return <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} />;

    return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader leftIcon="arrow-back" onLeftPress={() => navigation.goBack()} rightIcon="location-outline" />
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.sectionTitle}>Usage</Text>
          <View style={styles.statsContainer}>
              <StatDisplay iconName="add" value={profile?.stats?.totalStamps ?? 0} label="Total Stamps" color="#3498db"/>
              <StatDisplay iconName="add" value={profile?.stats?.totalCards ?? 0} label="Total Cards" color="#2c3e50"/>
              <StatDisplay iconName="add" value={profile?.stats?.points ?? 0} label="My Points" color="#e74c3c"/>
          </View>

          <List.Section>
            <InfoRow icon="mail-outline" text={profile?.email ?? 'name@email.com'} actionIcon="pencil-outline" />
            <InfoRow icon="person-outline" text="Username" actionIcon="lock-closed-outline" />
            <InfoRow icon="shield-checkmark-outline" text="**********" actionIcon="pencil-outline" />
            <InfoRow icon="call-outline" text="+20" actionIcon="pencil-outline" />
            <InfoRow icon="calendar-outline" text="dd/mm/yyyy" actionIcon="lock-closed-outline" />
          </List.Section>

          <List.Section style={{marginTop: 20}}>
            <ActionRow icon="people-outline" text="Refer a friend" />
            <ActionRow icon="headset-outline" text="Support" />
            <ActionRow icon="log-out-outline" text="Sign Out" onPress={signOut} />
          </List.Section>
        </ScrollView>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
          Feature coming soon!
      </Snackbar>
      </View>
    </SafeAreaView>
  );
}

const InfoRow = ({ icon, text, actionIcon }: { icon: any, text: string, actionIcon: any }) => (
    <View style={styles.infoRow}>
        <Ionicons name={icon} size={24} color="#2c3e50" style={styles.infoIcon} />
        <Text style={styles.infoText}>{text}</Text>
        <TouchableOpacity>
            <Ionicons name={actionIcon} size={24} color="grey" />
        </TouchableOpacity>
    </View>
  );

const ActionRow = ({ icon, text, onPress }: { icon: any, text: string, onPress?: () => void }) => (
    <TouchableOpacity style={styles.infoRow} onPress={onPress}>
        <Ionicons name={icon} size={24} color="#2c3e50" style={styles.infoIcon} />
        <Text style={styles.infoText}>{text}</Text>
        <Ionicons name="chevron-forward-outline" size={24} color="grey" />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: '#0A0D28',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  logo: {
    height: 40,
    width: 150,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 10,
    marginTop: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '45deg' }],
    marginBottom: 8,
  },
  statValueContainer: {
      position: 'absolute',
      transform: [{ rotate: '-45deg' }],
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: 'grey',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoIcon: {
    marginRight: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 16,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0D28',
  }
}); 