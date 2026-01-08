import { useState } from 'react';
import { X, User, Target, Shield } from 'lucide-react';
import ProfileSettings from './ProfileSettings';
import GoalsSettings from './GoalsSettings';
import PrivacySettings from './PrivacySettings';
import PrivacyPolicy from './PrivacyPolicy';

export default function SettingsModal({ userProfile, onSave, onClose }) {
    const [activeTab, setActiveTab] = useState('profile');
    const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

    return (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 fade-in">
                <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                    {/* Header */}
                    <div className="border-b border-gray-100 px-8 py-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-900">Settings</h2>
                                <p className="text-sm text-gray-500 mt-1">Manage your profile, goals, and privacy</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                aria-label="Close"
                            >
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-medium text-sm transition-all ${activeTab === 'profile'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <User size={16} />
                                Profile
                            </button>
                            <button
                                onClick={() => setActiveTab('goals')}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-medium text-sm transition-all ${activeTab === 'goals'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <Target size={16} />
                                Goals
                            </button>
                            <button
                                onClick={() => setActiveTab('privacy')}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-medium text-sm transition-all ${activeTab === 'privacy'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <Shield size={16} />
                                Privacy
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-8">
                        {/* Fade-in animation wrapper */}
                        <div className="animate-fade-in">
                            {activeTab === 'profile' && (
                                <ProfileSettings userProfile={userProfile} onSave={onSave} />
                            )}
                            {activeTab === 'goals' && (
                                <GoalsSettings userProfile={userProfile} onSave={onSave} onClose={null} />
                            )}
                            {activeTab === 'privacy' && (
                                <PrivacySettings onShowPolicy={() => setShowPrivacyPolicy(true)} />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Privacy Policy Modal */}
            {showPrivacyPolicy && (
                <PrivacyPolicy onClose={() => setShowPrivacyPolicy(false)} />
            )}
        </>
    );
}
