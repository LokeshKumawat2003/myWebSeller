const logger = (req, res, next) => {
  const startTime = Date.now();
  
  // Log incoming request
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log(`  Headers:`, {
    contentType: req.headers['content-type'],
    authorization: req.headers['authorization'] ? 'Bearer ***' : 'None',
  });

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function (data) {
    const duration = Date.now() - startTime;
    console.log(`  Response: ${res.statusCode} (${duration}ms)`);
    if (res.statusCode >= 400) {
      console.log(`  Error:`, data.message || data);
    }
    return originalJson.call(this, data);
  };

  next();
};

module.exports = logger;
