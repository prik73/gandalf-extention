import { useState } from 'react';
import { Plus, X, Check, Calendar, Clock, Flag, Sparkles } from 'lucide-react';

// Goal templates by profession
const GOAL_TEMPLATES = {
    'Software Engineer': [
        { text: 'Code review 2 PRs', time: '1h', priority: 'medium' },
        { text: 'Learn new technology/framework', time: '2h', priority: 'high' },
        { text: 'Ship feature to production', time: '4h', priority: 'high' },
        { text: 'Write technical documentation', time: '1h', priority: 'low' },
    ],
    'Student': [
        { text: 'Study for upcoming exam', time: '3h', priority: 'high' },
        { text: 'Complete assignment', time: '2h', priority: 'high' },
        { text: 'Attend all lectures', time: '4h', priority: 'medium' },
        { text: 'Review class notes', time: '1h', priority: 'medium' },
    ],
    'Entrepreneur': [
        { text: 'Customer discovery calls', time: '2h', priority: 'high' },
        { text: 'Product development', time: '4h', priority: 'high' },
        { text: 'Marketing/social media', time: '1h', priority: 'medium' },
        { text: 'Investor outreach', time: '2h', priority: 'medium' },
    ],
    'Designer': [
        { text: 'Create design mockups', time: '3h', priority: 'high' },
        { text: 'Client feedback review', time: '1h', priority: 'high' },
        { text: 'Design system updates', time: '2h', priority: 'medium' },
        { text: 'Portfolio work', time: '2h', priority: 'low' },
    ],
    'Default': [
        { text: 'Focus work session', time: '2h', priority: 'high' },
        { text: 'Learning/skill development', time: '1h', priority: 'medium' },
        { text: 'Exercise/health', time: '1h', priority: 'medium' },
        { text: 'Personal project', time: '2h', priority: 'low' },
    ],
};

const PRIORITY_CONFIG = {
    high: { label: 'High', color: 'red', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
    medium: { label: 'Medium', color: 'amber', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
    low: { label: 'Low', color: 'blue', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
};

export default function GoalsSettings({ userProfile, onSave, onClose }) {
    const [dailyGoals, setDailyGoals] = useState(userProfile?.dailyGoals || []);
    const [weeklyGoals, setWeeklyGoals] = useState(userProfile?.weeklyGoals || []);
    const [newDailyGoal, setNewDailyGoal] = useState('');
    const [newDailyTime, setNewDailyTime] = useState('');
    const [newDailyPriority, setNewDailyPriority] = useState('medium');
    const [newWeeklyGoal, setNewWeeklyGoal] = useState('');
    const [showTemplates, setShowTemplates] = useState(false);

    const profession = userProfile?.profession || 'Default';
    const templates = GOAL_TEMPLATES[profession] || GOAL_TEMPLATES['Default'];

    const addDailyGoal = () => {
        if (newDailyGoal.trim()) {
            const goal = {
                id: Date.now(),
                text: newDailyGoal.trim(),
                completed: false,
                priority: newDailyPriority,
                timeEstimate: newDailyTime.trim() || null,
                createdAt: new Date().toISOString(),
            };
            setDailyGoals([...dailyGoals, goal]);
            setNewDailyGoal('');
            setNewDailyTime('');
            setNewDailyPriority('medium');
        }
    };

    const addFromTemplate = (template) => {
        const goal = {
            id: Date.now(),
            text: template.text,
            completed: false,
            priority: template.priority,
            timeEstimate: template.time,
            createdAt: new Date().toISOString(),
        };
        setDailyGoals([...dailyGoals, goal]);
        setShowTemplates(false);
    };

    const removeDailyGoal = (id) => {
        setDailyGoals(dailyGoals.filter((goal) => goal.id !== id));
    };

    const toggleDailyGoal = (id) => {
        setDailyGoals(
            dailyGoals.map((goal) =>
                goal.id === id ? { ...goal, completed: !goal.completed } : goal
            )
        );
    };

    const addWeeklyGoal = () => {
        if (newWeeklyGoal.trim()) {
            const goal = {
                id: Date.now(),
                text: newWeeklyGoal.trim(),
                progress: 0,
                createdAt: new Date().toISOString(),
            };
            setWeeklyGoals([...weeklyGoals, goal]);
            setNewWeeklyGoal('');
        }
    };

    const removeWeeklyGoal = (id) => {
        setWeeklyGoals(weeklyGoals.filter((goal) => goal.id !== id));
    };

    const updateWeeklyProgress = (id, progress) => {
        setWeeklyGoals(
            weeklyGoals.map((goal) =>
                goal.id === id ? { ...goal, progress: parseInt(progress) } : goal
            )
        );
    };

    const handleSave = () => {
        const updatedProfile = {
            ...userProfile,
            dailyGoals,
            weeklyGoals,
            preferences: {
                ...userProfile?.preferences,
                dailyReminderTime: '22:00',
                weeklyReminderTime: '20:00',
            },
        };
        localStorage.setItem('gandalf_user_profile', JSON.stringify(updatedProfile));
        onSave(updatedProfile);
    };

    const getPriorityConfig = (priority) => PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;

    // Sort daily goals by priority
    const sortedDailyGoals = [...dailyGoals].sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });


    // If onClose is null (embedded in SettingsModal), don't show modal wrapper
    if (!onClose) {
        return (
            <div className="space-y-6">
                {/* Daily Goals Section */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">📅 Daily Goals</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Set daily tasks you want to accomplish. We'll check your progress at 10pm each day.
                    </p>
                    {/* Daily goals content - simplified for embedded view */}
                    <div className="space-y-2 mb-4">
                        {sortedDailyGoals.map((goal) => {
                            const config = getPriorityConfig(goal.priority);
                            return (
                                <div key={goal.id} className={`flex items-center gap-3 p-3 rounded-lg border ${config.border} ${config.bg}`}>
                                    <button onClick={() => toggleDailyGoal(goal.id)} className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${goal.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-green-500'}`}>
                                        {goal.completed && <Check size={14} className="text-white" />}
                                    </button>
                                    <span className={`flex-1 ${goal.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>{goal.text}</span>
                                    {goal.timeEstimate && <span className="flex items-center gap-1 text-xs text-gray-600"><Clock size={12} />{goal.timeEstimate}</span>}
                                    <span className={`text-xs font-medium px-2 py-1 rounded ${config.text} ${config.bg}`}><Flag size={12} className="inline mr-1" />{config.label}</span>
                                    <button onClick={() => removeDailyGoal(goal.id)} className="text-red-500 hover:text-red-700 transition-colors"><X size={18} /></button>
                                </div>
                            );
                        })}
                    </div>
                    {/* Add daily goal */}
                    <div className="flex gap-2">
                        <input type="text" value={newDailyGoal} onChange={(e) => setNewDailyGoal(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addDailyGoal()} placeholder="e.g., Code for 4 hours..." maxLength="100" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        <input type="text" value={newDailyTime} onChange={(e) => { const value = e.target.value; if (value === '' || /^(\d+h)?(\d+m)?$/.test(value)) { setNewDailyTime(value); } }} placeholder="2h or 30m" maxLength="6" className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" />
                        <select value={newDailyPriority} onChange={(e) => setNewDailyPriority(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                        <button onClick={addDailyGoal} className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all flex items-center gap-2"><Plus size={18} />Add</button>
                    </div>
                </div>

                {/* Weekly Goals Section */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">📊 Weekly Goals</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Set weekly objectives. We'll review your progress every Sunday at 8pm.
                    </p>
                    {/* Weekly goals content */}
                    <div className="space-y-4 mb-4">
                        {weeklyGoals.map((goal) => (
                            <div key={goal.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-start justify-between mb-3">
                                    <span className="text-gray-900 font-medium">{goal.text}</span>
                                    <button onClick={() => removeWeeklyGoal(goal.id)} className="text-red-500 hover:text-red-700 transition-colors"><X size={18} /></button>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Progress</span>
                                        <span className="font-semibold text-gray-900">{goal.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${goal.progress}%` }} />
                                    </div>
                                    <input type="range" min="0" max="100" value={goal.progress} onChange={(e) => updateWeeklyProgress(goal.id, e.target.value)} className="w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Add weekly goal */}
                    <div className="flex gap-2">
                        <input type="text" value={newWeeklyGoal} onChange={(e) => setNewWeeklyGoal(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addWeeklyGoal()} placeholder="e.g., Ship new feature..." maxLength="100" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        <button onClick={addWeeklyGoal} className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all flex items-center gap-2"><Plus size={18} />Add</button>
                    </div>
                </div>

                {/* Save button for embedded view */}
                <div className="flex justify-end pt-6 border-t border-gray-100">
                    <button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all font-medium shadow-sm hover:shadow-md">
                        Save Goals
                    </button>
                </div>
            </div>
        );
    }

    // Standalone modal view (when onClose is provided)
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 fade-in">
            <div className="bg-white border border-gray-200 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-lg flex flex-col">
                <div className="border-b border-gray-200 p-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold">🎯 Set Your Goals</h2>
                        <p className="text-sm text-gray-500 mt-1">Track daily tasks and weekly objectives</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={24} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Daily Goals Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">📅 Daily Goals</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Set daily tasks you want to accomplish. We'll check your progress at 10pm each day.
                        </p>
                        <div className="space-y-2 mb-4">
                            {sortedDailyGoals.map((goal) => {
                                const config = getPriorityConfig(goal.priority);
                                return (
                                    <div key={goal.id} className={`flex items-center gap-3 p-3 rounded-lg border ${config.border} ${config.bg}`}>
                                        <button onClick={() => toggleDailyGoal(goal.id)} className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${goal.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-green-500'}`}>
                                            {goal.completed && <Check size={14} className="text-white" />}
                                        </button>
                                        <span className={`flex-1 ${goal.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>{goal.text}</span>
                                        {goal.timeEstimate && <span className="flex items-center gap-1 text-xs text-gray-600"><Clock size={12} />{goal.timeEstimate}</span>}
                                        <span className={`text-xs font-medium px-2 py-1 rounded ${config.text} ${config.bg}`}><Flag size={12} className="inline mr-1" />{config.label}</span>
                                        <button onClick={() => removeDailyGoal(goal.id)} className="text-red-500 hover:text-red-700 transition-colors"><X size={18} /></button>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex gap-2">
                            <input type="text" value={newDailyGoal} onChange={(e) => setNewDailyGoal(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addDailyGoal()} placeholder="e.g., Code for 4 hours..." maxLength="100" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            <input type="text" value={newDailyTime} onChange={(e) => { const value = e.target.value; if (value === '' || /^(\d+h)?(\d+m)?$/.test(value)) { setNewDailyTime(value); } }} placeholder="2h or 30m" maxLength="6" className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" />
                            <select value={newDailyPriority} onChange={(e) => setNewDailyPriority(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                            <button onClick={addDailyGoal} className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all flex items-center gap-2"><Plus size={18} />Add</button>
                        </div>
                    </div>

                    {/* Weekly Goals Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">📊 Weekly Goals</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Set weekly objectives. We'll review your progress every Sunday at 8pm.
                        </p>
                        <div className="space-y-4 mb-4">
                            {weeklyGoals.map((goal) => (
                                <div key={goal.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-start justify-between mb-3">
                                        <span className="text-gray-900 font-medium">{goal.text}</span>
                                        <button onClick={() => removeWeeklyGoal(goal.id)} className="text-red-500 hover:text-red-700 transition-colors"><X size={18} /></button>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Progress</span>
                                            <span className="font-semibold text-gray-900">{goal.progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${goal.progress}%` }} />
                                        </div>
                                        <input type="range" min="0" max="100" value={goal.progress} onChange={(e) => updateWeeklyProgress(goal.id, e.target.value)} className="w-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input type="text" value={newWeeklyGoal} onChange={(e) => setNewWeeklyGoal(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addWeeklyGoal()} placeholder="e.g., Ship new feature..." maxLength="100" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            <button onClick={addWeeklyGoal} className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all flex items-center gap-2"><Plus size={18} />Add</button>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-200 p-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium">Cancel</button>
                    <button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all font-medium shadow-sm hover:shadow-md">Save Goals</button>
                </div>
            </div>
        </div>
    );
}
