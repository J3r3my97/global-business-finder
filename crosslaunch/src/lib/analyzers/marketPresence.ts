import { GitHubAPI, type DeveloperActivityMetrics } from '../apis/github'
import { NewsAPI, type MediaCoverageMetrics } from '../apis/newsapi'
import { TrendsAPI, type TrendsMetrics } from '../apis/trends'

export interface PresenceSignals {
  github: DeveloperActivityMetrics
  news: MediaCoverageMetrics
  trends: TrendsMetrics
  overall: {
    presenceLevel: 'none' | 'low' | 'medium' | 'high'
    confidence: number
    signalCount: number
    strongSignals: string[]
  }
}

export interface MarketPresenceConfig {
  githubToken?: string
  newsApiKey?: string
}

export class MarketPresenceAnalyzer {
  private githubAPI: GitHubAPI
  private newsAPI: NewsAPI
  private trendsAPI: TrendsAPI

  constructor(config: MarketPresenceConfig) {
    this.githubAPI = new GitHubAPI(config.githubToken)
    this.newsAPI = new NewsAPI(config.newsApiKey || '')
    this.trendsAPI = new TrendsAPI()
  }

  async analyzeMarketPresence(
    keywords: string[],
    country: string
  ): Promise<PresenceSignals> {
    try {
      const [github, news, trends] = await Promise.all([
        this.githubAPI.checkDeveloperActivity(country, keywords),
        this.newsAPI.checkMediaCoverage(country, keywords),
        this.trendsAPI.checkSearchInterest(keywords, country)
      ])

      const overall = this.calculateOverallPresence({
        github,
        news,
        trends
      })

      return {
        github,
        news,
        trends,
        overall
      }
    } catch (error) {
      console.error('Market presence analysis error:', error)
      
      // Return minimal presence data on error
      return {
        github: {
          repoCount: 0,
          totalStars: 0,
          recentRepos: 0,
          languages: [],
          activityScore: 0
        },
        news: {
          articleCount: 0,
          recentMentions: 0,
          sourceDiversity: 0,
          coverageScore: 0,
          topSources: []
        },
        trends: {
          searchVolume: 0,
          interest: 0,
          trendDirection: 'stable',
          interestScore: 0
        },
        overall: {
          presenceLevel: 'none',
          confidence: 0,
          signalCount: 0,
          strongSignals: []
        }
      }
    }
  }

  private calculateOverallPresence(signals: {
    github: DeveloperActivityMetrics
    news: MediaCoverageMetrics
    trends: TrendsMetrics
  }): PresenceSignals['overall'] {
    const scores = [
      signals.github.activityScore,
      signals.news.coverageScore,
      signals.trends.interestScore
    ]

    const strongSignals: string[] = []
    let signalCount = 0

    // Evaluate GitHub signals
    if (signals.github.activityScore >= 5) {
      strongSignals.push('Active developer community')
      signalCount++
    } else if (signals.github.activityScore >= 2) {
      signalCount++
    }

    // Evaluate news signals
    if (signals.news.coverageScore >= 5) {
      strongSignals.push('Media coverage present')
      signalCount++
    } else if (signals.news.coverageScore >= 2) {
      signalCount++
    }

    // Evaluate trends signals
    if (signals.trends.interestScore >= 5) {
      strongSignals.push('High search interest')
      signalCount++
    } else if (signals.trends.interestScore >= 2) {
      signalCount++
    }

    // Additional signal detection
    if (signals.github.recentRepos > 5) {
      strongSignals.push('Recent development activity')
    }
    
    if (signals.news.recentMentions > 10) {
      strongSignals.push('Recent media mentions')
    }

    if (signals.trends.trendDirection === 'up') {
      strongSignals.push('Growing search interest')
    }

    // Calculate overall presence level
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length
    const strongSignalCount = strongSignals.length

    let presenceLevel: 'none' | 'low' | 'medium' | 'high'
    let confidence: number

    if (strongSignalCount >= 3 || averageScore >= 7) {
      presenceLevel = 'high'
      confidence = 0.9
    } else if (strongSignalCount >= 2 || averageScore >= 5) {
      presenceLevel = 'medium'
      confidence = 0.75
    } else if (signalCount >= 2 || averageScore >= 2) {
      presenceLevel = 'low'
      confidence = 0.6
    } else {
      presenceLevel = 'none'
      confidence = 0.4
    }

    return {
      presenceLevel,
      confidence: Math.round(confidence * 100) / 100,
      signalCount,
      strongSignals
    }
  }
}