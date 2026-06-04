import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FBF6E6',
          100: '#F5D78E',
          200: '#EDC76A',
          300: '#E0B850',
          400: '#D4AD3F',
          500: '#C9A84C',
          600: '#A88A3A',
          700: '#866C2C',
          800: '#5E4B1E',
          900: '#3D3013'
        },
        navy: {
          50: '#E8EAF2',
          100: '#C5C9DC',
          200: '#9CA3BF',
          300: '#737CA2',
          400: '#535D8B',
          500: '#333F75',
          600: '#26305C',
          700: '#1B2347',
          800: '#121833',
          900: '#0A0E20'
        }
      },
      fontFamily: {
        amiri: ['Amiri', 'serif'],
        naskh: ['"Noto Naskh Arabic"', 'serif'],
        scheherazade: ['"Scheherazade New"', 'serif'],
        cairo: ['Cairo', 'sans-serif']
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A84C 0%, #F5D78E 100%)',
        'gold-gradient-radial': 'radial-gradient(circle, #F5D78E 0%, #C9A84C 100%)',
        'luxury-dark':
          'radial-gradient(ellipse at top, #1B2347 0%, #0a0e20 60%, #050813 100%)'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-scale': 'fadeInScale 0.5s ease-out',
        shimmer: 'shimmer 3s linear infinite',
        'pulse-gold': 'pulseGold 2s ease-out infinite',
        'float-y': 'floatY 3s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeInScale: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' }
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(201,168,76,0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(201,168,76,0)' }
        },
        floatY: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        }
      },
      boxShadow: {
        'gold-glow': '0 0 30px -5px rgba(245,215,142,0.3)',
        'gold-strong': '0 10px 40px -5px rgba(201,168,76,0.5)',
        luxe:
          '0 8px 32px -8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(245,215,142,0.05)'
      }
    }
  },
  plugins: []
};

export default config;
