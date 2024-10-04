import { logout } from "../../../firebase/logout.js";
const logoutBtn = document.getElementById('admin__sign-out');
const pathToLogin = "../../index.html"
logoutBtn.addEventListener('click', () => logout(pathToLogin));

