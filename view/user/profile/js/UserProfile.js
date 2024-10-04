// UserProfile.js
import DatabaseService from './Database.js';

class UserProfile {
  constructor(userId) {
    this.userId = userId;
    this.userFullname = document.getElementById("user_fullName");
    this.userPhone = document.getElementById("user_phone");
    this.userAddress = document.getElementById("user_address");
    this.userEmail = document.getElementById("user_email");
    this.userBirth = document.getElementById("user_birth");
    this.userCreateDate = document.getElementById("user_createDate");
    this.updUser = document.getElementById("updUser");

    if (this.updUser) {
      this.updUser.addEventListener('click', this.updateUser.bind(this));
    } else {
      console.error("Update button not found");
    }

    document.addEventListener('DOMContentLoaded', this.selectUser.bind(this));
  }

  selectUser() {
    DatabaseService.getUserData(this.userId).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        this.userFullname.value = data.FullName;
        this.userPhone.value = data.Phone;
        this.userAddress.value = data.Address;
        this.userEmail.value = data.Email;
        this.userBirth.value = data.Birth;
        this.userCreateDate.value = data.CreateDate;
      } else {
        alert("No data found");
      }
    }).catch((error) => {
      alert(`Unsuccessful, error: ${error}`);
    });
  }

  updateUser() {
    if (confirm("Do you want to save changes?") === true) {
      const userData = {
        FullName: this.userFullname.value,
        Phone: this.userPhone.value,
        Address: this.userAddress.value,
        Email: this.userEmail.value,
        Birth: this.userBirth.value,
        CreateDate: this.userCreateDate.value,
      };

      DatabaseService.updateUser(this.userId, userData).then(() => {
        alert("Data stored successfully");
      }).catch((error) => {
        alert(`Unsuccessful, error: ${error}`);
      });
    } else {
      alert("Save Canceled!");
    }
  }
}

export default UserProfile;
