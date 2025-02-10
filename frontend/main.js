import 'core-js/stable';
import 'regenerator-runtime/runtime';
import User from './modules/User';

const register = new User('.register-form');
const login = new User('.login-form');

register.execute();
login.execute();

