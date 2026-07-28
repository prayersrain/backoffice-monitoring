# 📈 Backoffice Monitoring (PWA)

An enterprise-grade Progressive Web App (PWA) built for real-time back-office monitoring and analytics. Designed to streamline operations, track logistics, manage staff performance, and deliver high-speed data insights across all devices.

## ✨ Key Features
- **Progressive Web App (PWA)**: Fully installable on iOS, Android, and Desktop with native-like performance.
- **Offline Reliability**: Built-in caching mechanisms ensuring seamless operation in low-network areas.
- **Real-time Analytics Dashboard**: Visualize revenue, profits, and staff performance dynamically.
- **Robust Inventory & Logistics**: High-speed, search-based input system for warehouse and branch management.
- **Role-Based Access Control**: Secure routing and middleware for different administrative levels (Owner vs Staff).

## 💻 Tech Stack
- **Framework**: Next.js (App Router), React
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **PWA Configuration**: `next-pwa`
- **Database / BaaS**: Supabase (PostgreSQL, Auth, Realtime)
- **Data Visualization**: Recharts

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase Project (for Authentication & Database)

### 1. Clone & Install
```bash
git clone https://github.com/prayersrain/backoffice-monitoring.git
cd backoffice-monitoring
npm install
```

### 2. Environment Variables
Copy the example environment file and add your Supabase credentials:
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` to view the application.

## 📝 License
This project is part of a professional portfolio showcasing full-stack engineering and PWA development capabilities.