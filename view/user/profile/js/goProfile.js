let userProfile =  document.getElementById('go_profile');
let path;

userProfile.addEventListener('click',()=>{
    if(localStorage.getItem('userID') !== "null"){
        console.log('user');
        path = "../user_profile_UI.html";
    }
    else
        path = "#";
    window.location.href = path;
})