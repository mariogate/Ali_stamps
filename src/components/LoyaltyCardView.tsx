import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

interface LoyaltyCardViewProps {
  logo: any;
  brandName: string;
  reward: string;
  stamps: number;
  stampsRequired: number;
  buttonLabel: string;
  onButtonPress: () => void;
  buttonDisabled?: boolean;
  loading?: boolean;
  cardColor?: string;
}

const LoyaltyCardView: React.FC<LoyaltyCardViewProps> = ({
  logo,
  brandName,
  reward,
  stamps,
  stampsRequired,
  buttonLabel,
  onButtonPress,
  buttonDisabled = false,
  loading = false,
  cardColor = '#1976D2',
}) => {
  const stampsGrid = [];
  for (let i = 0; i < stampsRequired; i++) {
    stampsGrid.push(
      <View key={i} style={styles.stamp}>
        <Ionicons name={i < stamps ? 'star' : 'star-outline'} size={30} color={i < stamps ? '#FFD700' : 'white'} />
      </View>
    );
  }

  return (
    <View style={[styles.cardContainer, { backgroundColor: cardColor }]}>  
      <Image source={logo} style={styles.merchantLogo} resizeMode="contain" />
      <Text style={styles.rewardText}>{`Collect ${stampsRequired} Stamps, Enjoy a Free ${reward}`}</Text>
      <View style={styles.stampsGrid}>{stampsGrid}</View>
      <Button
        mode="contained"
        onPress={onButtonPress}
        disabled={buttonDisabled}
        loading={loading}
        style={[styles.button, { backgroundColor: buttonDisabled ? '#aaa' : '#2D62EA' }]}
      >
        {buttonLabel}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  merchantLogo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  rewardText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  stampsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  stamp: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  button: {
    marginTop: 8,
    width: '100%',
  },
});

export default LoyaltyCardView; 