import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Text, TextInput, Button, useTheme, Snackbar } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../contexts/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MainLogo from '../../assets/Design/stamps/logo.png';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const theme = useTheme();
  const { signIn } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(''); // New state for phone number

  function isValidEmail(email: string) {
    // Updated regex based on feedback, more robust email validation is recommended for production apps
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // Revert to previous regex, less strict for now
  }

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      setSnackbarVisible(true);
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      setSnackbarVisible(true);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setSnackbarVisible(true);
      return;
    }

    // Add password strength validation here if needed, based on backend rules
    // e.g., minlength, uppercase, lowercase, number, special character
    // if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
    //   setError('Password must meet criteria...');
    //   setSnackbarVisible(true);
    //   return;
    // }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch('http://10.0.2.2:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role: 'customer' }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || 'Registration failed');
      }

      // Assuming backend returns { token: string, user: IUser }
      if (data.token && data.user) {
        signIn(data.token, data.user); // Pass token and user data
      } else {
        throw new Error('Registration successful but no token or user data received');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Add background pattern/image here if needed */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          {/* Replace with your logo image */}
          <Image source={MainLogo} style={{ width: 140, height: 40, alignSelf: 'center', marginBottom: 32 }} resizeMode="contain" />
          {/* Placeholder for Logo */}
           {/* <Text style={styles.logoText}>STAMPS</Text>
           <Text style={styles.logoSubtitle}>By STLR</Text> */}
          <Text variant="displaySmall" style={styles.title}>
            Sign Up
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Please sign up to get started
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.inputLabel}>NAME</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.input}
            mode="outlined" // Use outlined mode for input fields
            outlineColor="transparent" // Make outline transparent initially
            activeOutlineColor="#E91E63" // Pink outline when active
            theme={{ colors: { surfaceVariant: '#F5F5F5' } }} // Change background color
            contentStyle={styles.inputContent}
            placeholder="John doe"
            placeholderTextColor="#999"
          />

          <Text style={styles.inputLabel}>EMAIL</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            mode="outlined"
            outlineColor="transparent"
            activeOutlineColor="#E91E63"
            theme={{ colors: { surfaceVariant: '#F5F5F5' } }}
            contentStyle={styles.inputContent}
            placeholder="example@gmail.com"
            placeholderTextColor="#999"
          />

          <Text style={styles.inputLabel}>PHONE NUMBER</Text>
          <TextInput
            value={phoneNumber} // Use state variable
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            style={styles.input}
            mode="outlined"
            outlineColor="transparent"
            activeOutlineColor="#E91E63"
            theme={{ colors: { surfaceVariant: '#F5F5F5' } }}
            contentStyle={styles.inputContent}
            placeholder="01223344556"
            placeholderTextColor="#999"
          />

          <Text style={styles.inputLabel}>PASSWORD</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            style={styles.input}
            mode="outlined"
            outlineColor="transparent"
            activeOutlineColor="#E91E63"
            theme={{ colors: { surfaceVariant: '#F5F5F5' } }}
            contentStyle={styles.inputContent}
            placeholder="**********"
            placeholderTextColor="#999"
            right={<TextInput.Icon icon={passwordVisible ? "eye-off" : "eye"} onPress={() => setPasswordVisible(!passwordVisible)} color="#666" />} // Add eye icon
          />

          {/* Add Confirm Password field */}
          <Text style={styles.inputLabel}>CONFIRM PASSWORD</Text>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!confirmPasswordVisible}
            style={styles.input}
            mode="outlined"
            outlineColor="transparent"
            activeOutlineColor="#E91E63"
            theme={{ colors: { surfaceVariant: '#F5F5F5' } }}
            contentStyle={styles.inputContent}
            placeholder="**********"
            placeholderTextColor="#999"
            right={<TextInput.Icon icon={confirmPasswordVisible ? "eye-off" : "eye"} onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)} color="#666" />} // Add eye icon
          />

          <Button
            mode="contained"
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            style={styles.button}
            labelStyle={styles.buttonLabel}
            contentStyle={styles.buttonContent} // Add padding to button content
          >
            SIGN UP
          </Button>

          {/* Add "Already have an account? LOG IN" text and button */}
          <View style={styles.loginContainer}>
            <Text style={styles.alreadyAccountText}>
              Already have an account?
            </Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Login')}
              labelStyle={styles.loginButtonLabel}
              style={styles.loginTextButton} // Add style for the text button
            >
              LOG IN
            </Button>
          </View>

          {/* Add "Or login with" separator */}
          <View style={styles.separatorContainer}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>Or login with</Text>
            <View style={styles.separatorLine} />
          </View>

          {/* Add social login buttons (Google and Apple) */}
          <View style={styles.socialButtonsContainer}>
            {/* Replace with actual social login buttons */}
            <Button mode="outlined" style={styles.socialButton} contentStyle={styles.socialButtonContent}>
              <Icon name="google" size={24} color="#4285F4" />
            </Button>
            <Button mode="outlined" style={styles.socialButton} contentStyle={styles.socialButtonContent}>
              <Icon name="apple" size={24} color="#000000" />
            </Button>
          </View>

          {/* Add Terms of Service and Privacy Policy text */}
          <Text style={styles.termsText}>
            By clicking continue, you agree to our <Text style={styles.linkText}>Terms of Service</Text>
            and <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>

        </View>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        action={{
          label: 'Dismiss',
          onPress: () => setSnackbarVisible(false),
        }}
        style={styles.snackbar}
      >
        {error}
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // White background based on Figma
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24, // Consistent horizontal padding
    paddingVertical: 40, // Top/bottom padding
  },
  header: {
    alignItems: 'center',
    marginBottom: 40, // Space below header
  },
  logo: {
    width: 100, // Adjust size as per Figma
    height: 100, // Adjust size as per Figma
    resizeMode: 'contain',
    marginBottom: 16, // Space below logo
  },
  title: {
    fontSize: 28, // Adjust font size as per Figma
    fontWeight: 'bold', // Adjust font weight as per Figma
    color: '#333333', // Dark text color
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
    marginTop: 16,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#F5F5F5', // Light grey background for inputs
    borderRadius: 8, // Rounded corners
    borderWidth: 1, // Add a subtle border
    borderColor: '#E0E0E0', // Light grey border color
    height: 56, // Fixed height for inputs
    fontSize: 16,
    paddingHorizontal: 16, // Padding inside input
    paddingVertical: 0,
  },
  inputContent: {
    paddingHorizontal: 0,
  },
  button: {
    borderRadius: 8, // Rounded corners for button
    marginTop: 24,
    backgroundColor: '#E91E63', // Pink color from Figma
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text
    paddingVertical: 8,
  },
  buttonContent: {
    height: 56, // Fixed height for button
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  alreadyAccountText: {
    fontSize: 14,
    color: '#666666',
  },
  loginTextButton: {
    marginLeft: 4,
  },
  loginButtonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E91E63', // Pink color for login link
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30, // Space around separator
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  separatorText: {
    width: 100,
    textAlign: 'center',
    color: '#999999',
    fontSize: 14,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  socialButton: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF', // White background
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialButtonContent: {
    paddingHorizontal: 0, // Remove default padding
  },
  termsText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    color: '#E91E63', // Pink color for links
    fontWeight: 'bold',
  },
  snackbar: {
    backgroundColor: '#FF6347', // Error red
  },
  snackbarText: {
    color: '#FFFFFF',
  },
}); 