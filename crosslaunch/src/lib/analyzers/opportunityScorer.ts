import type { PresenceSignals } from './marketPresence'
import type { Market } from '../supabase/types'

export interface OpportunityScore {
  overall: number
  breakdown: {
    marketGap: number
    marketSize: number
    marketReadiness: number
    competitionLevel: number
  }
  reasoning: string[]
  competitionLevel: 'none' | 'low' | 'medium' | 'high'
  marketSize: 'small' | 'medium' | 'large'
  recommendation: string
}

export interface BusinessModel {
  name: string
  keywords: string[]
  category: string
  businessType: 'B2C' | 'B2B' | 'B2B2C'
  technicalComplexity: 'low' | 'medium' | 'high'
  regulatoryComplexity: 'low' | 'medium' | 'high'
}

export class OpportunityScorer {
  calculateOpportunityScore(
    presenceSignals: PresenceSignals,
    market: Market,
    businessModel: BusinessModel
  ): OpportunityScore {
    const breakdown = {
      marketGap: this.calculateMarketGap(presenceSignals),
      marketSize: this.calculateMarketSize(market, businessModel),
      marketReadiness: this.calculateMarketReadiness(market, businessModel),
      competitionLevel: this.calculateCompetitionScore(presenceSignals)
    }

    const overall = this.calculateOverallScore(breakdown)
    const reasoning = this.generateReasoning(breakdown, presenceSignals, market, businessModel)
    const competitionLevel = this.getCompetitionLevel(presenceSignals)
    const marketSize = this.getMarketSizeCategory(market)
    const recommendation = this.generateRecommendation(overall, breakdown)

    return {
      overall,
      breakdown,
      reasoning,
      competitionLevel,
      marketSize,
      recommendation
    }
  }

  private calculateMarketGap(presenceSignals: PresenceSignals): number {
    // Higher score = bigger gap (less presence = more opportunity)
    const presenceScore = (
      presenceSignals.github.activityScore +
      presenceSignals.news.coverageScore +
      presenceSignals.trends.interestScore
    ) / 3

    // Invert the presence score to get gap score
    return Math.max(0, 10 - presenceScore)
  }

  private calculateMarketSize(market: Market, businessModel: BusinessModel): number {
    let score = 0

    // Population factor (40% weight)
    const population = market.population || 0
    if (population > 200_000_000) score += 4
    else if (population > 100_000_000) score += 3
    else if (population > 50_000_000) score += 2
    else score += 1

    // Internet penetration factor (30% weight)
    const internetPenetration = market.internet_penetration || 0
    score += (internetPenetration / 100) * 3

    // GDP per capita factor (20% weight)
    const gdpPerCapita = market.gdp_per_capita || 0
    if (gdpPerCapita > 8000) score += 2
    else if (gdpPerCapita > 4000) score += 1.5
    else if (gdpPerCapita > 2000) score += 1
    else score += 0.5

    // Business model fit factor (10% weight)
    if (businessModel.businessType === 'B2C' && internetPenetration > 60) {
      score += 1
    } else if (businessModel.businessType === 'B2B' && gdpPerCapita > 5000) {
      score += 1
    }

    return Math.min(score, 10)
  }

  private calculateMarketReadiness(market: Market, businessModel: BusinessModel): number {
    let score = 0

    // Internet penetration readiness
    const internetPenetration = market.internet_penetration || 0
    score += (internetPenetration / 100) * 4

    // Economic readiness
    const gdpPerCapita = market.gdp_per_capita || 0
    if (gdpPerCapita > 5000) score += 3
    else if (gdpPerCapita > 2500) score += 2
    else score += 1

    // Technical complexity penalty
    if (businessModel.technicalComplexity === 'high') score -= 1
    else if (businessModel.technicalComplexity === 'medium') score -= 0.5

    // Regulatory complexity penalty
    if (businessModel.regulatoryComplexity === 'high') score -= 1.5
    else if (businessModel.regulatoryComplexity === 'medium') score -= 0.5

    // Language barrier (assume English proficiency correlates with market readiness)
    const hasEnglish = market.languages?.includes('English') || false
    if (hasEnglish) score += 1

    // App store availability
    const hasAppStores = market.app_stores?.length || 0
    if (hasAppStores >= 2) score += 1

    return Math.max(0, Math.min(score, 10))
  }

  private calculateCompetitionScore(presenceSignals: PresenceSignals): number {
    // This is used in the breakdown, higher = more competition (worse for opportunity)
    const presenceScore = (
      presenceSignals.github.activityScore +
      presenceSignals.news.coverageScore +
      presenceSignals.trends.interestScore
    ) / 3

    return presenceScore
  }

  private calculateOverallScore(breakdown: OpportunityScore['breakdown']): number {
    // Weighted average of factors
    const weights = {
      marketGap: 0.35,      // Most important - is there actually a gap?
      marketSize: 0.25,     // How big is the opportunity?
      marketReadiness: 0.25, // Can we execute here?
      competitionLevel: 0.15 // How hard will it be? (inverted)
    }

    const competitionPenalty = 10 - breakdown.competitionLevel // Invert competition

    const score = (
      breakdown.marketGap * weights.marketGap +
      breakdown.marketSize * weights.marketSize +
      breakdown.marketReadiness * weights.marketReadiness +
      competitionPenalty * weights.competitionLevel
    )

    return Math.round(score * 10) / 10
  }

  private generateReasoning(
    breakdown: OpportunityScore['breakdown'],
    presenceSignals: PresenceSignals,
    market: Market,
    businessModel: BusinessModel
  ): string[] {
    const reasoning: string[] = []

    // Market gap reasoning
    if (breakdown.marketGap >= 7) {
      reasoning.push('Minimal existing competition detected')
    } else if (breakdown.marketGap >= 4) {
      reasoning.push('Limited market presence found')
    } else {
      reasoning.push('Established players present in market')
    }

    // Market size reasoning
    const population = market.population || 0
    if (population > 200_000_000) {
      reasoning.push(`Large addressable market (${(population / 1_000_000).toFixed(0)}M population)`)
    }

    // Internet readiness
    const internetPenetration = market.internet_penetration || 0
    if (internetPenetration >= 70) {
      reasoning.push('High internet adoption supports digital business models')
    } else if (internetPenetration >= 50) {
      reasoning.push('Growing internet adoption creates emerging opportunities')
    }

    // Economic factors
    const gdpPerCapita = market.gdp_per_capita || 0
    if (gdpPerCapita > 5000) {
      reasoning.push('Strong purchasing power in target market')
    } else if (gdpPerCapita > 2000) {
      reasoning.push('Emerging middle class with growing spending power')
    }

    // Technical complexity
    if (businessModel.technicalComplexity === 'low') {
      reasoning.push('Low technical barriers to entry')
    } else if (businessModel.technicalComplexity === 'high') {
      reasoning.push('High technical complexity may limit competitors')
    }

    // Strong signals
    if (presenceSignals.overall.strongSignals.length > 0) {
      reasoning.push(`Market shows interest: ${presenceSignals.overall.strongSignals[0].toLowerCase()}`)
    }

    return reasoning
  }

  private getCompetitionLevel(presenceSignals: PresenceSignals): 'none' | 'low' | 'medium' | 'high' {
    return presenceSignals.overall.presenceLevel
  }

  private getMarketSizeCategory(market: Market): 'small' | 'medium' | 'large' {
    const population = market.population || 0
    if (population > 200_000_000) return 'large'
    if (population > 50_000_000) return 'medium'
    return 'small'
  }

  private generateRecommendation(overall: number, breakdown: OpportunityScore['breakdown']): string {
    if (overall >= 8) {
      return 'Excellent opportunity - high market gap with favorable conditions'
    } else if (overall >= 6.5) {
      return 'Strong opportunity - good market potential with manageable competition'
    } else if (overall >= 5) {
      return 'Moderate opportunity - consider market entry strategy carefully'
    } else if (overall >= 3) {
      return 'Limited opportunity - significant challenges or competition present'
    } else {
      return 'Poor opportunity - high competition or unfavorable market conditions'
    }
  }
}