import { useState } from 'react';
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle2, Target, Lightbulb, ArrowRight } from 'lucide-react';

export default function GandalfInsights({ analysis, timeRange, userProfile, onGenerate, onOpenSettings }) {
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGenerate = async () => {
        console.log('🔍 Generate Insights clicked');
        console.log('📊 Analysis:', analysis);
        console.log('⏰ Time Range:', timeRange);
        console.log('👤 User Profile:', userProfile);

        setLoading(true);
        setError(null);

        try {
            console.log('🚀 Calling onGenerate...');
            const result = await onGenerate(analysis, timeRange, userProfile);
            console.log('✅ Result received:', result);

            if (result) {
                setInsights(result);
            } else {
                console.error('❌ No result returned');
                setError('Failed to generate insights. Please try again.');
            }
        } catch (err) {
            console.error('❌ Error in handleGenerate:', err);
            console.error('Error stack:', err.stack);
            setError(err.message || 'An error occurred while generating insights.');
        } finally {
            setLoading(false);
        }
    };

    const getDateRangeText = () => {
        const ranges = {
            today: "Today's",
            week: "This Week's",
            month: "This Month's",
            year: "This Year's",
            all: 'All-Time',
        };
        return ranges[timeRange] || "Today's";
    };

    const isProfileComplete = () => {
        return userProfile &&
            userProfile.name &&
            userProfile.age &&
            userProfile.profession;
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="border-b border-gray-100 px-8 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                <Sparkles className="text-white" size={20} />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-900">Ask Gandalf</h2>
                        </div>
                        <p className="text-sm text-gray-500 ml-13">
                            Get personalized insights about your {getDateRangeText().toLowerCase()} browsing
                        </p>
                    </div>

                    {!loading && isProfileComplete() && (
                        <button
                            onClick={handleGenerate}
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-sm hover:shadow-md flex items-center gap-2 font-medium"
                        >
                            <Sparkles size={18} />
                            {insights ? 'Refresh Insights' : 'Generate Insights'}
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-8">
                {/* Profile Incomplete Warning */}
                {!isProfileComplete() && !insights && !loading && !error && (
                    <div className="max-w-2xl mx-auto text-center py-12">
                        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="text-amber-600" size={32} />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Complete Your Profile to Get Insights
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            To receive personalized AI insights, please complete your profile with your name, age, profession, and goals.
                        </p>
                        <button
                            onClick={onOpenSettings}
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all font-medium shadow-sm hover:shadow-md inline-flex items-center gap-2"
                        >
                            Complete Profile Now
                            <ArrowRight size={18} />
                        </button>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600" size={24} />
                        </div>
                        <p className="mt-6 text-gray-600 font-medium">Analyzing your browsing patterns...</p>
                        <p className="text-sm text-gray-400 mt-1">This may take a few moments</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                                <div>
                                    <h4 className="font-semibold text-red-900 mb-1">Error Generating Insights</h4>
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!insights && !loading && !error && !userProfile?.isIncomplete && (
                    <div className="max-w-2xl mx-auto text-center py-12">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                            <Lightbulb className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Ready for Insights?
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Click "Generate Insights" to get personalized feedback about your browsing patterns and how they align with your goals.
                        </p>
                    </div>
                )}

                {/* Insights Display - New JSON Format */}
                {insights && !loading && (
                    <div className="space-y-6 max-w-4xl mx-auto">
                        {/* Main Insight Card */}
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-xl p-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                                    <TrendingUp className="text-blue-600" size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Insight</h3>
                                    <p className="text-gray-700 leading-relaxed">{insights.insight}</p>
                                </div>
                            </div>
                        </div>

                        {/* Productivity Score */}
                        {insights.score && (
                            <div className="bg-white border border-gray-200 rounded-xl p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Productivity Score</h3>
                                        <p className="text-sm text-gray-600">Based on your browsing patterns</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-5xl font-bold text-blue-600">{insights.score}</div>
                                        <div className="text-gray-400 text-2xl">/10</div>
                                    </div>
                                </div>
                                {/* Score Bar */}
                                <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                                        style={{ width: `${(insights.score / 10) * 100}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Recommendations */}
                        {insights.recommendations && insights.recommendations.length > 0 && (
                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                                        <Lightbulb className="text-indigo-600" size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
                                        <div className="space-y-4">
                                            {insights.recommendations.map((item, idx) => (
                                                <div key={idx} className="flex items-start gap-3">
                                                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                                                        {idx + 1}
                                                    </div>
                                                    <p className="text-gray-700 leading-relaxed pt-0.5">{item}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Encouragement */}
                        {insights.encouragement && (
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="text-green-600 flex-shrink-0" size={24} />
                                    <p className="text-gray-800 font-medium italic">{insights.encouragement}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
