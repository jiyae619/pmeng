import { useState, useRef, useEffect } from 'react'
import PMInsights from './PMInsights'
import EnglishExpressions from './EnglishExpressions'

export default function Results({ data, onBack }) {
    const [activeTab, setActiveTab] = useState('insights')
    const [isExporting, setIsExporting] = useState(false)
    const [exportError, setExportError] = useState(null)
    const [notionUrl, setNotionUrl] = useState(null)
    const playerRef = useRef(null)
    const API_URL = import.meta.env.VITE_API_URL || ''

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

    const handleExportToNotion = async () => {
        setIsExporting(true)
        setExportError(null)
        setNotionUrl(null)

        const accessToken = localStorage.getItem('notion_access_token')

        if (!accessToken) {
            // Redirect to OAuth
            const clientId = import.meta.env.VITE_NOTION_CLIENT_ID
            const redirectUri = encodeURIComponent(window.location.origin + '/notion-callback')
            window.location.href = `https://api.notion.com/v1/oauth/authorize?client_id=${clientId}&response_type=code&owner=user&redirect_uri=${redirectUri}`
            return
        }

        try {
            const response = await fetch(`${API_URL}/api/export/notion`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    analysis_data: data,
                    access_token: accessToken
                })
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'Export failed')
            }

            if (result.success) {
                setNotionUrl(result.notion_url)
            } else {
                if (response.status === 401) {
                    localStorage.removeItem('notion_access_token')
                    throw new Error('Notion access revoked or expired. Please reconnect.')
                }
                throw new Error(result.error || 'Export failed')
            }
        } catch (err) {
            setExportError(err.message)
        } finally {
            setIsExporting(false)
        }
    }

    const hasNotionToken = !!localStorage.getItem('notion_access_token')

    return (
        <div className="min-h-screen flex flex-col font-sans transition-colors duration-500 text-[#141414] bg-[#E4E3E0]">
            {/* Header */}
            <nav className="border-b-4 border-[#141414]">
                <div className="px-6 md:px-12 py-6 flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-[#141414] hover:text-green-800 transition-colors uppercase font-bold tracking-widest text-sm"
                    >
                        <iconify-icon icon="solar:arrow-left-linear" width="24"></iconify-icon>
                        <span>Back to Start</span>
                    </button>
                    <h1 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tight m-0">
                        PM X English
                    </h1>
                    <div className="flex items-center gap-4">
                        {notionUrl ? (
                            <a
                                href={notionUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-green-800 font-bold uppercase tracking-widest text-sm hover:opacity-70 transition-opacity"
                            >
                                <iconify-icon icon="solar:check-circle-bold" width="24"></iconify-icon>
                                <span>Saved</span>
                            </a>
                        ) : (
                            <button
                                onClick={handleExportToNotion}
                                disabled={isExporting}
                                className={`flex items-center gap-2 font-bold uppercase tracking-widest text-sm transition-all ${isExporting
                                    ? 'text-[#141414]/40 cursor-not-allowed'
                                    : 'text-[#141414] hover:text-green-800'
                                    }`}
                            >
                                {isExporting ? (
                                    <>
                                        <iconify-icon icon="solar:refresh-linear" width="24" className="animate-spin"></iconify-icon>
                                        <span>Saving</span>
                                    </>
                                ) : (
                                    <>
                                        <iconify-icon icon="solar:database-bold" width="24"></iconify-icon>
                                        <span>{hasNotionToken ? "Save to Notion" : "Connect to Notion"}</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
                {exportError && (
                    <div className="bg-[#141414] text-[#E4E3E0] px-6 md:px-12 py-2">
                        <p className="text-xs uppercase tracking-widest font-bold text-center">
                            Failed to export: {exportError}
                        </p>
                    </div>
                )}
            </nav>

            {/* Main Content Grid */}
            <main className="flex-1 flex flex-col lg:flex-row">
                {/* Left Column: Video Player & Info */}
                <div className="w-full lg:w-5/12 border-b-4 lg:border-b-0 lg:border-r-4 border-[#141414] flex flex-col">
                    <div className="sticky top-0">
                        {/* Video Info Header */}
                        <div className="p-6 md:p-12 border-b-4 border-[#141414]">
                            <h2 className="text-2xl md:text-4xl font-display font-black uppercase leading-tight tracking-tight mb-4" title={data.video?.title || "Analysis Complete"}>
                                {data.video?.title || "Analysis Complete"}
                            </h2>
                            <p className="text-sm md:text-base opacity-70 uppercase tracking-widest font-medium max-w-sm">
                                Review insights and learn vocabulary. Click timestamps to jump to specific points.
                            </p>
                        </div>

                        {/* YouTube Player Wrapper */}
                        <div className="bg-[#141414] aspect-video w-full">
                            <div id="youtube-player" className="w-full h-full"></div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Analysis */}
                <div className="w-full lg:w-7/12 flex flex-col">
                    {/* Massive Tabs */}
                    <div className="grid grid-cols-2 border-b-4 border-[#141414]">
                        <button
                            onClick={() => setActiveTab('insights')}
                            className={`p-4 md:p-6 font-display font-black uppercase text-xl md:text-2xl text-left border-r-4 border-[#141414] transition-colors leading-[0.85] ${activeTab === 'insights'
                                ? 'bg-green-800 text-[#E4E3E0]'
                                : 'bg-transparent text-[#141414] hover:bg-[#141414]/5'
                                }`}
                        >
                            <span className="opacity-50 text-sm md:text-base block mb-1">01.</span>
                            PM<br />Insights
                        </button>
                        <button
                            onClick={() => setActiveTab('expressions')}
                            className={`p-4 md:p-6 font-display font-black uppercase text-xl md:text-2xl text-left transition-colors leading-[0.85] ${activeTab === 'expressions'
                                ? 'bg-green-800 text-[#E4E3E0]'
                                : 'bg-transparent text-[#141414] hover:bg-[#141414]/5'
                                }`}
                        >
                            <span className="opacity-50 text-sm md:text-base block mb-1">02.</span>
                            English<br />Expressions
                        </button>
                    </div>

                    {/* Tab Content Area */}
                    <div className="p-6 md:p-12 flex-1">
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
            </main>
        </div>
    )
}
