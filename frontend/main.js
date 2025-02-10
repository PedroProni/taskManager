import "core-js/stable";
import "regenerator-runtime/runtime";
import User from "./modules/User";
import Task from "./modules/Task";
import Auth from "./services/Auth";

if (Auth.checkAuthAndRedirect()) {
  const register = new User(".register-form");
  const login = new User(".login-form");
  const task = new Task(".task-form");

  register.execute();
  login.execute();
  task.execute();
}
