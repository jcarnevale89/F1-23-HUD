module.exports = {
  root: true,
  extends: [
    '@nuxt/eslint-config',
    'plugin:vue/vue3-recommended',
    'plugin:vue-pug/vue3-recommended',
    '@vue/eslint-config-prettier',
    'prettier',
  ],
  rules: {
    'vue/multi-word-component-names': 'off',
  },
}
