import api from '../services/axios';

export default class Task {
  constructor(formClass) {
    this.form = document.querySelector(formClass);
    this.taskList = document.querySelector('#taskList');
    this.currentTask = null;
    this.filterButtons = document.querySelectorAll('[data-filter]');
    this.currentFilter = 'all';
    this.tasks = []; 
  }

  async execute() {
    this.events();
    await this.loadTasks();
  }

  events() {
    if (!this.form) return;
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.validate(e);
    });

    this.taskList.addEventListener('click', async (e) => {
      const target = e.target;
      if (target.classList.contains('edit-task')) {
        const taskId = target.dataset.id;
        await this.handleEdit(taskId);
      }
      if (target.classList.contains('delete-task')) {
        const taskId = target.dataset.id;
        await this.handleDelete(taskId);
      }
    });

    this.filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const filterType = button.dataset.filter;
        this.handleFilter(filterType, button);
      });
    });

    this.taskList.addEventListener('change', async (e) => {
      if (e.target.classList.contains('task-status')) {
        const taskId = e.target.dataset.id;
        const newStatus = e.target.value;
        await this.handleStatusChange(taskId, newStatus);
      }
    });
  }

  handleFilter(filterType, clickedButton) {
    this.filterButtons.forEach(button => {
      button.classList.remove('active');
    });
    clickedButton.classList.add('active');
    
    this.currentFilter = filterType;
    this.filterTasks();
  }

  filterTasks() {
    if (this.currentFilter === 'all') {
      this.renderTasks(this.tasks);
      return;
    }
    
    const filteredTasks = this.tasks.filter(task => task.status === this.currentFilter);
    this.renderTasks(filteredTasks);
  }

  async validate(e) {
    const el = e.target;
    const title = el.querySelector('input[name="title"]');
    const description = el.querySelector('textarea[name="description"]');
    let error = false;

    const errorContainers = el.querySelectorAll('.error-container');
    errorContainers.forEach(container => container.innerHTML = '');

    if (title.value.length < 3 || title.value.length > 255) {
      const errorMessage = document.createElement("div");
      errorMessage.textContent = "The title must be between 3 and 255 characters.";
      errorMessage.style.color = "red";
      errorMessage.classList.add("error-message");
      title.closest('.input-group').querySelector('.error-container').appendChild(errorMessage);
      error = true;
    }

    if (description.value.length < 3 || description.value.length > 3000) {
      const errorMessage = document.createElement("div");
      errorMessage.textContent = "The description must be between 3 and 3000 characters.";
      errorMessage.style.color = "red";
      errorMessage.classList.add("error-message");
      description.closest('.input-group').querySelector('.error-container').appendChild(errorMessage);
      error = true;
    }

    if (!error) {
      try {
        const taskData = {
          title: title.value,
          description: description.value,
          status: this.currentTask ? this.currentTask.status : 'pending'
        };

        if (el.dataset.editing) {
          await this.updateTask(el.dataset.editing, taskData);
          delete el.dataset.editing;
          el.querySelector('#addTask').textContent = 'Add Task';
          this.currentTask = null;
        } else {
          await this.createTask(taskData);
        }
        
        title.value = '';
        description.value = '';
        await this.loadTasks();
      } catch (e) {
        alert('Error saving task: ' + e.message);
      }
    }
  }

  async loadTasks() {
    try {
      this.tasks = await this.getAllTasks();
      this.filterTasks();
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  }

  renderTasks(tasks) {
    if (!this.taskList) return;
    
    this.taskList.innerHTML = '';
    
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.innerHTML = `
        <div class="d-flex justify-content-between align-items-start">
          <div class="flex-grow-1">
            <div class="d-flex align-items-center mb-2">
              <h5 class="mb-0 mr-3">${task.title}</h5>
              <select class="form-control form-control-sm task-status" data-id="${task.id}" style="width: auto;">
                <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>Pending</option>
                <option value="in_progress" ${task.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
                <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
              </select>
            </div>
            <p class="mb-0">${task.description}</p>
          </div>
          <div class="ml-3">
            <button class="btn btn-warning btn-sm edit-task mb-1" data-id="${task.id}">Edit</button>
            <button class="btn btn-danger btn-sm delete-task" data-id="${task.id}">Delete</button>
          </div>
        </div>
      `;
      this.taskList.appendChild(li);
    });
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
      this.tasks.push(response.data);
      this.filterTasks();
      return response.data;
    } catch (error) {
      throw error.response?.data?.errors || ['Failed to create task'];
    }
  }

  async updateTask(taskId, taskData) {
    try {
      const response = await api.put(`/tasks/${taskId}`, taskData);
      const index = this.tasks.findIndex(t => t.id === taskId);
      if (index !== -1) {
        this.tasks[index] = response.data;
      }
      this.filterTasks();
      return response.data;
    } catch (error) {
      throw error.response?.data?.errors || ['Failed to update task'];
    }
  }

  async deleteTask(taskId) {
    try {
      await api.delete(`/tasks/${taskId}`);
      this.tasks = this.tasks.filter(t => t.id !== taskId);
      this.filterTasks();
      return true;
    } catch (error) {
      throw error.response?.data?.errors || ['Failed to delete task'];
    }
  }

  async handleEdit(taskId) {
    try {
      const task = await this.getTask(taskId);
      this.currentTask = task;
      
      const titleInput = this.form.querySelector('input[name="title"]');
      const descriptionInput = this.form.querySelector('textarea[name="description"]');
      const addButton = this.form.querySelector('#addTask');
      
      titleInput.value = task.title;
      descriptionInput.value = task.description;
      addButton.textContent = 'Update Task';
      
      this.form.dataset.editing = taskId;
    } catch (error) {
      alert('Error loading task for edit');
    }
  }

  async handleDelete(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await this.deleteTask(taskId);
        await this.loadTasks();
      } catch (error) {
        alert('Error deleting task');
      }
    }
  }

  async getTask(taskId) {
    try {
      const response = await api.get(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.errors || ['Failed to fetch task'];
    }
  }

  async handleStatusChange(taskId, newStatus) {
    try {
      const task = this.tasks.find(t => t.id === Number(taskId));
      if (!task) return;

      const updatedTask = await this.updateTask(taskId, {
        ...task,
        status: newStatus
      });

      const index = this.tasks.findIndex(t => t.id === Number(taskId));
      if (index !== -1) {
        this.tasks[index] = updatedTask;
      }
      this.filterTasks();
    } catch (error) {
      alert('Error updating task status');
    }
  }
}
