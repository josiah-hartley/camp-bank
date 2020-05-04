<template>
  <div>
    <Navbar :bankName="bank.name"></Navbar>

    <div class="center-panel reports-page">
      <h1>This is the reports page.</h1>
      <div>There's nothing here yet.</div>
    </div>
  </div>
</template>

<script>
import db from '@/firebase/database.js';
import Navbar from '@/components/Navbar.vue';

export default {
  data: function() {
    return {
      bank: {}
    }
  },
  firestore() {
    return {
      bank: db.collection('banks').doc(this.$route.params.bankId),
    }
  },
  components: { Navbar }
}

</script>
