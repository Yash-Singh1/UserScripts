import eslintPluginUserScripts from 'eslint-plugin-userscripts';

export default [
  {
    files: ['./**/*.js'],
    parser: '@babel/eslint-parser',
    parserOptions: {
      requireConfigFile: false
    }
  },
  {
    files: ['./*_*/*.js'],
    ...eslintPluginUserScripts.configs.recommended
  }
];
