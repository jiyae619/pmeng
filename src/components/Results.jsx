import { useState, useRef, useEffect } from 'react'
import PMInsights from './PMInsights'
import EnglishExpressions from './EnglishExpressions'

export default function Results({ data, onBack }) {
    const [activeTab, setActiveTab] = useState('insights')
    const playerRef = useRef(null)

    // YouTube Player API integration
    useEffect(() => {
        const initializePlayer = () => {
            if (window.YT && window.YT.Player) {
                playerRef.current = new window.YT.Player('youtube-player', {
                    videoId: data.video.id,
                    playerVars: {
                        autoplay: 0,
                        modestbranding: 1,
                        rel: 0
                    }
                })
            }
        }

        // Check if API is already loaded
        if (window.YT && window.YT.Player) {
            initializePlayer()
        } else {
            // Load YouTube IFrame API if not already loaded
            if (!window.YT) {
                const tag = document.createElement('script')
                tag.src = 'https://www.youtube.com/iframe_api'
                const firstScriptTag = document.getElementsByTagName('script')[0]
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
            }

            // Set callback for when API is ready
            window.onYouTubeIframeAPIReady = initializePlayer
        }

        return () => {
            // Cleanup
            if (playerRef.current && playerRef.current.destroy) {
                playerRef.current.destroy()
            }
        }
    }, [data.video.id])

    const handleTimestampClick = (seconds) => {
        if (playerRef.current && playerRef.current.seekTo) {
            playerRef.current.seekTo(seconds, true)
            playerRef.current.playVideo()
        }
    }

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Header */}
            <nav className="bg-white border-b border-neutral-200">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
                    >
                        <iconify-icon icon="solar:arrow-left-linear" width="20"></iconify-icon>
                        <span className="font-medium">Back</span>
                    </button>
                    <h1 className="text-2xl font-display uppercase tracking-tight text-neutral-900">
                        PM-ENG
                    </h1>
                    <div className="w-20"></div> {/* Spacer for centering */}
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Video Player */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-8">
                            {/* YouTube Player */}
                            <div className="bg-black aspect-video rounded-lg overflow-hidden shadow-lg mb-4">
                                <div id="youtube-player" className="w-full h-full"></div>
                            </div>

                            {/* Video Info */}
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <div className="flex items-start gap-3">
                                    <iconify-icon
                                        icon="solar:video-frame-bold"
                                        width="24"
                                        className="text-green-800 mt-1"
                                    ></iconify-icon>
                                    <div>
                                        <h2 className="font-medium text-neutral-900 mb-1">
                                            Analysis Complete
                                        </h2>
                                        <p className="text-sm text-neutral-600">
                                            Click timestamp buttons to jump to specific moments in the video
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Analysis */}
                    <div className="lg:col-span-7">
                        {/* Tabs */}
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="border-b border-neutral-200">
                                <div className="flex">
                                    <button
                                        onClick={() => setActiveTab('insights')}
                                        className={`flex-1 px-6 py-4 font-display uppercase tracking-wide text-sm transition-colors ${activeTab === 'insights'
                                            ? 'bg-green-800 text-white'
                                            : 'bg-white text-neutral-600 hover:bg-neutral-50'
                                            }`}
                                    >
                                        PM Insights
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('expressions')}
                                        className={`flex-1 px-6 py-4 font-display uppercase tracking-wide text-sm transition-colors ${activeTab === 'expressions'
                                            ? 'bg-emerald-700 text-white'
                                            : 'bg-white text-neutral-600 hover:bg-neutral-50'
                                            }`}
                                    >
                                        English Expressions
                                    </button>
                                </div>
                            </div>

                            {/* Tab Content */}
                            <div className="p-6">
                                {activeTab === 'insights' ? (
                                    <PMInsights insights={data.pm_insights} />
                                ) : (
                                    <EnglishExpressions
                                        expressions={data.english_expressions}
                                        onTimestampClick={handleTimestampClick}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
