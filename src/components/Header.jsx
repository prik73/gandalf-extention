import { Settings, Target } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getStreakData, updateStreak } from '../utils/streakTracker';

export default function Header({ userProfile, onSettingsClick, onGoalsClick }) {
    const [streakData, setStreakData] = useState(null);

    useEffect(() => {
        // Update streak on component mount
        const data = updateStreak();
        setStreakData(data);
    }, []);

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6 flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back, {userProfile?.name || 'Friend'}! 👋
                </h1>
                <p className="text-gray-600 mt-1">
                    {userProfile?.profession || 'Explorer'} • {userProfile?.age || '?'} years old
                </p>
            </div>

            <div className="flex items-center gap-3">
                {/* Streak Counter */}
                {streakData && streakData.currentStreak > 0 && (
                    <div
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg"
                        title={`${streakData.currentStreak}-day streak! Keep it up!`}
                    >
                        <span className="text-2xl">🔥</span>
                        <div className="text-left">
                            <div className="text-sm font-semibold text-orange-700">{streakData.currentStreak} Day Streak</div>
                            <div className="text-xs text-orange-600">Longest: {streakData.longestStreak}</div>
                        </div>
                    </div>
                )}

                {onGoalsClick && (
                    <button
                        onClick={onGoalsClick}
                        className="p-3 hover:bg-blue-50 rounded-lg transition-colors group"
                        title="Goals"
                    >
                        <Target size={24} className="text-gray-600 group-hover:text-blue-600 transition-colors" />
                    </button>
                )}

                {onSettingsClick && (
                    <button
                        onClick={onSettingsClick}
                        className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Settings"
                    >
                        <Settings size={24} className="text-gray-600" />
                    </button>
                )}
            </div>
        </div>
    );
}
