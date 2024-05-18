/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
    root: true,
    extends: ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/eslint-config-prettier', '@vue/eslint-config-typescript'],
    parserOptions: {
        ecmaVersion: 'latest'
    },
    overrides: [
        {
            files: ['*.ts'],
            parser: '@typescript-eslint/parser'
        }
    ],
    rules: {
        'vue/multi-word-component-names': 'off',
        'vue/no-reserved-component-names': 'off',
        'vue/component-tags-order': [
            'error',
            {
                order: ['script', 'template', 'style']
            }
        ]
    }
};
