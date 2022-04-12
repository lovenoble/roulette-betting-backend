module.exports = {
	env: {
		browser: false,
		es2021: true,
		node: true,
	},
	plugins: ['@typescript-eslint', 'promise', 'import'],
	extends: ['airbnb-base', 'airbnb-typescript/base', 'prettier'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		project: 'tsconfig.json'
	},
	settings: {
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts'],
		},
	},
	rules: {
		'node/no-unsupported-features/es-syntax': ['error', { ignores: ['modules'] }],
		'node/no-missing-import': 'off',
		'node/no-unsupported-features/node-builtins': 'off',
		'no-unused-vars': 'warn',
		'no-unreachable': 'off',
		'prefer-const': 'off',
		'@typescript-eslint/no-this-alias': 'off',
	},
	ignorePatterns: ['dist/*', 'node_modules/*', '.eslintrc.js'],
}
