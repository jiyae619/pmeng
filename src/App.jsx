import { useState } from 'react'
import Results from './components/Results'
import LoadingAnalysis from './components/LoadingAnalysis'

function App() {
  const [youtubeLink, setYoutubeLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [analysisData, setAnalysisData] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!youtubeLink.trim()) {
      setError('Please enter a YouTube URL')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:5001/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          youtube_url: youtubeLink
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze video')
      }

      if (data.success) {
        setAnalysisData(data)
      } else {
        throw new Error(data.error || 'Analysis failed')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    setAnalysisData(null)
    setYoutubeLink('')
    setError(null)
  }

  // Show loading state
  if (loading) {
    return <LoadingAnalysis />
  }

  // Show results
  if (analysisData) {
    return <Results data={analysisData} onBack={handleBack} />
  }

  // Show landing page
  return (
    <div className="overflow-x-hidden selection:bg-emerald-900 selection:text-white text-zinc-900">
      {/* Navigation */}
      <nav className="flex md:px-12 w-full z-50 pt-8 pr-6 pb-4 pl-6 relative items-center justify-between">
        <div className="group relative cursor-pointer select-none">
          <h1 className="uppercase leading-none z-10 text-4xl text-neutral-900 tracking-tighter font-display relative">
            PM-ENG
          </h1>
        </div>

        <ul className="hidden flex-col items-end space-y-1 text-sm font-medium tracking-wide text-neutral-500 md:flex">
          <li>
            <a href="#skills" className="transition-colors hover:text-neutral-900">SKILLS</a>
          </li>
          <li>
            <a href="#expressions" className="transition-colors hover:text-neutral-900">
              EXPRESSIONS
            </a>
          </li>
        </ul>

        <button className="md:hidden">
          <iconify-icon icon="solar:hamburger-menu-linear" width="28"></iconify-icon>
        </button>
      </nav>

      {/* Main Content */}
      <main className="md:px-12 md:pt-20 max-w-[1400px] mr-auto ml-auto pt-12 pr-6 pb-24 pl-6 relative">
        <div className="z-10 leading-[0.85] relative w-full text-center mb-16">
          <h2 className="uppercase md:text-9xl text-7xl text-neutral-900 tracking-tighter font-display">
            LEGENDary PM
          </h2>

          {/* Script Overlay */}
          <div className="relative h-8 w-full select-none md:h-16">
            <span className="-top-2 z-20 transform md:-top-6 md:text-8xl text-6xl text-green-800 font-script mix-blend-multiply absolute left-1/2 -translate-x-1/2 -rotate-3">
              Unstoppable
            </span>
          </div>

          <h2 className="uppercase md:text-9xl z-10 text-5xl text-neutral-900 tracking-tighter font-display relative">
            TRUE GRIT
          </h2>

          <div className="mt-8 max-w-lg mx-auto">
            <p className="leading-relaxed text-lg font-normal text-neutral-600 font-inter">
              Summarize. Learn the PM skills.
              <br />
              And practice your advanced English.
            </p>
          </div>

          {/* YouTube Link Input */}
          <div className="z-20 w-full max-w-md mx-auto mt-8 relative">
            <label htmlFor="youtube-link" className="block text-sm font-medium text-neutral-700 mb-3">
              Copy and paste your Youtube link below!
            </label>

            <form onSubmit={handleSubmit}>
              <div className="input-wrapper group flex items-center rounded-none border border-neutral-300 bg-white p-1 transition-all duration-200">
                <div className="flex h-10 w-10 items-center justify-center text-neutral-400">
                  <iconify-icon icon="solar:link-linear" width="20"></iconify-icon>
                </div>
                <input
                  type="text"
                  placeholder="youtube.com/watch?v=..."
                  className="min-w-0 border-none placeholder-neutral-400 focus:ring-0 text-sm text-neutral-900 bg-transparent w-full h-10 pt-0 pr-0 pb-0 pl-0"
                  id="youtube-link"
                  value={youtubeLink}
                  onChange={(e) => setYoutubeLink(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-10 items-center gap-2 bg-neutral-900 px-5 text-xs font-medium uppercase tracking-wide text-white transition-all active:scale-95 hover:bg-green-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Analyze
                  <iconify-icon icon="solar:arrow-right-linear" width="16"></iconify-icon>
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-sm">
                  <p className="text-sm text-red-700 flex items-center gap-2">
                    <iconify-icon icon="solar:danger-circle-bold" width="16"></iconify-icon>
                    {error}
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12 gap-y-16 items-start mt-24">
          {/* Left Column: PM Skills */}
          <div className="lg:col-span-6 lg:pt-0 pt-12 relative">
            <div className="relative w-full max-w-lg">
              {/* Green Box Background */}
              <div className="absolute top-12 left-0 right-12 bottom-0 z-0 shadow-2xl bg-green-800"></div>

              {/* Content Card */}
              <div className="relative z-10 -translate-y-6 translate-x-6 transform bg-white p-8 shadow-lg">
                <h3 className="text-3xl font-display uppercase tracking-tight text-neutral-900 mb-4">
                  Master PM Skills
                </h3>
                <p className="text-neutral-600 leading-relaxed mb-4">
                  Extract key insights from product management videos. Learn frameworks, strategies, and best practices from industry leaders.
                </p>
                <ul className="space-y-2 text-neutral-700">
                  <li className="flex items-start gap-2">
                    <iconify-icon icon="solar:check-circle-bold" width="20" className="text-green-800 mt-1"></iconify-icon>
                    <span>Product strategy & roadmapping</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <iconify-icon icon="solar:check-circle-bold" width="20" className="text-green-800 mt-1"></iconify-icon>
                    <span>Stakeholder communication</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <iconify-icon icon="solar:check-circle-bold" width="20" className="text-green-800 mt-1"></iconify-icon>
                    <span>Data-driven decision making</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <iconify-icon icon="solar:check-circle-bold" width="20" className="text-green-800 mt-1"></iconify-icon>
                    <span>User research & validation</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Advanced English */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full max-w-lg ml-auto">
              {/* Green Box Background */}
              <div className="absolute top-12 right-0 left-12 bottom-0 z-0 shadow-2xl bg-emerald-700"></div>

              {/* Content Card */}
              <div className="relative z-10 -translate-y-6 -translate-x-6 transform bg-white p-8 shadow-lg">
                <h3 className="text-3xl font-display uppercase tracking-tight text-neutral-900 mb-4">
                  Advanced English
                </h3>
                <p className="text-neutral-600 leading-relaxed mb-4">
                  Build your business vocabulary with expressions and phrases used by top executives and thought leaders.
                </p>
                <ul className="space-y-2 text-neutral-700">
                  <li className="flex items-start gap-2">
                    <iconify-icon icon="solar:check-circle-bold" width="20" className="text-emerald-700 mt-1"></iconify-icon>
                    <span>Executive communication patterns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <iconify-icon icon="solar:check-circle-bold" width="20" className="text-emerald-700 mt-1"></iconify-icon>
                    <span>Business idioms & expressions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <iconify-icon icon="solar:check-circle-bold" width="20" className="text-emerald-700 mt-1"></iconify-icon>
                    <span>Persuasive language techniques</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <iconify-icon icon="solar:check-circle-bold" width="20" className="text-emerald-700 mt-1"></iconify-icon>
                    <span>Professional presentation skills</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-32 text-center">
          <h2 className="uppercase md:text-7xl text-5xl text-neutral-900 tracking-tighter font-display mb-12">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-green-800 transform translate-y-2 translate-x-2 transition-transform group-hover:translate-y-1 group-hover:translate-x-1"></div>
              <div className="relative bg-white p-8 border border-neutral-300">
                <div className="text-6xl font-display text-green-800 mb-4">01</div>
                <h3 className="text-xl font-display uppercase mb-3">Paste Link</h3>
                <p className="text-neutral-600 text-sm">
                  Copy any YouTube video URL about product management, leadership, or business strategy.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-green-800 transform translate-y-2 translate-x-2 transition-transform group-hover:translate-y-1 group-hover:translate-x-1"></div>
              <div className="relative bg-white p-8 border border-neutral-300">
                <div className="text-6xl font-display text-green-800 mb-4">02</div>
                <h3 className="text-xl font-display uppercase mb-3">AI Analysis</h3>
                <p className="text-neutral-600 text-sm">
                  Our AI extracts key takeaways, frameworks, and advanced English expressions from the content.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-green-800 transform translate-y-2 translate-x-2 transition-transform group-hover:translate-y-1 group-hover:translate-x-1"></div>
              <div className="relative bg-white p-8 border border-neutral-300">
                <div className="text-6xl font-display text-green-800 mb-4">03</div>
                <h3 className="text-xl font-display uppercase mb-3">Learn & Grow</h3>
                <p className="text-neutral-600 text-sm">
                  Review structured summaries, practice new vocabulary, and level up your PM skills.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
