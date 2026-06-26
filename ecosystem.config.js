module.exports = {
  apps: [
    {
      name: "equitas-backend",
      cwd: "/var/www/equitas-ai/backend",
      script: "dist/main.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "700M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
    {
      name: "equitas-frontend",
      cwd: "/var/www/equitas-ai/frontend",
      script: "npm",
      args: "run start -- --port 3001",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "700M",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
    },
  ],
};
