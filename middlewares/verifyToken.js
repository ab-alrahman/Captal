const jwt = require("jsonwebtoken");

  function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    
    const token = req.cookies.token || (authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
      } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }
    } else {
      return res.status(401).json({ message: "No token provided" });
    }
  }

function verifyAdmin(req, res, next) {
  verifyToken(req, res, () => {
    console.log(req.user.role);
    if (req.user?.role === "admin") {
      next();
    } else {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }
  });
}

function verifyUser(req, res, next) {
  verifyToken(req, res, () => {
    const userIdFromToken = req.user?.id;
    const userIdFromRequest = req.params.userId || req.body.userId || req.query.userId;

    if (userIdFromToken === userIdFromRequest) {
      next();
    } else {
      return res.status(403).json({ message: "Access denied: Not the user" });
    }
  });
}

function verifyRoles(...allowedRoles) {
  return (req, res, next) => {
    verifyToken(req, res, () => {
      if (allowedRoles.includes(req.user?.role)) {
        next();
      } else {
        return res.status(403).json({ message: "Access denied: Insufficient role" });
      }
    });
  };
}

module.exports = { verifyToken, verifyAdmin, verifyUser, verifyRoles };
