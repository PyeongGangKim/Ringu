module.exports = {

  apps : [{
  
    name: "ringu",
    
    script: './server/bin/www',
    
    instances: 3,
    
    exec_mode : 'cluster',
    
    merge_logs: true,
    
    autorestart: true,
    
    watch: true,
  
    env:{
    
      NODE_ENV: 'development',
    
    },
    
    env_production: {
    
      NODE_ENV: 'production'
    
    }
  
  },],
  
};
