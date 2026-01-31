/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        screens: {
            'xs': '475px',
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1536px',
        },
        extend: {
            colors: {
                primary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                },
                gray: {
                    50: '#f9fafb',
                    100: '#f3f4f6',
                    200: '#e5e7eb',
                    300: '#d1d5db',
                    400: '#9ca3af',
                    500: '#6b7280',
                    600: '#4b5563',
                    700: '#374151',
                    800: '#1f2937',
                    900: '#111827',
                }
            },
            fontFamily: {
                'sans': ['Inter', 'system-ui', 'sans-serif'],
                'mono': ['Fira Code', 'monospace'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.6s ease-out',
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 3s ease-in-out infinite',
                'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
                'fade-in-up': 'fadeInUp 0.6s ease-out',
                'stagger-fade-in': 'staggerFadeIn 0.5s ease-out forwards',
                'shimmer': 'shimmer 2s linear infinite',
                'float-slow': 'floatSlow 8s ease-in-out infinite',
                'pulse-soft': 'pulse 4s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translate3d(0, 10px, 0)' },
                    '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translate3d(0, 30px, 0)' },
                    '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
                    '50%': { transform: 'translate3d(0, -10px, 0)' },
                },
                floatSlow: {
                    '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
                    '50%': { transform: 'translate3d(0, -10px, 0)' },
                },
                bounceGentle: {
                    '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
                    '50%': { transform: 'translate3d(0, -5px, 0)' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translate3d(0, 30px, 0)' },
                    '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
                },
                staggerFadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200px 0' },
                    '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            }
        },
    },
    plugins: [require('@tailwindcss/typography')],
}
