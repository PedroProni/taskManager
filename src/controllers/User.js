import User from "../models/User";
import jwt from "jsonwebtoken";

class UserC {
  async register(req, res) {
    try {
      const newUser = await User.create(req.body);
      const { id, email } = newUser;

      const token = jwt.sign({ id, email }, process.env.TOKEN_SECRET, {
        expiresIn: "1d",
      });

      res.status(200).json({ access_token: token });
    } catch (err) {
      return res.status(400).json({ errors: err.errors.map((e) => e.message) });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ errors: ["Invalid credentials"] });
      }
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ errors: ["User not found"] });
      }
      if (!(await user.checkPassword(password))) {
        return res.status(400).json({ errors: ["Invalid password"] });
      }

      const { id } = user;

      const token = jwt.sign({ id, email }, process.env.TOKEN_SECRET, {
        expiresIn: "1d",
      });

      res.status(200).json({ access_token: token });
    } catch (err) {
      return res.status(400).json({ errors: err.errors.map((e) => e.message) });
    }
  }

  async update(req, res) {
    try {
      const user = await User.findByPk(req.userId);
      if (!user) {
        return res.status(400).json({ errors: ["User not found"] });
      }
      await user.update(req.body);
      const { id, name, email } = user;
      return res.status(200).json({ id, name, email });
    } catch (err) {
      return res.status(400).json({ errors: err.errors.map((e) => e.message) });
    }
  }

  async delete(req, res) {
    try {
      const user = await User.findByPk(req.userId);
      await user.destroy();
      return res.status(200).json(null);
    } catch (err) {
      return res.status(400).json({ errors: ["User not found"] });
    }
  }
}

export default new UserC();
