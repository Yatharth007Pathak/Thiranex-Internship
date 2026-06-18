const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

/* SAVE TO LOCAL STORAGE */

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* UPDATE TASK COUNTER */

function updateTaskCount() {
    const activeTasks = tasks.filter(task => !task.completed).length;
    taskCount.textContent = `${activeTasks} Tasks Remaining`;
}

/* RENDER TASKS */

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "active") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.classList.add("task-item");

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <div class="task-content">
                <input
                    type="checkbox"
                    class="complete-checkbox"
                    data-id="${task.id}"
                    ${task.completed ? "checked" : ""}
                >

                <span class="task-text">
                    ${task.text}
                </span>
            </div>

            <div class="task-actions">

                <button
                    class="edit-btn"
                    data-id="${task.id}">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    data-id="${task.id}">
                    Delete
                </button>

            </div>
        `;

        taskList.appendChild(li);
    });

    updateTaskCount();
}

/* ADD TASK */

function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    taskInput.value = "";
}

/* DELETE TASK */

function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
}

/* TOGGLE COMPLETE */

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {
            task.completed = !task.completed;
        }

        return task;
    });

    saveTasks();
    renderTasks();
}

/* EDIT TASK */

function editTask(id) {

    const task = tasks.find(task => task.id === id);

    const updatedText = prompt(
        "Edit Task:",
        task.text
    );

    if (
        updatedText === null ||
        updatedText.trim() === ""
    ) {
        return;
    }

    task.text = updatedText.trim();

    saveTasks();
    renderTasks();
}

/* ADD BUTTON EVENT */

addTaskBtn.addEventListener(
    "click",
    addTask
);

/* ENTER KEY EVENT */

taskInput.addEventListener(
    "keypress",
    function(event) {

        if (event.key === "Enter") {
            addTask();
        }

    }
);

/* EVENT DELEGATION */

taskList.addEventListener(
    "click",
    function(event) {

        const id = Number(
            event.target.dataset.id
        );

        if (
            event.target.classList.contains("delete-btn")
        ) {
            deleteTask(id);
        }

        if (
            event.target.classList.contains("edit-btn")
        ) {
            editTask(id);
        }

    }
);

/* CHECKBOX EVENT */

taskList.addEventListener(
    "change",
    function(event) {

        if (
            event.target.classList.contains(
                "complete-checkbox"
            )
        ) {

            const id = Number(
                event.target.dataset.id
            );

            toggleTask(id);
        }

    }
);

/* FILTER BUTTONS  */

filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        function() {

            filterButtons.forEach(btn =>
                btn.classList.remove("active")
            );

            this.classList.add("active");

            currentFilter =
                this.dataset.filter;

            renderTasks();
        }
    );

});

/* INITIAL LOAD */

renderTasks();