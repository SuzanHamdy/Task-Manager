
/* =====================================================
   TASK FLOW - TASK MANAGER
   HTML + CSS + JavaScript
===================================================== */


/* =====================================================
   1. GET HTML ELEMENTS
===================================================== */

const authSection = document.getElementById("authSection");
const dashboard = document.getElementById("dashboard");

const loginForm = document.getElementById("login");
const registerForm = document.getElementById("register");

const loginContainer = document.getElementById("loginForm");
const registerContainer = document.getElementById("registerForm");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");

const authMessage = document.getElementById("authMessage");

const logoutBtn = document.getElementById("logoutBtn");

const welcomeText = document.getElementById("welcomeText");
const userAvatar = document.getElementById("userAvatar");

const themeToggle = document.getElementById("themeToggle");

const notificationBtn =
    document.getElementById("notificationBtn");

const notificationPanel =
    document.getElementById("notificationPanel");

const notificationCount =
    document.getElementById("notificationCount");

const notifications =
    document.getElementById("notifications");


/* =====================================================
   2. LOCAL STORAGE
===================================================== */

let users =
    JSON.parse(localStorage.getItem("taskFlowUsers")) || [];

let currentUser =
    JSON.parse(localStorage.getItem("taskFlowCurrentUser")) || null;

let tasks =
    JSON.parse(localStorage.getItem("taskFlowTasks")) || [];

let projects =
    JSON.parse(localStorage.getItem("taskFlowProjects")) || [];


/* =====================================================
   3. SAVE DATA
===================================================== */

function saveUsers() {

    localStorage.setItem(
        "taskFlowUsers",
        JSON.stringify(users)
    );

}


function saveTasks() {

    localStorage.setItem(
        "taskFlowTasks",
        JSON.stringify(tasks)
    );

}


function saveProjects() {

    localStorage.setItem(
        "taskFlowProjects",
        JSON.stringify(projects)
    );

}


/* =====================================================
   4. GENERAL PROJECT
===================================================== */

/*
   General project is available to every user.
*/

const generalProjectExists =
    projects.some(
        project => project.id === "general"
    );


if (!generalProjectExists) {

    projects.unshift({

        id: "general",

        name: "General"

    });

    saveProjects();

}


/* =====================================================
   5. SHOW / HIDE LOGIN AND REGISTER
===================================================== */

showRegister.addEventListener("click", () => {

    loginContainer.classList.add("hidden");

    registerContainer.classList.remove("hidden");

    authMessage.textContent = "";

});


showLogin.addEventListener("click", () => {

    registerContainer.classList.add("hidden");

    loginContainer.classList.remove("hidden");

    authMessage.textContent = "";

});


/* =====================================================
   6. REGISTER
===================================================== */

registerForm.addEventListener("submit", (event) => {

    event.preventDefault();


    const name =
        document
            .getElementById("registerName")
            .value
            .trim();


    const email =
        document
            .getElementById("registerEmail")
            .value
            .trim()
            .toLowerCase();


    const password =
        document.getElementById("registerPassword").value;


    const confirmPassword =
        document.getElementById("confirmPassword").value;


    /* Check password */

    if (password.length < 6) {

        showMessage(
            "Password must contain at least 6 characters.",
            "error"
        );

        return;

    }


    /* Check confirm password */

    if (password !== confirmPassword) {

        showMessage(
            "Passwords do not match.",
            "error"
        );

        return;

    }


    /* Check existing user */

    const existingUser =
        users.find(
            user => user.email === email
        );


    if (existingUser) {

        showMessage(
            "This email is already registered.",
            "error"
        );

        return;

    }


    /* Create user */

    const newUser = {

        id: createId(),

        name,

        email,

        password

    };


    users.push(newUser);

    saveUsers();


    showMessage(
        "Account created successfully! You can login now.",
        "success"
    );


    registerForm.reset();


    setTimeout(() => {

        registerContainer.classList.add("hidden");

        loginContainer.classList.remove("hidden");

        authMessage.textContent = "";

    }, 1200);

});


/* =====================================================
   7. LOGIN
===================================================== */

loginForm.addEventListener("submit", (event) => {

    event.preventDefault();


    const email =
        document
            .getElementById("loginEmail")
            .value
            .trim()
            .toLowerCase();


    const password =
        document.getElementById("loginPassword").value;


    const user =
        users.find(
            user =>
                user.email === email &&
                user.password === password
        );


    if (!user) {

        showMessage(
            "Invalid email or password.",
            "error"
        );

        return;

    }


    currentUser = {

        id: user.id,

        name: user.name,

        email: user.email

    };


    localStorage.setItem(
        "taskFlowCurrentUser",
        JSON.stringify(currentUser)
    );


    loginForm.reset();

    showDashboard();

});


/* =====================================================
   8. AUTH MESSAGE
===================================================== */

function showMessage(message, type) {

    authMessage.textContent = message;


    if (type === "error") {

        authMessage.style.color =
            "var(--danger)";

    } else {

        authMessage.style.color =
            "var(--success)";

    }

}


/* =====================================================
   9. SHOW DASHBOARD
===================================================== */

function showDashboard() {

    authSection.classList.add("hidden");

    dashboard.classList.remove("hidden");


    welcomeText.textContent =
        `Welcome back, ${currentUser.name}!`;


    userAvatar.textContent =
        currentUser.name
            .charAt(0)
            .toUpperCase();


    updateDashboard();

    renderTasks();

    renderProjects();

    updateProjectSelect();

    renderCalendar();

    updateNotifications();

}


/* =====================================================
   10. LOGOUT
===================================================== */

logoutBtn.addEventListener("click", () => {

    currentUser = null;


    localStorage.removeItem(
        "taskFlowCurrentUser"
    );


    dashboard.classList.add("hidden");

    authSection.classList.remove("hidden");


    registerContainer.classList.add("hidden");

    loginContainer.classList.remove("hidden");

});


/* =====================================================
   11. GET CURRENT USER TASKS
===================================================== */

function getUserTasks() {

    if (!currentUser) {

        return [];

    }


    return tasks.filter(
        task =>
            task.userId === currentUser.id
    );

}


/* =====================================================
   12. GET CURRENT USER PROJECTS
===================================================== */

function getUserProjects() {

    if (!currentUser) {

        return [];

    }


    return projects.filter(
        project =>
            project.id === "general" ||
            project.userId === currentUser.id
    );

}


/* =====================================================
   13. CREATE ID
===================================================== */

function createId() {

    return (
        Date.now().toString() +
        Math.random()
            .toString(36)
            .substring(2, 8)
    );

}


/* =====================================================
   14. TASK MODAL
===================================================== */

const taskModal =
    document.getElementById("taskModal");

const taskForm =
    document.getElementById("taskForm");

const taskModalTitle =
    document.getElementById("taskModalTitle");

const closeTaskModal =
    document.getElementById("closeTaskModal");

const addTaskBtn =
    document.getElementById("addTaskBtn");

const addTaskBtn2 =
    document.getElementById("addTaskBtn2");


function openTaskModal() {

    taskModal.classList.remove("hidden");

    taskModalTitle.textContent =
        "Add New Task";

    taskForm.reset();

    document.getElementById("taskId").value = "";

    updateProjectSelect();

}


function closeTaskModalFunction() {

    taskModal.classList.add("hidden");

}


addTaskBtn.addEventListener(
    "click",
    openTaskModal
);


addTaskBtn2.addEventListener(
    "click",
    openTaskModal
);


closeTaskModal.addEventListener(
    "click",
    closeTaskModalFunction
);


/* Close task modal */

taskModal.addEventListener("click", (event) => {

    if (event.target === taskModal) {

        closeTaskModalFunction();

    }

});


/* =====================================================
   15. ADD / EDIT TASK
===================================================== */

taskForm.addEventListener("submit", (event) => {

    event.preventDefault();


    const taskId =
        document.getElementById("taskId").value;


    const title =
        document
            .getElementById("taskTitle")
            .value
            .trim();


    const description =
        document
            .getElementById("taskDescription")
            .value
            .trim();


    const project =
        document.getElementById("taskProject").value;


    const priority =
        document.getElementById("taskPriority").value;


    const deadline =
        document.getElementById("taskDeadline").value;


    /* EDIT TASK */

    if (taskId) {

        const task =
            tasks.find(
                task =>
                    task.id === taskId &&
                    task.userId === currentUser.id
            );


        if (!task) {

            alert("Task not found.");

            return;

        }


        task.title = title;

        task.description = description;

        task.project = project;

        task.priority = priority;

        task.deadline = deadline;

    }


    /* ADD TASK */

    else {

        const newTask = {

            id: createId(),

            userId: currentUser.id,

            title,

            description,

            project,

            priority,

            deadline,

            completed: false,

            createdAt: new Date().toISOString()

        };


        tasks.push(newTask);

    }


    saveTasks();


    closeTaskModalFunction();


    updateDashboard();

    renderTasks();

    renderProjects();

    renderCalendar();

    updateNotifications();

});


/* =====================================================
   16. RENDER TASKS
===================================================== */

function renderTasks() {

    const allTasksContainer =
        document.getElementById("allTasks");


    const recentTasksContainer =
        document.getElementById("recentTasks");


    const userTasks =
        getUserTasks();


    /* Recent tasks */

    const recentTasks =
        [...userTasks]
            .sort(
                (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
            )
            .slice(0, 5);


    recentTasksContainer.innerHTML =
        recentTasks.length
            ? recentTasks
                .map(createTaskHTML)
                .join("")
            : emptyState(
                "📋",
                "No tasks yet",
                "Create your first task."
            );


    /* Search */

    const search =
        document
            .getElementById("searchTask")
            .value
            .toLowerCase();


    /* Status */

    const status =
        document
            .getElementById("filterStatus")
            .value;


    /* Project */

    const project =
        document
            .getElementById("filterProject")
            .value;


    let filteredTasks =
        userTasks.filter(task => {

            const matchesSearch =
                task.title
                    .toLowerCase()
                    .includes(search) ||

                task.description
                    .toLowerCase()
                    .includes(search);


            const matchesStatus =
                status === "all" ||

                (
                    status === "completed" &&
                    task.completed
                ) ||

                (
                    status === "pending" &&
                    !task.completed
                );


            const matchesProject =
                project === "all" ||
                task.project === project;


            return (
                matchesSearch &&
                matchesStatus &&
                matchesProject
            );

        });


    filteredTasks.sort(
        (a, b) => {

            if (!a.deadline) return 1;

            if (!b.deadline) return -1;

            return (
                new Date(a.deadline) -
                new Date(b.deadline)
            );

        }
    );


    allTasksContainer.innerHTML =
        filteredTasks.length
            ? filteredTasks
                .map(createTaskHTML)
                .join("")
            : emptyState(
                "🔎",
                "No tasks found",
                "Try changing your filters."
            );

}


/* =====================================================
   17. CREATE TASK HTML
===================================================== */

function createTaskHTML(task) {

    return `
        <div class="task-item ${
            task.completed
                ? "task-completed"
                : ""
        }">

            <div class="task-info">

                <div class="task-title">
                    ${escapeHTML(task.title)}
                </div>

                ${
                    task.description
                        ? `
                            <div class="task-description">
                                ${escapeHTML(
                                    task.description
                                )}
                            </div>
                          `
                        : ""
                }

                <div class="task-meta">

                    <span class="badge project-badge">
                        📁 ${escapeHTML(task.project)}
                    </span>

                    <span class="badge priority-${task.priority}">
                        ${capitalize(task.priority)}
                    </span>

                    <span class="task-date">
                        📅 ${formatDate(task.deadline)}
                    </span>

                </div>

            </div>


            <div class="task-actions">

                <button
                    onclick="toggleTask('${task.id}')"
                    title="Complete task"
                >
                    ${task.completed ? "↩️" : "✓"}
                </button>


                <button
                    onclick="editTask('${task.id}')"
                    title="Edit task"
                >
                    ✏️
                </button>


                <button
                    class="delete-task"
                    onclick="deleteTask('${task.id}')"
                    title="Delete task"
                >
                    🗑️
                </button>

            </div>

        </div>
    `;

}


/* =====================================================
   18. TOGGLE TASK
===================================================== */

function toggleTask(id) {

    const task =
        tasks.find(
            task =>
                task.id === id &&
                task.userId === currentUser.id
        );


    if (!task) return;


    task.completed =
        !task.completed;


    saveTasks();


    updateDashboard();

    renderTasks();

    renderProjects();

    renderCalendar();

    updateNotifications();

}


/* =====================================================
   19. EDIT TASK
===================================================== */

function editTask(id) {

    const task =
        tasks.find(
            task =>
                task.id === id &&
                task.userId === currentUser.id
        );


    if (!task) return;


    taskModal.classList.remove("hidden");


    taskModalTitle.textContent =
        "Edit Task";


    document.getElementById("taskId").value =
        task.id;


    document.getElementById("taskTitle").value =
        task.title;


    document.getElementById("taskDescription").value =
        task.description;


    document.getElementById("taskPriority").value =
        task.priority;


    document.getElementById("taskDeadline").value =
        task.deadline;


    updateProjectSelect(task.project);

}


/* =====================================================
   20. DELETE TASK
===================================================== */

function deleteTask(id) {

    const task =
        tasks.find(
            task =>
                task.id === id &&
                task.userId === currentUser.id
        );


    if (!task) return;


    const confirmed =
        confirm(
            "Are you sure you want to delete this task?"
        );


    if (!confirmed) return;


    tasks =
        tasks.filter(
            task =>
                !(
                    task.id === id &&
                    task.userId === currentUser.id
                )
        );


    saveTasks();


    updateDashboard();

    renderTasks();

    renderProjects();

    renderCalendar();

    updateNotifications();

}


/* =====================================================
   21. EMPTY STATE
===================================================== */

function emptyState(
    icon,
    title,
    message
) {

    return `
        <div class="empty-state">

            <div class="empty-state-icon">
                ${icon}
            </div>

            <h3>
                ${title}
            </h3>

            <p>
                ${message}
            </p>

        </div>
    `;

}


/* =====================================================
   22. DASHBOARD STATISTICS
===================================================== */

function updateDashboard() {

    const userTasks =
        getUserTasks();


    const total =
        userTasks.length;


    const completed =
        userTasks.filter(
            task =>
                task.completed
        ).length;


    const pending =
        total - completed;


    const dueSoon =
        userTasks.filter(task => {

            if (task.completed) {

                return false;

            }


            if (!task.deadline) {

                return false;

            }


            const today =
                new Date();

            today.setHours(
                0,
                0,
                0,
                0
            );


            const deadline =
                new Date(
                    task.deadline +
                    "T00:00:00"
                );


            const difference =
                deadline - today;


            const days =
                difference /
                (1000 * 60 * 60 * 24);


            return (
                days >= 0 &&
                days <= 3
            );

        }).length;


    document.getElementById(
        "totalTasks"
    ).textContent = total;


    document.getElementById(
        "completedTasks"
    ).textContent = completed;


    document.getElementById(
        "pendingTasks"
    ).textContent = pending;


    document.getElementById(
        "dueSoonTasks"
    ).textContent = dueSoon;

}


/* =====================================================
   23. SEARCH / FILTER
===================================================== */

document
    .getElementById("searchTask")
    .addEventListener(
        "input",
        renderTasks
    );


document
    .getElementById("filterStatus")
    .addEventListener(
        "change",
        renderTasks
    );


document
    .getElementById("filterProject")
    .addEventListener(
        "change",
        renderTasks
    );


/* =====================================================
   24. PROJECT MODAL
===================================================== */

const projectModal =
    document.getElementById("projectModal");


const projectForm =
    document.getElementById("projectForm");


const addProjectBtn =
    document.getElementById("addProjectBtn");


const closeProjectModal =
    document.getElementById("closeProjectModal");


addProjectBtn.addEventListener(
    "click",
    () => {

        projectModal.classList.remove(
            "hidden"
        );

        projectForm.reset();

    }
);


closeProjectModal.addEventListener(
    "click",
    () => {

        projectModal.classList.add(
            "hidden"
        );

    }
);


projectModal.addEventListener(
    "click",
    event => {

        if (event.target === projectModal) {

            projectModal.classList.add(
                "hidden"
            );

        }

    }
);


/* =====================================================
   25. ADD PROJECT
===================================================== */

projectForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        if (!currentUser) return;


        const name =
            document
                .getElementById("projectName")
                .value
                .trim();


        if (!name) return;


        /* Check only current user's projects */

        const exists =
            getUserProjects().some(
                project =>
                    project.name.toLowerCase() ===
                    name.toLowerCase()
            );


        if (exists) {

            alert(
                "This project already exists."
            );

            return;

        }


        projects.push({

            id: createId(),

            userId: currentUser.id,

            name

        });


        saveProjects();


        projectModal.classList.add(
            "hidden"
        );


        updateProjectSelect();

        renderProjects();

    }
);


/* =====================================================
   26. PROJECT SELECT
===================================================== */

function updateProjectSelect(
    selectedProject = ""
) {

    const taskProject =
        document.getElementById(
            "taskProject"
        );


    const userProjects =
        getUserProjects();


    taskProject.innerHTML = "";


    userProjects.forEach(project => {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            project.name;


        option.textContent =
            project.name;


        if (
            project.name ===
            selectedProject
        ) {

            option.selected = true;

        }


        taskProject.appendChild(
            option
        );

    });


    /* Filter */

    const filterProject =
        document.getElementById(
            "filterProject"
        );


    filterProject.innerHTML = `
        <option value="all">
            All Projects
        </option>
    `;


    userProjects.forEach(project => {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            project.name;


        option.textContent =
            project.name;


        filterProject.appendChild(
            option
        );

    });

}


/* =====================================================
   27. RENDER PROJECTS
===================================================== */

function renderProjects() {

    const container =
        document.getElementById(
            "projectsGrid"
        );


    const userTasks =
        getUserTasks();


    const userProjects =
        getUserProjects();


    container.innerHTML =
        userProjects
            .map(project => {

                const projectTasks =
                    userTasks.filter(
                        task =>
                            task.project ===
                            project.name
                    );


                const completed =
                    projectTasks.filter(
                        task =>
                            task.completed
                    ).length;


                const total =
                    projectTasks.length;


                const percentage =
                    total === 0
                        ? 0
                        : Math.round(
                            (
                                completed /
                                total
                            ) * 100
                        );


                return `
                    <div class="project-card">

                        <h3>
                            📁 ${escapeHTML(
                                project.name
                            )}
                        </h3>

                        <p>
                            ${total}
                            task${total !== 1 ? "s" : ""}
                        </p>

                        <div class="project-progress">

                            <div
                                class="project-progress-bar"
                                style="width: ${percentage}%"
                            ></div>

                        </div>

                        <div class="project-card-footer">

                            <span>
                                ${percentage}%
                                completed
                            </span>

                            ${
                                project.id !== "general"
                                    ? `
                                        <button
                                            class="delete-project"
                                            onclick="deleteProject('${project.id}')"
                                        >
                                            Delete
                                        </button>
                                      `
                                    : ""
                            }

                        </div>

                    </div>
                `;

            })
            .join("");

}


/* =====================================================
   28. DELETE PROJECT
===================================================== */

function deleteProject(id) {

    if (!currentUser) return;


    /* Find only current user's project */

    const project =
        getUserProjects().find(
            project =>
                project.id === id
        );


    if (!project) return;


    /* Prevent deleting General */

    if (project.id === "general") {

        alert(
            "The General project cannot be deleted."
        );

        return;

    }


    /* Check if project contains tasks */

    const hasTasks =
        getUserTasks().some(
            task =>
                task.project ===
                project.name
        );


    if (hasTasks) {

        alert(
            "You cannot delete a project that contains tasks."
        );

        return;

    }


    const confirmed =
        confirm(
            `Delete project "${project.name}"?`
        );


    if (!confirmed) return;


    projects =
        projects.filter(
            project =>
                project.id !== id
        );


    saveProjects();


    updateProjectSelect();

    renderProjects();

}


/* =====================================================
   29. CALENDAR
===================================================== */

const calendarGrid =
    document.getElementById(
        "calendarGrid"
    );


const calendarTitle =
    document.getElementById(
        "calendarTitle"
    );


const prevMonth =
    document.getElementById(
        "prevMonth"
    );


const nextMonth =
    document.getElementById(
        "nextMonth"
    );


let calendarDate =
    new Date();


function renderCalendar() {

    const year =
        calendarDate.getFullYear();


    const month =
        calendarDate.getMonth();


    const monthName =
        calendarDate.toLocaleString(
            "default",
            {
                month: "long"
            }
        );


    calendarTitle.textContent =
        `${monthName} ${year}`;


    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    calendarGrid.innerHTML = "";


    /* Empty days */

    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        const empty =
            document.createElement(
                "div"
            );


        empty.className =
            "calendar-day empty";


        calendarGrid.appendChild(
            empty
        );

    }


    const userTasks =
        getUserTasks();


    /* Calendar days */

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const cell =
            document.createElement(
                "div"
            );


        cell.className =
            "calendar-day";


        const dateString =
            `${year}-${String(
                month + 1
            ).padStart(2, "0")}-${String(
                day
            ).padStart(2, "0")}`;


        const today =
            new Date();


        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {

            cell.classList.add(
                "today"
            );

        }


        cell.innerHTML = `
            <div class="day-number">
                ${day}
            </div>
        `;


        const dayTasks =
            userTasks.filter(
                task =>
                    task.deadline ===
                    dateString
            );


        dayTasks.forEach(task => {

            const taskElement =
                document.createElement(
                    "div"
                );


            taskElement.className =
                "calendar-task";


            taskElement.textContent =
                task.title;


            taskElement.title =
                task.title;


            cell.appendChild(
                taskElement
            );

        });


        calendarGrid.appendChild(
            cell
        );

    }

}


prevMonth.addEventListener(
    "click",
    () => {

        calendarDate.setMonth(
            calendarDate.getMonth() - 1
        );

        renderCalendar();

    }
);


nextMonth.addEventListener(
    "click",
    () => {

        calendarDate.setMonth(
            calendarDate.getMonth() + 1
        );

        renderCalendar();

    }
);


/* =====================================================
   30. NOTIFICATIONS
===================================================== */

function updateNotifications() {

    const userTasks =
        getUserTasks();


    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    const upcoming =
        userTasks.filter(task => {

            if (task.completed) {

                return false;

            }


            if (!task.deadline) {

                return false;

            }


            const deadline =
                new Date(
                    task.deadline +
                    "T00:00:00"
                );


            const difference =
                deadline - today;


            const days =
                Math.ceil(
                    difference /
                    (1000 * 60 * 60 * 24)
                );


            return (
                days >= 0 &&
                days <= 3
            );

        });


    notificationCount.textContent =
        upcoming.length;


    if (!upcoming.length) {

        notifications.innerHTML = `
            <div class="empty-state">

                <p>
                    No upcoming deadlines 🎉
                </p>

            </div>
        `;

        return;

    }


    notifications.innerHTML =
        upcoming
            .map(task => {

                const deadline =
                    new Date(
                        task.deadline +
                        "T00:00:00"
                    );


                const difference =
                    deadline - today;


                const days =
                    Math.ceil(
                        difference /
                        (1000 * 60 * 60 * 24)
                    );


                let message;


                if (days === 0) {

                    message =
                        "Due today 🔥";

                } else if (days === 1) {

                    message =
                        "Due tomorrow ⚠️";

                } else {

                    message =
                        `Due in ${days} days`;

                }


                return `
                    <div class="notification-item">

                        <strong>
                            ${escapeHTML(
                                task.title
                            )}
                        </strong>

                        <br>

                        <span>
                            ${message}
                        </span>

                    </div>
                `;

            })
            .join("");

}


/* =====================================================
   31. NOTIFICATION PANEL
===================================================== */

notificationBtn.addEventListener(
    "click",
    () => {

        notificationPanel.classList.toggle(
            "hidden"
        );

    }
);


/* =====================================================
   32. DARK MODE
===================================================== */

let darkMode =
    localStorage.getItem(
        "taskFlowDarkMode"
    ) === "true";


function applyTheme() {

    if (darkMode) {

        document.body.classList.add(
            "dark"
        );


        themeToggle.textContent =
            "☀️ Light Mode";

    } else {

        document.body.classList.remove(
            "dark"
        );


        themeToggle.textContent =
            "🌙 Dark Mode";

    }

}


themeToggle.addEventListener(
    "click",
    () => {

        darkMode =
            !darkMode;


        localStorage.setItem(
            "taskFlowDarkMode",
            darkMode
        );


        applyTheme();

    }
);


applyTheme();


/* =====================================================
   33. NAVIGATION
===================================================== */

const navItems =
    document.querySelectorAll(
        ".nav-item[data-view]"
    );


const views = {

    dashboard:
        document.getElementById(
            "dashboardView"
        ),

    tasks:
        document.getElementById(
            "tasksView"
        ),

    calendar:
        document.getElementById(
            "calendarView"
        ),

    projects:
        document.getElementById(
            "projectsView"
        )

};


navItems.forEach(item => {

    item.addEventListener(
        "click",
        () => {

            const viewName =
                item.dataset.view;


            /* Remove active */

            navItems.forEach(nav =>
                nav.classList.remove(
                    "active"
                )
            );


            item.classList.add(
                "active"
            );


            /* Hide all views */

            Object.values(views)
                .forEach(view =>
                    view.classList.add(
                        "hidden"
                    )
                );


            /* Show selected view */

            views[viewName]
                .classList.remove(
                    "hidden"
                );


            const titles = {

                dashboard: "Dashboard",

                tasks: "My Tasks",

                calendar: "Calendar",

                projects: "Projects"

            };


            document.getElementById(
                "pageTitle"
            ).textContent =
                titles[viewName];


            if (viewName === "calendar") {

                renderCalendar();

            }


            if (viewName === "projects") {

                renderProjects();

            }

        }
    );

});


/* =====================================================
   34. HELPER FUNCTIONS
===================================================== */

function formatDate(dateString) {

    if (!dateString) return "";


    const date =
        new Date(
            dateString +
            "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );

}


function capitalize(text) {

    return (
        text
            .charAt(0)
            .toUpperCase() +
        text.slice(1)
    );

}


/* Prevent HTML injection */

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =====================================================
   35. CHECK LOGIN ON PAGE LOAD
===================================================== */

if (currentUser) {

    showDashboard();

} else {

    authSection.classList.remove(
        "hidden"
    );


    dashboard.classList.add(
        "hidden"
    );

}


