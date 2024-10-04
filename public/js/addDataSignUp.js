//import { correctValidateSignUp, validateFormSignUp } from "./validateForm";
//import { inputSignUpName, inputSignUpPhoneNumber, inputSignUpEmail, inputSignUpPassword, inputSignUpRePassword } from "./validateForm";
//
//const email = inputSignUpEmail.value;
//const fullname = inputSignUpName.value;
//const password = inputSignUpPassword.value;
//const phoneNumber = inputSignUpPhoneNumber.value;
//const register = () => {
//    console.log("register");
//    if(correctValidateSignUp){
//        auth.createUserWithEmailAndPassword(email, password)
//        .then(() => {
//            let user = auth.currentUser;
//            const userData = {
//                address: '',
//                create_date: new Date().toISOString(),
//                email: email,
//                fullname: fullname,
//                phone: phoneNumber,
//                role_id: "",
//                update_date:"",
//            }
//            let databaseRef = database.ref('User/' + user.uid).set(userData);
//            alert('Sign up successfully');
//        })
//        .catch((error) => {
//            console.log(error.message);
//        })
//    }
//}
//export {
//    register
//}
