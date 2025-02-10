import Sequelize, { Model } from "sequelize";

export default class Task extends Model {
  static init(sequelize) {
    super.init(
      {
        title: {
          type: Sequelize.STRING,
          defaultValue: "",
          validate: {
            len: {
              args: [3, 255],
              msg: "Title must have between 3 and 255 characters",
            },
          },
        },
        description: {
          type: Sequelize.STRING,
        },
        status: {
          type: Sequelize.ENUM("pending", "in_progress", "completed"),
          defaultValue: "pending",
          validate: {
            isIn: {
              args: [["pending", "in_progress", "completed"]],
              msg: "Status must be pending, in_progress or completed",
            },
          },
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
      }
    );
    return this;
  }
}
