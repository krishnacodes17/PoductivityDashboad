


let userName = document.querySelector("#username")
let passWord = document.querySelector("#password")
let form     = document.querySelector("form")


let users = JSON.parse(localStorage.getItem("users")) || []

form.addEventListener("submit",(e)=>{
    e.preventDefault()

    let username = userName.value.trim()
    let password = passWord.value.trim()
    // console.log(username, " " , password)


    // * validation  
    if(username === "" || password === ""){
        alert("please fill all Fields")
        return
    }

    // * duplicate user check
    const isUserExists = users.find((user)=>{
         return user.username.toLowerCase() === username.toLowerCase();
    })

    if(isUserExists) {
        alert("username Already exists")
        return
    }

    users.push({
    id: Date.now(),
    username,
    password,

    productivity: {
        tasks: [],
        planner: [],
        goals: [],
        pomodoro: {
            completedSessions: 0,
            totalFocusMinutes: 0,
            settings: {
                focus: 25,
                shortBreak: 5,
                longBreak: 15
            }
        }
    },

    finance: {
        transactions: []
    },
    
    preferences: {
        theme: "light"
    }
})

    localStorage.setItem("users",JSON.stringify(users))
    
    alert("Account created SuccessFully")
    form.reset()

    window.location.href="./index.html"
// console.log(users)
})

