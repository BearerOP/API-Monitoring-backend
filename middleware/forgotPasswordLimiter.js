const rateLimit = require("express-rate-limit");

// Create a rate limiter for the forgot password route
const forgotPasswordLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Limit each IP to 2 requests per windowMs
  message: (req, res) => {
    const now = Date.now();
    const resetTime = req.rateLimit.resetTime; // Time when the rate limit window resets
    const remainingTime = Math.max(0, resetTime - now); // Time remaining in milliseconds

    res.setHeader("Retry-After", Math.ceil(remainingTime / 1000)); // Retry-After header in seconds
    return res.status(429).json({
      success: false,
      message: "Too many requests, please try again later.",
      retryAfter: Math.ceil(remainingTime / 1000), // Dynamic time remaining in seconds
    });
  },
});

module.exports = forgotPasswordLimiter;