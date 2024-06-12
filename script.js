document.addEventListener('DOMContentLoaded', loadTasks);

const addTaskButton = document.getElementById('add-task');
const taskList = document.getElementById('task-list');

addTaskButton.addEventListener('click', addTask);

function addTask() {
    const taskInput = document.getElementById('new-task');
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const taskItem = createTaskItem(taskText, false);
    taskList.appendChild(taskItem);
    saveTask(taskText, false);

    taskInput.value = '';
}

function createTaskItem(text, completed) {
    const li = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = completed;
    checkbox.addEventListener('change', () => {
        li.classList.toggle('completed', checkbox.checked);
        updateTask(text, text, checkbox.checked);
    });

    const span = document.createElement('span');
    span.textContent = text;
    span.classList.add('task-text');

    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.value = text;
    editInput.classList.add('edit-input');

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('edit-button');
    editButton.addEventListener('click', () => {
        const isEditing = editInput.style.display === 'none';
        editInput.style.display = isEditing ? 'inline-block' : 'none';
        span.style.display = isEditing ? 'none' : 'inline';
        editButton.textContent = isEditing ? 'Save' : 'Edit';

        if (!isEditing) {
            updateTask(text, editInput.value, checkbox.checked);
            span.textContent = editInput.value;
        }
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', () => {
        const isConfirmed = confirm('Are you sure you want to delete this task?');
        if (isConfirmed) {
            taskList.removeChild(li);
            deleteTask(text);
        }
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editInput);
    li.appendChild(editButton);
    li.appendChild(deleteButton);

    if (completed) {
        li.classList.add('completed');
    }

    return li;
}

function saveTask(text, completed) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ text, completed });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const taskItem = createTaskItem(task.text, task.completed);
        taskList.appendChild(taskItem);
    });
}

function updateTask(oldText, newText, completed) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => 
        task.text === oldText ? { text: newText, completed } : task
    );
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function deleteTask(text) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.text !== text);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

