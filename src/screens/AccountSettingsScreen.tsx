import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, SafeAreaView } from 'react-native';
import { Text, List, useTheme, Button, Snackbar, Portal, Dialog, ActivityIndicator } from 'react-native-paper';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from '../types/navigation';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Settings'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function AccountSettingsScreen({ navigation }: Props) {
  const { user } = useAuth();
  const theme = useTheme();
  
  const [howItWorksVisible, setHowItWorksVisible] = useState(false);
  const [accountIdVisible, setAccountIdVisible] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [termsVisible, setTermsVisible] = useState(false);
  const [privacyVisible, setPrivacyVisible] = useState(false);

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map(star => (
      <TouchableOpacity key={star} onPress={() => setFeedbackRating(star)}>
        <Ionicons name={feedbackRating >= star ? "star" : "star-outline"} size={30} color="#FFD700" />
      </TouchableOpacity>
    ));
  };
  
    return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader leftIcon="arrow-back" onLeftPress={() => navigation.goBack()} rightIcon="location-outline" />
      <View style={styles.container}>
        <Text style={styles.settingsTitle}>Settings</Text>
        
        <ScrollView>
          <List.Section>
            <List.Item
              title="How it works"
              left={() => <Ionicons name="help-circle-outline" size={24} color="black" style={styles.icon} />}
              right={() => <Ionicons name="chevron-forward" size={24} color="grey" />}
              onPress={() => setHowItWorksVisible(true)}
            />
            <List.Item
              title="Account ID"
              left={() => <Ionicons name="person-circle-outline" size={24} color="black" style={styles.icon} />}
              right={() => <Ionicons name="chevron-forward" size={24} color="grey" />}
              onPress={() => setAccountIdVisible(true)}
            />
            <List.Item
              title="Feedback"
              left={() => <MaterialCommunityIcons name="comment-quote-outline" size={24} color="black" style={styles.icon} />}
              right={() => <Ionicons name="chevron-forward" size={24} color="grey" />}
              onPress={() => setFeedbackVisible(true)}
            />
            <List.Item
              title="Notifications"
              left={() => <Ionicons name="notifications-outline" size={24} color="black" style={styles.icon} />}
              right={() => <Ionicons name="chevron-forward" size={24} color="grey" />}
              onPress={() => setSnackbarVisible(true)}
            />
            <List.Item
              title="Terms of use"
              left={() => <Ionicons name="document-text-outline" size={24} color="black" style={styles.icon} />}
              right={() => <Ionicons name="chevron-forward" size={24} color="grey" />}
              onPress={() => setTermsVisible(true)}
            />
            <List.Item
              title="Privacy Policy"
              left={() => <Ionicons name="lock-closed-outline" size={24} color="black" style={styles.icon} />}
              right={() => <Ionicons name="chevron-forward" size={24} color="grey" />}
              onPress={() => setPrivacyVisible(true)}
          />
          </List.Section>
          
          <List.Section style={styles.bottomSection}>
            <List.Item
              title="Get in touch"
              left={() => <Ionicons name="mail-outline" size={24} color="black" style={styles.icon} />}
              right={() => <Ionicons name="chevron-forward" size={24} color="grey" />}
              onPress={() => setSnackbarVisible(true)}
            />
            <List.Item
              title="Sign up as a merchant?"
              left={() => <Ionicons name="briefcase-outline" size={24} color="black" style={styles.icon} />}
              right={() => <Ionicons name="chevron-forward" size={24} color="grey" />}
              onPress={() => setSnackbarVisible(true)}
            />
          </List.Section>
        </ScrollView>

        {/* How it works Modal */}
        <Modal transparent={true} visible={howItWorksVisible} onRequestClose={() => setHowItWorksVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>How it works</Text>
              <View style={styles.howItWorksItem}>
                  <MaterialCommunityIcons name="plus" size={24} color="#FF00FF" />
                  <Text>Show your card when you order</Text>
              </View>
              <View style={styles.howItWorksItem}>
                  <MaterialCommunityIcons name="plus" size={24} color="#FF00FF" />
                  <Text>The cashier will stamp it for you</Text>
              </View>
              <View style={styles.howItWorksItem}>
                  <MaterialCommunityIcons name="plus" size={24} color="#FF00FF" />
                  <Text>Collect more stamps to earn rewards</Text>
              </View>
              <Button onPress={() => setHowItWorksVisible(false)}>GOT IT</Button>
            </View>
          </View>
        </Modal>

        {/* Account ID Modal */}
        <Modal transparent={true} visible={accountIdVisible} onRequestClose={() => setAccountIdVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Account ID</Text>
              <Ionicons name="person-circle" size={80} color="#FF00FF" />
              <Text style={styles.accountIdText}>{user?._id.slice(-6).toUpperCase()}</Text>
              <Button onPress={() => setAccountIdVisible(false)}>GOT IT</Button>
            </View>
          </View>
        </Modal>

        {/* Feedback Modal */}
        <Modal transparent={true} visible={feedbackVisible} onRequestClose={() => setFeedbackVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <MaterialCommunityIcons name="comment-quote" size={50} color="#FF00FF" />
              <Text style={styles.modalTitle}>Rate Your Overall Experience</Text>
              <Text>Are you satisfied with the service?</Text>
              <View style={styles.starsContainer}>{renderStars()}</View>
              <View style={styles.feedbackButtons}>
                <Button onPress={() => setFeedbackVisible(false)}>CANCEL</Button>
                <Button onPress={() => {setFeedbackVisible(false); setSnackbarVisible(true);}}>CONFIRM</Button>
              </View>
            </View>
          </View>
        </Modal>
        
        {/* Terms of Use Modal */}
        <Modal transparent={true} visible={termsVisible} onRequestClose={() => setTermsVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, {alignItems: 'flex-start', maxHeight: '80%'}]}>
              <Text style={styles.modalTitle}>Terms of Use</Text>
              <ScrollView style={{marginBottom: 16}}>
                <Text style={{fontSize: 15, color: '#222'}}>
{`Welcome to STLR Stamps! By using our app, you agree to the following terms:

1. Eligibility: You must be at least 16 years old to use this app.
2. Account: You are responsible for keeping your account information secure.
3. Loyalty Cards & Points: Points and rewards are non-transferable and have no cash value. Stamps and rewards may be subject to change or expiration at the discretion of STLR or participating merchants.
4. Offers & Promotions: Offers are subject to availability and may change without notice.
5. User Conduct: Do not misuse the app or attempt to manipulate the loyalty system.
6. Privacy: We respect your privacy. Please review our Privacy Policy for details on how your data is handled.
7. Changes: We may update these terms at any time. Continued use of the app means you accept the new terms.
8. Contact: For questions, contact us at support@stlr.com.

Thank you for using STLR Stamps!`}
          </Text>
              </ScrollView>
              <Button onPress={() => setTermsVisible(false)} style={{alignSelf: 'center'}}>CLOSE</Button>
            </View>
          </View>
        </Modal>
        
        {/* Privacy Policy Modal */}
        <Modal transparent={true} visible={privacyVisible} onRequestClose={() => setPrivacyVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, {alignItems: 'flex-start', maxHeight: '80%'}]}>
              <Text style={styles.modalTitle}>Privacy Policy</Text>
              <ScrollView style={{marginBottom: 16}}>
                <Text style={{fontSize: 15, color: '#222'}}>
{`STLR Stamps values your privacy. This policy explains how we collect, use, and protect your information:

1. Information Collection: We collect information you provide when you register, such as your name, email, and account activity (e.g., stamps, rewards).
2. Usage: Your data is used to provide and improve our loyalty services, personalize your experience, and communicate important updates.
3. Sharing: We do not sell your personal information. Data may be shared with participating merchants only as needed to deliver rewards and offers.
4. Security: We use reasonable measures to protect your data, but no system is 100% secure.
5. Analytics: We may use anonymized data for analytics to improve our app.
6. Your Choices: You can update or delete your account at any time. Contact us for assistance.
7. Changes: We may update this policy. Continued use of the app means you accept the new policy.
8. Contact: For privacy questions, email support@stlr.com.

Thank you for trusting STLR Stamps!`}
            </Text>
              </ScrollView>
              <Button onPress={() => setPrivacyVisible(false)} style={{alignSelf: 'center'}}>CLOSE</Button>
            </View>
          </View>
        </Modal>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  settingsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 16,
  },
  icon: {
    marginRight: 16,
  },
  bottomSection: {
    marginTop: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  howItWorksItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  accountIdText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  feedbackButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0D28',
  }
}); 