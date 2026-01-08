import { create } from 'zustand';

// Zustand store for app state
const useAppStore = create((set) => ({
    // Time range state
    timeRange: 'today',
    setTimeRange: (range) => set({ timeRange: range }),

    // Analysis state
    analysis: null,
    setAnalysis: (data) => set({ analysis: data }),

    // User profile state
    userProfile: null,
    setUserProfile: (profile) => set({ userProfile: profile }),

    // Loading states
    loading: false,
    setLoading: (isLoading) => set({ loading: isLoading }),

    // Modal states
    showOnboarding: false,
    showSettings: false,
    showGoals: false,
    setShowOnboarding: (show) => set({ showOnboarding: show }),
    setShowSettings: (show) => set({ showSettings: show }),
    setShowGoals: (show) => set({ showGoals: show }),

    // Insights state
    insights: null,
    setInsights: (data) => set({ insights: data }),
}));

export default useAppStore;
