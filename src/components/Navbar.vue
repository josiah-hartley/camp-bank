<template>
  <div>
    <div id="nav" class="navbar">
      <span v-if="bankName !== null" class="back-button"
        @click="$router.go(-1)">
        <i class="nav-icon fas fa-arrow-left fa-lg fa-fw"></i>
      </span>
      <!--<router-link v-if="bankName !== null" to="/" tag="span" class="back-button">
       <i class="nav-icon fas fa-arrow-left fa-lg fa-fw"></i>
      </router-link>-->

      <span v-if="bankName === null" class="brand-link">
        <router-link to="/" tag="span">
          <span>GWH Camp Banking</span>
        </router-link>
      </span>
      <span v-if="bankName !== null" class="brand-link">
        <router-link :to="{ name: 'Bank', params: { bankId: $route.params.bankId, userId: $route.params.userId }}" tag="span">
          <span>{{ bankName }}</span>
        </router-link>
      </span>

      <!--<span class="brand-link"><router-link to="/" tag="span">
        <span v-if="bankName === null">GWH Camp Banking</span>
        <span v-if="bankName !== null">{{ bankName }}</span>
      </router-link></span>-->

      <span v-if="showHamburgerButton" class="menu-btn-holder" @click="toggleMenu">
        <i class="nav-icon fas fa-bars fa-lg fa-fw"></i>
      </span>
    </div>

    <div v-if="menuOpen" class="transparent-screen" @click="closeMenu"></div>
    <div v-if="menuOpen" class="overflow-menu" @click="closeMenu">
      <span v-if="$route.name === 'Home' && showNewUserMenu" @click="$emit('addUser')">Create a new banker</span>
      <span v-if="$route.name === 'Bank'" @click="$emit('editAccountInfo')">Edit information for the listed accounts</span>
      <span v-if="$route.name === 'Bank'" @click="$emit('editPermissions')">Edit permissions for this bank</span>
      <router-link :to="{ name: 'Reports', params: { bankId: $route.params.bankId, userId: $route.params.userId }}"
        v-if="$route.name === 'Bank'" tag="span">
        View/Create Reports
      </router-link>
      <span><a @click="logout">Log out</a></span>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  props: {
    showNewUserMenu: {
      type: Boolean,
      required: false
    },
    bankName: {
      type: String,
      default: null
    },
    showHamburgerButton: {
      type: Boolean,
      default: true
    }
  },
  data: function() {
    return {
      menuOpen: false
    }
  },
  methods: {
    logout: function() {
      firebase.auth().signOut();
      this.$router.push({ name: 'Login'});
    },
    closeMenu: function() {
      this.menuOpen = false;
    },
    toggleMenu: function() {
      this.menuOpen = !this.menuOpen;
    },
  }
}

</script>