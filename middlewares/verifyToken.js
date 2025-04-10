const jwt = require("jsonwebtoken");

// function verifyToken(req, res, next) {
//   const authToken = req.headers.authorization;
//   // console.log(authToken);
//   if (authToken) {
//     const token = authToken.split(" ")[1];
//     // console.log(token);
//     try {
//       const decoded = jwt.verify(token, process.env.SECRET_KEY);
//       req.user = decoded;
//       next();
//     } catch (error) {
//       return res.status(401).json({ message: "Invalid token, access denied" });
//     }
//   } else {
//     res.status(401).json({ message: "No token provided, access denied" });
//   }
// }

// function verifyAdmin(req, res, next) {
//   verifyToken(req, res, () => {
//     if (req.user.role === 'Admin') {
//       next();
//     } else {
//       return res.status(403).json({ message: "Not allowed, only admin" });
//     }
//   });
// }

// function verifyUser(req, res, next) {
//   verifyToken(req, res, () => {
//     if (req.user.id === req.headers.authorization.split(" ")[1]) {
//       next();
//     } else {
//       return res.status(403).json({ message: "Not allowed, only the user" });
//     }
//   });
// }

// function verifyAuthorization(req, res, next) {
//   verifyToken(req, res, () => {
//     if (req.user.id === req.params.id || req.user.isAdmin) {
//       next();
//     } else {
//       return res.status(403).json({ message: "Not allowed, only user or admin" });
//     }
//   });
// }

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
}

function verifyAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user?.role === "Admin") {
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



module.exports = {
  verifyToken,
  verifyAdmin,
  verifyUser, 
  verifyRoles
};
