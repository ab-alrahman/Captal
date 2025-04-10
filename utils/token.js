const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, phone: user.phone },
    process.env.SECRET_KEY,
    { expiresIn: '7d' }
  );
};

module.exports = generateToken;
