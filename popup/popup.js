let tasks = []; // maintain a list of my tasks

const updateTime = () => {
    chrome.storage.local.get(["timer", "timeOption"], (res) => {
        const time = document.getElementById("time");
        const minutes = `${res.timeOption - Math.ceil(res.timer / 60)}`.padStart(2,0);
        let seconds = "00";
        if (res.timer % 60 != 0) {
            seconds = `${60 - res.timer % 60}`.padStart(2, 0);
        };
        time.textContent = `${minutes}:${seconds}`;
        console.log(res.timer);

        chrome.action.setBadgeText({
            text: minutes,
        })
    })
}

const updateButtons = () => {
    chrome.storage.local.get(["isRunning"], (res) => {
        startTimerButton.textContent = !res.isRunning ? "start" : "pause";
    })
}

updateTime();
setInterval(updateTime, 1000);
setInterval(updateButtons, 1000);

const startTimerButton = document.getElementById("start-timer-btn");
startTimerButton.addEventListener("click", () => {
    chrome.storage.local.get(["isRunning"], (res) => {
        chrome.storage.local.set({
            isRunning: !res.isRunning,
        }, () => {
            startTimerButton.textContent = !res.isRunning ? "pause" : "start";
        })
    })
})

chrome.storage.sync.get(["tasks"], (res) => {
    tasks = res.tasks ? res.tasks : [];
    renderTasks();
})

const saveTasks = () => {
    chrome.storage.sync.set({
        tasks,
    })
}

const resetTimerButton = document.getElementById("reset-timer-btn");
resetTimerButton.addEventListener("click", () => {
    chrome.storage.local.set({
        timer: 0,
        isRunning: false,
    }, () => {
        startTimerButton.textContent = "start";
    })
})

const addTaskButton = document.getElementById("add-task-btn");
addTaskButton.addEventListener("click", () => addTask());

const renderTask = (taskIndex) => {
    const taskRow = document.createElement("div");

    const text = document.createElement("input");
    text.type = "text";
    text.placeholder = "Enter a task...";
    text.value = tasks[taskIndex];
    text.className = "task-input";
    text.addEventListener("change", () => {
        tasks[taskIndex] = text.value;
        saveTasks();
    });

    const deleteButton = document.createElement("input");
    deleteButton.type = "button";
    deleteButton.value = "X";
    deleteButton.className = "task-delete";
    deleteButton.addEventListener("click", () => {
        deleteTask(taskIndex);
    })

    taskRow.appendChild(text);
    taskRow.appendChild(deleteButton);

    const taskContainer = document.getElementById("task-container");
    taskContainer.appendChild(taskRow);
}

const addTask = () => {
    const taskIndex = tasks.length;
    tasks.push("");
    renderTask(taskIndex);
    saveTasks();
}

const deleteTask = (taskIndex) => {
    tasks.splice(taskIndex, 1);
    // tasks.remove(taskIndex);
    renderTasks();
    saveTasks();
}

const renderTasks = () => {
    const taskContainer = document.getElementById("task-container");
    taskContainer.textContent="";
    tasks.forEach((taskText, taskIndex) => {
        renderTask(taskIndex);
    })
}