import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, TrendingUp, Globe, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Globe className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">CrossLaunch</span>
          </div>
          <Button variant="outline">Sign In</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Find Proven Business Models
          <br />
          <span className="text-blue-600">Missing in Your Market</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Discover successful startups from other countries that haven't launched in yours yet. 
          Turn global innovation into local opportunity.
        </p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Enter a startup URL or business type (e.g., 'buy now pay later')" 
                className="pl-10 h-12 text-lg"
              />
            </div>
            <Button size="lg" className="h-12 px-8">
              Find Opportunities
            </Button>
          </div>
        </div>

        {/* How It Works */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Track Global Startups</h3>
            <p className="text-gray-600">We monitor successful businesses worldwide across multiple data sources</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Check Market Presence</h3>
            <p className="text-gray-600">Analyze if similar businesses exist in your target markets</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Score Opportunities</h3>
            <p className="text-gray-600">Get opportunity scores based on market size and readiness</p>
          </div>
        </div>
      </section>

      {/* Featured Opportunities */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Today's Top Opportunities</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              company: "Buy Now Pay Later",
              description: "Installment payment solutions like Affirm",
              market: "Brazil",
              score: 8.5,
              competition: "Low",
              marketSize: "215M population"
            },
            {
              company: "Commission-free Trading",
              description: "Zero-fee stock trading platforms like Robinhood",
              market: "India",
              score: 7.8,
              competition: "Medium",
              marketSize: "1.4B population"
            },
            {
              company: "Gamified Learning",
              description: "Language learning apps like Duolingo",
              market: "Indonesia",
              score: 8.2,
              competition: "Low",
              marketSize: "273M population"
            }
          ].map((opportunity, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{opportunity.company}</CardTitle>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {opportunity.score}/10
                  </Badge>
                </div>
                <CardDescription>{opportunity.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Target Market:</span>
                    <span className="text-sm font-medium">{opportunity.market}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Competition:</span>
                    <Badge variant={opportunity.competition === 'Low' ? 'default' : 'secondary'}>
                      {opportunity.competition}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Market Size:</span>
                    <span className="text-sm font-medium">{opportunity.marketSize}</span>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Next Opportunity?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join entrepreneurs worldwide who are using CrossLaunch to discover untapped markets
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
            Start Free Analysis
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Globe className="h-6 w-6" />
                <span className="text-lg font-bold">CrossLaunch</span>
              </div>
              <p className="text-gray-400">
                Discover global business opportunities in your local market.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Opportunity Finder</li>
                <li>Market Analysis</li>
                <li>Competition Reports</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Markets</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Brazil</li>
                <li>India</li>
                <li>Nigeria</li>
                <li>Indonesia</li>
                <li>Mexico</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About</li>
                <li>Contact</li>
                <li>Privacy</li>
                <li>Terms</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CrossLaunch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
