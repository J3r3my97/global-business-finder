export interface TrendsMetrics {
  searchVolume: number
  interest: number
  trendDirection: 'up' | 'down' | 'stable'
  interestScore: number
}

export class TrendsAPI {
  async checkSearchInterest(
    keywords: string[], 
    country: string
  ): Promise<TrendsMetrics> {
    try {
      // Note: This is a placeholder implementation
      // In a real implementation, you might use:
      // - pytrends (Python library) via a microservice
      // - SerpAPI Google Trends API (paid)
      // - Custom scraping solution (against ToS)
      
      // For MVP, we'll simulate trends data based on keyword characteristics
      const simulatedMetrics = this.simulateTrendsData(keywords, country)
      
      return simulatedMetrics
    } catch (error) {
      console.error('Trends API error:', error)
      return {
        searchVolume: 0,
        interest: 0,
        trendDirection: 'stable',
        interestScore: 0
      }
    }
  }

  private simulateTrendsData(keywords: string[], country: string): TrendsMetrics {
    // Simulate search interest based on keyword characteristics
    let baseInterest = 0
    
    // Popular business model keywords get higher base interest
    const popularKeywords = [
      'food delivery', 'video call', 'language learning', 
      'stock trading', 'design', 'productivity'
    ]
    
    const hasPopularKeyword = keywords.some(keyword => 
      popularKeywords.some(popular => 
        keyword.toLowerCase().includes(popular.toLowerCase())
      )
    )
    
    if (hasPopularKeyword) {
      baseInterest += 30
    }
    
    // Country-specific adjustments
    const countryMultipliers: Record<string, number> = {
      'BR': 1.2, // High mobile adoption
      'IN': 1.4, // Growing digital economy
      'NG': 1.1, // Emerging market
      'ID': 1.3, // Large internet population
      'MX': 1.0  // Baseline
    }
    
    const multiplier = countryMultipliers[country] || 1.0
    baseInterest *= multiplier
    
    // Add some randomness to simulate real trends
    const randomFactor = 0.7 + (Math.random() * 0.6) // 0.7 to 1.3
    baseInterest *= randomFactor
    
    const interest = Math.min(Math.round(baseInterest), 100)
    const searchVolume = interest * 100 // Simulated volume
    
    // Determine trend direction based on business model maturity
    let trendDirection: 'up' | 'down' | 'stable' = 'stable'
    if (interest > 60) trendDirection = 'up'
    else if (interest < 20) trendDirection = 'down'
    
    const interestScore = this.calculateInterestScore({
      interest,
      trendDirection,
      hasPopularKeyword
    })
    
    return {
      searchVolume,
      interest,
      trendDirection,
      interestScore
    }
  }

  private calculateInterestScore(metrics: {
    interest: number
    trendDirection: 'up' | 'down' | 'stable'
    hasPopularKeyword: boolean
  }): number {
    let score = 0
    
    // Base score from interest level
    score += (metrics.interest / 100) * 5
    
    // Trend direction bonus/penalty
    if (metrics.trendDirection === 'up') score += 2
    else if (metrics.trendDirection === 'down') score -= 1
    
    // Popular keyword bonus
    if (metrics.hasPopularKeyword) score += 1
    
    return Math.min(Math.round(score * 10) / 10, 10)
  }
}