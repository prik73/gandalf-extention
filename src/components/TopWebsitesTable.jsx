export default function TopWebsitesTable({ topDomains }) {
    if (!topDomains || topDomains.length === 0) return null;

    const maxCount = Math.max(...topDomains.map(d => d.count));

    return (
        <div className="wisdom-card fade-in mb-6">
            <h2 className="mb-6">🌐 Top Websites</h2>

            <div className="space-y-3">
                {topDomains.slice(0, 10).map((item, idx) => {
                    const percentage = (item.count / maxCount) * 100;

                    return (
                        <div key={idx} className="relative">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-3">
                                    <span className="text-lg font-bold text-purple-600">
                                        #{idx + 1}
                                    </span>
                                    <span className="font-semibold text-gray-800">
                                        {item.domain}
                                    </span>
                                </div>
                                <span className="text-sm font-bold text-gray-600">
                                    {item.count} visits
                                </span>
                            </div>

                            {/* Visual bar */}
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-amber-400 rounded-full transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
