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