import User from "../model/user.js";
const redirect = async () => {
    const userID = localStorage.getItem('userID');
    const userDB = new User();
    const role = await userDB.getRoleUser(userID);
    const getCurrentPageTitle = document.title; 
    if(role !== getCurrentPageTitle)
        window.location.href = '../../index.html';
}
redirect();
const Aside = document.getElementById('sidebar');
const ToggleSideBar = document.getElementsByClassName('toggle-sidebar-btn')[0];
ToggleSideBar.addEventListener('click', ()=>{
    const styleAside = getComputedStyle(Aside);
    console.log(styleAside.left);
    if(Aside.style.left === "0px"){
        Aside.style.left = "-300px";
        return;
    }
    Aside.style.left = "0px";
})
