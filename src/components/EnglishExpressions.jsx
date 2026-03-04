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
                <div key={index} className="group relative">
                    <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8">
                        <div className="flex-shrink-0">
                            <span className="text-4xl md:text-6xl font-display font-black opacity-10">
                                {(index + 1).toString().padStart(2, '0')}
                            </span>
                        </div>
                        <div className="flex-1 pt-0 md:pt-2">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
                                <h3 className="text-xl md:text-2xl font-bold text-[#141414]">
                                    "{expr.phrase}"
                                </h3>
                                <button
                                    onClick={() => onTimestampClick(expr.timestamp)}
                                    className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 border-2 border-[#141414] text-[#141414] text-xs font-bold uppercase tracking-widest transition-all hover:bg-[#141414] hover:text-[#E4E3E0] active:scale-95"
                                >
                                    <iconify-icon icon="solar:play-bold" width="16"></iconify-icon>
                                    {formatTimestamp(expr.timestamp)}
                                </button>
                            </div>
                            <p className="opacity-70 text-sm md:text-base leading-relaxed max-w-2xl bg-[#141414]/5 p-4 border-l-4 border-[#141414]">
                                {expr.example}
                            </p>
                        </div>
                    </div>

                    {index < expressions.length - 1 && (
                        <div className="mt-8 border-b border-[#141414]/10"></div>
                    )}
                </div>
            ))}
        </div>
    )
}
