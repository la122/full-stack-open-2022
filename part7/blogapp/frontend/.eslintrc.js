module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    jest: true,
    'cypress/globals': true
  },
  extends: ['plugin:react/recommended', 'standard'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  plugins: ['react', 'cypress'],
  rules: {
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 0,
    'no-unused-vars': 'warn',
    'react/no-unescaped-entities': 0,

    quotes: [2, 'single', { allowTemplateLiterals: true }]
  }
}
