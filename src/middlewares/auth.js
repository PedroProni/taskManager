import jwt from "jsonwebtoken";
import User from "../models/User";

export default async (req, res, next) => {
  const publicPaths = ['/login', '/register', '/favicon.ico'];
  if (publicPaths.includes(req.path) || req.path.startsWith('/assets/')) {
    return next();
  }

  const { authorization } = req.headers;

  const isApiRequest =
    req.xhr ||
    req.path.startsWith('/tasks') ||
    req.headers.accept?.includes('application/json') ||
    req.headers['content-type']?.includes('application/json');

  if (!authorization) {
    if (isApiRequest) {
      return res.status(401).json({
        errors: ["Login required"],
      });
    }
    return res.redirect('/login');
  }

  try {
    const [, token] = authorization.split(" ");
    const data = jwt.verify(token, process.env.TOKEN_SECRET);
    const { id, email } = data;

    const user = await User.findOne({ where: { id, email } });
    if (!user) {
      if (isApiRequest) {
        return res.status(401).json({
          errors: ["Invalid user"],
        });
      }
      return res.redirect('/login');
    }

    req.userId = id;
    req.userEmail = email;
    return next();
  } catch (err) {
    console.error('Auth Error:', err);
    if (isApiRequest) {
      return res.status(401).json({
        errors: ["Token invalid"],
      });
    }
    return res.redirect('/login');
  }
};
