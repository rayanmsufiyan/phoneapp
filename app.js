const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const taskCount = document.getElementById("taskCount");
const clearCompleted = document.getElementById("clearCompleted");
const dateElement = document.getElementById("date");

let tasks = JSON.parse(localStorage.getItem("quickTodoTasks")) || [];


/* -------------------------
   Date
------------------------- */

function showDate() {
    const now = new Date();

    dateElement.textContent = now.toLocaleDateString(undefined, {
        weekday: "long",
        day: "numeric",
        month: "long"
    });
}


/* -------------------------
   Save
------------------------- */

function saveTasks() {
    localStorage.setItem(
        "quickTodoTasks",
        JSON.stringify(tasks)
    );
}


/* -------------------------
   Add Task
------------------------- */

function addTask() {

    const text = taskInput.value.trim();

    if (!text) {
        taskInput.focus();
        return;
    }

    tasks.unshift({
        id: Date.now(),
        text: text,
        completed: false
    });

    taskInput.value = "";

    saveTasks();
    renderTasks();

    taskInput.focus();
}


/* -------------------------
   Toggle Task
------------------------- */

function toggleTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) return;

    task.completed = !task.completed;

    saveTasks();
    renderTasks();
}


/* -------------------------
   Delete Task
------------------------- */

function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
}


/* -------------------------
   Clear Completed
------------------------- */

function clearCompletedTasks() {

    tasks = tasks.filter(task => !task.completed);

    saveTasks();
    renderTasks();
}


/* -------------------------
   Render
------------------------- */

function renderTasks() {

    taskList.innerHTML = "";

    tasks.forEach(task => {

        const taskElement = document.createElement("div");

        taskElement.className =
            "task" + (task.completed ? " completed" : "");

        /*
         * Checkbox
         */

        const checkbox = document.createElement("button");

        checkbox.className = "checkbox";
        checkbox.setAttribute("aria-label", "Complete task");

        checkbox.addEventListener("click", () => {
            toggleTask(task.id);
        });


        /*
         * Text
         */

        const text = document.createElement("div");

        text.className = "task-text";
        text.textContent = task.text;


        /*
         * Delete
         */

        const deleteButton = document.createElement("button");

        deleteButton.className = "delete-button";
        deleteButton.textContent = "×";
        deleteButton.setAttribute("aria-label", "Delete task");

        deleteButton.addEventListener("click", () => {
            deleteTask(task.id);
        });


        taskElement.appendChild(checkbox);
        taskElement.appendChild(text);
        taskElement.appendChild(deleteButton);

        taskList.appendChild(taskElement);
    });


    /*
     * Empty state
     */

    emptyMessage.style.display =
        tasks.length === 0 ? "block" : "none";


    /*
     * Count only unfinished tasks
     */

    const remaining = tasks.filter(
        task => !task.completed
    ).length;

    taskCount.textContent =
        remaining === 1
            ? "1 task remaining"
            : `${remaining} tasks remaining`;
}


/* -------------------------
   Events
------------------------- */

addButton.addEventListener("click", addTask);

taskInput.addEventListener("keydown", event => {

    if (event.key === "Enter") {
        addTask();
    }

});

clearCompleted.addEventListener(
    "click",
    clearCompletedTasks
);


/* -------------------------
   Start
------------------------- */

showDate();
renderTasks();


/* -------------------------
   Service Worker
------------------------- */

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker.register("sw.js")
            .catch(error => {
                console.log(
                    "Service Worker registration failed:",
                    error
                );
            });

    });

}
