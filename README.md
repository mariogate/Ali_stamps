# STLR Stamps Frontend

A React Native mobile application for the STLR Stamps loyalty program. This is a static UI implementation that showcases the loyalty card system interface.

## Features

- **Loyalty Card Management**: View and manage loyalty cards from various merchants
- **Merchant Integration**: Browse and interact with merchant offers and rewards
- **User Authentication**: Login and registration screens
- **Profile Management**: User profile and account settings
- **Wallet System**: Track points and rewards
- **Leaderboard**: View user rankings and achievements

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts for state management
├── screens/            # Main application screens
├── types/              # TypeScript type definitions
└── utils/              # Utility functions and data
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npx expo start
```

3. Run on your preferred platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your device

## Static Data

This version uses static data for demonstration purposes. The app includes:

- Sample merchant data with logos and information
- Mock loyalty cards and stamps
- Example offers and rewards
- User profile data

## Technologies Used

- React Native
- Expo
- TypeScript
- React Navigation
- Context API for state management

## Development

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run in web browser

### Building for Production

```bash
# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is proprietary software for STLR Stamps. 