<template>
  <div v-if="visible">
    <div class="grayed-out" @click="close"></div>
    <div class="modal new-user-form">
      <h2>Create a new banker account</h2>
        <div>
          <input type="text" v-model="newUser.firstName" placeholder="First Name"><br>
          <input type="text" v-model="newUser.lastName" placeholder="Last Name"><br>
          <input type="text" v-model="newUser.email" placeholder="Email Address"><br>
          <span v-if="currentUserRoles && currentUserRoles.superuser">
            <input id="make-admin-checkbox" type="checkbox" v-model="newUser.roles.admin">
            <label for="make-admin-checkbox">Make this an admin account</label>
          </span><br>
          <span v-if="errorMsg !== ''">{{ errorMsg }}</span><br>

          <div class="button-group">
            <button class="btn btn-primary" @click="addNewUser">Create Account</button>
            <button class="btn btn-secondary" @click="close">Cancel</button>
          </div>
        </div>

        <hr>

        <div v-if="currentUserRoles && currentUserRoles.superuser">
          <h2>Apply admin rights</h2>
          <table align="center">
            <tr>
              <th>Name</th>
              <th>Admin</th>
            </tr>
            <tr v-for="(user, index) in tempUsers" :key="index">
              <td><label :for="('admin-id-' + index)">
                {{ user.firstName + ' ' + user.lastName }}
              </label></td>
              <td><input :id="('admin-id-' + index)" type="checkbox" v-model="user.roles.admin"></td>
            </tr>
          </table>

          <div class="button-group">
            <button class="btn btn-primary" @click="saveAdminRoles">Save Changes</button>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import db from '@/firebase/database.js';

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    currentUser: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      newUser: {
        firstName: '',
        lastName: '',
        email: '',
        roles: {
          banker: true,
          admin: false,
          superuser: false
        }
      },
      users: [],
      currentUserMetadata: {},
      errorMsg: '',
      tempUsers: []
    }
  },
  firestore() {
    return {
      users: db.collection('users'),
      currentUserMetadata: db.collection('users').doc(this.currentUser.uid)
    }
  },
  computed: {
    currentUserRoles: function() {
      return this.currentUserMetadata.roles;
    }
  },
  watch: {
    users: function() {
      this.tempUsers = this.users.filter((user) => !user.roles.superuser);
    }
  },
  methods: {
    addNewUser: function() {
      let valid = Boolean(this.newUser.firstName) && Boolean(this.newUser.lastName) && Boolean(this.newUser.email);
      let emailAvailable = this.users.findIndex((user) => user.email === this.newUser.email) < 0;

      if (valid && emailAvailable) {
        db.collection('users').add(this.newUser);
        this.errorMsg = '';
      } else if (!valid) {
        this.errorMsg = 'All fields must be filled in';
      } else {
        this.errorMsg = 'A user with that email address already exists';
      }

      this.close();
    },
    saveAdminRoles: function() {
      this.tempUsers.forEach((user) => {
        db.collection('users').doc(user['.key']).set({
          roles: user.roles
        }, { merge: true })
        .catch((e) => { console.log('Error saving admin roles: ', e); });
      });
    },
    close: function() {
      this.$emit('close');
    }
  }
}

</script>