module.exports = function checkUserAccess(req, res, next) {
  const user = req.user; 
  // console.log(user);
  if (!user || !user.role) {
    return res.status(400).json({ message: 'User role is required' });
  }

  if (user.role === "Admin") {
    return next();
  }

  if (user.role === 'Contractor') {
    if (user.status === 'qualified') {
      return next();
    } else if (user.status === 'visitor') {
      return res.status(403).json({ message: 'Contractor is a visitor. Please complete your Log in.' });
    } else {
      return res.status(400).json({ message: 'Unknown contractor status.' });
    }
  }

  if (user.role === 'Provider') {
    return next(); 
  }

  return res.status(400).json({ message: 'Unknown role.' });
};
