// ecosystem.config.js

module.exports = {
    apps: [
      {
        name: 'API',
        script: 'index.js',
        exec_mode: 'cluster_mode',
        instances: 'max',
        env: {
          NODE_ENV: 'production'
        }
      },
      {
        name: '',
        args: 'consumeMessage',
        exec_mode: 'fork',
        watch: false,
        script: '',
        instances: '1'
      }
    ]
  };