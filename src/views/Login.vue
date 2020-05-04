<template>
  <div>
    <Navbar :showHamburgerButton="false">
    </Navbar>

    <div class="center-panel">
      <div id="firebase-auth" class="login-form"></div>
    </div>
  </div>
</template>

<script>

import firebase from 'firebase/app';
import firebaseApp from '@/firebase/app.js';
import firebaseui from 'firebaseui';

import Navbar from '@/components/Navbar.vue';

const uiConfig = {
  signInSuccessUrl: '/',
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  credentialHelper: 'none' //firebaseui.auth.CredentialHelper.NONE
}

const ui = new firebaseui.auth.AuthUI(firebaseApp.auth());

export default {
  methods: {
    initializeAuth: function() {
      ui.start('#firebase-auth', uiConfig);
    }
  },
  mounted() {
    this.initializeAuth();
  },
  components: { Navbar }
}

</script>
