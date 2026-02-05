export default function EnglishExpressions({ expressions, onTimestampClick }) {
    if (!expressions || expressions.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-neutral-500">No English expressions available</p>
            </div>
        )
    }

    const formatTimestamp = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="space-y-6">
            {expressions.map((expr, index) => (
                <div key={index} className="group">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                            <iconify-icon
                                icon="solar:chat-round-line-bold"
                                width="24"
                                className="text-emerald-700"
                            ></iconify-icon>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-start justify-between gap-4 mb-2">
                                <h3 className="text-lg font-medium text-neutral-900">
                                    "{expr.phrase}"
                                </h3>
                                <button
                                    onClick={() => onTimestampClick(expr.timestamp)}
                                    className="flex-shrink-0 flex items-center gap-1 px-3 py-1 bg-emerald-700 text-white text-xs font-medium uppercase tracking-wide rounded-sm transition-all hover:bg-emerald-800 active:scale-95"
                                >
                                    <iconify-icon icon="solar:play-circle-bold" width="14"></iconify-icon>
                                    {formatTimestamp(expr.timestamp)}
                                </button>
                            </div>
                            <p className="text-neutral-600 text-sm leading-relaxed">
                                {expr.example}
                            </p>
                        </div>
                    </div>

                    {index < expressions.length - 1 && (
                        <div className="mt-6 border-b border-neutral-200"></div>
                    )}
                </div>
            ))}
        </div>
    )
}
