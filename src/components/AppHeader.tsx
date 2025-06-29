import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, SafeAreaView, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MainLogo from '../../assets/Design/stamps/logo.png';

interface AppHeaderProps {
  leftIcon?: string;
  onLeftPress?: () => void;
  rightIcon?: string;
  onRightPress?: () => void;
  logoSource?: any;
  style?: ViewStyle;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  leftIcon = 'menu',
  onLeftPress,
  rightIcon = 'location-outline',
  onRightPress,
  logoSource = MainLogo,
  style,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.header, style]}>  
        <TouchableOpacity onPress={onLeftPress} style={styles.iconButton}>
          <Ionicons name={leftIcon as any} size={32} color="white" />
        </TouchableOpacity>
        <Image source={logoSource} style={styles.headerLogo} resizeMode="contain" />
        <TouchableOpacity onPress={onRightPress} style={styles.iconButton}>
          <Ionicons name={rightIcon as any} size={28} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#081D43',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 18,
    backgroundColor: '#081D43',
    minHeight: 80,
  },
  headerLogo: {
    height: 54,
    width: 200,
    marginTop: 8,
  },
  iconButton: {
    padding: 4,
  },
});

export default AppHeader; 