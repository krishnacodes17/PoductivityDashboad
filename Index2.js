let time_info = document.querySelector("#time_info");
let days_info = document.querySelector("#days_info");

// * side menu
const menuLinks = document.querySelectorAll(".menu-link");

const backButtons = document.querySelectorAll(".back-btn");

let dashboard = document.querySelector("#rightHideContent");
let quickCard = document.querySelectorAll(".quick-card");
const pages = document.querySelectorAll(".page");

const currentUsername = document.querySelector("#currentUsername")
let greetUser  = document.querySelector("#greetUser")
let greetQuots   = document.querySelector("#greetQuots")

const plannerCount = document.querySelector("#plannerCount");

// * Time *
function UpdateTime() {
  const now = new Date();
  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const date = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  time_info.innerHTML = time;
  days_info.textContent = date;
}

setInterval(() => {
  UpdateTime();
}, 1000);



quickCard.forEach((card) => {
  card.addEventListener("click", () => {
    openPage(card.dataset.page);
  });
});

menuLinks.forEach((card) => {
  card.addEventListener("click", () => {
    openPage(card.dataset.page);
  });
});




function openPage(pageName) {
  const selectedPage = document.getElementById(pageName);
  if (!selectedPage) {
    return;
  }

  dashboard.style.display = "none";

  pages.forEach((page) => {
    page.style.display = "none";
  });
  
  selectedPage.style.display = "block";
}



//  * backbutton logic
function openDashboard() {
  dashboard.style.display = "block";
  pages.forEach((page) => {
    page.style.display = "none";
  });
}

backButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openDashboard();
  });
});





//  * Todo

const taskInput = document.querySelector("#taskInput");
const taskCategory = document.querySelector("#taskCategory");
const taskPriority = document.querySelector("#taskPriority");
const taskDate = document.querySelector("#taskDate");
const addTaskBtn = document.querySelector("#addTaskBtn");

const todoList = document.querySelector("#todoList");
let editTaskId = null;
let tasks = [];




addTaskBtn.addEventListener("click", () => {
  if (taskDate.value.trim() === "" || taskInput.value.trim() === "") {
    alert("all fields are required");
    return;
  }



  if (editTaskId === null) {
      const task = {
    id: Date.now(),
    title: taskInput.value.trim(),
    category: taskCategory.value,
    priority: taskPriority.value,
    dueDate: taskDate.value,
    completed: false,
  };

    tasks.push(task);
    saveUserTasks();
    renderTasks();

  } else {

    const task = tasks.find(task => task.id === editTaskId);

    task.title = taskInput.value.trim();
    task.category = taskCategory.value;
    task.priority = taskPriority.value;
    task.dueDate = taskDate.value;

    editTaskId = null;

    addTaskBtn.innerHTML = `
        <i class="ri-add-line"></i>
        Add Task
    `;
    formreset()

}

  formreset();
  saveUserTasks();
  renderTasks();
  //   console.log(tasks);
});

function formreset() {
  taskInput.value = "";
  taskCategory.selectedIndex = 0;
  taskPriority.selectedIndex = 0;
  taskDate.value = "";
}




function renderTasks() {
  todoList.innerHTML = "";
  tasks.forEach((task) => {
    todoList.innerHTML += `<div class="todo-item">

                <div class="todo-left">
                    <input  type="checkbox"
                       class="complete-checkbox"
                       data-id="${task.id}"
                       ${task.completed ? "checked" : ""}> 
                    <div class="task-details">
                        <h4>${task.title}</h4>

                        <div class="task-meta">
                            <span>${task.category}</span>
                            <span>${task.priority}</span>
                            <span>${task.dueDate}</span>
                        </div>

                    </div>
                </div>

                <div class="task-actions">
                    <button class="edit-btn" data-id=${task.id}>
                        <i class="ri-edit-line"></i>
                    </button>

                    <button class="delete-btn" data-id="${task.id}">
                        <i class="ri-delete-bin-line"></i>
                    </button>

                </div>

            </div>`;
  });

  updateDashboard()
}




todoList.addEventListener("click", (e) => {
  //* ================ Delete =================
  const deleteBtn = e.target.closest(".delete-btn");
  if (deleteBtn) {
    const taskId = Number(deleteBtn.dataset.id);
    tasks = tasks.filter((task) => task.id !== taskId);

    saveUserTasks();
    renderTasks();

    return;
  }

  //* ================ Complete =================

  const checkbox = e.target.closest(".complete-checkbox");
  if (checkbox) {
    const taskId = Number(checkbox.dataset.id);
    const task = tasks.find((task) => task.id === taskId);
    task.completed = checkbox.checked;

    saveUserTasks();
    renderTasks();

    return;
  }

  const editBtn = e.target.closest(".edit-btn");

  if (editBtn) {
    const taskId = Number(editBtn.dataset.id);
    const task = tasks.find((task) => task.id === taskId);

    taskInput.value = task.title;
    taskCategory.value = task.category;
    taskPriority.value = task.priority;
    taskDate.value = task.dueDate;
    editTaskId = task.id;
    addTaskBtn.textContent = "Update Task";

    saveUserTasks();
    renderTasks();

    return;
  }
});


// * Updating task 

const totalTasks = document.querySelector("#totalTasks");
const pendingTasks = document.querySelector("#pendingTasks");
const completedTasks = document.querySelector("#completedTasks");
const completionRate = document.querySelector("#completionRate");


function updateDashboard(){ 

  const total = tasks.length;
  const completed = tasks.filter((task)=>task.completed).length;
  const pending = total - completed
  const percentage =
        total === 0
            ? 0
            : Math.round((completed / total) * 100);

  totalTasks.textContent = total;
  pendingTasks.textContent = pending;
  completedTasks.textContent = completed;
  completionRate.textContent = `${percentage}%`

}

function saveUserTasks(){

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const users = JSON.parse(localStorage.getItem("users"));

    const userIndex = users.findIndex(user => user.id === currentUser.id);

    users[userIndex].tasks = tasks;
    currentUser.tasks = tasks;
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

}


function loadUserTasks(){
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if(currentUser && currentUser.tasks){
        tasks = [...currentUser.tasks]
        
    }
    currentUsername.textContent =currentUser.username
    
    let {message,greetqoutemessage} = updateGreeting()
    // console.log(currentUser.username)
    greetUser.textContent = ` ${message}, ${currentUser.username}!`
    greetQuots.textContent = greetqoutemessage
    renderTasks();

}


function updateGreeting(){
    const hour = new Date().getHours();
    let message = ""
    let greetqoutemessage = ""

    if(hour<12){
      message = "Good Morning"
      greetqoutemessage = "Start your day with focus."
    }else if(hour<17){
      message = "Good Afternoon";
      greetqoutemessage = "Keep pushing towards your goals."

    }else{
      message = "Good Evening";
      greetqoutemessage = "Great work today. Finish strong"

    }

    return {message,greetqoutemessage}
}



//  * Planner 


const plannerTime = document.querySelector("#plannerTime");
const plannerTask = document.querySelector("#plannerTask");
const addPlanBtn = document.querySelector("#addPlanBtn");
const plannerList = document.querySelector("#plannerList");

let planner = [];
let editPlanId = null;



addPlanBtn.addEventListener("click",()=>{
  if(plannerTime.value.trim() === ""   || plannerTask.value.trim() === "" ){
      alert("All fields are required");
        return;
  }


  const plan = {
    id:Date.now(),
    time:plannerTime.value,
    task:plannerTask.value.trim()
};

if(editPlanId === null){
    planner.push(plan);

    saveUserPlanner();
    resetPlanner();
    renderPlanner();

}else{
    const currentPlan = planner.find(plan => plan.id === editPlanId);

    console.log(plannerTime.value)
      currentPlan.time = plannerTime.value;
      currentPlan.task = plannerTask.value.trim();
      editPlanId = null;
      addPlanBtn.textContent = "Add Plan";

      saveUserPlanner();
      resetPlanner();
      renderPlanner();
}

// console.log(plan)
})




function resetPlanner(){
    plannerTime.value = "";
    plannerTask.value = "";
}

function formatTime(time){
    let [hour,minute] = time.split(":");
    hour = Number(hour);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
}

function renderPlanner(){
    plannerList.innerHTML = "";
    planner.forEach(plan=>{
      let time = formatTime(plan.time)

        plannerList.innerHTML += `
<div class="planner-item">

    <div class="planner-time">
        ${time}
    </div>

    <div class="planner-task">
        ${plan.task}
    </div>

    <div class="planner-actions">

        <button
            class="edit-plan"
            data-id="${plan.id}">
            <i class="ri-edit-line"></i>
        </button>

        <button
            class="delete-plan"
            data-id="${plan.id}">
            <i class="ri-delete-bin-line"></i>
        </button>

    </div>

</div>
`;
    });

    updatePlannerDashboard();
}

plannerList.addEventListener("click",(e)=>{
  const deleteBtn = e.target.closest(".delete-plan")
  const editBtn  = e.target.closest(".edit-plan")

  if(deleteBtn){
    const planId = Number(deleteBtn.dataset.id)
    planner = planner.filter((plan)=> plan.id !== planId)

    saveUserPlanner();
    renderPlanner();

    return
  }


if(editBtn){
    const planId = Number(editBtn.dataset.id);
    const plan = planner.find(plan => plan.id === planId);
    // console.log(plan.time)
    plannerTime.value = plan.time;
    plannerTask.value = plan.task;
    editPlanId = plan.id;
    addPlanBtn.textContent = "Update Plan";
    return;
}

})


function saveUserPlanner(){
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const users = JSON.parse(localStorage.getItem("users"));
    const userIndex = users.findIndex(user => user.id === currentUser.id);
    users[userIndex].productivity.planner = planner;
    currentUser.productivity.planner = planner;
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

}


function loadUserPlanner(){
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if(currentUser && currentUser.productivity.planner){
        planner = [...currentUser.productivity.planner];
    }
    renderPlanner();

}


function updatePlannerDashboard(){
    plannerCount.textContent = planner.length;
}



// * Prodomo


const openSettings = document.querySelector("#openSettings");
const closeSettings = document.querySelector("#closeSettings");

const pomodoroSettings = document.querySelector("#pomodoroSettings");


const plusBtns = document.querySelectorAll(".plus-btn");
const minusBtns = document.querySelectorAll(".minus-btn");
const focusValue = document.querySelector("#focusValue");
const shortValue = document.querySelector("#shortValue");
const longValue = document.querySelector("#longValue");
const sessionBtns = document.querySelectorAll(".session");

let settings = {
    focus:25,
    short:5,
    long:15
}

let timerInterval = null;
let totalSeconds = settings.focus * 60;
let currentMode = "focus";
let isRunning = false;





openSettings.addEventListener("click",()=>{
    pomodoroSettings.style.display="flex";
});

closeSettings.addEventListener("click",()=>{
    pomodoroSettings.style.display="none";
});




function updateSettingsUI(){
    focusValue.textContent = settings.focus;
    shortValue.textContent = settings.short;
    longValue.textContent = settings.long;
}



function updateTimerDisplay(){
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    timer.textContent =
    `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
}


function resetCurrentMode(){
    totalSeconds = settings[currentMode] * 60;
    updateTimerDisplay();

}


startBtn.addEventListener("click",()=>{
    if(isRunning) return;
    isRunning = true;
    timerInterval = setInterval(()=>{
        totalSeconds--;
        updateTimerDisplay();
        if(totalSeconds <= 0){
            clearInterval(timerInterval);
            isRunning = false;
            alert("Session Completed 🎉");
        }
    },1000);

});


pauseBtn.addEventListener("click",()=>{
    clearInterval(timerInterval);
    isRunning = false;
});


resetBtn.addEventListener("click",()=>{
    clearInterval(timerInterval);
    isRunning = false;
    resetCurrentMode();

});


sessionBtns.forEach(btn=>{
    btn.addEventListener("click",()=>{
        sessionBtns.forEach(button=>{
            button.classList.remove("active");
        });
        btn.classList.add("active");
        currentMode = btn.dataset.mode;
        clearInterval(timerInterval);
        isRunning = false;
        resetCurrentMode();
    });

});



plusBtns.forEach(btn=>{
    btn.addEventListener("click",()=>{
        const target = btn.dataset.target;
        settings[target]++;
        updateSettingsUI();
        if(currentMode === target){
            resetCurrentMode();
        }
    });

})


minusBtns.forEach(btn=>{
    btn.addEventListener("click",()=>{
        const target = btn.dataset.target;
        if(settings[target] > 1){
            settings[target]--;
        }
        updateSettingsUI();
        if(currentMode === target){
            resetCurrentMode();
        }
    });

});


updateSettingsUI();
updateTimerDisplay();
loadUserTasks();
loadUserPlanner();