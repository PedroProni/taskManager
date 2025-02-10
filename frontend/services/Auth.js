class Auth {
  static getToken() {
    return localStorage.getItem('token');
  }

  static setToken(token) {
    localStorage.setItem('token', token);
  }

  static removeToken() {
    localStorage.removeItem('token');
  }

  static isAuthenticated() {
    return !!this.getToken();
  }
}

export default Auth;
