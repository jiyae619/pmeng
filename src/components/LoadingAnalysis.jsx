export default function LoadingAnalysis({ message = 'Preparing analysis...' }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
            <div className="text-center max-w-md">
                {/* Animated Icon */}
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-green-800 opacity-20 blur-xl animate-pulse"></div>
                        <iconify-icon
                            icon="solar:video-frame-play-vertical-bold"
                            width="80"
                            className="text-green-800 animate-bounce relative z-10"
                        ></iconify-icon>
                    </div>
                </div>

                {/* Loading Text */}
                <h2 className="text-3xl font-display uppercase tracking-tight text-neutral-900 mb-4">
                    Analyzing Video
                </h2>

                <div className="space-y-3 text-neutral-600">
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-green-800 rounded-full animate-pulse"></div>
                        <p className="text-sm">{message}</p>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-green-800 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <p className="text-sm">Analyzing PM insights...</p>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-green-800 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        <p className="text-sm">Identifying English expressions...</p>
                    </div>
                </div>

                <p className="mt-8 text-xs text-neutral-500">
                    This may take 30-60 seconds
                </p>
            </div>
        </div>
    )
}
