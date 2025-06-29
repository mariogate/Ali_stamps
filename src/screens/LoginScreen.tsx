import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Text, TextInput, Button, useTheme, Snackbar, Checkbox } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../contexts/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MainLogo from '../../assets/Design/stamps/logo.png';

// Assuming the logo image is in the assets folder
// import Logo from '../../assets/logo.png'; // Uncomment and update path as needed

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const theme = useTheme();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);


  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      setSnackbarVisible(true);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch('http://10.0.2.2:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || 'Login failed');
      }

      // Assuming backend returns { token: string, user: IUser }
      if (data.token && data.user) {
         signIn(data.token, data.user); // Pass token and user data
      } else {
         throw new Error('Login successful but no token or user data received');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
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
          {/* <Image source={Logo} style={styles.logo} /> */}
          <Image source={MainLogo} style={{ width: 140, height: 40, alignSelf: 'center', marginBottom: 32 }} resizeMode="contain" />
           <Text style={styles.logoText}>STAMPS</Text>
           <Text style={styles.logoSubtitle}>By STLR</Text>
          <Text variant="displaySmall" style={styles.title}>
            Log In
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Enter your details below
          </Text>
        </View>

        <View style={styles.form}>
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

          {/* Remember Me and Forgot Password */}
          <View style={styles.optionsContainer}>
            <View style={styles.rememberMeContainer}>
              <Checkbox
                status={rememberMe ? 'checked' : 'unchecked'}
                onPress={() => setRememberMe(!rememberMe)}
                color="#E91E63"
              />
              <Text style={styles.rememberMeText}>Remember me</Text>
            </View>
            <Button
              mode="text"
              onPress={() => { /* Handle Forgot Password */ }}
              labelStyle={styles.forgotPasswordLabel}
              style={styles.forgotPasswordButton}
            >
              Forgot Password
            </Button>
          </View>

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.button}
            labelStyle={styles.buttonLabel}
            contentStyle={styles.buttonContent}
          >
            LOG IN
          </Button>

          {/* Don't have an account? SIGN UP */}
          <View style={styles.registerContainer}>
            <Text style={styles.noAccountText}>
              Don't have an account?
            </Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Register')}
              labelStyle={styles.registerButtonLabel}
              style={styles.registerTextButton}
            >
              SIGN UP
            </Button>
          </View>

          {/* Continue as a Vendor */}
          <Button
            mode="text"
            onPress={() => { /* Handle Continue as Vendor */ }}
            labelStyle={styles.vendorButtonLabel}
            style={styles.vendorTextButton}
          >
            Continue as a Vendor
          </Button>

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
      >
        {error}
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C004F', // Dark purple background
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start', // Align header to top
    paddingHorizontal: 20,
    paddingTop: 80, // Add some padding at the top
    paddingBottom: 40, // Add padding at the bottom
  },
  header: {
    alignItems: 'center',
    marginBottom: 60, // Increased space after header
  },
  logo: {
    // Define logo styles (width, height, etc.)
    width: 100,
    height: 100,
    marginBottom: 20,
  },
   logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
    // Add other styling for the logo text
   },
   logoSubtitle: {
     fontSize: 16,
     color: '#FFFFFF',
     marginBottom: 30,
     // Add other styling for the logo subtitle
   },
  title: {
    color: '#FFFFFF', // White color for title
    marginBottom: 10,
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#FFFFFF', // White color for subtitle
    textAlign: 'center',
    fontSize: 16,
  },
  form: {
    backgroundColor: 'white',
    padding: 30,
    borderTopLeftRadius: 30, // Large border radius at top left
    borderTopRightRadius: 30, // Large border radius at top right
    borderRadius: 0,
    elevation: 4,
  },
  inputLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    marginTop: 15,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  inputContent: {
    paddingVertical: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberMeText: {
    fontSize: 14,
    color: '#666',
    marginLeft: -4, // Adjust checkbox text spacing
  },
  forgotPasswordLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E91E63', // Pink color for Forgot Password text
  },
  forgotPasswordButton: {
     paddingHorizontal: 0, // Remove horizontal padding
     paddingVertical: 0, // Remove vertical padding
  },
  button: {
    marginTop: 10,
    backgroundColor: '#E91E63',
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  buttonContent: {
    paddingVertical: 6,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  noAccountText: {
    fontSize: 14,
    color: '#666',
  },
  registerButtonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E91E63',
  },
   registerTextButton: {
     paddingHorizontal: 0, // Remove horizontal padding
     paddingVertical: 0, // Remove vertical padding
   },
   vendorTextButton: {
     paddingHorizontal: 0, // Remove horizontal padding
     paddingVertical: 0, // Remove vertical padding
     marginTop: 10, // Space above Vendor button
   },
   vendorButtonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666', // Grey color for Vendor text
   },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#eee',
  },
  separatorText: {
    marginHorizontal: 10,
    color: '#666',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  socialButton: {
    marginHorizontal: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: '#eee',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialButtonContent: {
    width: 24,
    height: 24,
  },
  termsText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 18,
  },
  linkText: {
    color: '#E91E63',
    textDecorationLine: 'underline',
  }
}); 