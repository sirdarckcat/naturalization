# Privacy & Consent Mode Implementation

## Overview

This document describes the privacy compliance measures implemented for the Grundkenntnistest Zürich application to meet Swiss Data Protection Act (FADP/DSG) and GDPR requirements.

## Switzerland Privacy Requirements

### Legal Framework

Switzerland has its own data protection laws:
- **Federal Act on Data Protection (FADP/DSG)**: Switzerland's primary data protection law
- **GDPR Compliance**: Although Switzerland is not in the EU, GDPR principles are followed for best practices
- **ePrivacy Directive**: Requires informed consent for non-essential cookies

### Key Requirements for Switzerland

1. **Explicit Consent**: Users must give informed consent before analytics cookies are set
2. **Cookie Information**: Clear information about what cookies are used and why
3. **Opt-out Option**: Users must be able to refuse non-essential cookies
4. **Data Minimization**: Collect only necessary data (IP anonymization required)
5. **Transparency**: Clear privacy information in the local language (German)

## Implementation Details

### Google Consent Mode V2

Implemented according to Google's requirements for European markets:

**Default Consent State** (before user choice):
```javascript
gtag('consent', 'default', {
  'analytics_storage': 'denied',       // Analytics cookies denied by default
  'ad_storage': 'denied',             // Ad cookies denied (not used)
  'ad_user_data': 'denied',           // Ad user data denied (not used)
  'ad_personalization': 'denied',     // Ad personalization denied (not used)
  'functionality_storage': 'granted', // Required for app functionality
  'personalization_storage': 'denied',// Personalization denied by default
  'security_storage': 'granted',      // Required for security
  'wait_for_update': 500              // Wait 500ms for consent update
});
```

**After User Accepts Analytics**:
```javascript
gtag('consent', 'update', {
  'analytics_storage': 'granted',
  'personalization_storage': 'granted'
});
```

### Cookie Consent Banner

**Features**:
- Displayed on first visit (no prior consent)
- Multilingual support (German primary, English available)
- Three options:
  1. "Alle akzeptieren" (Accept All) - Grants analytics consent
  2. "Nur notwendige" (Only Necessary) - Denies analytics consent
  3. "Einstellungen anpassen" (Adjust Settings) - Detailed view

**Detailed Settings View**:
- Shows two cookie categories:
  1. **Necessary Cookies**: Always active (progress tracking, preferences)
  2. **Analytics Cookies**: Optional (Google Analytics 4 with IP anonymization)
- Toggle switch for analytics cookies
- Information about Google Analytics with IP anonymization
- Reference to Swiss Data Protection Law compliance

### Consent Storage

- **Storage Method**: localStorage
- **Storage Key**: `cookie-consent`
- **Data Format**: JSON
  ```json
  {
    "analytics": true/false,
    "timestamp": "2025-12-22T09:07:07.696Z"
  }
  ```
- **Persistence**: Survives page reloads and browser sessions
- **Scope**: Per-domain

### Google Analytics Configuration

**Privacy Features Enabled**:
- IP Anonymization: `anonymize_ip: true`
- Cookie Flags: `SameSite=None;Secure`
- No PII (Personally Identifiable Information) collected
- Question text truncated to 100 characters
- No user IDs or email tracking

**Data Collection** (when consent granted):
- Page views
- Custom events (quiz interactions, flashcard usage)
- Session duration
- Device type and browser information
- Geographic location (country/city level only, with anonymized IP)

## User Experience Flow

### First Visit (No Consent)
1. Page loads with consent mode set to 'denied'
2. Cookie banner appears at bottom of screen
3. User sees clear explanation in German
4. User can choose to accept, reject, or customize

### Consent Given (Accept)
1. User clicks "Alle akzeptieren"
2. Consent mode updated to 'granted' for analytics
3. Preference saved to localStorage
4. Banner disappears
5. Google Analytics begins tracking

### Consent Denied (Reject)
1. User clicks "Nur notwendige"
2. Consent mode remains 'denied' for analytics
3. Preference saved to localStorage with `analytics: false`
4. Banner disappears
5. Only necessary cookies (functionality, security) are active

### Return Visit
1. App checks localStorage for previous consent
2. If consent exists, applies it immediately (no banner)
3. If consent is granted, updates consent mode before GA loads
4. Banner does not appear again

## Testing & Verification

### Manual Testing Checklist

- [x] Cookie banner appears on first visit
- [x] Banner text is in German (primary audience)
- [x] "Alle akzeptieren" grants analytics consent
- [x] "Nur notwendige" denies analytics consent
- [x] Consent is stored in localStorage
- [x] Banner does not appear on return visits
- [x] Google Analytics respects consent mode
- [x] IP anonymization is active

### Browser Console Testing

Check consent mode status:
```javascript
// Check stored consent
localStorage.getItem('cookie-consent')

// Check dataLayer for consent updates
dataLayer.filter(item => item[0] === 'consent')

// Verify gtag is available
typeof gtag === 'function'
```

### Google Analytics DebugView

1. Install Google Analytics Debugger extension
2. Enable debug mode
3. Accept cookies in the app
4. Verify events are being sent in GA4 DebugView

## Compliance Checklist

- [x] **Consent before tracking**: No analytics data sent until consent granted
- [x] **Clear information**: Users informed about cookie usage in German
- [x] **Easy opt-out**: "Nur notwendige" button prominently displayed
- [x] **IP anonymization**: All IP addresses anonymized
- [x] **No PII**: No personally identifiable information collected
- [x] **Consent storage**: User preferences persisted across sessions
- [x] **Consent Mode V2**: Implemented according to Google's guidelines
- [x] **Local language**: All text in German (Switzerland's primary language)
- [x] **Data minimization**: Only essential and analytics cookies used
- [x] **Transparency**: Clear explanation of data processing

## Maintenance

### Updating Consent Text

Cookie banner text is located in:
- `/app/src/ConsentBanner.jsx`

To update:
1. Edit the German text in the component
2. Consider adding English translations for international users
3. Keep explanations clear and concise

### Adding New Cookie Categories

If new cookies are needed:
1. Add category to consent banner UI
2. Update consent mode default settings
3. Update `updateConsent()` function in ConsentBanner.jsx
4. Update documentation

### Testing After Changes

After any consent-related changes:
1. Clear localStorage: `localStorage.clear()`
2. Reload page to see banner
3. Test all three consent options
4. Verify localStorage storage
5. Check dataLayer in console
6. Verify GA4 DebugView

## References

- [Google Consent Mode V2](https://developers.google.com/tag-platform/security/guides/consent)
- [Swiss Federal Act on Data Protection (FADP)](https://www.fedlex.admin.ch/eli/cc/2022/491/en)
- [GDPR](https://gdpr.eu/)
- [ePrivacy Directive](https://ec.europa.eu/digital-single-market/en/eprivacy-directive)

## Support

For questions about privacy compliance:
- Review this documentation
- Check ANALYTICS.md for tracking details
- Review code in `/app/src/ConsentBanner.jsx`
- Test in browser with DevTools console
