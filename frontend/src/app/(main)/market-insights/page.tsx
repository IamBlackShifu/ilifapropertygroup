export default function MarketInsightsPage() {
  return (
    <div className="bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Market Insights & Analytics</h1>
          <p className="text-xl text-primary-100">
            Data-driven insights on Zimbabwe's property and construction markets
          </p>
        </div>
      </section>

      {/* Key Metrics Dashboard */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Average Build Cost', value: '$62,500', change: '+5.2%', trend: 'up' },
            { label: 'Average Land Price', value: '$28,000', change: '+3.8%', trend: 'up' },
            { label: 'Projects Started (Q1)', value: '1,247', change: '+12%', trend: 'up' },
            { label: 'Diaspora Buyers', value: '38%', change: '+7%', trend: 'up' },
          ].map((metric) => (
            <div key={metric.label} className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 mb-2">{metric.label}</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{metric.value}</p>
              <span className={`text-sm font-medium ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {metric.trend === 'up' ? '↑' : '↓'} {metric.change} vs last quarter
              </span>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Price Trends Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Land Prices by Suburb</h3>
            <div className="h-80 bg-gray-100 rounded flex items-center justify-center">
              <p className="text-gray-500">Chart: Land Price Trends</p>
            </div>
          </div>

          {/* Build Costs Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Average Build Costs (per m²)</h3>
            <div className="h-80 bg-gray-100 rounded flex items-center justify-center">
              <p className="text-gray-500">Chart: Build Cost Breakdown</p>
            </div>
          </div>
        </div>

        {/* Popular Suburbs */}
        <div className="bg-white rounded-lg shadow p-6 mb-12">
          <h3 className="text-xl font-semibold mb-6">Top 10 Suburbs by Demand</h3>
          <div className="space-y-4">
            {[
              { suburb: 'Borrowdale', demand: 95, avgPrice: '$45,000', projects: 87 },
              { suburb: 'Mt Pleasant', demand: 88, avgPrice: '$38,000', projects: 72 },
              { suburb: 'Glen Lorne', demand: 82, avgPrice: '$55,000', projects: 54 },
              { suburb: 'Avondale', demand: 78, avgPrice: '$35,000', projects: 68 },
              { suburb: 'Greendale', demand: 75, avgPrice: '$32,000', projects: 61 },
            ].map((item) => (
              <div key={item.suburb} className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{item.suburb}</span>
                    <div className="text-sm text-gray-600 space-x-4">
                      <span>Avg: {item.avgPrice}</span>
                      <span>{item.projects} projects</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${item.demand}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Material Price Index */}
        <div className="bg-white rounded-lg shadow p-6 mb-12">
          <h3 className="text-xl font-semibold mb-6">Material Price Index</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { material: 'Cement (50kg)', price: '$12.50', change: '+2.1%' },
              { material: 'Bricks (1000)', price: '$180', change: '+1.5%' },
              { material: 'Steel (per ton)', price: '$850', change: '+4.2%' },
              { material: 'Roof Sheets (per sheet)', price: '$15', change: '+3.0%' },
              { material: 'Tiles (per m²)', price: '$25', change: '+1.8%' },
              { material: 'Paint (20L)', price: '$45', change: '+2.5%' },
            ].map((item) => (
              <div key={item.material} className="p-4 border border-gray-200 rounded-lg">
                <p className="font-medium mb-2">{item.material}</p>
                <p className="text-2xl font-bold text-primary-600 mb-1">{item.price}</p>
                <span className="text-sm text-green-600">{item.change} this month</span>
              </div>
            ))}
          </div>
        </div>

        {/* Diaspora vs Local Buyers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Buyer Demographics</h3>
            <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
              <p className="text-gray-500">Chart: Diaspora vs Local Buyers</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Average Budget Range</h3>
            <div className="space-y-4">
              {[
                { range: 'Under $30,000', percentage: 15 },
                { range: '$30,000 - $50,000', percentage: 28 },
                { range: '$50,000 - $100,000', percentage: 35 },
                { range: '$100,000 - $200,000', percentage: 18 },
                { range: 'Over $200,000', percentage: 4 },
              ].map((item) => (
                <div key={item.range}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">{item.range}</span>
                    <span className="text-sm text-gray-600">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${item.percentage * 2.5}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reports CTA */}
      <section className="bg-primary-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Download Quarterly Market Report</h2>
          <p className="text-xl text-primary-100 mb-8">
            Get detailed insights and analysis delivered to your inbox
          </p>
          <button className="px-8 py-3 bg-white text-primary-600 font-semibold rounded-md hover:bg-primary-50">
            Download Report (PDF)
          </button>
        </div>
      </section>
    </div>
  )
}
