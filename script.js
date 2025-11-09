let tasks = [];
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    renderTasks();
});
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTask();
});
taskList.addEventListener('click', (e) => {
    const target = e.target;
    const taskItem = target.closest('.task-item');

    if (!taskItem) return;
    const taskId = parseInt(taskItem.dataset.id);
    if (target.classList.contains('delete-btn')) {
        deleteTask(taskId);
    }
    if (target.classList.contains('complete-btn')) {
        toggleComplete(taskId);
    }
    if (target.classList.contains('edit-btn')) {
        enableEdit(taskId);
    }
    if (target.classList.contains('save-btn')) {
        saveEdit(taskId);
    }
    if (target.classList.contains('cancel-btn')) {
        cancelEdit(taskId);
    }
});
function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText) {
        const now = new Date();
        const task = {
            id: Date.now(),
            text: taskText,
            completed: false,
            createdAt: now.toISOString(),
            completedAt: null
        };

        tasks.push(task);
        saveTasks();
        renderTasks();
        taskInput.value = '';
        taskInput.focus();
    }
}
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}
function toggleComplete(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            const now = new Date();
            return {
                ...task,
                completed: !task.completed,
                completedAt: task.completed ? null : now.toISOString()
            };
        }
        return task;
    });
    saveTasks();
    renderTasks();
}
function enableEdit(id) {
    const task = tasks.find(task => task.id === id);
    if (!task) return;

    const taskItem = document.querySelector(`.task-item[data-id="${id}"]`);
    if (!taskItem) return;

    taskItem.innerHTML = `
        <input type="text" class="edit-input" value="${task.text}">
        <button class="save-btn">Save</button>
        <button class="cancel-btn">Cancel</button>
        <div class="task-dates">
            <small>Created: ${formatDate(task.createdAt)}</small>
            ${task.completedAt ? `<br><small>Completed: ${formatDate(task.completedAt)}</small>` : ''}
        </div>
    `;
}
function saveEdit(id) {
    const taskItem = document.querySelector(`.task-item[data-id="${id}"]`);
    if (!taskItem) return;

    const editInput = taskItem.querySelector('.edit-input');
    const newText = editInput.value.trim();

    if (newText) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, text: newText };
            }
            return task;
        });

        saveTasks();
        renderTasks();
    }
}
function cancelEdit(id) {
    renderTasks();
}
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
}
function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.dataset.id = task.id;

        li.innerHTML = `
            <button class="complete-btn ${task.completed ? 'completed' : ''}">
                ${task.completed ? 'Undo' : 'Complete'}
            </button>
            <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
            <div class="task-dates">
                <small>Created: ${formatDate(task.createdAt)}</small>
                ${task.completedAt ? `<br><small>Completed: ${formatDate(task.completedAt)}</small>` : ''}
            </div>
        `;
        taskList.appendChild(li);
    });
}