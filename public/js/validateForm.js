/***********************************************Form sign in validation ***********************************************/
const btnSubmit = document.getElementsByClassName('login-area__submit')[0];
const inputUsername = document.getElementsByClassName('login-area__username')[0];
const inputPassword = document.getElementsByClassName('login-area__password')[0];
const errorUsername = document.getElementsByClassName('error__username')[0];
const errorPassword = document.getElementsByClassName('error__password')[0];
const capsLockText = document.getElementsByClassName('capsLock-error')[0];
const errorInvalidUser = document.getElementsByClassName('error__invalid-user')[0];
const passwordIcon = document.getElementsByClassName('password__icon')[0];
const showLoginInvalidUser = () => {
    errorInvalidUser.style.display='block';
}
const validateFormSignIn = () => {
    if (inputPassword.value.trim() === '') {
        errorPassword.style.display='block';
        inputPassword.style.outline='1px solid red';
    }
    if (inputUsername.value.trim() === '') {
        errorUsername.style.display='block';
        inputUsername.style.outline='1px solid red';
    }
}
btnSubmit.addEventListener('click', validateFormSignIn);


inputPassword.addEventListener('keydown', function(e) {
    if(e.getModifierState('CapsLock')) {
        capsLockText.style.display='flex';
    }
    else {
        capsLockText.style.display='none';
    }
})
    
passwordIcon.addEventListener('click', function() {
    if(inputPassword.type === 'password') {
        inputPassword.type = 'text';
    }
    else {
        inputPassword.type = 'password';
    }
})

/***********************************************Form sign up validation ***********************************************/
const isCorrectValidateSignUp = () => {
    for(const key in validateSignUp)
        if(validateSignUp[key] === false)
            return false
    return true
}
const validateSignUp = {
    username: false,
    phoneNumber: false,
    email: false,
    password: false,
    repassword: false,
}
const rightConditionPassword = {
    letter: false, 
    capital: false,
    number: false,
    length: false
}

const showRightConditionPassword = () => {
    for(const key in rightConditionPassword )
        console.log(key,rightConditionPassword[key]);
}
const inputSignUpName = document.getElementsByClassName('signup__username')[0];
const inputSignUpPhoneNumber = document.getElementsByClassName('signup__phone-number')[0];
const inputSignUpEmail = document.getElementsByClassName('signup__email')[0];
const inputSignUpPassword = document.getElementsByClassName('signup__password')[0];
const inputSignUpRePassword = document.getElementsByClassName('signup__repassword')[0];
const inputSignUp = [];
inputSignUp.push(inputSignUpName);
inputSignUp.push(inputSignUpPhoneNumber);
inputSignUp.push(inputSignUpEmail);
inputSignUp.push(inputSignUpPassword);
inputSignUp.push(inputSignUpRePassword);


const errorSignUpName = document.getElementsByClassName('error-signup__username')[0];
const errorSignUpPhoneNumber = document.getElementsByClassName('error-signup__phone-number')[0];
const errorSignUpEmail = document.getElementsByClassName('error-signup__email')[0];
const errorSignUpPassword = document.getElementsByClassName('error-signup__password')[0];
const errorSignUpRePassword = document.getElementsByClassName('error-signup__repassword')[0];
const errorSignUp = [];
errorSignUp.push(errorSignUpName);
errorSignUp.push(errorSignUpPhoneNumber);
errorSignUp.push(errorSignUpEmail);
errorSignUp.push(errorSignUpPassword);
errorSignUp.push(errorSignUpRePassword);

const btnSubmitSignUp = document.getElementsByClassName('signup-area__submit')[0];

const validateVietNamesePhoneNumber = (phoneNumber) => {
    return /^(03|05|07|08|09|01)([0-9]{8})\b/.test(phoneNumber);
}
const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@\.]+\.[^\s@]+/.test(email);
}
const validateFormSignUp = () => {
    //index mean
    //0: name, 1: phoneNumber, 2: Email, 3: password, 4: repassword
    for(let i = 0; i < inputSignUp.length; i++){
        if(i !== 0){
            if(i === 1 ){
                if(!validateVietNamesePhoneNumber(inputSignUpPhoneNumber.value.trim())){
                    errorSignUp[i].style.display='block';
                    inputSignUp[i].style.outline='1px solid red';
                    validateSignUp.phoneNumber = false;
                }
                else
                    validateSignUp.phoneNumber = true;
            }
            else if(i === 2 ){
                if(!validateEmail(inputSignUpEmail.value.trim())){
                    errorSignUp[i].style.display='block';
                    inputSignUp[i].style.outline='1px solid red';
                    validateSignUp.email = false;
                }
                else
                    validateSignUp.email = true;
            }
            else if( i === 3 ){
                let bWrong = false;
                //If in rightConditionPassword has value of item is false, wrong will be true to trigger error message
                for(const key in rightConditionPassword)
                    if(!rightConditionPassword[key])
                        bWrong = true;
                if(bWrong){
                    errorSignUp[i].style.display='block';
                    inputSignUp[i].style.outline='1px solid red';
                    validateSignUp.password = false;
                }
                else
                    validateSignUp.password = true;
            }
            else if(i === 4){
                const repasswordVal = inputSignUp[i].value;
                const passwordVal = inputSignUpPassword.value;
                if(repasswordVal !== passwordVal || repasswordVal === ''){
                    errorSignUp[i].style.display='block';
                    inputSignUp[i].style.outline='1px solid red';
                    validateSignUp.repassword = false;
                }
                else
                    validateSignUp.repassword = true;
            }
        }
        else  
        {
            if (inputSignUp[i].value.trim() === ''){
                errorSignUp[i].style.display='block';
                inputSignUp[i].style.outline='1px solid red';
                validateSignUp.username = false;
            }
            else
                validateSignUp.username = true;
        }
    }
    //showRightConditionPassword();
    //console.log(isCorrectValidateSignUp());
}
btnSubmitSignUp.addEventListener('click', validateFormSignUp);


let letter = document.getElementById("letter");
let capital = document.getElementById("capital");
let number = document.getElementById("number");
let length = document.getElementById("length");
const passwordUIValidation =  document.getElementById("password__validation");
const inputSignupPassword = document.getElementsByClassName('signup__password')[0];
inputSignupPassword.onfocus = () => {
    passwordUIValidation.style.display = "flex";
}
inputSignupPassword.onblur = () => {
    passwordUIValidation.style.display = "none";
}

//rightCondition includes 4 item: lowercase, uppercase, number and min 8 chars
//function below describe that if all things are right, each of values's items in rightCondition will be true
//validateFormSignUp in index 3 of validateSignUp will be based on value's item in rightCondition
inputSignupPassword.addEventListener('keyup', () => { 
    const inputPassVal = inputSignupPassword.value;
    const usingRegexValiPass = (regex, spanID, keyItem) => {
        if(regex.test(inputPassVal)){
            spanID.classList.remove("password__invalid");
            spanID.classList.add("password__valid");
            rightConditionPassword[keyItem] = true;
        }
        else{
            spanID.classList.add("password__invalid");
            spanID.classList.remove("password__valid");
            rightConditionPassword[keyItem] = false;
        }
    }
    let lowercase = /[a-z]/g;
    let uppercase = /[A-Z]/g;
    let isNumber = /[0-9]/g;
    usingRegexValiPass(lowercase, letter, 'letter');
    usingRegexValiPass(uppercase, capital,'capital');
    usingRegexValiPass(isNumber, number, 'number');
    if(inputPassVal.length >= 8){
         length.classList.remove("password__invalid");
         length.classList.add("password__valid");
         rightConditionPassword.length = true;
    }
    else{
         length.classList.add("password__invalid");
         length.classList.remove("password__valid");
         rightConditionPassword.length = false;
    }
})

/***********************************************Form forgot pass validation ***********************************************/
const forgotpassbtnSubmit = document.getElementsByClassName('forgot-pass__submit')[0];
const inputForgotpass = document.getElementsByClassName('input__forgot-pass')[0];
const errorForgotpass = document.getElementsByClassName('error__forgot-pass')[0];
forgotpassbtnSubmit.addEventListener('click', (event) => {
    const inputVal = inputForgotpass.value;
    console.log(validateEmail(inputVal));
    if(!validateEmail(inputVal)){
        errorForgotpass.style.display='block';
        inputForgotpass.style.outline='1px solid red';

    }

});
export{
    btnSubmit,
    inputUsername,
    inputPassword,
    showLoginInvalidUser,

    inputSignUpEmail,
    inputSignupPassword,
    inputSignUpName,
    inputSignUpPhoneNumber,
    isCorrectValidateSignUp,
    btnSubmitSignUp,
    errorSignUpEmail,
    errorInvalidUser,

    inputForgotpass,
    forgotpassbtnSubmit,

    validateEmail

}
