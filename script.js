let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let editingIndex = -1;

// DOM elements
const taskInput = document.getElementById('taskInput');
const taskDateTime = document.getElementById('taskDateTime');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    renderTasks();
    updateStats();
    setupEventListeners();
});

function setupEventListeners() {
    // Enter key to add task
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // DateTime change to add task if text exists
    taskDateTime.addEventListener('change', function() {
        if (taskInput.value.trim()) {
            addTask();
        }
    });

    // Button click
    addBtn.addEventListener('click', addTask);
}

function addTask() {
    const taskText = taskInput.value.trim();
    const taskDateTimeValue = taskDateTime.value;

    if (!taskText) {
        alert('Please enter a task!');
        return;
    }

    if (editingIndex >= 0) {
        // Edit existing task
        tasks[editingIndex] = {
            text: taskText,
            dateTime: taskDateTimeValue || tasks[editingIndex].dateTime,
            completed: tasks[editingIndex].completed,
            id: tasks[editingIndex].id
        };
        editingIndex = -1;
        addBtn.textContent = 'Add Task';
    } else {
        // Add new task
        const newTask = {
            text: taskText,
            dateTime: taskDateTimeValue,
            completed: false,
            id: Date.now()
        };
        tasks.push(newTask);
    }

    taskInput.value = '';
    taskDateTime.value = '';
    saveTasks();
    renderTasks();
    updateStats();
}

function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
    updateStats();
}

function editTask(index) {
    taskInput.value = tasks[index].text;
    taskDateTime.value = tasks[index].dateTime || '';
    editingIndex = index;
    addBtn.textContent = 'Update Task';
    taskInput.focus();
}

function deleteTask(index) {
    if (confirm('Delete this task?')) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
        updateStats();
    }
}

function formatDateTime(dateTime) {
    if (!dateTime) return 'No due date';
    const date = new Date(dateTime);
    return date.toLocaleString('en-IN', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function renderTasks() {
    if (tasks.length === 0) {
        taskList.innerHTML = '<li class="empty-state">Add your first task above! 🎯</li>';
        return;
    }

    taskList.innerHTML = tasks.map((task, index) => `
        <li class="task-item ${task.completed ? 'completed' : ''}">
            <input type="checkbox" class="task-checkbox" 
                   ${task.completed ? 'checked' : ''} 
                   onchange="toggleComplete(${index})">
            
            <div class="task-content">
                <div class="task-title">${task.text}</div>
                <div class="task-time">${formatDateTime(task.dateTime)}</div>
            </div>
            
            <div class="task-actions">
                <button class="edit-btn" onclick="editTask(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
            </div>
        </li>
    `).join('');
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    
    totalTasksEl.textContent = `${total} tasks`;
    completedTasksEl.textContent = `${completed} completed`;
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}