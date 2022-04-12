module.exports = {
	env: {
		browser: false,
		es2021: true,
		mocha: true,
		node: true,
	},
	plugins: ['@typescript-eslint', 'import'],
	extends: [
		'standard',
		'plugin:node/recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 12,
		project: 'tsconfig.json',
	},
	rules: {
		'node/no-unsupported-features/es-syntax': ['error', { ignores: ['modules'] }],
		'node/no-missing-import': 'off',
		'node/no-unsupported-features/node-builtins': 'off',
		'no-unused-vars': 'warn',
		'no-unreachable': 'off',
		'prefer-const': 'off',
	},
	ignorePatterns: ['dist/*', 'node_modules/*'],
}
