const GITHUB_API_BASE = 'https://api.github.com'

export interface GitHubSearchResult {
  total_count: number
  items: Array<{
    id: number
    name: string
    full_name: string
    description: string | null
    created_at: string
    updated_at: string
    stargazers_count: number
    language: string | null
    owner: {
      login: string
      location: string | null
    }
  }>
}

export interface DeveloperActivityMetrics {
  repoCount: number
  totalStars: number
  recentRepos: number
  languages: string[]
  activityScore: number
}

export class GitHubAPI {
  private token?: string

  constructor(token?: string) {
    this.token = token
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'CrossLaunch-MVP'
    }
    
    if (this.token) {
      headers['Authorization'] = `token ${this.token}`
    }
    
    return headers
  }

  async checkDeveloperActivity(
    country: string, 
    keywords: string[]
  ): Promise<DeveloperActivityMetrics> {
    try {
      const searchQueries = keywords.map(keyword => 
        `location:${country} ${keyword} in:name,description`
      )

      const results = await Promise.all(
        searchQueries.map(query => this.searchRepositories(query))
      )

      const allRepos = results.flatMap(result => result.items)
      const uniqueRepos = Array.from(
        new Map(allRepos.map(repo => [repo.id, repo])).values()
      )

      const recentRepos = uniqueRepos.filter(repo => {
        const createdAt = new Date(repo.created_at)
        const oneYearAgo = new Date()
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
        return createdAt > oneYearAgo
      })

      const languages = [...new Set(
        uniqueRepos
          .map(repo => repo.language)
          .filter(lang => lang !== null)
      )] as string[]

      const totalStars = uniqueRepos.reduce(
        (sum, repo) => sum + repo.stargazers_count, 
        0
      )

      const activityScore = this.calculateActivityScore({
        repoCount: uniqueRepos.length,
        recentRepos: recentRepos.length,
        totalStars,
        hasActiveRepos: recentRepos.length > 0
      })

      return {
        repoCount: uniqueRepos.length,
        totalStars,
        recentRepos: recentRepos.length,
        languages,
        activityScore
      }
    } catch (error) {
      console.error('GitHub API error:', error)
      return {
        repoCount: 0,
        totalStars: 0,
        recentRepos: 0,
        languages: [],
        activityScore: 0
      }
    }
  }

  private async searchRepositories(query: string): Promise<GitHubSearchResult> {
    const url = `${GITHUB_API_BASE}/search/repositories?q=${encodeURIComponent(query)}&sort=updated&per_page=100`
    
    const response = await fetch(url, {
      headers: this.getHeaders()
    })

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('GitHub API rate limit exceeded')
      }
      throw new Error(`GitHub API error: ${response.status}`)
    }

    return response.json()
  }

  private calculateActivityScore(metrics: {
    repoCount: number
    recentRepos: number
    totalStars: number
    hasActiveRepos: boolean
  }): number {
    let score = 0

    // Base score from repository count
    if (metrics.repoCount > 0) score += Math.min(metrics.repoCount * 0.5, 3)
    
    // Recent activity bonus
    if (metrics.recentRepos > 0) score += Math.min(metrics.recentRepos * 0.8, 4)
    
    // Star quality bonus
    if (metrics.totalStars > 10) score += Math.min(metrics.totalStars * 0.01, 2)
    
    // Active development bonus
    if (metrics.hasActiveRepos) score += 1

    return Math.min(Math.round(score * 10) / 10, 10)
  }
}