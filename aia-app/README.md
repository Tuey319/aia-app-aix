# AIA+ Mobile App

A high-fidelity React Native + Expo implementation of the AIA+ insurance app redesign, focused on **Premium Management** — helping users understand, manage, and keep paying their premiums.

## Quick Start

### Prerequisites
- Node.js 18+
- [Expo Go](https://expo.dev/go) installed on your phone (iOS or Android)
- Or an Android/iOS simulator/emulator

### Run on your phone (Expo Go)

```bash
cd aia-app
npm install          # already done if you cloned this
npx expo start
```

Scan the QR code that appears in the terminal with:
- **iOS**: Camera app → scan → tap the banner
- **Android**: Expo Go app → scan QR

### Run on a simulator

```bash
npx expo start --ios        # macOS only
npx expo start --android    # requires Android Studio + emulator
npx expo start --web        # browser preview (limited native features)
```

> **Note on fonts**: The app loads Plus Jakarta Sans, Anuphan, and IBM Plex Mono from Google Fonts on first launch — there may be a brief loading screen on cold start.

---

## Project Structure

```
aia-app/
├── App.tsx                      # Entry point — loads fonts, wraps in SafeAreaProvider
├── src/
│   ├── tokens/                  # Design system
│   │   ├── colors.ts            # Full AIA palette (primary #D31145, semantic colors)
│   │   ├── typography.ts        # Font families + size scale
│   │   ├── spacing.ts           # Padding, gap, radius constants
│   │   └── shadows.ts           # Platform-specific card/button shadows
│   │
│   ├── store/
│   │   └── index.ts             # Zustand store (auth, policy, language, billing freq)
│   │
│   ├── components/              # Shared components
│   │   ├── Card.tsx             # White card with shadow
│   │   ├── PrimaryButton.tsx    # Red primary / outline / ghost variants
│   │   ├── StatusPill.tsx       # Semantic colored pills (amber/success/risk/info/mono)
│   │   ├── ListRow.tsx          # Icon + title + subtitle + chevron row
│   │   ├── SectionGroup.tsx     # Labelled white card group with dividers
│   │   ├── BarChart.tsx         # Simple vertical bar chart (View-based)
│   │   ├── CoverageRing.tsx     # Per-category coverage progress ring
│   │   ├── ScreenLayout.tsx     # Scrollable screen wrapper with safe-area padding
│   │   └── Text.tsx             # Typography component with Thai/Latin font switching
│   │
│   ├── navigation/
│   │   ├── types.ts             # All TypeScript param list types
│   │   ├── RootNavigator.tsx    # Login ↔ Main switch
│   │   ├── TabNavigator.tsx     # 5-tab bottom bar (Home, Policy, Vitality, Benefits, Account)
│   │   ├── HomeStack.tsx        # Home + Premium Management + Payment flow + Celebration + System
│   │   ├── PolicyStack.tsx      # Policy + docs + coverage + Vitality
│   │   ├── ClaimsStack.tsx      # e-claims flow (start → details → docs → OTP → review → submitting → success/declined)
│   │   └── AccountStack.tsx     # Account + Support + FAQ
│   │
│   └── screens/
│       ├── LoginScreen.tsx
│       ├── HomeScreen.tsx
│       ├── PlaceholderScreen.tsx
│       ├── premium/             # Premium Management hub + all tools
│       ├── payment/             # Payment flow (select → coverage → review → method → card/QR → success)
│       ├── policy/              # Policy, docs, coverage, Vitality
│       ├── claims/              # e-claims flow
│       ├── celebration/         # AI Celebration ecosystem (milestones, badges, gratitude, sharing)
│       ├── benefits/            # Benefits tab
│       ├── assistant/           # AI chat assistant
│       ├── account/             # Account settings + profile
│       ├── support/             # Support, FAQ, change freq, contact
│       ├── notifications/       # Notification center
│       └── system/              # Empty states, loading, error, offline screens
```

---

## Screens (69 implemented)

| Section | Screens |
|---|---|
| Auth | Login |
| Home | Home · AllServices |
| Premium Management | PremiumMgmt · Affordability · Value · Illustration · AdjustPlan · Costs · CoverageOverview · LifestyleCheck · Recommend · History |
| Payment | PaySelect · PayCoverage · PayReview · PayMethod · PayCard · PayQr · PaySuccess · PayChecking · PayProcessing |
| Policy | Policy · AllPolicies · PolicyDetail · PolicyDocs · CoverageDetail · Vitality · PremiumPaymentInfo |
| Claims | ClaimStart · ClaimDetails · ClaimDocs · ClaimOtp · ClaimReview · ClaimSubmitting · ClaimSuccess · ClaimHistory · ClaimDeclined |
| AI Celebration | Celebration · CelebrationDetail · AICelebrationHub · BadgeCollection · ProtectionJourney · GratitudeLetter · RewardPrivilege · SharePride |
| Benefits | Benefits |
| AI Assistant | Assistant |
| Account | Account · ProfileEdit |
| Support | Support · FaqList · FaqSearch · FaqAnswer · ChangeFreq · FreqConfirm · FreqOtp · FreqSubmitting · FreqSuccess · ContactAgent |
| Notifications | Notifications |
| Empty States | EmptyClaims · EmptyHistory · EmptyPolicies |
| System | PayFailed · SearchLoading · GenericError · Offline · SessionTimeout |

---

## Tech Stack

| Package | Version | Purpose |
|---|---|---|
| expo | ^54.0 | Managed workflow |
| react-native | 0.81.5 | Core framework |
| @react-navigation/native | ^7.3 | Navigation container |
| @react-navigation/native-stack | ^7.17 | Stack navigator |
| @react-navigation/bottom-tabs | ^7.18 | Tab bar |
| react-native-screens | ~4.16 | Native screen optimization |
| react-native-safe-area-context | ~5.6 | Safe area insets |
| expo-font | ~14.0 | Font loading |
| @expo-google-fonts/* | ^0.4 | Plus Jakarta Sans, Anuphan, IBM Plex Mono |
| @expo/vector-icons | ^15.0 | MaterialIcons (flat red, no chips) |
| expo-linear-gradient | ~15.0 | Hero card gradients |
| expo-image | ~3.0 | Partner/benefit logo rendering |
| react-native-svg | 15.12 | Available for richer charts (BarChart is still View-based) |
| @react-native-community/slider | 5.0 | AdjustPlan coverage slider |
| zustand | ^5 | Lightweight global state |

---

## Design Tokens

All tokens are in `src/tokens/`. Key values:

```ts
primary:    '#D31145'   // AIA red — buttons, active tab, all icons
primaryDeep:'#9E0E34'   // Gradient end, pressed states
screenBg:   '#F4F4F6'   // Page background
card:       '#FFFFFF'   // Card surface
ink:        '#16161C'   // Headings / dark hero text
success:    '#1B9E5A'   // Paid, safe, approved
amber:      '#E8821A'   // Due dates, caution
```

**Icon rule**: All icons are flat `#D31145` with **no colored background chip**. Only semantic pills (due-date amber, paid green, risk red) and status circles keep their colors.

---

## Mock Data

All data is hardcoded in `src/store/index.ts`. Policy defaults:

```
Policy: AIA Health Happy
Sum assured: ฿2,000,000
Monthly premium: ฿4,250
Annual premium: ฿51,000
Due date: 25 มิ.ย.
Income: ฿38,000/month
```

Replace with real API calls at the 🔌 markers in each screen.

---

## Known Gaps (from design spec)

- **Real API**: All 🔌 endpoints (auth, policy data, payment processing, illustration engine, claims submission) need wiring to AIA's backend services.
- **Ad banners**: Home carousel uses placeholder gradient cards. Replace with remote images from AIA's campaign CMS.
- **AIA Marketplace**: The coverage upsell deep-link opens a placeholder — wire to AIA Marketplace URL.
- **Bar charts**: Using View-based bars. `react-native-svg` is installed if richer charts are needed.
