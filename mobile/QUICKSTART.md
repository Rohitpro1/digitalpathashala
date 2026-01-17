# Quick Start Guide - Digital Pathshala Mobile App

## For Developers

### 1. Install Dependencies
```bash
cd /app/mobile
yarn install
```

### 2. Start Development
```bash
yarn start
# Then scan QR code with Expo Go app
```

### 3. Run on Android Emulator
```bash
yarn android
```

### 4. Run on iOS Simulator (macOS only)
```bash
yarn ios
```

## For Testing

### Demo Accounts

**Student Account:**
- Email: `student1@school.com`
- Password: `student123`

**Teacher Account:**
- Email: `teacher@school.com`
- Password: `teacher123`

### Testing Offline Mode

1. Login to the app
2. Load some lessons
3. Enable airplane mode on device
4. Navigate through app (should work)
5. Disable airplane mode
6. Watch automatic sync

### Testing Languages

1. Login to app
2. Tap language selector (top right)
3. Switch between English, Hindi, Punjabi
4. UI should update immediately

## Build APK for Testing

### Prerequisites
```bash
npm install -g eas-cli
eas login
```

### Build APK
```bash
cd /app/mobile
eas build --platform android --profile preview
```

APK will be available for download after build completes (~10-15 minutes).

## Architecture Overview

```
User Login → JWT Token (Secure Storage)
           ↓
API Calls → Interceptor adds token
           ↓
Offline? → Queue request → Sync later
           ↓
Online? → Direct API call → Cache response
```

## Key Files

- `App.js` - Root component with providers
- `src/navigation/AppNavigator.js` - Navigation logic
- `src/services/api.js` - API client
- `src/services/sync.js` - Offline sync
- `src/hooks/useAuth.js` - Authentication
- `src/hooks/useOffline.js` - Network detection

## Common Commands

```bash
# Start development
yarn start

# Clear cache and start
expo start --clear

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios

# View build logs
eas build:list
```

## Troubleshooting

**Can't connect to backend?**
- Check API URL in `app.config.js`
- Backend must be running and accessible

**Metro bundler errors?**
```bash
expo start --clear
```

**EAS build failing?**
- Run `eas build:configure` first
- Check eas.json exists

## Next Steps

1. Review full README.md
2. Explore codebase structure
3. Test offline functionality
4. Build production APK
5. Deploy to stores
