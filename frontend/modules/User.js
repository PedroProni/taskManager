import validator from "validator";
import Auth from '../services/Auth';
import api from '../services/axios';

export default class User {
  constructor(formClass) {
    this.form = document.querySelector(formClass);
    this.logoutBtn = document.querySelector('#logout-btn');
    this.init();
  }

  init() {
    if (this.logoutBtn) {
      this.logoutBtn.addEventListener('click', () => this.logout());
    }
  }

  logout() {
    Auth.removeToken();
    Auth.redirectToLogin();
  }

  execute() {
    this.events();
  }

  events() {
    if (this.form) {
      this.form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.validate(e);
      });
    }
  }

  async validate(e) {
    const el = e.target;
    const emailInput = el.querySelector('input[name="email"]');
    const passwordInput = el.querySelector('input[name="password"]');
    let error = false;

    const existingErrors = el.querySelectorAll(".error-message");
    existingErrors.forEach((error) => error.remove());

    if (el.classList.contains('register-form')) {
      const nameInput = el.querySelector('input[name="name"]');
      if (!nameInput.value) {
        const errorMessage = document.createElement("div");
        errorMessage.textContent = "Name is required.";
        errorMessage.style.color = "red";
        errorMessage.classList.add("error-message");
        nameInput.insertAdjacentElement("afterend", errorMessage);
        error = true;
      }
    }

    if (!validator.isEmail(emailInput.value)) {
      const errorMessage = document.createElement("div");
      errorMessage.textContent = "Invalid email.";
      errorMessage.style.color = "red";
      errorMessage.classList.add("error-message");
      emailInput.insertAdjacentElement("afterend", errorMessage);
      error = true;
    }

    if (passwordInput.value.length < 3 || passwordInput.value.length > 50) {
      console.log(passwordInput.value.length);
      const errorMessage = document.createElement("div");
      errorMessage.textContent =
        "The password must be between 3 and 50 characters.";
      errorMessage.style.color = "red";
      errorMessage.classList.add("error-message");
      passwordInput.insertAdjacentElement("afterend", errorMessage);
      error = true;
    }

    if (!error) {
      const formData = {
        email: emailInput.value,
        password: passwordInput.value
      };

      if (el.classList.contains('register-form')) {
        const nameInput = el.querySelector('input[name="name"]');
        formData.name = nameInput.value;
        await this.register(formData);
      } else {
        await this.login(formData);
      }
    }
  }

  async login(data) {
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      const responseData = await response.json();
      
      if (response.ok) {
        Auth.setToken(responseData.token);
        window.location.href = '/';
      } else {
        alert(responseData.errors.join('\n'));
      }
    } catch (e) {
      console.error('Login error:', e);
      alert('Error during login');
    }
  }

  async register(data) {
    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      const responseData = await response.json();
      
      if (response.ok) {
        Auth.setToken(responseData.token);
        window.location.href = '/';
      } else {
        alert(responseData.errors.join('\n'));
      }
    } catch (e) {
      console.error('Register error:', e);
      alert('Error during registration');
    }
  }
}
