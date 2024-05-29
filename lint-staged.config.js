module.exports = {
  '**/*.{js,jsx,ts,tsx}': [
    'prettier -w .',
    'tsc -p tsconfig.json',
    'eslint --fix',
    'next lint .',
  ],
};
