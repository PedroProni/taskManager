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

  static redirectToLogin() {
    window.location.replace('/login');
  }

  static redirectToHome() {
    window.location.replace('/');
  }

  static checkAuthAndRedirect() {
    const isAuthenticated = this.isAuthenticated();
    const isLoginPage = window.location.pathname === '/login';
    const isRegisterPage = window.location.pathname === '/register';

    if (!isAuthenticated && !isLoginPage && !isRegisterPage) {
      this.redirectToLogin();
      return false;
    }

    return true;
  }
}

export default Auth;
