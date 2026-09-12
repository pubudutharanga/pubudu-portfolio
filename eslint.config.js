import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
    { ignores: ['dist'] },
    {
        files: ['**/*.{js,jsx}'],
        languageOptions: {
            ecmaVersion: 2025,
            globals: globals.browser,
            parserOptions: {
                ecmaVersion: 'latest',
                ecmaFeatures: { jsx: true },
                sourceType: 'module',
            },
        },
        settings: { react: { version: '19.3' } },
        plugins: {
            react,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...react.configs.recommended.rules,
            ...react.configs['jsx-runtime'].rules,
            // react-hooks v7 recommended includes many new strict rules;
            // we keep the classic two for backward compatibility
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            'react/jsx-no-target-blank': 'off',
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            'no-unused-vars': 'off',
            'no-empty': ['error', { allowEmptyCatch: true }],
            'react/no-unknown-property': ['error', { ignore: ['object', 'intensity', 'position', 'attach', 'args'] }],
            'react/prop-types': 'off',
            'react/no-unescaped-entities': 'off',
        },
    },
    {
        files: ['scripts/*.js'],
        languageOptions: {
            globals: globals.node,
        }
    },
    {
        files: ['api/**/*.js'],
        languageOptions: {
            globals: globals.node,
        }
    },
    {
        files: ['vite.config.js', 'verify-schema.js'],
        languageOptions: {
            globals: globals.node,
        }
    }
]

