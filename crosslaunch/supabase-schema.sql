-- CrossLaunch MVP Database Schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
  country_code VARCHAR(2) UNIQUE NOT NULL,
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
CREATE INDEX idx_startups_keywords ON startups USING gin(keywords);
CREATE INDEX idx_markets_country_code ON markets(country_code);

-- Initial data: Target markets for MVP
INSERT INTO markets (country_code, country_name, population, internet_penetration, gdp_per_capita, languages, primary_search_engine, app_stores) VALUES
('BR', 'Brazil', 215000000, 81.0, 8897.0, ARRAY['Portuguese'], 'Google', ARRAY['Google Play', 'App Store']),
('IN', 'India', 1400000000, 52.0, 2256.0, ARRAY['Hindi', 'English'], 'Google', ARRAY['Google Play', 'App Store']),
('NG', 'Nigeria', 218000000, 55.0, 2432.0, ARRAY['English', 'Hausa', 'Yoruba', 'Igbo'], 'Google', ARRAY['Google Play', 'App Store']),
('ID', 'Indonesia', 273000000, 77.0, 4256.0, ARRAY['Indonesian'], 'Google', ARRAY['Google Play', 'App Store']),
('MX', 'Mexico', 128000000, 75.0, 9926.0, ARRAY['Spanish'], 'Google', ARRAY['Google Play', 'App Store']);

-- Initial data: 20 proven successful startups to start
INSERT INTO startups (name, url, description, business_model, category, keywords, founded_year, headquarters_country, is_successful, success_indicators) VALUES
('Affirm', 'https://affirm.com', 'Buy now, pay later financing platform', 'BNPL', 'Fintech', ARRAY['buy now pay later', 'installment', 'financing'], 2012, 'US', true, '{"funding": "1B+", "users": "10M+", "revenue_range": "100M+"}'),
('DoorDash', 'https://doordash.com', 'Food delivery marketplace', 'Food Delivery', 'Marketplace', ARRAY['food delivery', 'restaurant', 'delivery'], 2013, 'US', true, '{"funding": "3B+", "users": "25M+", "revenue_range": "1B+"}'),
('Robinhood', 'https://robinhood.com', 'Commission-free stock trading app', 'Commission-free Trading', 'Fintech', ARRAY['stock trading', 'investing', 'commission-free'], 2013, 'US', true, '{"funding": "5B+", "users": "20M+", "revenue_range": "500M+"}'),
('Duolingo', 'https://duolingo.com', 'Gamified language learning platform', 'Gamified Learning', 'Education', ARRAY['language learning', 'education', 'gamification'], 2011, 'US', true, '{"funding": "200M+", "users": "500M+", "revenue_range": "400M+"}'),
('Canva', 'https://canva.com', 'Online graphic design platform', 'Design Tool', 'SaaS', ARRAY['graphic design', 'templates', 'design'], 2013, 'AU', true, '{"funding": "500M+", "users": "100M+", "revenue_range": "1B+"}'),
('Notion', 'https://notion.so', 'All-in-one workspace for notes and collaboration', 'All-in-one Workspace', 'Productivity', ARRAY['notes', 'productivity', 'collaboration', 'workspace'], 2016, 'US', true, '{"funding": "300M+", "users": "30M+", "revenue_range": "100M+"}'),
('Discord', 'https://discord.com', 'Community chat platform', 'Community Platform', 'Communication', ARRAY['chat', 'community', 'gaming', 'voice'], 2015, 'US', true, '{"funding": "1B+", "users": "150M+", "revenue_range": "100M+"}'),
('Calendly', 'https://calendly.com', 'Online scheduling tool', 'Scheduling', 'SaaS', ARRAY['calendar', 'booking', 'scheduling', 'appointments'], 2013, 'US', true, '{"funding": "350M+", "users": "10M+", "revenue_range": "100M+"}'),
('Zoom', 'https://zoom.us', 'Video conferencing platform', 'Video Conferencing', 'Communication', ARRAY['video call', 'meeting', 'conferencing'], 2011, 'US', true, '{"funding": "100M+", "users": "300M+", "revenue_range": "4B+"}'),
('Substack', 'https://substack.com', 'Newsletter publishing platform', 'Newsletter Platform', 'Publishing', ARRAY['newsletter', 'publishing', 'subscription'], 2017, 'US', true, '{"funding": "200M+", "users": "1M+", "revenue_range": "100M+"}');