import { memo } from 'react';
import { TrendingUp, Clock, Sun, Target } from 'lucide-react';
import { AnimatedNumber, AnimatedTime } from './AnimatedNumber';

const BrowsingActivityCard = memo(({ analysis, timeRange }) => {
    if (!analysis || !analysis.details) {
        return (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <TrendingUp className="text-white" size={20} />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Browsing Activity</h2>
                </div>
                <p className="text-gray-500 text-center py-8">No browsing data available</p>
            </div>
        );
    }

    const { totalPages, totalTimeMinutes, peakBrowsingTime, dominantCategory, contextSwitches } = analysis.details;

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="border-b border-gray-100 px-8 py-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <TrendingUp className="text-white" size={20} />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Browsing Activity</h2>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="p-8">
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* Pages Visited */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                                <TrendingUp className="text-blue-600" size={20} />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                            <AnimatedNumber value={totalPages || 0} />
                        </div>
                        <div className="text-sm font-medium text-gray-600">Pages Visited</div>
                    </div>

                    {/* Time Spent */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                                <Clock className="text-purple-600" size={20} />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                            <AnimatedTime minutes={totalTimeMinutes || 0} />
                        </div>
                        <div className="text-sm font-medium text-gray-600">Time Spent</div>
                    </div>

                    {/* Peak Activity */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                                <Sun className="text-amber-600" size={20} />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1 capitalize transition-all duration-300">
                            {peakBrowsingTime || 'N/A'}
                        </div>
                        <div className="text-sm font-medium text-gray-600">Peak Activity</div>
                    </div>

                    {/* Top Focus */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                                <Target className="text-green-600" size={20} />
                            </div>
                        </div>
                        <div className="text-lg font-bold text-gray-900 mb-1 truncate capitalize transition-all duration-300">
                            {dominantCategory ? dominantCategory.replace(/_/g, ' ') : 'Mixed'}
                        </div>
                        <div className="text-sm font-medium text-gray-600">Top Focus</div>
                    </div>
                </div>

                {/* Context Switches Alert */}
                {contextSwitches > 20 && (
                    <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-4 animate-fade-in">
                        <div className="flex items-start gap-3">
                            <span className="text-amber-600 text-lg">⚡</span>
                            <div className="flex-1">
                                <p className="text-sm text-amber-900">
                                    <span className="font-semibold">
                                        <AnimatedNumber value={contextSwitches} /> context switches
                                    </span>
                                    <span className="text-amber-700"> — your attention jumped between many sites</span>
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

BrowsingActivityCard.displayName = 'BrowsingActivityCard';

export default BrowsingActivityCard;
