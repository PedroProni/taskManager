import jwt from "jsonwebtoken";
import User from "../models/User";

export default async (req, res, next) => {
  const publicRoutes = ['/', '/login', '/register'];
  
  if (publicRoutes.includes(req.path)) {
    return next();
  }

  const isApiRequest = req.path.startsWith('/api/');
  
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    if (isApiRequest) {
      return res.status(401).json({ errors: ["No authorization header"] });
    }
    return res.redirect('/login');
  }

  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ errors: ["No token provided"] });
  }

  try {
    const data = jwt.verify(token, process.env.TOKEN_SECRET);
    const { id, email } = data;
    
    const user = await User.findOne({ where: { id, email } });
    
    if (!user) {
      return res.status(401).json({ errors: ["User not found"] });
    }

    req.userId = id;
    req.userEmail = email;
    return next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({ errors: ["Invalid or expired token"] });
  }
};
