import Task from "../models/Task";

class Tasks {
  async index(req, res) {
    const tasks = await Task.findAll({
      where: { userId: req.userId },
      attributes: { exclude: ['userId'] }
    });
    res.status(200).json(tasks);
  }

  async show(req, res) {
    const { id } = req.params;
    const task = await Task.findOne({
      where: { id, userId: req.userId },
      attributes: { exclude: ['userId'] }
    });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json(task);
  }

  async create(req, res) {
    const { title, description, status } = req.body;
    try {
      if (!["pending", "in_progress", "completed"].includes(status)) {
        return res.status(400).json({
          errors: ["Status must be pending, in_progress or completed"],
        });
      }
      const task = await Task.create({ title, description, status, userId: req.userId });
      const { userId, ...taskWithoutUserId } = task.toJSON();
      res.status(200).json(taskWithoutUserId);
    } catch (err) {
      res.status(400).json({ errors: err.errors.map((e) => e.message) });
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const task = await Task.findOne({ where: { id, userId: req.userId } });
    if (!task) {
      return res.status(404).json({ errors: ["Task not found"] });
    }
    task.title = title;
    task.description = description;
    task.status = status;
    try {
      await task.save();
      const { userId, ...taskWithoutUserId } = task.toJSON();
      res.status(200).json(taskWithoutUserId);
    } catch (err) {
      res.status(400).json({ errors: err.errors.map((e) => e.message) });
    }
  }

  async delete(req, res) {
    const { id } = req.params;
    const task = await Task.findOne({ where: { id, userId: req.userId } });
    if (!task) {
      return res.status(404).json({ errors: ["Task not found"] });
    }
    await task.destroy();
    res.status(200).send();
  }
}

export default new Tasks();
