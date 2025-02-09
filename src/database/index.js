import Sequelize from "sequelize";
import databaseConfig from "../config/database";
import Task from "../models/Task";
import User from "../models/User";

const models = [Task, User];

const connect = new Sequelize(databaseConfig);

models.forEach((model) => model.init(connect));
