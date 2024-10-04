import {logout} from '../../firebase/logout';
const btnLoginIndex = document.getElementById('index__login');
btnLoginIndex.addEventListener('click', () => logout()); 