import api from '../../src/services/axios';

class Task {
  constructor(formClass) {
    this.form = document.querySelector(formClass);
  }

  execute() {
    this.events();
  }

  events() {
    if (!this.form) return;
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.validate(e);
    });
  }

  validate(e) {
    const el = e.target;
    console.log(el)
    const title = el.querySelector('input[name="title"]');
    const description = el.querySelector('textarea[name="description"]');
    let error = false;

    const existingErrors = el.querySelectorAll(".error-message");
    existingErrors.forEach((error) => error.remove());

    if (title.value.length < 3 || title.value.length > 255) {
      const errorMessage = document.createElement("div");
      errorMessage.textContent = "The title must be between 3 and 255 characters.";
      errorMessage.style.color = "red";
      errorMessage.classList.add("error-message");
      title.insertAdjacentElement("afterend", errorMessage);
      error = true;
    }

    if (description.value.length < 3 || description.value.length > 3000) {
      const errorMessage = document.createElement("div");
      errorMessage.textContent = "The description must be between 3 and 3000 characters.";
      errorMessage.style.color = "red";
      errorMessage.classList.add("error-message");
      description.insertAdjacentElement("afterend", errorMessage);
      error = true;
    }

    if (!error) el.submit();
  }

  async getAllTasks() {
    try {
      const response = await api.get('/tasks');
      return response.data;
    } catch (error) {
      throw error.response?.data?.errors || ['Failed to fetch tasks'];
    }
  }

  async createTask(taskData) {
    try {
      const response = await api.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.errors || ['Failed to create task'];
    }
  }

  async updateTask(taskId, taskData) {
    try {
      const response = await api.put(`/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.errors || ['Failed to update task'];
    }
  }

  async deleteTask(taskId) {
    try {
      const response = await api.delete(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.errors || ['Failed to delete task'];
    }
  }
}

export default new Task();
