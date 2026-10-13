const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        message: 'Authorization token is missing'
      });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        message: 'Invalid token format'
      });
    }
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userId = decodedToken.userId;

    next();

  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired token'
    });
  }
};

module.exports = authMiddleware;