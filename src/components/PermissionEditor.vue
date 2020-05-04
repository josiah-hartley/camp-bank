<template>
  <div v-if="visible">
    <div class="grayed-out" @click="close"></div>
    <div class="modal permission-editor">
      <h3>{{ currentBank.name }}</h3>
      <h4>Select which bankers should have access to this bank</h4>
      <div class="banker-selection">
        <div v-for="(user, index) in users" :key="index">
          <input type="checkbox" :value="user['.key']" :id="('banker-id-' + index)" v-model="tempAuthUsers">
          <label :for="('banker-id-' + index)">{{ user.firstName + ' ' + user.lastName }}</label>
        </div>
      </div>

      <div class="button-group">
        <button class="btn btn-primary" @click="savePermissions">Save Changes</button>
        <button class="btn btn-secondary" @click="close">Cancel</button>
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
    bankId: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      users: [],
      banks: [],
      tempAuthUsers: [],
    }
  },
  firestore() {
    return {
      users: db.collection('users'),
      banks: db.collection('bankMetadata')
    }
  },
  computed: {
    currentBank: function() {
      return this.banks.find((bank) => bank['.key'] === this.bankId);
    }
  },
  methods: {
    savePermissions: function() {
      db.collection('bankMetadata').doc(this.bankId).set({
        authorizedUsers: this.tempAuthUsers
      }, { merge: true })
      .catch((e) => {console.log('Error editing user permissions: ', e)});

      this.close();
    },
    close: function() {
      this.$emit('close');
    }
  },
  watch: {
    currentBank: function() {
      this.tempAuthUsers = this.currentBank.authorizedUsers;
    }
  }
}

</script>