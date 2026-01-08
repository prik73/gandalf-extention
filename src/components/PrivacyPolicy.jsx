import { X, Shield, Eye, Lock, Trash2 } from 'lucide-react';

export default function PrivacyPolicy({ onClose }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Shield className="text-blue-600" size={20} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Privacy Policy</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <p className="text-gray-600">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>

                    {/* What We Collect */}
                    <section>
                        <div className="flex items-center gap-2 mb-3">
                            <Eye className="text-blue-600" size={20} />
                            <h3 className="text-lg font-semibold text-gray-900">What We Collect</h3>
                        </div>
                        <div className="space-y-3 text-gray-700">
                            <p>
                                Gandalf collects <strong>anonymous usage data</strong> to improve the extension.
                                This data is collected only if you consent to analytics.
                            </p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li>Feature usage (button clicks, modal opens)</li>
                                <li>Time range selections</li>
                                <li>Goal creation events (not content)</li>
                                <li>Insight generation events</li>
                                <li>Extension performance metrics</li>
                            </ul>
                        </div>
                    </section>

                    {/* What We DON'T Collect */}
                    <section>
                        <div className="flex items-center gap-2 mb-3">
                            <Lock className="text-green-600" size={20} />
                            <h3 className="text-lg font-semibold text-gray-900">What We DON'T Collect</h3>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                <li><strong>Your browsing history</strong> - We never access or store URLs you visit</li>
                                <li><strong>Personal information</strong> - No names, emails, or contact details</li>
                                <li><strong>Goal content</strong> - We don't see what your goals are</li>
                                <li><strong>Insights text</strong> - AI-generated insights stay on your device</li>
                                <li><strong>Identifiable data</strong> - All analytics are anonymized</li>
                            </ul>
                        </div>
                    </section>

                    {/* How We Use Data */}
                    <section>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">How We Use Data</h3>
                        <p className="text-gray-700 mb-2">
                            The anonymous data we collect helps us:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                            <li>Understand which features are most useful</li>
                            <li>Identify and fix bugs</li>
                            <li>Improve user experience</li>
                            <li>Make data-driven product decisions</li>
                        </ul>
                    </section>

                    {/* Data Storage */}
                    <section>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Storage</h3>
                        <p className="text-gray-700">
                            All your personal data (profile, goals, streaks) is stored <strong>locally on your device</strong> using
                            Chrome's storage API. This data syncs across your Chrome browsers if you're signed in to Chrome,
                            but is never sent to our servers.
                        </p>
                    </section>

                    {/* Third-Party Services */}
                    <section>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Third-Party Services</h3>
                        <div className="space-y-2 text-gray-700">
                            <p><strong>Google Analytics:</strong> Used for anonymous usage analytics (if you consent)</p>
                            <p><strong>Google Gemini API:</strong> Used to generate insights based on your browsing patterns.
                                Data sent to Gemini is anonymized and not stored.</p>
                        </div>
                    </section>

                    {/* Your Rights */}
                    <section>
                        <div className="flex items-center gap-2 mb-3">
                            <Trash2 className="text-red-600" size={20} />
                            <h3 className="text-lg font-semibold text-gray-900">Your Rights</h3>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                            <li><strong>Opt-out:</strong> Disable analytics anytime in Settings → Privacy</li>
                            <li><strong>Delete data:</strong> Uninstall the extension to remove all local data</li>
                            <li><strong>Access data:</strong> All your data is stored locally and accessible to you</li>
                        </ul>
                    </section>

                    {/* Contact */}
                    <section>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact</h3>
                        <p className="text-gray-700">
                            Questions about privacy? Contact us through the Chrome Web Store support page.
                        </p>
                    </section>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Got It
                    </button>
                </div>
            </div>
        </div>
    );
}
