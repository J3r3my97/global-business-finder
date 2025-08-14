const NEWS_API_BASE = 'https://newsapi.org/v2'

export interface NewsAPIResponse {
  status: string
  totalResults: number
  articles: Array<{
    source: {
      id: string | null
      name: string
    }
    author: string | null
    title: string
    description: string | null
    url: string
    urlToImage: string | null
    publishedAt: string
    content: string | null
  }>
}

export interface MediaCoverageMetrics {
  articleCount: number
  recentMentions: number
  sourceDiversity: number
  coverageScore: number
  topSources: string[]
}

export class NewsAPI {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async checkMediaCoverage(
    country: string, 
    keywords: string[]
  ): Promise<MediaCoverageMetrics> {
    try {
      const searchQueries = keywords.map(keyword => 
        `${keyword} ${this.getCountrySearchTerm(country)}`
      )

      const results = await Promise.all(
        searchQueries.map(query => this.searchNews(query, country))
      )

      const allArticles = results.flatMap(result => result.articles)
      const uniqueArticles = Array.from(
        new Map(allArticles.map(article => [article.url, article])).values()
      )

      const recentArticles = uniqueArticles.filter(article => {
        const publishedAt = new Date(article.publishedAt)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        return publishedAt > thirtyDaysAgo
      })

      const sources = [...new Set(
        uniqueArticles.map(article => article.source.name)
      )]

      const coverageScore = this.calculateCoverageScore({
        articleCount: uniqueArticles.length,
        recentMentions: recentArticles.length,
        sourceDiversity: sources.length
      })

      return {
        articleCount: uniqueArticles.length,
        recentMentions: recentArticles.length,
        sourceDiversity: sources.length,
        coverageScore,
        topSources: sources.slice(0, 5)
      }
    } catch (error) {
      console.error('News API error:', error)
      return {
        articleCount: 0,
        recentMentions: 0,
        sourceDiversity: 0,
        coverageScore: 0,
        topSources: []
      }
    }
  }

  private async searchNews(query: string, country: string): Promise<NewsAPIResponse> {
    const countryCode = country.toLowerCase()
    const url = `${NEWS_API_BASE}/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=100&apiKey=${this.apiKey}`
    
    const response = await fetch(url)

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('News API rate limit exceeded')
      }
      throw new Error(`News API error: ${response.status}`)
    }

    return response.json()
  }

  private getCountrySearchTerm(countryCode: string): string {
    const countryTerms: Record<string, string> = {
      'BR': 'Brazil OR Brasil',
      'IN': 'India',
      'NG': 'Nigeria',
      'ID': 'Indonesia',
      'MX': 'Mexico OR México'
    }
    
    return countryTerms[countryCode] || countryCode
  }

  private calculateCoverageScore(metrics: {
    articleCount: number
    recentMentions: number
    sourceDiversity: number
  }): number {
    let score = 0

    // Base score from article count
    if (metrics.articleCount > 0) score += Math.min(metrics.articleCount * 0.3, 4)
    
    // Recent activity bonus
    if (metrics.recentMentions > 0) score += Math.min(metrics.recentMentions * 0.5, 3)
    
    // Source diversity bonus
    if (metrics.sourceDiversity > 1) score += Math.min(metrics.sourceDiversity * 0.4, 3)

    return Math.min(Math.round(score * 10) / 10, 10)
  }
}