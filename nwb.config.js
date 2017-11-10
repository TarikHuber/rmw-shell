module.exports = {
  type: 'react-component',
  babel: {
    cherryPick: 'some-module'
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
