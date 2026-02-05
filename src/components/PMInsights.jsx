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
                <div key={index} className="group">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                            <div className="w-8 h-8 rounded-full bg-green-800 flex items-center justify-center">
                                <span className="text-white font-display text-sm">{index + 1}</span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-display uppercase tracking-tight text-neutral-900 mb-2">
                                {insight.title}
                            </h3>
                            <p className="text-neutral-700 leading-relaxed">
                                {insight.description}
                            </p>
                        </div>
                    </div>

                    {index < insights.length - 1 && (
                        <div className="mt-6 border-b border-neutral-200"></div>
                    )}
                </div>
            ))}
        </div>
    )
}
