/**
 * =============================================================================
 * VIGILANCE DASHBOARD - Tailwind CSS Configuration
 * =============================================================================
 * 
 * Custom military-grade theme configuration for the Vigilance dashboard.
 * 
 * Design System:
 * - Primary: Slate (dark backgrounds)
 * - Accent: Red (alerts, branding)
 * - Status Colors: Green (ok), Yellow (warning), Red (critical)
 * 
 * Custom animations:
 * - pulse-slow: Subtle pulsing for status indicators
 * - radar-sweep: Rotating radar effect for scanning animations
 * 
 * TODO: Customize colors to match your organization's branding
 * =============================================================================
 */

/** @type {import('tailwindcss').Config} */
export default {
    // Files to scan for Tailwind classes
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],

    theme: {
        extend: {
            // Custom color palette for military aesthetic
            colors: {
                // Primary dark backgrounds
                'command': {
                    900: '#0a0f1a',  // Darkest - main background
                    800: '#111827',  // Panels
                    700: '#1f2937',  // Cards
                    600: '#374151',  // Borders
                },
                // Accent red for branding and critical alerts
                'alert': {
                    50: '#fef2f2',
                    100: '#fee2e2',
                    200: '#fecaca',
                    300: '#fca5a5',
                    400: '#f87171',
                    500: '#ef4444',   // Standard red
                    600: '#dc2626',   // Critical
                    700: '#b91c1c',
                    800: '#991b1b',
                    900: '#7f1d1d',
                },
                // Status colors
                'status': {
                    operational: '#10b981',  // Green
                    warning: '#f59e0b',      // Amber
                    critical: '#ef4444',     // Red
                    offline: '#6b7280',      // Gray
                },
            },

            // Custom animations for military dashboard feel
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'radar-sweep': 'radar 4s linear infinite',
                'blink': 'blink 1s step-end infinite',
                'slide-in': 'slideIn 0.3s ease-out',
            },
            keyframes: {
                radar: {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                },
                blink: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0' },
                },
                slideIn: {
                    '0%': { transform: 'translateX(-10px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
            },

            // Font family for technical/military look
            fontFamily: {
                'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
                'display': ['Inter', 'system-ui', 'sans-serif'],
            },

            // Custom box shadows for depth
            boxShadow: {
                'glow-red': '0 0 20px rgba(239, 68, 68, 0.3)',
                'glow-green': '0 0 20px rgba(16, 185, 129, 0.3)',
                'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3)',
            },
        },
    },

    plugins: [],
};
