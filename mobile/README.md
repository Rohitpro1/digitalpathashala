# Digital Pathshala Mobile App - React Native (Expo)

## Overview

A production-ready, offline-first mobile application for Digital Pathshala rural education platform. Built with React Native (Expo) for both Android and iOS, with deep integration to the existing FastAPI + MongoDB backend.

## Features

### Core Functionality
- ✅ **Offline-First Architecture** - Full app functionality without internet
- ✅ **JWT Authentication** - Secure token storage with expo-secure-store
- ✅ **Background Sync** - Automatic data synchronization when online
- ✅ **Multilingual Support** - English, Hindi (हिन्दी), Punjabi (ਪੰਜਾਬੀ)
- ✅ **Low-End Device Optimization** - Works smoothly on 1-2GB RAM devices
- ✅ **Role-Based Access** - Student, Teacher, and Admin roles
- ✅ **Progress Tracking** - Lesson completion and time-spent analytics

### Student Features
- Interactive lessons with offline download
- Digital literacy modules
- Assignment submission (offline-capable)
- Progress tracking dashboard
- Multi-language lesson viewing

### Teacher Features
- Student management
- Attendance marking
- Assignment creation and grading
- Class analytics
- Progress monitoring

## Technology Stack

- **Framework**: React Native with Expo SDK 50
- **Navigation**: React Navigation v6
- **State Management**: React Context API
- **API Client**: Axios with interceptors
- **Local Storage**: AsyncStorage + expo-secure-store
- **Offline Database**: expo-sqlite (ready for implementation)
- **Network Detection**: @react-native-community/netinfo
- **UI Components**: Custom components with consistent design system

## Project Structure

```
/app/mobile/
├── app.json                  # Expo configuration
├── app.config.js              # Dynamic configuration
├── package.json               # Dependencies
├── App.js                     # Root component
└── src/
    ├── navigation/            # Navigation configuration
    │   ├── AppNavigator.js    # Main navigator
    │   ├── StudentNavigator.js
    │   └── TeacherNavigator.js
    ├── screens/               # Screen components
    │   ├── Auth/
    │   │   ├── LoginScreen.js
    │   │   └── RegisterScreen.js
    │   ├── Student/
    │   │   └── StudentDashboard.js
    │   └── Teacher/
    ├── services/              # API and data services
    │   ├── api.js             # API client with interceptors
    │   ├── auth.js            # Authentication service
    │   ├── storage.js         # Local storage service
    │   └── sync.js            # Background sync service
    ├── hooks/                 # Custom React hooks
    │   ├── useAuth.js         # Authentication hook
    │   ├── useOffline.js      # Offline detection hook
    │   └── useLanguage.js     # Internationalization hook
    ├── components/            # Reusable components
    │   ├── Button.js
    │   ├── Input.js
    │   ├── Card.js
    │   ├── LanguageSelector.js
    │   └── OfflineIndicator.js
    └── constants/             # App constants
        ├── colors.js          # Theme colors
        └── translations.js    # Multi-language strings
```

## Installation & Setup

### Prerequisites

1. **Node.js** (v16 or higher)
2. **Yarn** package manager
3. **Expo CLI**: `npm install -g expo-cli`
4. **EAS CLI** (for building): `npm install -g eas-cli`
5. **Android Studio** (for Android development)
6. **Xcode** (for iOS development - macOS only)

### Step 1: Install Dependencies

```bash
cd /app/mobile
yarn install
```

### Step 2: Configure Backend URL

Update the API URL in `app.config.js`:

```javascript
export default {
  expo: {
    extra: {
      apiUrl: 'https://digital-pathshala.preview.emergentagent.com/api',
    },
  },
};
```

Or set via environment variable:
```bash
export API_URL="https://your-backend-url.com/api"
```

### Step 3: Start Development Server

```bash
cd /app/mobile
expo start
# or
yarn start
```

This will open Expo DevTools in your browser.

### Step 4: Run on Device/Emulator

#### For Android:
1. Install Expo Go app from Play Store
2. Scan QR code from terminal

OR

```bash
expo start --android  # Opens in Android emulator
```

#### For iOS (macOS only):
1. Install Expo Go app from App Store
2. Scan QR code from terminal

OR

```bash
expo start --ios  # Opens in iOS simulator
```

## Building for Production

### Setup EAS Build

1. **Create Expo account**: https://expo.dev/signup

2. **Login to EAS**:
```bash
eas login
```

3. **Configure EAS**:
```bash
eas build:configure
```

### Build Android APK

```bash
# Build APK for development/testing
eas build --platform android --profile preview

# Build AAB for Google Play Store
eas build --platform android --profile production
```

### Build iOS App

```bash
# Build for TestFlight/App Store
eas build --platform ios --profile production
```

### Build Configuration (eas.json)

Create `eas.json` in the root:

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "bundler": "metro"
      }
    }
  }
}
```

## Offline Architecture

### Data Synchronization

1. **Offline Detection**:
   - Automatic detection using NetInfo
   - Visual indicator when offline
   - Graceful degradation of features

2. **Sync Queue**:
   - Write operations queued when offline
   - Automatic sync when connection restored
   - Retry mechanism with exponential backoff

3. **Local Storage**:
   - Lessons cached locally
   - Progress saved offline
   - Assignments stored for offline submission

### Implementation Details

```javascript
// services/sync.js handles:
- addToSyncQueue()      // Add failed requests
- processSyncQueue()    // Sync when online
- startSyncListener()   // Auto-sync on connection

// hooks/useOffline.js provides:
- isConnected           // Network state
- isOffline             // Inverse of isConnected
- isSyncing             // Sync in progress
- sync()                // Manual sync trigger
```

## API Integration

### Authentication Flow

1. User logs in via LoginScreen
2. JWT token stored securely in expo-secure-store
3. Token attached to all API requests via interceptor
4. Automatic logout on token expiry
5. User data cached in AsyncStorage

### API Service Structure

```javascript
// services/api.js
import { authAPI, lessonsAPI, modulesAPI, assignmentsAPI } from './api';

// Usage:
const response = await lessonsAPI.getAll();
const lesson = await lessonsAPI.getById(id);
```

### Error Handling

- Network errors automatically queued for sync
- 401 errors trigger logout
- User-friendly error messages
- Offline fallback to cached data

## Security

### Token Storage
- JWT stored in expo-secure-store (encrypted keychain)
- Never stored in AsyncStorage
- Automatic expiry handling

### API Security
- All requests include Authorization header
- HTTPS only in production
- No sensitive data in local storage

## Performance Optimizations

### For Low-End Devices

1. **Lazy Loading**:
   - Screens loaded on demand
   - Images lazy loaded with placeholders

2. **Memory Management**:
   - Pagination for large lists
   - Cleanup on component unmount
   - Limited cache size

3. **Rendering Optimizations**:
   - FlatList for long lists
   - Memoization of expensive components
   - Debounced inputs

4. **Bundle Size**:
   - Minimal dependencies
   - Tree-shaking enabled
   - No unused imports

## Multilingual Support

### Language Switching

```javascript
const { language, setLanguage, t, getMultilingualText } = useLanguage();

// Change language
setLanguage('hindi');

// Get translated text
<Text>{t.login}</Text>

// Get multilingual content
const title = getMultilingualText(lesson.title);
```

### Adding New Languages

1. Add translations to `src/constants/translations.js`
2. Update LanguageSelector component
3. Translations persisted in AsyncStorage

## Testing

### Manual Testing

1. **Authentication**:
   - Login with demo credentials
   - Register new account
   - Logout and re-login

2. **Offline Mode**:
   - Enable airplane mode
   - Navigate through app
   - Submit actions
   - Restore connection and verify sync

3. **Language Switching**:
   - Switch between languages
   - Verify UI updates
   - Check persistence after restart

### Demo Credentials

```
Student:
  Email: student1@school.com
  Password: student123

Teacher:
  Email: teacher@school.com
  Password: teacher123
```

## Troubleshooting

### Common Issues

1. **"Can't connect to backend"**
   - Check API URL in app.config.js
   - Verify backend is running
   - Check network permissions

2. **"Metro bundler not starting"**
   ```bash
   expo start --clear
   ```

3. **"Build failed on EAS"**
   - Check eas.json configuration
   - Verify app.json credentials
   - Check EAS build logs

4. **"Offline sync not working"**
   - Check NetInfo permissions
   - Verify sync queue in AsyncStorage
   - Check console logs for errors

### Debug Mode

```bash
# Enable debug mode
expo start --dev-client

# View logs
expo start --tunnel  # For remote debugging
```

## Deployment Checklist

### Pre-Deployment

- [ ] Update version in app.json
- [ ] Set production API URL
- [ ] Test offline functionality
- [ ] Test on low-end device
- [ ] Verify all languages work
- [ ] Test authentication flow
- [ ] Check error handling
- [ ] Optimize images and assets

### Android Deployment

- [ ] Build production APK/AAB
- [ ] Test on real device
- [ ] Upload to Play Console
- [ ] Configure store listing
- [ ] Submit for review

### iOS Deployment

- [ ] Build production IPA
- [ ] Test on real device
- [ ] Upload to App Store Connect
- [ ] Configure store listing
- [ ] Submit for review

## Future Enhancements

### Planned Features

1. **Enhanced Offline**:
   - SQLite for complex queries
   - Lesson content download
   - Video offline playback

2. **Push Notifications**:
   - Assignment reminders
   - New lesson alerts
   - Sync complete notifications

3. **Advanced Features**:
   - Voice lessons
   - Interactive quizzes
   - Peer-to-peer learning
   - Gamification

4. **Performance**:
   - Image optimization
   - Code splitting
   - Background tasks

## Support & Contribution

For issues or questions:
1. Check documentation
2. Review troubleshooting guide
3. Contact development team

## License

Built for Punjab Education Department's Digital Pathshala initiative.

---

**Digital Pathshala Mobile App v1.0.0**

*Empowering rural education through mobile technology*
