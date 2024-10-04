
let userProfile =  document.getElementById('user__profile');
let path;

userProfile.addEventListener('click',()=>{
    if(localStorage.getItem('userID') !== "null"){
        console.log('user');
        path = "./view/user/profile/user_profile_UI.html";
    }
    else
        path = "#";
    window.location.href = path;
})