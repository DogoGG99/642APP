module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: { node: 'current' },
      modules: 'commonjs'
    }],
    '@babel/preset-typescript'
  ],
  plugins: [
    ['@babel/plugin-transform-modules-commonjs', {
      allowTopLevelThis: true,
      loose: true,
      strict: false
    }]
  ],
  ignore: [
    'node_modules/(?!(@shared|drizzle-zod|drizzle-orm|zod)/)'
  ]
};