<template>
  <div v-if="visible">
    <div class="grayed-out" @click="close"></div>
    <div class="modal full-height-modal wide-modal">
      <span class="tabs">
        <ul>
          <li :class="{ 'active-tab': tabIndex === 0 }"
            @click="switchTab(0)">
            Edit Current Accounts
          </li>
          <li :class="{ 'active-tab': tabIndex === 1 }"
            @click="switchTab(1)">
            Import Account Data
          </li>
        </ul>
        <div class="button-group">
          <button class="btn btn-secondary" @click="close">Done Editing</button>
        </div>
      </span>

      <EditCurrentAccounts v-if="tabIndex === 0" 
        :campers="camperList"
        @saveCamper="saveCamperEdit"
        @deleteCamper="deleteCamper">
      </EditCurrentAccounts>
      <ImportAccountData v-if="tabIndex === 1"
        :bankId="bankId"
        @close="switchTab(0)">
      </ImportAccountData>

    </div>
  </div>
</template>

<script>

import EditCurrentAccounts from './EditCurrentAccounts.vue';
import ImportAccountData from './ImportAccountData.vue';

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    bankId: {
      type: String,
      required: true
    },
    camperList: {
      type: Array,
      required: true
    },
    tabIndex: {
      type: Number,
      require: true
    }
  },
  methods: {
    switchTab: function(index) {
      this.$emit('switchTab', index);
    },
    saveCamperEdit: function(camper) {
      this.$emit('saveCamperEdit', camper);
    },
    deleteCamper: function(camper) {
      this.$emit('deleteCamper', camper);
    },
    close: function() {
      this.$emit('close');
    }
  },
  components: { EditCurrentAccounts, ImportAccountData }
}

</script>