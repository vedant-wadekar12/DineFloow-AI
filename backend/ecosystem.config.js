module.exports = {
  apps: [
    {
      name: "dineflow-backend",
      script: "dist/server.js",
      instances: 4,
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      restart_delay: 3000,
      kill_timeout: 5000,
      env: {
        NODE_ENV: "production",
        PORT: 5000,
      },
    },
  ],
};
