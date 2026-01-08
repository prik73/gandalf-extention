import { useState, useEffect } from 'react';
import Header from './components/Header';
import TimeRangeSelector from './components/TimeRangeSelector';
import BrowsingActivityCard from './components/BrowsingActivityCard';
import GandalfInsights from './components/GandalfInsights';
import LoadingSpinner from './components/LoadingSpinner';
import OnboardingModal from './components/OnboardingModal';
import SettingsModal from './components/SettingsModal';
import GoalsSettings from './components/GoalsSettings';
import PrivacyConsentBanner from './components/PrivacyConsentBanner';
import PrivacyPolicy from './components/PrivacyPolicy';
import analyzeBrowsingHistory from './utils/historyAnalyzer';
import { getLLMInsights } from './utils/apiClient';
import analytics from './utils/analytics';

function App() {
    const [timeRange, setTimeRange] = useState('today');
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState(null);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showGoals, setShowGoals] = useState(false);
    const [showConsentBanner, setShowConsentBanner] = useState(false);
    const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

    // Check for user profile and consent on mount
    useEffect(() => {
        const savedProfile = localStorage.getItem('gandalf_user_profile');
        if (savedProfile) {
            setUserProfile(JSON.parse(savedProfile));
        } else {
            setShowOnboarding(true);
        }

        // Check if user has made a consent decision
        chrome.storage.sync.get(['analytics_consent_shown'], (result) => {
            if (!result.analytics_consent_shown) {
                // Show consent banner after onboarding
                setTimeout(() => {
                    setShowConsentBanner(true);
                }, 1000);
            }
        });
    }, []);

    // Analyze browsing history when component mounts or timeRange changes
    useEffect(() => {
        async function analyze() {
            // Only show loading spinner on initial mount, not on time range changes
            if (analysis === null) {
                setLoading(true);
            }
            const result = await analyzeBrowsingHistory(timeRange);
            setAnalysis(result);
            setLoading(false);
        }
        analyze();
    }, [timeRange]);

    const handleOnboardingComplete = (profile) => {
        setUserProfile(profile);
        setShowOnboarding(false);
        // Sync to chrome.storage for background script
        syncProfileToStorage(profile);

        // Track onboarding completion
        analytics.trackOnboardingComplete(profile);
    };

    const handleConsentAccept = async () => {
        await chrome.storage.sync.set({ analytics_consent_shown: true });
        setShowConsentBanner(false);
        analytics.trackPageView('main_app');
    };

    const handleConsentDecline = async () => {
        await chrome.storage.sync.set({ analytics_consent_shown: true });
        setShowConsentBanner(false);
    };

    const handleGenerateInsights = async (analysis, timeRange, profile) => {
        if (!analysis) return null;

        try {
            // Track insight generation
            analytics.trackInsightGenerated(timeRange, !!profile);

            const insights = await getLLMInsights(analysis, timeRange, profile);
            return insights;
        } catch (error) {
            console.error('Error generating insights:', error);
            throw error;
        }
    };

    const handleSaveSettings = (updatedProfile) => {
        setUserProfile(updatedProfile);
        setShowSettings(false);
        // Sync to chrome.storage for background script
        syncProfileToStorage(updatedProfile);
    };

    const handleGoalsSave = (updatedProfile) => {
        setUserProfile(updatedProfile);
        setShowGoals(false);
        // Sync to chrome.storage for background script
        syncProfileToStorage(updatedProfile);
    };

    // Sync profile to chrome.storage for background script access
    const syncProfileToStorage = (profile) => {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.sync.set(
                {
                    gandalf_user_profile: profile,
                },
                () => {
                    console.log('✅ Profile synced to chrome.storage');
                }
            );
        }
    };

    if (showOnboarding) {
        return <OnboardingModal onComplete={handleOnboardingComplete} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <Header
                    userProfile={userProfile}
                    onSettingsClick={() => setShowSettings(true)}
                    onGoalsClick={() => setShowGoals(true)}
                />

                {/* Time Range Selector */}
                <TimeRangeSelector timeRange={timeRange} setTimeRange={setTimeRange} />

                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        {/* Two-column layout for Browsing Activity and Ask Gandalf */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            {/* Browsing Activity Card */}
                            <BrowsingActivityCard analysis={analysis} timeRange={timeRange} />

                            {/* Ask Gandalf Card */}
                            <GandalfInsights
                                analysis={analysis}
                                timeRange={timeRange}
                                userProfile={userProfile}
                                onGenerate={handleGenerateInsights}
                                onOpenSettings={() => setShowSettings(true)}
                            />
                        </div>
                    </>
                )}
            </div>

            {/* Modals */}
            {showSettings && (
                <SettingsModal
                    userProfile={userProfile}
                    onSave={handleSaveSettings}
                    onClose={() => setShowSettings(false)}
                />
            )}

            {showGoals && (
                <GoalsSettings
                    userProfile={userProfile}
                    onSave={handleSaveSettings}
                    onClose={() => setShowGoals(false)}
                />
            )}

            {/* Privacy Consent Banner */}
            {showConsentBanner && !showOnboarding && (
                <PrivacyConsentBanner
                    onAccept={handleConsentAccept}
                    onDecline={handleConsentDecline}
                    onShowPolicy={() => setShowPrivacyPolicy(true)}
                />
            )}

            {/* Privacy Policy Modal */}
            {showPrivacyPolicy && (
                <PrivacyPolicy onClose={() => setShowPrivacyPolicy(false)} />
            )}
        </div>
    );
}

export default App;
