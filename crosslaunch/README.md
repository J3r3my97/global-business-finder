# CrossLaunch MVP

A web application that identifies successful business models in one country that don't exist in other markets, helping entrepreneurs find proven ideas to replicate globally.

## 🚀 Features

- **Opportunity Analysis** - Analyze any startup or business model across 5 target markets
- **Market Presence Detection** - Check competition levels using GitHub, News, and search data
- **Opportunity Scoring** - Get 0-10 scores based on market gap, size, and readiness
- **Professional Dashboard** - Interactive interface with trending opportunities

## 🎯 Target Markets

- 🇧🇷 Brazil (215M population)
- 🇮🇳 India (1.4B population) 
- 🇳🇬 Nigeria (218M population)
- 🇮🇩 Indonesia (273M population)
- 🇲🇽 Mexico (128M population)

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- API keys (GitHub, News API)

### Installation

1. **Clone and install**
   ```bash
   git clone <repository-url>
   cd crosslaunch
   npm install
   ```

2. **Environment setup**
   ```bash
   cp .env.local.example .env.local
   ```
   Update with your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_KEY=your_service_key
   GITHUB_TOKEN=your_github_token
   NEWS_API_KEY=your_newsapi_key
   ```

3. **Database setup**
   - Go to your Supabase dashboard
   - Run the SQL from `supabase-schema.sql` in SQL Editor

4. **Start development**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### Landing Page
- Browse featured opportunities
- Quick search for analysis

### Dashboard (`/dashboard`)
- Enter startup URL (e.g., `affirm.com`)
- Or business type (e.g., `"food delivery"`)
- Get instant market analysis

### Example Analysis
Input: `"buy now pay later"` → Results:
- Brazil: 8.5/10 (Low competition, large market)
- India: 7.2/10 (Medium competition, huge population)
- Nigeria: 6.8/10 (Emerging market opportunity)

## 🏗️ Tech Stack

- **Framework**: Next.js 14, TypeScript
- **UI**: Tailwind CSS, Shadcn/ui, Lucide icons
- **Database**: Supabase (PostgreSQL)
- **APIs**: GitHub, News API, simulated Google Trends
- **Deployment**: Vercel-ready

## 📊 API Endpoints

### `POST /api/check-opportunity`
Analyze business opportunities across markets.

**Request:**
```json
{
  "startupUrl": "https://duolingo.com",
  // OR
  "businessType": "language learning"
}
```

**Response:**
```json
{
  "businessModel": { "name": "Gamified Learning", ... },
  "opportunities": [
    {
      "country": "Brazil",
      "score": 8.2,
      "competitionLevel": "low",
      "quickInsights": ["Minimal competition detected", ...]
    }
  ]
}
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Environment Variables
Set these in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`
- `GITHUB_TOKEN`
- `NEWS_API_KEY`

## 🧪 Development

### Project Structure
```
src/
├── app/                    # Next.js app router
│   ├── api/               # API endpoints
│   ├── dashboard/         # Dashboard page
│   └── page.tsx          # Landing page
├── components/            # React components
├── lib/
│   ├── analyzers/         # Business logic
│   ├── apis/             # External API integrations
│   └── supabase/         # Database client
```

### Key Components
- `StartupAnalyzer` - Main analysis interface
- `OpportunityCard` - Market opportunity display
- `MarketPresenceAnalyzer` - Multi-source presence detection
- `OpportunityScorer` - Scoring algorithm

## 📈 Performance

- Analysis time: < 30 seconds
- Parallel API calls for speed
- Graceful error handling
- Rate limit management

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.
