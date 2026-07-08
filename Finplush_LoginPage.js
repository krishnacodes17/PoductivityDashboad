

let userName = document.querySelector("#username")
let passWord = document.querySelector("#password")
let form     = document.querySelector("form")

let user = JSON.parse(localStorage.getItem("users")) || []

form.addEventListener("submit",(e)=>{
    e.preventDefault()

    // * value getting through form

    let username = userName.value.trim()
    let password = passWord.value.trim()


    //  * Validation
    if(username === "" || password === ""){
        alert("please fill all Fields")
        return
    }


    // * check userExist or not in localStorage

    let isUserExists = user.find((user)=>{
       return user.username.toLowerCase() === username.toLowerCase() && user.password === password
    })


    if(!isUserExists){
        alert("Invalid Username or Password.");
        return
    }


    localStorage.setItem("isLoggedIn","true")
    localStorage.setItem("currentUser",JSON.stringify(isUserExists))


    window.location.href= "./poductivityDashboard.html"


})