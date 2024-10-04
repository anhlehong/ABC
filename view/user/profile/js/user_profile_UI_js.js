// user_profile_UI_js.js
import UserProfile from './UserProfile.js';

const userId = localStorage.getItem('userID');
if (userId) {
  const userProfile = new UserProfile(userId);
} else {
  console.error("User ID not found in localStorage");
}
