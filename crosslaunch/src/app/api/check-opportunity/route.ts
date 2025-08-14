import { NextRequest, NextResponse } from 'next/server'
import { MarketPresenceAnalyzer } from '@/lib/analyzers/marketPresence'
import { OpportunityScorer } from '@/lib/analyzers/opportunityScorer'
import { BusinessModelAnalyzer } from '@/lib/analyzers/businessModel'
import { supabase } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { startupUrl, businessType, targetMarkets } = body

    if (!startupUrl && !businessType) {
      return NextResponse.json(
        { error: 'Either startupUrl or businessType is required' },
        { status: 400 }
      )
    }

    // Default target markets if not provided
    const markets = targetMarkets || ['BR', 'IN', 'NG', 'ID', 'MX']

    // Step 1: Identify/classify the business model
    const businessModel = BusinessModelAnalyzer.identifyBusinessModel({
      name: businessType,
      url: startupUrl,
      description: businessType
    })

    const keywords = BusinessModelAnalyzer.getBusinessModelKeywords(businessModel)

    // Step 2: Get market data from database
    const { data: marketData, error: marketError } = await supabase
      .from('markets')
      .select('*')
      .in('country_code', markets)

    if (marketError) {
      console.error('Database error:', marketError)
      return NextResponse.json(
        { error: 'Failed to fetch market data' },
        { status: 500 }
      )
    }

    // Step 3: Analyze each market
    const analyzer = new MarketPresenceAnalyzer({
      githubToken: process.env.GITHUB_TOKEN,
      newsApiKey: process.env.NEWS_API_KEY
    })

    const scorer = new OpportunityScorer()

    const opportunities = await Promise.all(
      marketData.map(async (market) => {
        try {
          // Check market presence
          const presenceSignals = await analyzer.analyzeMarketPresence(
            keywords,
            market.country_code
          )

          // Calculate opportunity score
          const opportunityScore = scorer.calculateOpportunityScore(
            presenceSignals,
            market,
            businessModel
          )

          return {
            country: market.country_name,
            countryCode: market.country_code,
            score: opportunityScore.overall,
            competitionLevel: opportunityScore.competitionLevel,
            marketSize: market.population,
            presenceSignals,
            opportunityScore,
            quickInsights: opportunityScore.reasoning.slice(0, 3)
          }
        } catch (error) {
          console.error(`Error analyzing market ${market.country_code}:`, error)
          
          // Return minimal data on error
          return {
            country: market.country_name,
            countryCode: market.country_code,
            score: 0,
            competitionLevel: 'high' as const,
            marketSize: market.population,
            presenceSignals: null,
            opportunityScore: null,
            quickInsights: ['Analysis failed - please try again']
          }
        }
      })
    )

    // Sort by opportunity score
    opportunities.sort((a, b) => b.score - a.score)

    // Store search in database
    try {
      await supabase
        .from('user_searches')
        .insert({
          search_query: businessType,
          startup_url: startupUrl,
          results: { opportunities, businessModel }
        })
    } catch (dbError) {
      console.error('Failed to store search:', dbError)
      // Don't fail the request if we can't store the search
    }

    return NextResponse.json({
      businessModel,
      opportunities,
      analysisTime: new Date().toISOString()
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}