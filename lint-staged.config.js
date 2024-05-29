module.exports = {
  'src/**/*.{js,jsx,ts,tsx}': ['prettier --write', 'eslint --fix'],
  'test/**/*.{js,jsx,ts,tsx}': ['prettier --write', 'eslint --fix'],
  '**/*.{json,md}': ['prettier --write'],
};
