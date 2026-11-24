# Shortlist AI — Lightweight ATS Resume Builder SaaS & Android App

> **Production-ready, deterministic ATS resume builder with zero-hallucination job description matching, instant vector PDF export, offline PWA capabilities, and an ultra-lean 4.58 MB native Android APK.**

---

## 🌟 Overview & Key Principles

Shortlist AI is built for students, freshers, career switchers, and professionals who need high-impact, ATS-optimized resumes tailored to specific job descriptions without subscriptions, paid AI API keys, or hallucinated claims.

### Core Architectural Guarantees:
1. **Strict Zero-Hallucination Policy**: Unlike LLM wrapper apps that invent fake metrics or skills, Shortlist AI uses a deterministic rule-based NLP ontology. It strictly matches, ranks, and prioritizes qualifications that **actually exist** in your Master Profile.
2. **Transparent 100-Point ATS Diagnostic Checker**: Breaks down resume health into 4 transparent categories (Contact Completeness, Standard Structure, Keyword Alignment, and Quantified Action Verbs) with clear educational disclaimers.
3. **100% Selectable Vector PDFs**: Dual export system featuring native vector browser printing (0 kB bloat, perfect ATS machine-readability) and on-demand programmatic jsPDF export.
4. **Featherweight Performance**:
   - Web Landing Payload: **~115 kB gzipped** (Budget: $\le$ 800 kB)
   - Android Native APK: **4.58 MB** (Budget: $\le$ 30 MB)
5. **Zero-Setup Local Demo Mode**: Try the full SaaS experience immediately offline in any browser without configuring databases or auth services.

---

## 🚀 Live Routes & Architecture

| Route | Page | Purpose |
| :--- | :--- | :--- |
| `/` | `LandingPage.tsx` | High-converting landing page with live interactive JD matching demo & ATS guide |
| `/login` | `LoginPage.tsx` | Supabase Cloud Login or 1-click Instant Local Demo Mode |
| `/signup` | `SignupPage.tsx` | Cloud account registration with automated profile initialization |
| `/dashboard` | `DashboardPage.tsx` | Profile completeness meter, quick actions, saved resume list, and deletion controls |
| `/profile` | `ProfilePage.tsx` | Master Profile Builder (Personal, Education, Skills, Work Experience, Projects, Certifications) |
| `/builder` / `/builder/:id` | `BuilderPage.tsx` | Real-time Resume Customizer, template switcher, section re-ordering & inline overrides |
| `/matcher` | `MatcherPage.tsx` | Rule-based Job Description analysis with real-time keyword matching & tailoring |
| `/ats-checker` | `AtsCheckerPage.tsx` | 100-Point ATS Diagnostic Engine with actionable high/medium/low priority recommendations |
| `/preview` | `PreviewPage.tsx` | Dedicated full-screen document preview with A4/US Letter toggle, zoom, and PDF export |
| `/settings` | `SettingsPage.tsx` | JSON export/backup, JSON restore, password recovery, cache clearing, and account controls |

---

## 🛠️ Tech Stack & Key Libraries

- **Frontend Core**: React 19, TypeScript, Vite 8, React Router 7
- **Styling**: Tailwind CSS v4 (Zero-runtime utility engine)
- **Icons**: Lucide React
- **PDF Generation**: Native Vector CSS `@media print` + lazy-loaded programmatic `jspdf`
- **Native Android Runtime**: Capacitor 8 (`@capacitor/core`, `@capacitor/android`, `@capacitor/app`, `@capacitor/filesystem`, `@capacitor/share`)
- **Backend & Database**: Supabase PostgreSQL with Row Level Security (RLS) + LocalStorage offline fallback
- **Linter & Test Runner**: Oxlint + Node.js 24 native TypeScript test runner (`--experimental-strip-types`)

---

## ⚡ Quick Start & Local Development

### 1. Prerequisites
- Node.js 20+ (Node.js 22 or 24 recommended)
- npm 10+

### 2. Installation
```bash
git clone https://github.com/your-username/shortlist-ai.git
cd shortlist-ai
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser. You can click **"Try Instant Demo (No signup required)"** on the Login page to test all features with mock data instantly.

### 4. Run Automated Test Suite & Linter
```bash
# Run all unit and integration test suites
npm test

# Run ultra-fast oxlint
npm run lint

# Production web build & bundle size calculation
npm run build
```

---

## 🗄️ Supabase Cloud Setup (Optional)

Shortlist AI runs completely offline in **Local Demo Mode** by default. To connect your own Supabase Cloud instance:

### Step 1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Note your **Project URL** and **anon public key** in *Project Settings > API*.

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update `.env` with your project credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 3: Run Database Migrations
1. Open your Supabase Dashboard and go to the **SQL Editor**.
2. Copy the entire contents of [`supabase/schema.sql`](file:///d:/ResumeFit/supabase/schema.sql) and execute it.
3. This creates:
   - Tables: `profiles`, `education`, `skills`, `experience`, `projects`, `certifications`, `resumes`
   - Strict Row Level Security (RLS) policies ensuring users can only read, insert, update, or delete their own data (`auth.uid() = user_id`)
   - Automatic user profile creation trigger (`handle_new_user()`) on sign up.

---

## 🌐 Web Deployment (Vercel / Netlify)

### Deploying to Vercel
Shortlist AI is pre-configured with a production [`vercel.json`](file:///d:/ResumeFit/vercel.json) supporting Single Page Application (SPA) routing, service worker cache busting, and security headers:

1. Push your repository to GitHub or GitLab.
2. Import the project in [Vercel](https://vercel.com).
3. Set Framework Preset to **Vite**.
4. Set Build Command to `npm run build` and Output Directory to `dist`.
5. (Optional) Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under Environment Variables.
6. Click **Deploy**.

---

## 📱 Android Application via Capacitor

Shortlist AI includes a production native Android project with hardware back-button navigation and native PDF share-sheet integration.

### Android Project Structure
- Native Android root: `android/`
- Application ID: `com.shortlistai.app`
- Main Activity: `android/app/src/main/java/com/shortlistai/app/MainActivity.java`
- App Colors: `android/app/src/main/res/values/colors.xml` (`#4F46E5`)

### 1. Sync Web Assets to Android
```bash
npm run android:sync
```

### 2. Open in Android Studio
```bash
npm run android:open
```
Or open the `android/` folder directly in Android Studio.

### 3. Build Debug APK via Command Line
```powershell
# Set JDK 17 or 21 and Android SDK environment variables
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:ANDROID_HOME = "C:\Users\<YourUser>\AppData\Local\Android\Sdk"
cd android
.\gradlew.bat assembleDebug
```
The output debug APK will be located at:
```
android/app/build/outputs/apk/debug/app-debug.apk (Size: 4.58 MB)
```

### 4. Build Signed Release APK for Google Play / Sideloading
1. Generate a keystore (if you don't already have one):
   ```bash
   keytool -genkey -v -keystore shortlistai-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias shortlistai
   ```
2. Configure signing in `android/app/build.gradle` or use Android Studio:
   - In Android Studio: *Build > Generate Signed Bundle / APK > APK*.
   - Select your keystore and choose release build variant.
3. Build the release APK via Gradle:
   ```bash
   cd android
   .\gradlew assembleRelease
   ```

---

## 📊 Performance, Bundle & APK Metrics

| Asset / Target | Measured Size | Performance Budget | Verdict |
| :--- | :--- | :--- | :--- |
| **Android Debug APK** | **4.58 MB** | $\le$ 30 MB | **PASSED** (~15% of budget) |
| **Initial Landing Web Bundle (Gzipped)** | **~115 kB** | $\le$ 800 kB | **PASSED** (~14% of budget) |
| - `index.html` | 0.69 kB | - | Minimal shell |
| - `index.css` | 9.69 kB | - | Tailwind v4 zero-overhead styles |
| - `index.js` (App Core) | 15.96 kB | - | Route definitions & layouts |
| - `vendor-react.js` | 89.60 kB | - | React 19 + React Router 7 |
| **Programmatic jsPDF Chunk (Gzipped)** | **228.10 kB** | On-demand chunk | 100% Lazy loaded on PDF export |
| **OxLint Speed** | **51 ms** (59 files) | 0 warnings, 0 errors | Ultra-clean codebase |
| **Automated Test Suites** | **6 Suites (100% Pass Rate)** | 100% pass | Full user journey audited |

---

## 🔒 Security & Data Privacy

- **Client-Side Secret Isolation**: No database service role keys or administrative secrets are present in client code. Only the public Supabase anon key is used.
- **Strict Row Level Security**: All PostgreSQL database queries pass through row-level policies checking `auth.uid() = user_id`.
- **Data Portability**: Users can export their entire Master Profile and all saved resumes as a JSON backup or restore a backup at any time from `/settings`.
- **Zero Third-Party Tracking**: No invasive behavioral analytics or third-party ad pixels.

---

## 📄 License

MIT License. Built with ❤️ for students and professionals worldwide.
