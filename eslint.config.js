import jshowConfig from 'eslint-config-jshow';

const prettierConfigs = await jshowConfig.prettier(process.cwd());

export default [
  ...jshowConfig.react,
  ...prettierConfigs,
  {
    ignores: ['dist', 'node_modules', 'tests', 'skins', 'scripts']
  },
  {
    files: [
      'babel.config.js',
      'eslint.config.js',
      'jest.config.js',
      'jest.setup.ts',
      'metro.config.js',
      'tailwind.config.js',
      'src/theme/tokens.js'
    ],
    rules: {
      'no-undef': 'off',
      'no-restricted-globals': 'off'
    }
  },
  {
    rules: {
      // 'no-console': 'off',
      'no-void': 'off',
      // 'no-restricted-globals': 'off',
      'no-inline-comments': 'off',

      // '@typescript-eslint/no-require-imports': 'off',
      // '@typescript-eslint/no-invalid-void-type': 'off',
      // '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase', 'UPPER_CASE'],
          leadingUnderscore: 'allowSingleOrDouble',
          trailingUnderscore: 'allowSingleOrDouble'
        }
      ],

      'jshow/sort-import': [
        'error',
        {
          groups: [
            ['^@expo', 'expo'],
            ['^react'],
            ['^@jshow/'],
            ['^\\u0000', '^@?[a-zA-Z]'],
            ['^\\.\\./'],
            ['^\\./']
          ]
        }
      ]
    }
  }
];
