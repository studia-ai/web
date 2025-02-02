import { ArrowRight } from "lucide-react";

export default function UnderTheHood() {
  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl ring-1 ring-gray-200/50 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Under the Hood
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            How Your AI Agent Works
          </p>
        </div>

        {/* Tool Image */}
        <div className="p-6 flex justify-center">
          <img 
            src="/tool.png" 
            alt="AI Tool Architecture" 
            className="rounded-lg shadow-md mb-6" 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Architecture Overview */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Core Architecture
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                This AI agent is powered by IBM watsonx.ai, a state-of-the-art foundation model platform. 
                It uses advanced LLMs combined with specialized tools to provide intelligent responses and perform actions.
              </p>
            </div>
          </div>

          {/* Available Tools */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Available Tools
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-600">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                </div>
                <span>Web Search & Information Retrieval</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-600">
                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-indigo-500" />
                </div>
                <span>Code Analysis & Generation</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-600">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                </div>
                <span>Data Processing & Analysis</span>
              </li>
            </ul>
          </div>

          {/* Model Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              AI Models
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ArrowRight className="w-4 h-4 text-purple-500" />
                <span>IBM watsonx.ai Foundation Models</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ArrowRight className="w-4 h-4 text-purple-500" />
                <span>Specialized Task-Specific Models</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ArrowRight className="w-4 h-4 text-purple-500" />
                <span>Custom-Trained Assistants</span>
              </div>
            </div>
          </div>

          {/* Capabilities */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Key Capabilities
            </h3>
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4">
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                  Natural language understanding & generation
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                  Real-time tool execution & response streaming
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  Context-aware conversation management
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                  Multi-step task completion
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Features */}
      <div className="bg-gradient-to-br from-purple-50/50 to-indigo-50/50 backdrop-blur-md rounded-2xl ring-1 ring-purple-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-purple-100/50">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-600 rounded-full">
              Coming Soon
            </span>
            <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Solana Blockchain Integration
            </h2>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Advanced blockchain capabilities powered by your AI assistant
          </p>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Wallet Operations */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              Wallet Operations
            </h3>
            <ul className="space-y-3 text-sm text-gray-600 ml-4">
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-purple-400" />
                Smart fund transfers between wallets
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-purple-400" />
                Automated transaction scheduling
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-purple-400" />
                Multi-signature support
              </li>
            </ul>
          </div>

          {/* Token Analysis */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              Token Analysis
            </h3>
            <ul className="space-y-3 text-sm text-gray-600 ml-4">
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-indigo-400" />
                Real-time token metrics tracking
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-indigo-400" />
                Historical performance analysis
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-indigo-400" />
                Market trend predictions
              </li>
            </ul>
          </div>

          {/* Smart Contract Integration */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              Smart Contract Integration
            </h3>
            <ul className="space-y-3 text-sm text-gray-600 ml-4">
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-blue-400" />
                Contract address lookup & verification
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-blue-400" />
                Automated contract interactions
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-blue-400" />
                Security analysis & auditing
              </li>
            </ul>
          </div>

          {/* Portfolio Management */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-teal-500"></div>
              Portfolio Management
            </h3>
            <ul className="space-y-3 text-sm text-gray-600 ml-4">
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-teal-400" />
                Automated portfolio rebalancing
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-teal-400" />
                Risk assessment & monitoring
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-teal-400" />
                Performance optimization suggestions
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 