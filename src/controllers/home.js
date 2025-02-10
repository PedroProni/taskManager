import Task from "../models/Task";

class Home {
  async index(req, res) {
    // const tasks = await Task.findAll({ where: { user_id: req.userId } });
    res.render("index");
  }
}

export default new Home();
