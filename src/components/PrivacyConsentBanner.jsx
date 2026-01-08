import { Shield, X } from 'lucide-react';
import analytics from '../utils/analytics';

export default function PrivacyConsentBanner({ onAccept, onDecline, onShowPolicy }) {
    const handleAccept = async () => {
        await analytics.setConsent(true);
        onAccept();
    };

    const handleDecline = async () => {
        await analytics.setConsent(false);
        onDecline();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-t-2xl shadow-2xl max-w-2xl w-full mx-4 mb-0 animate-slide-up">
                {/* Header */}
                <div className="flex items-center gap-3 p-6 border-b border-gray-200">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <Shield className="text-blue-600" size={24} />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold text-gray-900">Privacy & Analytics</h2>
                        <p className="text-sm text-gray-600">Help us improve Gandalf</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <p className="text-gray-700">
                        We'd like to collect <strong>anonymous usage data</strong> to understand how you use Gandalf
                        and make it better. This helps us improve features and fix issues.
                    </p>

                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <h3 className="font-semibold text-gray-900 text-sm">What we collect:</h3>
                        <ul className="text-sm text-gray-600 space-y-1 ml-4">
                            <li>• Feature usage (which buttons you click)</li>
                            <li>• Time ranges you select</li>
                            <li>• When you create goals or generate insights</li>
                            <li>• Extension performance metrics</li>
                        </ul>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4 space-y-2">
                        <h3 className="font-semibold text-gray-900 text-sm">What we DON'T collect:</h3>
                        <ul className="text-sm text-gray-600 space-y-1 ml-4">
                            <li>• Your browsing history or URLs</li>
                            <li>• Personal information (name, email, etc.)</li>
                            <li>• Goal content or insights text</li>
                            <li>• Any identifiable data</li>
                        </ul>
                    </div>

                    <p className="text-xs text-gray-500">
                        You can change this anytime in Settings → Privacy.
                        <button
                            onClick={onShowPolicy}
                            className="text-blue-600 hover:underline ml-1"
                        >
                            Read our Privacy Policy
                        </button>
                    </p>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 border-t border-gray-200">
                    <button
                        onClick={handleDecline}
                        className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        No Thanks
                    </button>
                    <button
                        onClick={handleAccept}
                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Accept & Continue
                    </button>
                </div>
            </div>
        </div>
    );
}
