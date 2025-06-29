import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Text, Card, Button, Avatar, Divider, useTheme, Snackbar } from 'react-native-paper';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from '../types/navigation';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { mockApi, IUser } from '../data/staticData';
import AppHeader from '../components/AppHeader';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Account'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function ProfileScreen({ navigation }: Props) {
  const theme = useTheme();
  const { signOut, user } = useAuth();
  const [profileData, setProfileData] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const data = await mockApi.getUser();
      setProfileData(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setSnackbarMessage('Failed to load profile data');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    signOut();
  };

  const handleMenuItem = (item: string) => {
    switch (item) {
      case 'Account Settings':
        navigation.navigate('AccountSettings');
        break;
      case 'Privacy Policy':
        // Handle privacy policy
        setSnackbarMessage('Privacy Policy - Coming Soon');
        setSnackbarVisible(true);
        break;
      case 'Terms of Use':
        // Handle terms of use
        setSnackbarMessage('Terms of Use - Coming Soon');
        setSnackbarVisible(true);
        break;
      case 'Support':
        // Handle support
        setSnackbarMessage('Support - Coming Soon');
        setSnackbarVisible(true);
        break;
      case 'Feedback':
        // Handle feedback
        setSnackbarMessage('Feedback - Coming Soon');
        setSnackbarVisible(true);
        break;
      case 'Logout':
        handleLogout();
        break;
    }
  };

  const styles = getStyles(theme);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <AppHeader />
        <View style={styles.loadingContainer}>
          <Text>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            <Avatar.Text 
              size={80} 
              label={profileData?.name?.charAt(0) || 'U'} 
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{profileData?.name || 'User'}</Text>
              <Text style={styles.email}>{profileData?.email || 'user@example.com'}</Text>
              <View style={styles.pointsContainer}>
                <MaterialCommunityIcons name="star" size={20} color="#FFD700" />
                <Text style={styles.points}>{profileData?.points || 0} Points</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => handleMenuItem('Account Settings')}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="settings-outline" size={24} color="#666" />
              <Text style={styles.menuItemText}>Account Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <Divider />

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => handleMenuItem('Privacy Policy')}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="shield-outline" size={24} color="#666" />
              <Text style={styles.menuItemText}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <Divider />

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => handleMenuItem('Terms of Use')}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="document-text-outline" size={24} color="#666" />
              <Text style={styles.menuItemText}>Terms of Use</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <Divider />

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => handleMenuItem('Support')}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="help-circle-outline" size={24} color="#666" />
              <Text style={styles.menuItemText}>Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <Divider />

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => handleMenuItem('Feedback')}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="chatbubble-outline" size={24} color="#666" />
              <Text style={styles.menuItemText}>Feedback</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <Divider />

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => handleMenuItem('Logout')}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="log-out-outline" size={24} color="#E91E63" />
              <Text style={[styles.menuItemText, { color: '#E91E63' }]}>Logout</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#E91E63" />
          </TouchableOpacity>
        </View>
      </ScrollView>

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
  scrollView: {
    flex: 1,
  },
  profileCard: {
    margin: 16,
    elevation: 2,
    borderRadius: 12,
  },
  profileContent: {
    padding: 20,
  },
  profileInfo: {
    marginTop: 16,
    alignItems: 'center',
  },
  avatar: {
    alignSelf: 'center',
    backgroundColor: '#081D43',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  points: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginLeft: 4,
  },
  menuContainer: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  snackbar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
}); 