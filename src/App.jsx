import { useState } from 'react'
import Results from './components/Results'
import LoadingAnalysis from './components/LoadingAnalysis'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

function App() {
  const [youtubeLink, setYoutubeLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [error, setError] = useState(null)
  const [analysisData, setAnalysisData] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!youtubeLink.trim()) {
      setError('Please enter a YouTube URL')
      return
    }

    setLoading(true)
    setLoadingMessage('Fetching transcript from YouTube...')
    setError(null)

    try {
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          youtube_url: youtubeLink
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed')
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
      setLoadingMessage('')
    }
  }

  const handleSeek = (timestamp) => {
    const videoId = extractVideoId(youtubeLink)
    if (videoId) {
      const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}&t=${Math.floor(timestamp)}s`
      window.open(youtubeUrl, '_blank')
    }
  }

  const extractVideoId = (url) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            PM-ENG
          </h1>
          <p className="text-xl text-gray-600">
            Learn PM Skills & Advanced English from YouTube Videos
          </p>

        </header>

        {/* Main Content */}
        <>
          {/* Input Form */}
          <div className="max-w-3xl mx-auto mb-8">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
              <div className="mb-6">
                <label htmlFor="youtube-url" className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube Video URL
                </label>
                <input
                  id="youtube-url"
                  type="text"
                  value={youtubeLink}
                  onChange={(e) => setYoutubeLink(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !youtubeLink.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
              >
                {loading ? 'Analyzing...' : 'Analyze Video'}
              </button>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}
            </form>
          </div>

          {/* Loading State */}
          {loading && <LoadingAnalysis message={loadingMessage} />}

          {/* Results */}
          {analysisData && !loading && (
            <Results
              data={analysisData}
              onSeek={handleSeek}
            />
          )}
        </>
      </div>
    </div>
  )
}

export default App
