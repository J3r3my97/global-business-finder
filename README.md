Perfect! Let's create a clear, implementation-ready project spec for Claude Code. I'll structure this as a complete project brief that can be directly implemented.

## Project: CrossLaunch MVP - Global Business Opportunity Finder

### **Project Overview**
A web application that identifies successful business models in one country that don't exist in other markets, helping entrepreneurs find proven ideas to replicate globally.

### **Tech Stack**
- **Frontend**: Next.js 14 with App Router, Tailwind CSS, Shadcn/ui
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL + Auth)
- **APIs**: GitHub, Product Hunt, News API (free tier)
- **Deployment**: Vercel

### **Project Structure**
```
crosslaunch/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── dashboard/
│   │   └── page.tsx             # Main dashboard
│   ├── opportunities/
│   │   └── [id]/page.tsx        # Opportunity detail
│   ├── api/
│   │   ├── check-opportunity/route.ts
│   │   ├── analyze-startup/route.ts
│   │   └── webhook/
│   │       └── daily-scan/route.ts
├── components/
│   ├── ui/                     # Shadcn components
│   ├── OpportunityCard.tsx
│   ├── MarketPresenceIndicator.tsx
│   └── StartupAnalyzer.tsx
├── lib/
│   ├── apis/
│   │   ├── github.ts
│   │   ├── producthunt.ts
│   │   ├── newsapi.ts
│   │   └── trends.ts
│   ├── analyzers/
│   │   ├── marketPresence.ts
│   │   ├── businessModel.ts
│   │   └── opportunityScorer.ts
│   └── supabase/
│       ├── client.ts
│       └── types.ts
```

### **Database Schema (Supabase)**

```sql
-- Core tables for MVP
CREATE TABLE startups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  url VARCHAR(255),
  description TEXT,
  business_model VARCHAR(100),
  category VARCHAR(100),
  keywords TEXT[], -- Array of search keywords
  founded_year INTEGER,
  headquarters_country VARCHAR(2),
  is_successful BOOLEAN DEFAULT false,
  success_indicators JSONB, -- {funding, users, revenue_range}
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE markets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code VARCHAR(2) PRIMARY KEY,
  country_name VARCHAR(100),
  population BIGINT,
  internet_penetration DECIMAL(5,2),
  gdp_per_capita DECIMAL(10,2),
  languages TEXT[],
  primary_search_engine VARCHAR(50),
  app_stores TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id UUID REFERENCES startups(id),
  market_country_code VARCHAR(2) REFERENCES markets(country_code),
  opportunity_score DECIMAL(3,1), -- 0-10 scale
  presence_signals JSONB, -- All detection signals
  competitive_landscape JSONB,
  market_readiness JSONB,
  last_checked TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID, -- From Supabase Auth
  search_query TEXT,
  startup_url VARCHAR(255),
  results JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_opportunities_score ON opportunities(opportunity_score DESC);
CREATE INDEX idx_startups_model ON startups(business_model);
CREATE INDEX idx_opportunities_checked ON opportunities(last_checked);
```

### **Core Features for MVP**

#### **1. Landing Page**
```typescript
// Simple value prop with search bar
interface LandingPageFeatures {
  heroSection: {
    headline: "Find Proven Business Models Missing in Your Market";
    subheadline: "Discover successful startups from other countries that haven't launched in yours yet";
    searchBar: "Enter a startup URL or business type";
  };
  
  featuredOpportunities: {
    // Show 6 high-scoring opportunities
    // Updated daily from background job
  };
  
  howItWorks: [
    "1. We track successful startups globally",
    "2. Check if similar businesses exist in your market", 
    "3. Score opportunities based on market readiness"
  ];
}
```

#### **2. Opportunity Checker**
```typescript
interface OpportunityChecker {
  input: {
    startupUrl?: string;
    businessType?: string;
    targetMarkets: string[]; // Default: ["BR", "IN", "NG", "ID", "MX"]
  };
  
  process: {
    // Step 1: Identify/classify the business
    identifyBusiness: () => BusinessModel;
    
    // Step 2: Check presence in each market
    checkMarketPresence: () => PresenceSignals;
    
    // Step 3: Calculate opportunity score
    calculateScore: () => OpportunityScore;
  };
  
  output: {
    opportunities: Array<{
      country: string;
      score: number; // 0-10
      competitionLevel: "none" | "low" | "medium" | "high";
      marketSize: number;
      quickInsights: string[];
    }>;
  };
}
```

#### **3. Market Presence Detection (Using Free APIs)**
```typescript
interface MarketPresenceDetector {
  signals: {
    // GitHub API - Check developer activity
    developerActivity: {
      api: "GitHub Search API";
      query: `location:${country} ${keywords}`;
      metrics: ["repo_count", "recent_commits", "stars"];
    };
    
    // Product Hunt - Check for launches
    productLaunches: {
      api: "Product Hunt GraphQL";
      query: "Search products by keyword + filter by maker location";
      metrics: ["launch_count", "upvotes", "comments"];
    };
    
    // News API - Check media coverage
    mediaCoverage: {
      api: "NewsAPI.org free tier";
      query: `${keywords} ${country}`;
      metrics: ["article_count", "recent_mentions", "sentiment"];
    };
    
    // Google Trends (unofficial API)
    searchInterest: {
      api: "trends.google.com/trends/api";
      query: "Interest by region";
      metrics: ["search_volume", "trending_up/down"];
    };
  };
  
  // Combine signals into confidence score
  calculatePresence: () => {
    none: 0-2 signals detected;
    low: 3-4 weak signals;
    medium: 5-6 signals or 2 strong;
    high: 7+ signals or 3+ strong;
  };
}
```

#### **4. Dashboard Features**
```typescript
interface Dashboard {
  sections: {
    // Saved opportunities
    myOpportunities: Opportunity[];
    
    // Weekly trending opportunities
    trending: {
      source: "Background job runs weekly";
      display: "Top 10 opportunities by score change";
    };
    
    // Quick search
    quickCheck: {
      input: "Paste any startup URL";
      output: "Instant 5-market analysis";
    };
  };
}
```

### **API Integrations**

#### **GitHub API Integration**
```typescript
// lib/apis/github.ts
interface GitHubChecker {
  endpoint: "https://api.github.com/search";
  rateLimit: "60/hour unauthenticated, 5000/hour with token";
  
  checkDeveloperActivity: (country: string, keywords: string[]) => {
    // Search for repositories
    // Filter by location
    // Check recent activity
    // Return activity score
  };
}
```

#### **Product Hunt API**
```typescript
// lib/apis/producthunt.ts
interface ProductHuntChecker {
  endpoint: "https://api.producthunt.com/v2/api/graphql";
  auth: "OAuth2 token required";
  
  checkProductLaunches: (keywords: string[]) => {
    // Search recent launches
    // Check maker locations if available
    // Return launch metrics
  };
}
```

#### **News API Integration**
```typescript
// lib/apis/newsapi.ts
interface NewsAPIChecker {
  endpoint: "https://newsapi.org/v2";
  freeLimit: "100 requests/day";
  
  checkMediaCoverage: (country: string, keywords: string[]) => {
    // Search news articles
    // Filter by country
    // Analyze mention frequency
    // Return coverage score
  };
}
```

### **Background Jobs**

```typescript
// Runs daily via Vercel Cron or Supabase Edge Functions
interface BackgroundJobs {
  dailyScan: {
    schedule: "0 0 * * *"; // Midnight UTC
    tasks: [
      "Update trending startups from Product Hunt",
      "Refresh opportunity scores for saved items",
      "Check for new successful startups"
    ];
  };
  
  weeklyAnalysis: {
    schedule: "0 0 * * 0"; // Sunday midnight
    tasks: [
      "Deep scan of top 50 startups",
      "Update market readiness scores",
      "Generate opportunity report"
    ];
  };
}
```

### **Initial Data Seed**

```typescript
// 20 proven successful startups to start
const initialStartups = [
  { name: "Affirm", model: "BNPL", keywords: ["buy now pay later", "installment"] },
  { name: "DoorDash", model: "Food Delivery", keywords: ["food delivery", "restaurant"] },
  { name: "Robinhood", model: "Commission-free Trading", keywords: ["stock trading", "investing"] },
  { name: "Duolingo", model: "Gamified Learning", keywords: ["language learning", "education"] },
  { name: "Canva", model: "Design Tool", keywords: ["graphic design", "templates"] },
  { name: "Notion", model: "All-in-one Workspace", keywords: ["notes", "productivity"] },
  { name: "Discord", model: "Community Platform", keywords: ["chat", "community", "gaming"] },
  { name: "Calendly", model: "Scheduling", keywords: ["calendar", "booking", "scheduling"] },
  { name: "Zoom", model: "Video Conferencing", keywords: ["video call", "meeting"] },
  { name: "Substack", model: "Newsletter Platform", keywords: ["newsletter", "publishing"] }
];

// 5 target markets for MVP
const targetMarkets = [
  { code: "BR", name: "Brazil", population: 215000000, internetPenetration: 81 },
  { code: "IN", name: "India", population: 1400000000, internetPenetration: 52 },
  { code: "NG", name: "Nigeria", population: 218000000, internetPenetration: 55 },
  { code: "ID", name: "Indonesia", population: 273000000, internetPenetration: 77 },
  { code: "MX", name: "Mexico", population: 128000000, internetPenetration: 75 }
];
```

### **Environment Variables**

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# API Keys (all free tier)
GITHUB_TOKEN=your_github_token # Optional, increases rate limit
PRODUCT_HUNT_TOKEN=your_ph_token
NEWS_API_KEY=your_newsapi_key

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **MVP User Flow**

1. **Landing Page** → User enters startup URL or selects from featured
2. **Analysis** → System identifies business model and keywords
3. **Market Check** → APIs check presence in 5 target markets
4. **Results** → Show opportunity scores with explanations
5. **Save** → User can create account to save opportunities
6. **Monitor** → Saved opportunities update weekly

### **Success Metrics**

- 100 opportunity checks in first week
- 20 registered users in first month
- 5 markets analyzed per startup
- <30 second analysis time
- 3 paying customers for detailed reports

### **Future Enhancements (Post-MVP)**

1. Chrome extension for one-click checking
2. Paid API integrations (Crunchbase, etc.)
3. Email alerts for new opportunities
4. Detailed market entry reports
5. API access for developers

### **Implementation Notes for Claude Code**

1. Start with Next.js app creation using `create-next-app`
2. Set up Supabase project and run migrations
3. Install shadcn/ui components as needed
4. Implement API integrations one by one
5. Create simple UI first, enhance gradually
6. Use Vercel for deployment (seamless with Next.js)
7. Rate limit API calls to stay within free tiers
8. Cache API responses aggressively (24-hour cache minimum)

This spec is ready for Claude Code to implement. The MVP focuses on proven, free data sources and can be built in 1-2 weeks by a solo developer. The architecture is simple but scalable, allowing for future enhancements without major refactoring.