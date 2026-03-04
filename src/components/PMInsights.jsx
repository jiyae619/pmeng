export default function PMInsights({ insights }) {
    if (!insights || insights.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-neutral-500">No PM insights available</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {insights.map((insight, index) => (
                <div key={index} className="group relative">
                    <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8">
                        <div className="flex-shrink-0">
                            <span className="text-4xl md:text-6xl font-display font-black opacity-10">
                                {(index + 1).toString().padStart(2, '0')}
                            </span>
                        </div>
                        <div className="flex-1 pt-0 md:pt-2">
                            <h3 className="text-xl md:text-2xl font-display font-bold uppercase tracking-tight mb-3">
                                {insight.title}
                            </h3>
                            <p className="opacity-80 leading-relaxed text-sm md:text-base max-w-2xl">
                                {insight.description}
                            </p>
                        </div>
                    </div>

                    {index < insights.length - 1 && (
                        <div className="mt-8 border-b border-[#141414]/10"></div>
                    )}
                </div>
            ))}
        </div>
    )
}
