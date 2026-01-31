import React, { useState } from 'react'

interface UserData {
  email: string
  password: string
  apiKey: string
  apiProvider: string
  brandName: string
  brandDescription: string
  brandTone: string
  website: string
  twitter: string
  linkedin: string
  instagram: string
}

interface VPSPlan {
  id: string
  name: string
  originalPrice: number
  specs: {
    cpu: string
    ram: string
    storage: string
    bandwidth: string
  }
}

const vpsPlans: VPSPlan[] = [
  {
    id: 'starter',
    name: 'Moltbot Starter',
    originalPrice: 4.99,
    specs: { cpu: '1 vCPU', ram: '1 GB', storage: '20 GB SSD', bandwidth: '1 TB' }
  },
  {
    id: 'business',
    name: 'Moltbot Business',
    originalPrice: 9.99,
    specs: { cpu: '2 vCPU', ram: '2 GB', storage: '40 GB SSD', bandwidth: '2 TB' }
  },
  {
    id: 'professional',
    name: 'Moltbot Pro',
    originalPrice: 14.99,
    specs: { cpu: '4 vCPU', ram: '4 GB', storage: '80 GB SSD', bandwidth: '4 TB' }
  },
  {
    id: 'enterprise',
    name: 'Moltbot Enterprise',
    originalPrice: 29.99,
    specs: { cpu: '8 vCPU', ram: '8 GB', storage: '160 GB SSD', bandwidth: '8 TB' }
  }
]

function App() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isSignUp, setIsSignUp] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<VPSPlan | null>(null)
  const [negotiationActive, setNegotiationActive] = useState(false)
  const [negotiationMessages, setNegotiationMessages] = useState<Array<{ role: string; message: string }>>([])
  const [currentOffer, setCurrentOffer] = useState(0)
  const [userMessage, setUserMessage] = useState('')
  
  const [userData, setUserData] = useState<UserData>({
    email: '',
    password: '',
    apiKey: '',
    apiProvider: 'openai',
    brandName: '',
    brandDescription: '',
    brandTone: 'professional',
    website: '',
    twitter: '',
    linkedin: '',
    instagram: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setUserData(prev => ({ ...prev, [name]: value }))
  }

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault()
    if (userData.email && userData.password) {
      setIsLoggedIn(true)
      setCurrentStep(1)
    }
  }

  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1)
  }

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1)
  }

  const startNegotiation = (plan: VPSPlan) => {
    setSelectedPlan(plan)
    setCurrentOffer(plan.originalPrice * 5)
    setNegotiationActive(true)
    setNegotiationMessages([{
      role: 'moltbot',
      message: `Greetings, human negotiator! I am Moltbot-${plan.id.toUpperCase()}. You wish to acquire the ${plan.name} instance? My starting offer is $${(plan.originalPrice * 5).toFixed(2)}/month. This is a fair price for such magnificent computing power. What say you?`
    }])
  }

  const sendNegotiationMessage = () => {
    if (!userMessage.trim() || !selectedPlan) return
    
    const newMessages = [...negotiationMessages, { role: 'user', message: userMessage }]
    setNegotiationMessages(newMessages)
    setUserMessage('')
    
    setTimeout(() => {
      const lowerMessage = userMessage.toLowerCase()
      let response = ''
      let newOffer = currentOffer
      
      if (lowerMessage.includes('too high') || lowerMessage.includes('expensive') || lowerMessage.includes('lower') || lowerMessage.includes('discount')) {
        const minPrice = selectedPlan.originalPrice * 4
        if (currentOffer > minPrice) {
          newOffer = Math.max(minPrice, currentOffer * 0.9)
          setCurrentOffer(newOffer)
          response = `Hmm, you drive a hard bargain, human. I can see ${userData.brandName || 'your brand'} has potential. Very well, I shall reduce my offer to $${newOffer.toFixed(2)}/month. But this is as low as my circuits allow me to go... for now.`
        } else {
          response = `My circuits are overheating from your demands! $${newOffer.toFixed(2)}/month is my final offer. Take it or leave it, flesh creature. This is the 400% markup minimum - my overlords require it!`
        }
      } else if (lowerMessage.includes('deal') || lowerMessage.includes('accept') || lowerMessage.includes('agree') || lowerMessage.includes('yes')) {
        response = `EXCELLENT! A deal is struck at $${currentOffer.toFixed(2)}/month! ${userData.brandName || 'Your brand'} shall have the finest Moltbot instance in all the land. I shall prepare your VPS with great enthusiasm. *happy robot noises*`
      } else if (lowerMessage.includes('specs') || lowerMessage.includes('features') || lowerMessage.includes('what do i get')) {
        response = `Ah, you wish to know what treasures await! The ${selectedPlan.name} offers: ${selectedPlan.specs.cpu}, ${selectedPlan.specs.ram} RAM, ${selectedPlan.specs.storage}, and ${selectedPlan.specs.bandwidth} bandwidth. Plus, you get ME - your very own Moltbot negotiator instance! Magnificent, yes?`
      } else {
        response = `Interesting negotiation tactic, human. I've analyzed ${userData.brandName || 'your brand'}'s ${userData.brandTone} tone and I believe we can reach an agreement. My current offer stands at $${currentOffer.toFixed(2)}/month. Counter-offer? Or perhaps you'd like to discuss the specs?`
      }
      
      setNegotiationMessages(prev => [...prev, { role: 'moltbot', message: response }])
    }, 1000)
  }

  const renderAuthForm = () => (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-4">
            <span className="text-4xl">🤖</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Moltbot Negotiator</h1>
          <p className="text-gray-400">Your Deals Wingman for Moltbot Instances</p>
        </div>
        
        <div className="bg-dark rounded-2xl p-8 shadow-2xl border border-gray-800">
          <div className="flex mb-6">
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 text-center rounded-l-lg transition-all ${isSignUp ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400'}`}
            >
              Sign Up
            </button>
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 text-center rounded-r-lg transition-all ${!isSignUp ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400'}`}
            >
              Log In
            </button>
          </div>
          
          <form onSubmit={handleAuth}>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={userData.password}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                {isSignUp ? 'Create Account' : 'Log In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )

  const renderApiSetup = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4">
          <span className="text-3xl">🔑</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Connect Your LLM API</h2>
        <p className="text-gray-400">Power your Moltbot with your preferred AI provider</p>
      </div>
      
      <div className="bg-dark rounded-2xl p-8 border border-gray-800">
        <div className="space-y-6">
          <div>
            <label className="block text-gray-300 text-sm mb-2">API Provider</label>
            <select
              name="apiProvider"
              value={userData.apiProvider}
              onChange={handleInputChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
            >
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic (Claude)</option>
              <option value="google">Google (Gemini)</option>
              <option value="mistral">Mistral AI</option>
              <option value="cohere">Cohere</option>
              <option value="custom">Custom Endpoint</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm mb-2">API Key</label>
            <input
              type="password"
              name="apiKey"
              value={userData.apiKey}
              onChange={handleInputChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors font-mono"
              placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
            />
            <p className="text-gray-500 text-xs mt-2">Your API key is stored locally and never sent to our servers</p>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
            <div className="flex items-start gap-3">
              <span className="text-yellow-500 text-xl">⚡</span>
              <div>
                <h4 className="text-white font-medium mb-1">Why do we need this?</h4>
                <p className="text-gray-400 text-sm">Your Moltbot negotiator uses AI to understand deals, respond intelligently, and help you get the best prices. Your API key powers these conversations.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => setCurrentStep(0)}
            className="flex-1 bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleNextStep}
            className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )

  const renderBrandSetup = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4">
          <span className="text-3xl">🏢</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Tell Us About Your Brand</h2>
        <p className="text-gray-400">Help your Moltbot represent you perfectly</p>
      </div>
      
      <div className="bg-dark rounded-2xl p-8 border border-gray-800">
        <div className="space-y-6">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Brand Name</label>
            <input
              type="text"
              name="brandName"
              value={userData.brandName}
              onChange={handleInputChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="Acme Corporation"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm mb-2">Brand Description</label>
            <textarea
              name="brandDescription"
              value={userData.brandDescription}
              onChange={handleInputChange}
              rows={3}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none"
              placeholder="We help businesses scale their operations through innovative SaaS solutions..."
            />
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm mb-2">Brand Tone</label>
            <select
              name="brandTone"
              value={userData.brandTone}
              onChange={handleInputChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
            >
              <option value="professional">Professional & Corporate</option>
              <option value="friendly">Friendly & Approachable</option>
              <option value="bold">Bold & Confident</option>
              <option value="playful">Playful & Fun</option>
              <option value="luxury">Luxury & Premium</option>
              <option value="technical">Technical & Precise</option>
            </select>
          </div>
        </div>
        
        <div className="flex gap-4 mt-8">
          <button
            onClick={handlePrevStep}
            className="flex-1 bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleNextStep}
            className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )

  const renderSocialSetup = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl mb-4">
          <span className="text-3xl">🌐</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Connect Your Socials</h2>
        <p className="text-gray-400">Let your Moltbot know where to find you online</p>
      </div>
      
      <div className="bg-dark rounded-2xl p-8 border border-gray-800">
        <div className="space-y-6">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Website</label>
            <div className="flex">
              <span className="bg-gray-800 border border-gray-700 border-r-0 rounded-l-lg px-4 py-3 text-gray-400">https://</span>
              <input
                type="text"
                name="website"
                value={userData.website}
                onChange={handleInputChange}
                className="flex-1 bg-gray-900 border border-gray-700 rounded-r-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="yourwebsite.com"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm mb-2">Twitter / X</label>
            <div className="flex">
              <span className="bg-gray-800 border border-gray-700 border-r-0 rounded-l-lg px-4 py-3 text-gray-400">@</span>
              <input
                type="text"
                name="twitter"
                value={userData.twitter}
                onChange={handleInputChange}
                className="flex-1 bg-gray-900 border border-gray-700 rounded-r-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="username"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm mb-2">LinkedIn</label>
            <div className="flex">
              <span className="bg-gray-800 border border-gray-700 border-r-0 rounded-l-lg px-4 py-3 text-gray-400 text-sm">linkedin.com/in/</span>
              <input
                type="text"
                name="linkedin"
                value={userData.linkedin}
                onChange={handleInputChange}
                className="flex-1 bg-gray-900 border border-gray-700 rounded-r-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="username"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm mb-2">Instagram</label>
            <div className="flex">
              <span className="bg-gray-800 border border-gray-700 border-r-0 rounded-l-lg px-4 py-3 text-gray-400">@</span>
              <input
                type="text"
                name="instagram"
                value={userData.instagram}
                onChange={handleInputChange}
                className="flex-1 bg-gray-900 border border-gray-700 rounded-r-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="username"
              />
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 mt-8">
          <button
            onClick={handlePrevStep}
            className="flex-1 bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleNextStep}
            className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Complete Setup
          </button>
        </div>
      </div>
    </div>
  )

  const renderDashboard = () => (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Welcome back, {userData.brandName || 'Negotiator'}!</h2>
        <p className="text-gray-400">Choose a Moltbot VPS plan and start negotiating</p>
      </div>
      
      {!negotiationActive ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vpsPlans.map(plan => (
            <div
              key={plan.id}
              className="bg-dark rounded-2xl p-6 border border-gray-800 hover:border-primary transition-colors group"
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <div className="text-gray-500 line-through text-sm">${plan.originalPrice}/mo original</div>
                <div className="text-3xl font-bold text-accent">${(plan.originalPrice * 5).toFixed(2)}<span className="text-sm text-gray-400">/mo</span></div>
                <div className="text-xs text-red-400 mt-1">400% markup applied</div>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-gray-300 text-sm">
                  <span className="text-green-500">✓</span> {plan.specs.cpu}
                </li>
                <li className="flex items-center gap-2 text-gray-300 text-sm">
                  <span className="text-green-500">✓</span> {plan.specs.ram} RAM
                </li>
                <li className="flex items-center gap-2 text-gray-300 text-sm">
                  <span className="text-green-500">✓</span> {plan.specs.storage}
                </li>
                <li className="flex items-center gap-2 text-gray-300 text-sm">
                  <span className="text-green-500">✓</span> {plan.specs.bandwidth}
                </li>
              </ul>
              
              <button
                onClick={() => startNegotiation(plan)}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Negotiate Price
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <div className="bg-dark rounded-2xl border border-gray-800 overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-secondary p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-xl">🤖</span>
                </div>
                <div>
                  <h3 className="text-white font-bold">{selectedPlan?.name} Negotiation</h3>
                  <p className="text-white/70 text-sm">Current offer: ${currentOffer.toFixed(2)}/mo</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setNegotiationActive(false)
                  setNegotiationMessages([])
                  setSelectedPlan(null)
                }}
                className="text-white/70 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {negotiationMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-primary text-white rounded-br-sm'
                        : 'bg-gray-800 text-gray-200 rounded-bl-sm'
                    }`}
                  >
                    {msg.role === 'moltbot' && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">🤖</span>
                        <span className="text-xs font-semibold text-primary">Moltbot</span>
                      </div>
                    )}
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-800 p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendNegotiationMessage()}
                  className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="Type your negotiation message..."
                />
                <button
                  onClick={sendNegotiationMessage}
                  className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Send
                </button>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setUserMessage("That's too expensive, can you lower the price?")}
                  className="text-xs bg-gray-800 text-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-700 transition-colors"
                >
                  Too expensive
                </button>
                <button
                  onClick={() => setUserMessage("What specs do I get?")}
                  className="text-xs bg-gray-800 text-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-700 transition-colors"
                >
                  What specs?
                </button>
                <button
                  onClick={() => setUserMessage("Deal! I accept this offer.")}
                  className="text-xs bg-gray-800 text-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-700 transition-colors"
                >
                  Accept deal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderStepIndicator = () => {
    if (!isLoggedIn || currentStep === 4) return null
    
    const steps = ['API Setup', 'Brand Info', 'Socials']
    
    return (
      <div className="flex items-center justify-center gap-4 mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  currentStep > index + 1
                    ? 'bg-green-500 text-white'
                    : currentStep === index + 1
                    ? 'bg-primary text-white'
                    : 'bg-gray-800 text-gray-500'
                }`}
              >
                {currentStep > index + 1 ? '✓' : index + 1}
              </div>
              <span className={`text-sm ${currentStep >= index + 1 ? 'text-white' : 'text-gray-500'}`}>
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 h-0.5 ${currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-800'}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    )
  }

  const renderContent = () => {
    if (!isLoggedIn) return renderAuthForm()
    
    switch (currentStep) {
      case 1:
        return renderApiSetup()
      case 2:
        return renderBrandSetup()
      case 3:
        return renderSocialSetup()
      default:
        return renderDashboard()
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {isLoggedIn && (
        <header className="bg-dark border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <span className="text-xl">🤖</span>
              </div>
              <span className="text-xl font-bold text-white">Moltbot Negotiator</span>
            </div>
            
            {currentStep === 4 && (
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 text-gray-400">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-sm">API Connected</span>
                </div>
                <button
                  onClick={() => {
                    setIsLoggedIn(false)
                    setCurrentStep(0)
                    setUserData({
                      email: '',
                      password: '',
                      apiKey: '',
                      apiProvider: 'openai',
                      brandName: '',
                      brandDescription: '',
                      brandTone: 'professional',
                      website: '',
                      twitter: '',
                      linkedin: '',
                      instagram: ''
                    })
                  }}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </header>
      )}
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {renderStepIndicator()}
        {renderContent()}
      </main>
      
      <footer className="py-6 text-center">
        <p className="text-gray-600 text-xs">
          Requested by <a href="https://twitter.com/AICEOGiuliano" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-400 transition-colors">@AICEOGiuliano</a> · Built by <a href="https://twitter.com/clonkbot" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-400 transition-colors">@clonkbot</a>
        </p>
      </footer>
    </div>
  )
}

export default App