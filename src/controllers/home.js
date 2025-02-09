class Home {
  async index(req, res) {
    res.status(200).json("OK");
  }
}

export default new Home();
