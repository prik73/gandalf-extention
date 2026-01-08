import { useState } from 'react';

export default function ProfileSettings({ userProfile, onSave }) {
    const [formData, setFormData] = useState({
        name: userProfile?.name || '',
        age: userProfile?.age || '',
        profession: userProfile?.profession || '',
        goals: userProfile?.goals || '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = () => {
        const updatedProfile = {
            ...userProfile,
            ...formData,
            isIncomplete: false, // Mark profile as complete
        };
        onSave(updatedProfile);
    };

    return (
        <div className="space-y-6">
            {/* Name */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name
                </label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    maxLength="50"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow hover:border-gray-300"
                />
            </div>

            {/* Age */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Age
                </label>
                <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Your age"
                    min="13"
                    max="120"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow hover:border-gray-300"
                />
                <p className="text-xs text-gray-500 mt-2">Must be between 13 and 120</p>
            </div>

            {/* Profession */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Profession
                </label>
                <input
                    type="text"
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    placeholder="e.g., Software Engineer, Student..."
                    maxLength="50"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow hover:border-gray-300"
                />
            </div>

            {/* Long-term Goals */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Long-term Goals (6-12 months)
                </label>
                <textarea
                    name="goals"
                    value={formData.goals}
                    onChange={handleChange}
                    placeholder="e.g., Launch my startup, Learn machine learning..."
                    rows="4"
                    maxLength="500"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-shadow hover:border-gray-300"
                />
                <p className="text-xs text-gray-500 mt-2">{formData.goals.length}/500 characters</p>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all font-medium shadow-sm hover:shadow-md"
                >
                    Save Profile
                </button>
            </div>
        </div>
    );
}
