module.exports = {
  apps: [{
    name: "server",
    script: "./src/server.js",
    instances: "max",
    exec_mode: "cluster",
    out_file: "./src/logs/out.log",
    error_file: "./src/logs/errors.log",
    merge_logs: true,
    env_development: {
      NODE_ENV: "development",
      NODE_CLUSTER_SCHED_POLICY: "rr"
    },
    env_production: {
      NODE_ENV: "production"
    }
  }]
}