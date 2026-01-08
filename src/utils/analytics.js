// Google Analytics 4 wrapper with privacy compliance
const GA_MEASUREMENT_ID = 'G-XCVS8J4CFH'; // Your actual GA4 measurement ID

class Analytics {
    constructor() {
        this.enabled = false;
        this.initialized = false;
        this.init();
    }

    async init() {
        try {
            const result = await chrome.storage.sync.get(['analytics_consent']);
            this.enabled = result.analytics_consent === true;

            if (this.enabled && !this.initialized) {
                this.loadGA4();
            }
        } catch (error) {
            console.error('Analytics init error:', error);
        }
    }

    loadGA4() {
        if (this.initialized) return;

        // Create script element
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        document.head.appendChild(script);

        // Initialize dataLayer
        window.dataLayer = window.dataLayer || [];
        function gtag() {
            window.dataLayer.push(arguments);
        }
        window.gtag = gtag;

        gtag('js', new Date());
        gtag('config', GA_MEASUREMENT_ID, {
            anonymize_ip: true,
            send_page_view: false,
            cookie_flags: 'SameSite=None;Secure'
        });

        this.initialized = true;
        console.log('✅ Analytics initialized');
    }

    async setConsent(granted) {
        await chrome.storage.sync.set({ analytics_consent: granted });
        this.enabled = granted;

        if (granted && !this.initialized) {
            this.loadGA4();
        }
    }

    track(eventName, properties = {}) {
        if (!this.enabled || !this.initialized) return;

        try {
            window.gtag('event', eventName, {
                ...properties,
                // Add timestamp
                event_timestamp: new Date().toISOString()
            });
            console.log('📊 Tracked:', eventName, properties);
        } catch (error) {
            console.error('Analytics track error:', error);
        }
    }

    async setUserId(userId) {
        if (!this.enabled || !this.initialized) return;

        try {
            window.gtag('config', GA_MEASUREMENT_ID, {
                user_id: userId
            });
        } catch (error) {
            console.error('Analytics setUserId error:', error);
        }
    }

    // Predefined event helpers
    trackPageView(pageName) {
        this.track('page_view', { page_name: pageName });
    }

    trackOnboardingComplete(profile) {
        this.track('onboarding_complete', {
            has_name: !!profile.name,
            has_age: !!profile.age,
            has_profession: !!profile.profession,
            has_goals: !!profile.goals
        });
    }

    trackGoalCreated(goalType, priority) {
        this.track('goal_created', {
            goal_type: goalType,
            priority: priority || 'none'
        });
    }

    trackGoalCompleted(goalType) {
        this.track('goal_completed', {
            goal_type: goalType
        });
    }

    trackInsightGenerated(timeRange, hasProfile) {
        this.track('insight_generated', {
            time_range: timeRange,
            has_profile: hasProfile
        });
    }

    trackTimeRangeChanged(from, to) {
        this.track('time_range_changed', {
            from_range: from,
            to_range: to
        });
    }

    trackSettingsOpened(tab) {
        this.track('settings_opened', {
            tab: tab || 'profile'
        });
    }

    trackStreakMilestone(streakDays) {
        this.track('streak_milestone', {
            streak_days: streakDays
        });
    }
}

// Export singleton instance
const analytics = new Analytics();
export default analytics;
