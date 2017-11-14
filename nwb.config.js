const path = require('path')

module.exports = {
  type: 'react-component',
  npm: {
    esModules: false,
    umd: false
  },
  webpack: {
    html: {
      template: 'demo/public/index.html'
    },
    aliases: {
      'rmw-shell/lib': path.resolve('src')
    }
  }
}
