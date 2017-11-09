module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'rmw-shell',
      externals: {
        react: 'React'
      }
    }
  }
}
