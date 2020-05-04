<template>
    <div v-if="visible">
        <div class="grayed-out" @click="close"></div>
        <div class="modal transaction">
            <h2>Record a new transaction</h2>
            <div>
                <CamperDetail :camper="camper"></CamperDetail>
            </div>

            <div class="new-transaction-details">
              <h4>Where did this transaction occur?</h4>
              <select v-model="location">
                  <option v-for="(opt, index) in possibleLocations" :key="index">
                      {{ opt }}
                  </option>
              </select>

              <h4>What was the amount?</h4>
              <span style="font-size:1.1em;">$</span> <input type="number" step="0.01" ref="amountInput" v-model.number="newTransaction.amount"
                @keyup="amountKeyUp">
              <p class="hint-text">(Press Enter to save, Escape to close)</p>

              <h4>
                <input id="debit-checkbox" type="checkbox" 
                  :checked="!newTransaction.debit" @click="toggleCreditDebit"> 
                <label for="debit-checkbox">Check if the transaction was a credit</label>
              </h4>

              <div class="button-group">
                <button class="btn btn-primary" @click="recordTransaction">Save</button>
                <button class="btn btn-secondary" @click="close">Cancel</button>
              </div>
            </div>

            <div v-if="camper.transactions.length > 0">

              <hr>

              <h3>Past Transactions</h3>
              <table align="center">
                <tr>
                  <th>Amount</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Banker</th>
                  <th></th>
                </tr>
                <tr v-for="(transaction, index) in camper.transactions" :key="index">
                  <td><span v-if="!transaction.debit">Credit: </span>${{ Math.abs(transaction.amount).toFixed(2) }}</td>
                  <td>{{ transaction.location }}</td>
                  <td>{{ displayDate(transaction.timestamp) }}</td>
                  <td>{{ banker.firstName + ' ' + banker.lastName }}</td>
                  <td>
                    <button class="btn-icon" @click="deleteTransaction(index)">
                      <i class="nav-icon fas fa-trash-alt fa-md fa-fw"></i>
                    </button>
                  </td>
                </tr>
              </table>
            </div>
        </div>
    </div>
</template>

<script>
import db from '@/firebase/database.js';
import CamperDetail from '@/components/CamperDetail.vue';

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    camperID: {
      type: String,
      required: true
    },
    camper: {
      type: Object,
      //required: true
    }
  },
  data: function() {
    return {
      banker: {},
      location: 'Chatterbox',
      possibleLocations: [
        'Chatterbox',
        'Craft Cave',
        'Bookstore',
        'Front Desk'
      ],
      newTransaction: {
        debit: true,
        amount: null
      }
    }
  },
  firestore() {
    return {
      banker: db.collection('users').doc(this.$route.params.userId),
    }
  },
  computed: {
    transactionAmount() {
      let amt = Number(this.newTransaction.amount);
      if (amt === null || amt === undefined || amt <= 0) {
        return null;
      }
      return amt;
    },
  },
  methods: {
    amountKeyUp: function(evt) {
      // save on enter
      if (evt.key === 'Enter') {
        this.recordTransaction();
      }
      // close on escape
      if (evt.key === 'Escape') {
        this.close();
      }
    },
    toggleCreditDebit: function() {
      this.newTransaction.debit = !this.newTransaction.debit;
    },
    displayDate: function(timestamp) {
      let date = new Date(timestamp);

      return date.getMonth() + '/' + 
        date.getDate() + '/' + 
        date.getFullYear() + ' at ' + 
        date.getHours().toString().padStart(2,'0') + ':' + 
        date.getMinutes().toString().padStart(2,'0');
    },
    recordTransaction: function() {
      if (this.transactionAmount !== null) {
        let time = Date.now();
        this.$emit('recordTransaction', {
          camperID: this.$props.camperID,
          location: this.location,
          timestamp: time,
          debit: this.newTransaction.debit,
          amount: this.transactionAmount,
          bankerID: this.$route.params.userId
        });

        this.newTransaction = {
          debit: true,
          amount: null
        }

        this.close();
      } else {
        console.log('Invalid amount for transaction.  Must be a positive number.');
      }
    },
    deleteTransaction: function(index) {
      this.$emit('deleteTransaction', {
        camperID: this.$props.camperID,
        transactionIndex: index
      });
    },
    close: function() {
      this.$emit('close');
    }
  },
  updated() {
    if (this.$refs.amountInput !== undefined) {
      this.$refs.amountInput.focus();
    }
  },
  components: { CamperDetail }
}
</script>