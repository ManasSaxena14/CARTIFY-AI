/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    light: '#4F46E5', // Indigo-600
                    DEFAULT: '#4F46E5',
                    dark: '#4338CA', // Indigo-700
                },
                secondary: {
                    light: '#F43F5E', // Rose-500
                    DEFAULT: '#E11D48', // Rose-600
                    dark: '#BE123C', // Rose-700
                },
                accent: {
                    light: '#2DD4BF', // Teal-400
                    DEFAULT: '#0F766E', // Teal-700
                    dark: '#115E59', // Teal-800
                },
                background: {
                    light: '#F9FAFB', // Gray-50
                    DEFAULT: '#FFFFFF',
                    dark: '#F1F5F9', // Slate-100
                },
                text: {
                    light: '#64748B', // Slate-500
                    DEFAULT: '#334155', // Slate-700
                    dark: '#0F172A', // Slate-900
                }
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
                heading: ['Playfair Display', 'serif'], // Elegant serif font for headings
                body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'slide-up': 'slideUp 0.5s ease-out forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [],
}
