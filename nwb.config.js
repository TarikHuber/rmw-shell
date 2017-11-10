module.exports = {
  type: 'react-component',
  babel: {
    stage: 1
  },
  npm: {
    esModules: true,
    umd: {
      global: 'rmw-shell',
      externals: {
        react: 'React'
      }
    }
  },
  webpack: {
    html: {
      template: 'demo/public/index.html'
    }
  }
}
