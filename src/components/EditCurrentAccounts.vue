<template>
  <div>
    <div class="button-group" style="margin: 20px 0px;">
      <button class="btn btn-primary" @click="startAddingNewAccount">Add New Account</button>
    </div>

    <table align="center" class="edit-accounts-table">
      <tr>
        <th class="centered-el">Cabin</th>
        <th>Name</th>
        <th class="centered-el">Age</th>
        <th class="centered-el">Starting Balance</th>
        <th class="centered-el">Boys Camp</th>
        <th class="centered-el">Challenge Week</th>
        <th></th>
        <th></th>
      </tr>
      <tr v-if="newCamperOpen">
        <td class="centered-el">
          <input type="number" v-model.number="camperBeingEdited.cabin">
        </td>
        <td>
          <input type="text" v-model="camperBeingEdited.firstName">  <input type="text" v-model="camperBeingEdited.lastName">
        </td>
        <td class="centered-el">
          <input type="number" step="0.1" v-model.number="camperBeingEdited.age">
        </td>
        <td class="centered-el">
          <input type="number" step="0.01" v-model.number="camperBeingEdited.startingBalance">
        </td>
        <td class="centered-el">
          <input type="checkbox" v-model="camperBeingEdited.boysCamp">
        </td>
        <td class="centered-el">
          <input type="checkbox" v-model="camperBeingEdited.challengeWeek">
        </td>
        <td>
          <button class="btn btn-primary" @click="finishAddingNewAccount">
            Save
          </button>
        </td>
        <td>
          <button class="btn btn-secondary" @click="cancelEdit">
            Cancel
          </button>
        </td>
      </tr>
      <tr v-for="(camper, index) in campers" :key="index">
        <td class="centered-el">
          <span v-if="editIndex === index">
            <input type="number" v-model.number="camperBeingEdited.cabin">
          </span>
          <span v-if="editIndex !== index">{{ camper.cabin }}</span>
        </td>
        <td>
          <span v-if="editIndex === index">
            <input type="text" v-model="camperBeingEdited.firstName">  <input type="text" v-model="camperBeingEdited.lastName">
          </span>
          <span v-if="editIndex !== index">{{ camper.firstName + ' ' + camper.lastName }}</span>
        </td>
        <td class="centered-el">
          <span v-if="editIndex === index">
            <input type="number" step="0.1" v-model.number="camperBeingEdited.age">
          </span>
          <span v-if="editIndex !== index">{{ camper.age }}</span>
        </td>
        <td class="centered-el">
          <span v-if="editIndex === index">
            <input type="number" step="0.01" v-model.number="camperBeingEdited.startingBalance">
          </span>
          <span v-if="editIndex !== index">{{ camper.startingBalance }}</span>
        </td>
        <td class="centered-el">
          <span v-if="editIndex === index">
            <input type="checkbox" v-model="camperBeingEdited.boysCamp">
          </span>
          <span v-if="editIndex !== index">
            <span v-if="camper.boysCamp">
              <i class="nav-icon fas fa-check fa-md fa-fw"></i>
            </span>
          </span>
        </td>
        <td class="centered-el">
          <span v-if="editIndex === index">
            <input type="checkbox" v-model="camperBeingEdited.challengeWeek">
          </span>
          <span v-if="editIndex !== index">
            <span v-if="camper.challengeWeek">
              <i class="nav-icon fas fa-check fa-md fa-fw"></i>
            </span>
          </span>
        </td>
        <td>
          <button class="btn btn-primary" v-if="editIndex === index" @click="saveEdit">
            Save
          </button>
          <button class="btn-icon" v-if="editIndex !== index" @click="startEditing(index)">
            <i class="nav-icon fas fa-pencil-alt fa-md fa-fw"></i>
          </button>
        </td>
        <td>
          <button class="btn btn-secondary" v-if="editIndex === index" @click="cancelEdit">
            Cancel
          </button>
          <button class="btn-icon" v-if="editIndex !== index" @click="deleteCamperAtIndex(index)">
            <i class="nav-icon fas fa-trash-alt fa-md fa-fw"></i>
          </button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>

export default {
  props: {
    campers: {
      type: Array,
      required: true
    }
  },
  data: function() {
    return {
      editIndex: -1,
      newCamperOpen: false,
      camperBeingEdited: {
        id: '',
        firstName: '',
        lastName: '',
        age: null,
        cabin: null,
        startingBalance: null,
        boysCamp: false,
        challengeWeek: false,
        transactions: []
      }
    }
  },
  methods: {
    startAddingNewAccount: function() {
      this.camperBeingEdited = {
        id: '',
        firstName: '',
        lastName: '',
        age: null,
        cabin: null,
        startingBalance: null,
        boysCamp: false,
        challengeWeek: false,
        transactions: []
      };
      this.newCamperOpen = true;
    },
    finishAddingNewAccount: function() {
      this.camperBeingEdited.id = this.camperBeingEdited.cabin.toString() + 
        '-' + this.camperBeingEdited.firstName + 
        this.camperBeingEdited.lastName +
        '-' + this.camperBeingEdited.age.toString();
      this.saveEdit();
    },
    startEditing: function(index) {
      this.camperBeingEdited = this.campers[index];
      this.editIndex = index;
    },
    saveEdit: function() {
      this.$emit('saveCamper', this.camperBeingEdited);
      this.editIndex = -1;
      this.newCamperOpen = false;
      this.camperBeingEdited = {
        id: '',
        firstName: '',
        lastName: '',
        age: null,
        cabin: null,
        startingBalance: null,
        boysCamp: false,
        challengeWeek: false,
        transactions: []
      };
    },
    cancelEdit: function() {
      this.editIndex = -1;
      this.newCamperOpen = false;
      this.camperBeingEdited = {
        id: '',
        firstName: '',
        lastName: '',
        age: null,
        cabin: null,
        startingBalance: null,
        boysCamp: false,
        challengeWeek: false,
        transactions: []
      };
    },
    deleteCamperAtIndex: function(index) {
      this.$emit('deleteCamper', this.campers[index]);
    }
  }
}

</script>