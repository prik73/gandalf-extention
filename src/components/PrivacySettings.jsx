import { useState } from 'react';
import { Shield } from 'lucide-react';
import analytics from '../utils/analytics';

export default function PrivacySettings({ onShowPolicy }) {
    const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
    const [loading, setLoading] = useState(true);

    // Load current setting
    useState(() => {
        chrome.storage.sync.get(['analytics_consent'], (result) => {
            setAnalyticsEnabled(result.analytics_consent === true);
            setLoading(false);
        });
    }, []);

    const handleToggle = async (enabled) => {
        setAnalyticsEnabled(enabled);
        await analytics.setConsent(enabled);
    };

    if (loading) {
        return <div className="text-center py-8 text-gray-500">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy & Data</h3>
                <p className="text-sm text-gray-600">
                    Control how Gandalf uses your data to improve the extension.
                </p>
            </div>

            {/* Analytics Toggle */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Shield className="text-blue-600" size={20} />
                            <h4 className="font-semibold text-gray-900">Anonymous Analytics</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                            Help us improve Gandalf by sharing anonymous usage data. We never collect
                            personal information, browsing history, or goal content.
                        </p>
                        <button
                            onClick={onShowPolicy}
                            className="text-sm text-blue-600 hover:underline"
                        >
                            View Privacy Policy →
                        </button>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-4">
                        <input
                            type="checkbox"
                            checked={analyticsEnabled}
                            onChange={(e) => handleToggle(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                {analyticsEnabled && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-sm text-green-900">
                            ✅ <strong>Analytics enabled.</strong> Thank you for helping us improve Gandalf!
                            Your anonymous data helps us build better features for everyone.
                        </p>
                    </div>
                )}

                {!analyticsEnabled && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                            <span className="text-red-600 text-lg">⚠️</span>
                            <div className="flex-1">
                                <p className="text-sm text-red-900 font-semibold mb-1">
                                    Analytics disabled. We won't collect any usage data.
                                </p>
                                <p className="text-xs text-red-700">
                                    Without analytics, we can't understand which features you love or what needs improvement.
                                    Consider enabling to help us make Gandalf better for you! 🙏
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Data Information */}
            <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">What We Collect (if enabled)</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Feature usage (button clicks, modal opens)</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Time range selections</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Goal creation events (not content)</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Extension performance metrics</span>
                    </li>
                </ul>
            </div>

            <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">What We DON'T Collect</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start gap-2">
                        <span className="text-red-600 mt-0.5">✗</span>
                        <span>Your browsing history or URLs</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-red-600 mt-0.5">✗</span>
                        <span>Personal information (name, email, etc.)</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-red-600 mt-0.5">✗</span>
                        <span>Goal content or insights text</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-red-600 mt-0.5">✗</span>
                        <span>Any identifiable data</span>
                    </li>
                </ul>
            </div>

            {/* Local Data */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Your Data Stays Local</h4>
                <p className="text-sm text-gray-700">
                    All your personal data (profile, goals, streaks) is stored locally on your device
                    using Chrome's storage. This data syncs across your Chrome browsers but is never
                    sent to our servers.
                </p>
            </div>
        </div>
    );
}
