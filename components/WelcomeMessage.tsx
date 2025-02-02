export default function WelcomeMessage() {
  return (
    <div className="flex flex-col items-center justify-center h-full mt-6 md:mt-10 px-3 md:px-0">
      <div className="bg-white/80 backdrop-blur-md rounded-xl md:rounded-2xl ring-1 ring-gray-200/50 shadow-sm overflow-hidden w-full max-w-2xl">
        <div className="p-4 md:p-6 border-b border-gray-100">
          <h2 className="text-lg md:text-xl font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome to Studia.ai Agent! ✨
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your AI-powered assistant for research and blockchain development
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Core Capabilities */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              Current Capabilities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "Research Tools",
                  description: "YouTube transcripts, Wikipedia, and Google Books search",
                },
                {
                  title: "Exchange Data",
                  description: "Real-time market data and trading information",
                },
                {
                  title: "Math Processing",
                  description: "Complex calculations and mathematical analysis",
                },
                {
                  title: "Data Analysis",
                  description: "Advanced data processing and transformation",
                },
              ].map((item) => (
                <div key={item.title} className="space-y-1">
                  <div className="font-medium text-gray-900">{item.title}</div>
                  <div className="text-sm text-gray-600">{item.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Coming Soon */}
          <div className="bg-gradient-to-br from-purple-50/50 to-indigo-50/50 rounded-xl p-4">
            <div className="font-medium text-gray-900 mb-2">🚀 Coming Soon: Solana Integration</div>
            <div className="text-sm text-gray-600 leading-relaxed">
              Soon you'll be able to interact with Solana's blockchain, analyze smart contracts, 
              and manage transactions - all through natural conversation!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
