import { useState } from 'react';
import { Plus, X, Check, ArrowRight, ArrowLeft } from 'lucide-react';

export default function OnboardingModal({ onComplete }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        profession: '',
        goals: '',
        dailyGoals: [],
        weeklyGoals: [],
    });
    const [newDailyGoal, setNewDailyGoal] = useState('');
    const [newWeeklyGoal, setNewWeeklyGoal] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleNext = () => {
        if (step < 5) {
            setStep(step + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleSubmit = () => {
        const profile = {
            ...formData,
            preferences: {
                dailyReminderTime: '22:00', // 10pm
                weeklyReminderDay: 'sunday',
                weeklyReminderTime: '20:00', // 8pm
            },
        };
        localStorage.setItem('gandalf_user_profile', JSON.stringify(profile));
        onComplete(profile);
    };

    const handleSkip = () => {
        // Save whatever data user has entered so far (partial profile)
        const partialProfile = {
            ...formData, // Keep any data they've entered
            isIncomplete: true, // Mark as incomplete since they skipped
            preferences: {
                dailyReminderTime: '22:00',
                weeklyReminderDay: 'sunday',
                weeklyReminderTime: '20:00',
            },
        };
        localStorage.setItem('gandalf_user_profile', JSON.stringify(partialProfile));
        onComplete(partialProfile);
    };

    const canProceed = () => {
        switch (step) {
            case 1:
                return formData.name.trim().length > 0;
            case 2:
                return formData.age && parseInt(formData.age) > 0;
            case 3:
                return formData.profession.trim().length > 0;
            case 4:
                return formData.goals.trim().length > 10;
            case 5:
                return true; // Goals step is optional
            default:
                return false;
        }
    };

    // Daily goals management
    const addDailyGoal = () => {
        if (newDailyGoal.trim()) {
            setFormData({
                ...formData,
                dailyGoals: [
                    ...formData.dailyGoals,
                    {
                        id: Date.now(),
                        text: newDailyGoal.trim(),
                        completed: false,
                    },
                ],
            });
            setNewDailyGoal('');
        }
    };

    const removeDailyGoal = (id) => {
        setFormData({
            ...formData,
            dailyGoals: formData.dailyGoals.filter((goal) => goal.id !== id),
        });
    };

    // Weekly goals management
    const addWeeklyGoal = () => {
        if (newWeeklyGoal.trim()) {
            setFormData({
                ...formData,
                weeklyGoals: [
                    ...formData.weeklyGoals,
                    {
                        id: Date.now(),
                        text: newWeeklyGoal.trim(),
                        progress: 0,
                    },
                ],
            });
            setNewWeeklyGoal('');
        }
    };

    const removeWeeklyGoal = (id) => {
        setFormData({
            ...formData,
            weeklyGoals: formData.weeklyGoals.filter((goal) => goal.id !== id),
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 fade-in">
            <div className="bg-white border border-gray-200 rounded-xl max-w-2xl w-full shadow-lg p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl mb-2">🧙 Gandalf</h1>
                    <p className="text-gray-600">
                        Before we begin, I need to know you better...
                    </p>
                </div>

                {/* Progress */}
                <div className="flex gap-2 mb-8">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <div
                            key={s}
                            className={`h-2 flex-1 rounded-full transition-all ${s <= step ? 'bg-gray-900' : 'bg-gray-200'
                                }`}
                        />
                    ))}
                </div>

                {/* Step 1: Name */}
                {step === 1 && (
                    <div className="fade-in">
                        <h2 className="text-2xl font-semibold mb-4">What should I call you?</h2>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent mb-4"
                            autoFocus
                        />
                        <p className="text-sm text-gray-600">
                            Your name helps me address you personally in my insights.
                        </p>
                    </div>
                )}

                {/* Step 2: Age */}
                {step === 2 && (
                    <div className="fade-in">
                        <h2 className="text-2xl font-semibold mb-4">How old are you?</h2>
                        <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            placeholder="Enter your age..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent mb-4"
                            min="13"
                            max="120"
                            autoFocus
                        />
                        <p className="text-sm text-gray-600">
                            Age context helps me understand your life stage and priorities. Must be 13 or older.
                        </p>
                    </div>
                )}

                {/* Step 3: Profession */}
                {step === 3 && (
                    <div className="fade-in">
                        <h2 className="text-2xl font-semibold mb-4">What do you do?</h2>
                        <input
                            type="text"
                            name="profession"
                            value={formData.profession}
                            onChange={handleChange}
                            placeholder="e.g., Software Engineer, Student, Designer..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent mb-4"
                            autoFocus
                        />
                        <p className="text-sm text-gray-600">
                            Your profession helps me judge if your browsing aligns with your work.
                        </p>
                    </div>
                )}

                {/* Step 4: Long-term Goals */}
                {step === 4 && (
                    <div className="fade-in">
                        <h2 className="text-2xl font-semibold mb-4">What are your goals?</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Tell me your goals for the next 6-12 months. Be specific!
                        </p>
                        <textarea
                            name="goals"
                            value={formData.goals}
                            onChange={handleChange}
                            placeholder="e.g., Launch my startup, Learn machine learning, Get promoted, Build a portfolio..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent mb-4 min-h-[120px]"
                            autoFocus
                        />
                        <p className="text-sm text-gray-600">
                            I'll judge your browsing patterns against these goals and guide you accordingly.
                        </p>
                    </div>
                )}

                {/* Step 5: Daily & Weekly Goals (Optional) */}
                {step === 5 && (
                    <div className="fade-in">
                        <h2 className="text-2xl font-semibold mb-2">Set Daily & Weekly Goals</h2>
                        <p className="text-sm text-gray-600 mb-6">
                            Optional: Track daily tasks and weekly objectives. I'll check your progress at 10pm daily and Sunday 8pm.
                        </p>

                        {/* Daily Goals */}
                        <div className="mb-6">
                            <h3 className="font-semibold mb-3">📅 Daily Goals</h3>
                            <div className="space-y-2 mb-3">
                                {formData.dailyGoals.map((goal) => (
                                    <div
                                        key={goal.id}
                                        className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200"
                                    >
                                        <span className="flex-1 text-sm">{goal.text}</span>
                                        <button
                                            onClick={() => removeDailyGoal(goal.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newDailyGoal}
                                    onChange={(e) => setNewDailyGoal(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && addDailyGoal()}
                                    placeholder="e.g., Code for 4 hours..."
                                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                                />
                                <button
                                    onClick={addDailyGoal}
                                    className="bg-gray-900 text-white px-3 py-2 rounded-lg hover:bg-gray-800 flex items-center gap-1"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Weekly Goals */}
                        <div>
                            <h3 className="font-semibold mb-3">📊 Weekly Goals</h3>
                            <div className="space-y-2 mb-3">
                                {formData.weeklyGoals.map((goal) => (
                                    <div
                                        key={goal.id}
                                        className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200"
                                    >
                                        <span className="flex-1 text-sm">{goal.text}</span>
                                        <button
                                            onClick={() => removeWeeklyGoal(goal.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newWeeklyGoal}
                                    onChange={(e) => setNewWeeklyGoal(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && addWeeklyGoal()}
                                    placeholder="e.g., Ship new feature..."
                                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                                />
                                <button
                                    onClick={addWeeklyGoal}
                                    className="bg-gray-900 text-white px-3 py-2 rounded-lg hover:bg-gray-800 flex items-center gap-1"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 mt-8">
                    {step > 1 && (
                        <button
                            onClick={handleBack}
                            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                            <ArrowLeft size={18} />
                            Back
                        </button>
                    )}

                    <button
                        onClick={handleSkip}
                        className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                    >
                        Skip for Now
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={!canProceed()}
                        className={`flex-1 px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${canProceed()
                            ? 'bg-gray-900 text-white hover:bg-gray-800'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {step < 5 ? (
                            <>
                                Next
                                <ArrowRight size={18} />
                            </>
                        ) : (
                            'Begin Journey'
                        )}
                    </button>
                </div>

                {/* Step indicator */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    Step {step} of 5 {step === 5 && '(Optional)'}
                </p>
            </div>
        </div>
    );
}
