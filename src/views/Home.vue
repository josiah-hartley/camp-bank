<template>
  <div>
    <Navbar @addUser="openNewUserForm" 
      :showNewUserMenu="currentUserData && (currentUserData.roles.admin || currentUserData.roles.superuser)">
    </Navbar>

    <div class="center-panel home">

      <div class="new-bank-button" @click="openNewBankForm">
        <i class="nav-icon fas fa-plus-circle fa-lg fa-fw"></i>
        Create a new bank
      </div>
      <div v-if="newBankFormOpen" class="new-bank-form">
        <h3>Enter a name for the new bank:</h3>
        <input type="text" v-model="newBankDetails.name">

        <h3>Select which bankers will have access to this bank:</h3>
        <div class="banker-selection">
          <div v-for="(user, index) in otherUsers" :key="index">
            <input type="checkbox" :value="user['.key']" :id="('banker-id-' + index)" v-model="newBankDetails.authorizedUsers">
            <label :for="('banker-id-' + index)">{{ user.firstName + ' ' + user.lastName }}</label>
          </div>
        </div>

        <div class="button-group">
          <button class="btn btn-primary" @click="createBank">Create Bank</button>
          <button class="btn btn-secondary" @click="closeNewBankForm">Cancel</button>
        </div>
      </div>

      <div v-for="(bank, index) in visibleBanks" :key="index" class="bank-link-holder">
        <router-link :to="{ name: 'Bank', 
          params: { bankId: bank['.key'], userId: currentUser == null ? 'a' : currentUser.uid }}"
          tag="div" class="bank-link">
          <div>
            <h2>{{ bank.name }}</h2>
            <span>{{ createdDate(bank.created) }}</span>
          </div>
        </router-link>
      </div>

      <div v-if="currentUserData && (currentUserData.roles.admin || currentUserData.roles.superuser)">
        <CreateUserForm v-if="newUserFormOpen" :visible="newUserFormOpen"
          :currentUser="currentUser"
          @close="closeNewUserForm">
        </CreateUserForm>
      </div>      
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';
import db from '@/firebase/database.js';

import Navbar from '@/components/Navbar.vue';
import CreateUserForm from '@/components/CreateUser.vue';

export default {
  data: function() {
    return {
      bankIds: [],
      banks: [],
      users: [],
      currentUser: null,
      newBankFormOpen: false,
      newBankDetails: {
        name: '',
        authorizedUsers: [],
        createdBy: '',
        created: null
      },
      newUserFormOpen: false
    }
  },
  methods: {
    createdDate: function(timestamp) {
      let date = timestamp.toDate();
      let month = date.getMonth();
      let day = date.getDate();
      let year = date.getFullYear();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      return 'Created on ' + month + '/' + day + '/' + year + ' at ' + hours.toString().padStart(2,'0') + ':' + minutes.toString().padStart(2,'0');
    },
    openNewBankForm: function() {
      this.newBankFormOpen = true;
    },
    closeNewBankForm: function() {
      this.newBankFormOpen = false;
      this.newBankDetails = {
        name: '',
        authorizedUsers: [],
        createdBy: '',
        created: null
      };
    },
    createBank: function() {
      let newBankRef = db.collection('bankMetadata').doc();

      // user who creates bank automatically has access
      this.newBankDetails.authorizedUsers.push(this.currentUser.uid);

      newBankRef.set({
        name: this.newBankDetails.name,
        authorizedUsers: this.newBankDetails.authorizedUsers,
        createdBy: this.currentUser.uid,
        created: firebase.firestore.FieldValue.serverTimestamp()
      })
      .catch((e) => {console.log('Error adding bank: ', e)});

      db.collection('banks').doc(newBankRef.id).set({
        name: this.newBankDetails.name,
        created: firebase.firestore.FieldValue.serverTimestamp()
      })
      .catch((e) => {console.log('Error adding bank: ', e)});

      this.closeNewBankForm();
    },
    openNewUserForm: function() {
      this.newUserFormOpen = true;
    },
    closeNewUserForm: function() {
      this.newUserFormOpen = false;
    }
  },
  firestore() {
    return {
      users: db.collection('users'),
      banks: db.collection('bankMetadata'),
    }
  },
  computed: {
    otherUsers: function() {
      return this.users.filter((user) => user['.key'] !== this.currentUser.uid);
    },
    userIds: function() {
      return this.users.map((user) => user['.key']);
    },
    currentUserData: function() {
      return this.users.find((user) => user['.key'] === this.currentUser.uid);
    },
    visibleBanks: function() {
      if (this.currentUserData !== undefined && this.currentUserData.roles.superuser) {
        return this.banks;
      }

      return this.banks.filter((bank) => bank.authorizedUsers.indexOf(this.currentUser.uid) > -1)
    }
  },
  components: { Navbar, CreateUserForm },
  /*watch: {
    currentUser: function() {
      this.$binding('bankIds', db.collection('users').doc(this.currentUser.uid))
      .then((user) => {
        this.bankIds = user.banks;
      });
    },
    bankIds: function() {
      let result = [];
      db.collection('bankMetadata').get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            if (this.bankIds.indexOf(doc.id) > -1) {
              result.push({
                id: doc.id,
                ...doc.data()
              });
            }
          });
        });
      this.banks = result;
    }
  },*/
  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.currentUser = user;
      } else {
        this.currentUser = null;
      }
    });
  }
}
</script>
