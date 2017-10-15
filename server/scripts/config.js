const config = {
  FWA_1568: {
    enabled: process.env.FWA_1568_ENABLED === 'true' || false
  },
  FWA_1597: {
    enabled: process.env.FWA_1597_ENABLED === 'true' || false
  }
};

export default config;