module.exports = {
	root: true,
	env: {
		browser: false,
		es2021: true,
		node: true,
	},
	extends: [
		'airbnb-base',
		'airbnb-typescript/base',
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 12,
		project: './tsconfig.json',
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint', 'promise', 'import'],
	rules: {
		'node/no-missing-import': 'off',
		'node/no-unsupported-features/node-builtins': 'off',
		'no-unused-vars': 'warn',
		'no-unreachable': 'off',
		'prefer-const': 'off',
		'@typescript-eslint/no-this-alias': 'off',
		'no-console': 'off',
		'prettier/prettier': 'off',
	},
	settings: {
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts'],
		},
		'import/resolver': {
			typescript: {
				alwaysTryTypes: true,
			},
		},
	},
	ignorePatterns: ['dist', 'node_modules', '.eslintrc.cjs'],
}
