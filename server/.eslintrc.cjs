const path = require('path')

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
		project: path.join(__dirname, 'tsconfig.json'),
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint', 'promise', 'import'],
	rules: {
		'consistent-return': 'off',
		'no-restricted-syntax': 'off',
		'no-await-in-loop': 'off',
		'@typescript-eslint/ban-types': 'off',
		'new-cap': 'off',
		'no-param-reassign': 'off',
		'import/extensions': ['warn', 'never'],
		'import/prefer-default-export': 'off',
		'no-promise-executor-return': 'off',
		'node/no-missing-import': 'off',
		'node/no-unsupported-features/node-builtins': 'off',
		'no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars': [
			'warn',
			{
				varsIgnorePattern: '^_',
				argsIgnorePattern: '^_',
				destructuredArrayIgnorePattern: '^_',
			},
		],
		'no-unreachable': 'off',
		'prefer-const': 'off',
		'no-console': 'off',
		'prettier/prettier': 'warn',
		'no-underscore-dangle': 'off',
		'@typescript-eslint/naming-convention': 'off',
		'@typescript-eslint/lines-between-class-members': 'off',
		'max-classes-per-file': 'off',
		'@typescript-eslint/ban-ts-comment': 'off',
		'@typescript-eslint/no-explicit-any': 'off', // @NOTE: change value to 'warn' later
		'@typescript-eslint/no-empty-interface': 'off',
		'class-methods-use-this': 'off',
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
	ignorePatterns: ['dist', 'node_modules', '.eslintrc.cjs', 'ecosystem.config.js'],
}
