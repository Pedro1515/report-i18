module.exports = {
  env: {
    API_HOST: process.env.API_HOST
  },
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/projects",
      },
    ];
  },
};
