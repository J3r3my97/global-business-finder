import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StartupAnalyzer } from "@/components/StartupAnalyzer"
import { TrendingUp, Search, Globe, Users, Zap } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const featuredOpportunities = [
    {
      company: "Buy Now Pay Later",
      description: "Installment payment solutions",
      market: "Brazil",
      countryCode: "BR",
      score: 8.5,
      competition: "Low",
      marketSize: "215M population",
      trend: "+15% interest"
    },
    {
      company: "Commission-free Trading",
      description: "Zero-fee stock trading platforms",
      market: "India", 
      countryCode: "IN",
      score: 7.8,
      competition: "Medium",
      marketSize: "1.4B population",
      trend: "+8% interest"
    },
    {
      company: "Gamified Learning",
      description: "Language learning applications",
      market: "Indonesia",
      countryCode: "ID", 
      score: 8.2,
      competition: "Low",
      marketSize: "273M population",
      trend: "+22% interest"
    }
  ]

  const quickStats = [
    { label: "Markets Analyzed", value: "5", icon: Globe },
    { label: "Opportunities Found", value: "127", icon: TrendingUp },
    { label: "Users Served", value: "1,234", icon: Users },
    { label: "Avg Analysis Time", value: "< 30s", icon: Zap }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Globe className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">CrossLaunch</span>
            <Badge variant="secondary">Dashboard</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Button variant="outline">Sign In</Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Opportunity Dashboard</h1>
          <p className="text-gray-600">
            Analyze global business opportunities and discover untapped markets
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <stat.icon className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Analyzer */}
          <div className="lg:col-span-2">
            <StartupAnalyzer />
          </div>

          {/* Right Column - Trending & Quick Links */}
          <div className="space-y-6">
            {/* Trending Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Trending This Week
                </CardTitle>
                <CardDescription>
                  High-scoring opportunities with growing interest
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {featuredOpportunities.map((opportunity, index) => (
                  <div key={index} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm">{opportunity.company}</h4>
                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                        {opportunity.score}/10
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{opportunity.description}</p>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">{opportunity.market}</span>
                      <span className="text-green-600 font-medium">{opportunity.trend}</span>
                    </div>
                    <Link href={`/opportunities/${opportunity.countryCode}?business=${encodeURIComponent(opportunity.company)}`}>
                      <Button variant="ghost" size="sm" className="w-full mt-2 h-8">
                        View Details
                      </Button>
                    </Link>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Quick Checks
                </CardTitle>
                <CardDescription>
                  Popular business models to analyze
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    'Food delivery marketplace',
                    'Video conferencing platform', 
                    'Online design tool',
                    'Scheduling software',
                    'Newsletter platform'
                  ].map((businessType, index) => (
                    <div key={index} className="p-2 hover:bg-gray-50 rounded cursor-pointer text-sm">
                      {businessType}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Market Coverage */}
            <Card>
              <CardHeader>
                <CardTitle>Market Coverage</CardTitle>
                <CardDescription>
                  Currently analyzing these markets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { code: 'BR', name: 'Brazil', population: '215M' },
                    { code: 'IN', name: 'India', population: '1.4B' },
                    { code: 'NG', name: 'Nigeria', population: '218M' },
                    { code: 'ID', name: 'Indonesia', population: '273M' },
                    { code: 'MX', name: 'Mexico', population: '128M' }
                  ].map((market, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-4 bg-blue-100 rounded text-xs flex items-center justify-center font-mono">
                          {market.code}
                        </div>
                        <span>{market.name}</span>
                      </div>
                      <span className="text-gray-500">{market.population}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}