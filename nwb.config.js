module.exports = {
  type: 'react-component',
  npm: {
    esModules: false,
    umd: false
  },
  webpack: {
    html: {
      template: 'demo/public/index.html'
    }
  }
}
