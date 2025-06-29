// Static data to replace API calls
export interface IMerchant {
  _id: string;
  name: string;
  logo?: string;
  description?: string;
  loyaltyProgram: {
    stampsRequired: number;
    reward: string;
  };
  stampsRequired?: number;
}

export interface ILoyaltyCard {
  _id: string;
  merchantId: IMerchant;
  merchantName: string;
  merchantLogo?: string;
  merchantCategory: string;
  stamps: number;
  totalStamps: number;
  lastStamp?: string;
  createdAt: string;
  stampsRequired?: number;
}

export interface IOffer {
  _id: string;
  merchantId: {
    _id: string;
    name: string;
    logo?: string;
  } | null;
  title: string;
  description?: string;
  imageUrl?: string;
  validUntil?: string;
}

export interface IUser {
  _id: string;
  email: string;
  name: string;
  role: 'customer' | 'merchant';
  points: number;
}

export interface IReward {
  _id: string;
  name: string;
  description: string;
  pointsRequired: number;
  imageUrl?: string;
  available: boolean;
}

export interface ILeaderboardEntry {
  _id: string;
  name: string;
  points: number;
  rank: number;
  avatar?: string;
}

export interface IUserStats {
  totalCards: number;
  totalStamps: number;
  totalPoints: number;
  completedCards: number;
}

// Static merchants data
export const staticMerchants: IMerchant[] = [
  {
    _id: '1',
    name: 'Daily Dose',
    description: 'Premium coffee and pastries',
    loyaltyProgram: {
      stampsRequired: 8,
      reward: 'Free coffee of your choice'
    },
    stampsRequired: 8
  },
  {
    _id: '2',
    name: 'Munch & Shake',
    description: 'Delicious burgers and shakes',
    loyaltyProgram: {
      stampsRequired: 10,
      reward: 'Free burger with any purchase'
    },
    stampsRequired: 10
  },
  {
    _id: '3',
    name: 'Granita',
    description: 'Fresh Italian ice cream',
    loyaltyProgram: {
      stampsRequired: 6,
      reward: 'Free granita of any size'
    },
    stampsRequired: 6
  },
  {
    _id: '4',
    name: 'Hirds',
    description: 'Premium coffee and tea',
    loyaltyProgram: {
      stampsRequired: 12,
      reward: 'Free specialty drink'
    },
    stampsRequired: 12
  },
  {
    _id: '5',
    name: 'Mola',
    description: 'Fresh juices and smoothies',
    loyaltyProgram: {
      stampsRequired: 7,
      reward: 'Free smoothie of your choice'
    },
    stampsRequired: 7
  },
  {
    _id: '6',
    name: 'Subway',
    description: 'Fresh sandwiches and salads',
    loyaltyProgram: {
      stampsRequired: 9,
      reward: 'Free 6-inch sub'
    },
    stampsRequired: 9
  }
];

// Static loyalty cards data
export const staticLoyaltyCards: ILoyaltyCard[] = [
  {
    _id: 'card1',
    merchantId: staticMerchants[0], // Daily Dose
    merchantName: 'Daily Dose',
    merchantCategory: 'Coffee & Pastries',
    stamps: 5,
    totalStamps: 8,
    createdAt: '2024-01-15T10:30:00Z',
    stampsRequired: 8
  },
  {
    _id: 'card2',
    merchantId: staticMerchants[1], // Munch & Shake
    merchantName: 'Munch & Shake',
    merchantCategory: 'Fast Food',
    stamps: 8,
    totalStamps: 10,
    createdAt: '2024-01-10T14:20:00Z',
    stampsRequired: 10
  },
  {
    _id: 'card3',
    merchantId: staticMerchants[2], // Granita
    merchantName: 'Granita',
    merchantCategory: 'Desserts',
    stamps: 3,
    totalStamps: 6,
    createdAt: '2024-01-20T16:45:00Z',
    stampsRequired: 6
  },
  {
    _id: 'card4',
    merchantId: staticMerchants[3], // Hirds
    merchantName: 'Hirds',
    merchantCategory: 'Coffee & Tea',
    stamps: 10,
    totalStamps: 12,
    createdAt: '2024-01-05T09:15:00Z',
    stampsRequired: 12
  },
  {
    _id: 'card5',
    merchantId: staticMerchants[4], // Mola
    merchantName: 'Mola',
    merchantCategory: 'Juices & Smoothies',
    stamps: 6,
    totalStamps: 7,
    createdAt: '2024-01-18T11:30:00Z',
    stampsRequired: 7
  }
];

// Static offers data
export const staticOffers: IOffer[] = [
  {
    _id: 'offer1',
    merchantId: {
      _id: '1',
      name: 'Daily Dose'
    },
    title: '50% Off All Pastries',
    description: 'Get half off on all our delicious pastries this week!',
    validUntil: '2024-12-31'
  },
  {
    _id: 'offer2',
    merchantId: {
      _id: '2',
      name: 'Munch & Shake'
    },
    title: 'Buy One Get One Free',
    description: 'Buy any burger and get another one for free!',
    validUntil: '2024-12-31'
  },
  {
    _id: 'offer3',
    merchantId: {
      _id: '3',
      name: 'Granita'
    },
    title: 'Free Topping',
    description: 'Add any topping to your granita for free!',
    validUntil: '2024-12-31'
  },
  {
    _id: 'offer4',
    merchantId: {
      _id: '4',
      name: 'Hirds'
    },
    title: '20% Off Specialty Drinks',
    description: 'Enjoy 20% off on all our specialty coffee drinks!',
    validUntil: '2024-12-31'
  }
];

// Static user data
export const staticUser: IUser = {
  _id: 'user1',
  email: 'user@example.com',
  name: 'John Doe',
  role: 'customer',
  points: 150
};

// Static rewards data
export const staticRewards: IReward[] = [
  {
    _id: 'reward1',
    name: 'Free Coffee',
    description: 'Redeem for a free coffee at any participating merchant',
    pointsRequired: 50,
    available: true
  },
  {
    _id: 'reward2',
    name: '50% Off Next Purchase',
    description: 'Get 50% off your next purchase at any merchant',
    pointsRequired: 100,
    available: true
  },
  {
    _id: 'reward3',
    name: 'Free Dessert',
    description: 'Redeem for a free dessert at participating restaurants',
    pointsRequired: 75,
    available: true
  },
  {
    _id: 'reward4',
    name: 'VIP Status',
    description: 'Unlock VIP benefits and exclusive offers',
    pointsRequired: 200,
    available: false
  }
];

// Static leaderboard data
export const staticLeaderboard: ILeaderboardEntry[] = [
  {
    _id: 'user1',
    name: 'John Doe',
    points: 150,
    rank: 1
  },
  {
    _id: 'user2',
    name: 'Jane Smith',
    points: 125,
    rank: 2
  },
  {
    _id: 'user3',
    name: 'Mike Johnson',
    points: 100,
    rank: 3
  },
  {
    _id: 'user4',
    name: 'Sarah Wilson',
    points: 85,
    rank: 4
  },
  {
    _id: 'user5',
    name: 'David Brown',
    points: 70,
    rank: 5
  }
];

// Static user stats
export const staticUserStats: IUserStats = {
  totalCards: 5,
  totalStamps: 32,
  totalPoints: 150,
  completedCards: 1
};

// Mock API functions that return static data
export const mockApi = {
  getMerchants: async (): Promise<IMerchant[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return staticMerchants;
  },

  getLoyaltyCards: async (): Promise<ILoyaltyCard[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return staticLoyaltyCards;
  },

  getOffers: async (): Promise<IOffer[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return staticOffers;
  },

  getUser: async (): Promise<IUser> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return staticUser;
  },

  getRewards: async (): Promise<IReward[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    return staticRewards;
  },

  getLeaderboard: async (): Promise<ILeaderboardEntry[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return staticLeaderboard;
  },

  getUserStats: async (): Promise<IUserStats> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    return staticUserStats;
  },

  getMerchantById: async (id: string): Promise<IMerchant | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return staticMerchants.find(merchant => merchant._id === id) || null;
  },

  getLoyaltyCardById: async (id: string): Promise<ILoyaltyCard | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return staticLoyaltyCards.find(card => card._id === id) || null;
  },

  // Mock authentication functions
  login: async (email: string, password: string): Promise<{ token: string; user: IUser }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email === 'user@example.com' && password === 'password') {
      return {
        token: 'mock-jwt-token-12345',
        user: staticUser
      };
    }
    throw new Error('Invalid credentials');
  },

  register: async (name: string, email: string, password: string): Promise<{ token: string; user: IUser }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      token: 'mock-jwt-token-12345',
      user: { ...staticUser, name, email }
    };
  },

  // Mock stamp operations
  addStamp: async (cardId: string): Promise<{ success: boolean; message: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, message: 'Stamp added successfully!' };
  },

  redeemReward: async (rewardId: string): Promise<{ success: boolean; message: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: 'Reward redeemed successfully!' };
  }
}; 