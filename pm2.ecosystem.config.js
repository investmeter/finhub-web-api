module.exports = {
    apps : [{
            name:'strapi',
             cwd: '/home/ubuntu/strapi-test',
            script: 'npm',
            args: 'start',
  
            env: {
              NODE_ENV: 'production'
       }},
            {
                    name:'finhub-web-api',
                    cwd:'/home/ubuntu/finhub-web-api',
                    script: './gateway.js',
                      env: {
              NODE_ENV: 'production'
       }
  
  
    },
            {name:'finhub-web-front',
                    cwd:'/home/ubuntu/finhub-web-front',
  
                    script: 'yarn',
                    args: 'start',
  
            env: {
              NODE_ENV: 'production'
       }}
  
    ]
  
  };