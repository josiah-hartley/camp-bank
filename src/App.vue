<template>
  <div id="app">
    <!--<div id="nav" class="navbar">
      <span><router-link to="/" tag="a" :class="brand-link">Home</router-link></span>
      <span><button class="btn" @click="logout">Log Out</button></span>
    </div>-->
    <router-view/>
  </div>
</template>

<script>
//import firebase from 'firebase/app';
//import 'firebase/auth';

export default {
  /*data: function() {
    return {
      bankId: 'GHxLUaRCYIZfVfWOEN5d'
    }
  },*/
  /*methods: {
    logout: function() {
      firebase.auth().signOut();
      this.$router.push({ name: 'Login'});
    },
  }*/
}

</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
</style>
