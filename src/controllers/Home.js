import Task from "../models/Task";

class Home {
  async index(req, res) {
    res.render("index", { 
      isLoggedIn: true 
    });
  }
}

export default new Home();
