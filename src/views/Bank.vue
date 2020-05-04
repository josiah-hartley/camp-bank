<template>
  <div>
    <Navbar :bankName="bank.name"
      @editPermissions="openPermissionEditor"
      @editAccountInfo="openAccountEditor">
    </Navbar>
    
    <div class="bank">

      <div class="search-box" v-show="sortedCamperList.length > 0">
        <div class="search-outline">
          <div class="search-input-wrapper">
            <i class="nav-icon fas fa-search fa-md fa-fw"></i>
            <!--<input id="search-input" v-model="searchString" @keypress="searchKeyUp" placeholder="Search...">-->
            <input id="search-input" v-model="searchString" placeholder="Search...">
          </div>            
          <div id="search-results">
            <CamperDetail v-for="(camper, index) in matchingCampers" 
              :id ="index === focusIndex ? 'focused' : false"
              :camper="camper" 
              :key="index"
              @click.native="openTransaction(camper['id'])">
            </CamperDetail>
          </div>
        </div>
      </div>

      <div v-if="sortedCamperList.length === 0" class="no-account-data center-panel">
        This bank doesn't have any account information yet.
        <div>
          <button class="btn btn-primary" @click="openAccountEditorImportTab">Import Data</button>
        </div>
      </div>

      <TransactionModal :visible="transactionModalOpen" 
        :camperID="transactionCamperID"
        :camper="transactionCamper"
        @recordTransaction="recordTransaction"
        @deleteTransaction="deleteTransaction"
        @close="closeTransaction">
      </TransactionModal>

      <AccountEditor :visible="accountEditorOpen"
        :bankId="$route.params.bankId"
        :camperList="sortedCamperList"
        :tabIndex="accountEditorTab"
        @switchTab="switchAccountEditorTab"
        @saveCamperEdit="saveEditedCamperInfo"
        @deleteCamper="deleteCamperData"
        @close="closeAccountEditor">
      </AccountEditor>

      <PermissionEditor :visible="permissionEditorOpen"
        :bankId="$route.params.bankId"
        @close="closePermissionEditor">
      </PermissionEditor>

    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import TransactionModal from '@/components/TransactionModal.vue';
import AccountEditor from '@/components/AccountEditor.vue';
import PermissionEditor from '@/components/PermissionEditor.vue';
import CamperDetail from '@/components/CamperDetail.vue';
import firebase from 'firebase/app';
import db from '@/firebase/database.js';

export default {
  data: function() {
    return {
      searchString: '',
      focusIndex: 0,
      bank: {},
      matchingCampers: [],
      transactionModalOpen: false,
      transactionCamperID: '',
      transactionCamper: {},
      accountEditorOpen: false,
      accountEditorTab: 0,
      permissionEditorOpen: false
    }
  },
  firestore() {
    return {
      bank: db.collection('banks').doc(this.$route.params.bankId),
    }
  },
  computed: {
    campers() {
      return this.bank.accounts !== undefined ? this.bank.accounts : {};
    },
    sortedCamperList() {
      let camperList = [];
      let keys = Object.keys(this.campers);
      for (let key of keys) {
        camperList.push({
          id: key,
          ...this.campers[key]
        });
      }

      camperList.sort((a,b) => (a.cabin > b.cabin) ? 1 : (a.cabin === b.cabin) ? ((a.lastName > b.lastName) ? 1 : -1) : -1);
      return camperList;
    }
  },
  methods: {
    focusOnSearchBar() {
      let searchBar = document.getElementById('search-input');
      if (searchBar !== null) {
        searchBar.focus();
      }
    },
    search() {
      this.focusIndex = 0;

      if (this.searchString.split(' ').length > 1) {
        // if search contains a space : search for full name
        this.matchingCampers = this.sortedCamperList.filter((user) => 
          user.firstName.toLowerCase().startsWith(this.searchString.split(' ')[0].toLowerCase()) &&
          user.lastName.toLowerCase().startsWith(this.searchString.split(' ')[1].toLowerCase()));
      } else if (this.searchString.length > 0) {
        // no space in search : search for first or last name
        this.matchingCampers = this.sortedCamperList.filter((user) => 
          user.firstName.toLowerCase().startsWith(this.searchString.toLowerCase()) ||
          user.lastName.toLowerCase().startsWith(this.searchString.toLowerCase()));
      } else {
        this.matchingCampers = this.sortedCamperList;
      }
    },
    searchKeyUp(evt) {
      switch (evt.key) {
        case 'ArrowUp':
          if (this.focusIndex > 0) {
            this.focusIndex--;
          } else {
            this.focusIndex = this.matchingCampers.length - 1;
            let results = document.getElementById('search-results');
            results.scrollTo(0, results.scrollHeight);
          }
          break;
        case 'ArrowDown':
          if (this.focusIndex < this.matchingCampers.length - 1) {
            this.focusIndex++;
          } else {
            this.focusIndex = 0;
            document.getElementById('search-results').scrollTo(0,0);
          }
          break;
        case 'Enter':
          this.openTransaction(this.matchingCampers[this.focusIndex]['id']);
          break;
        default:
            this.search();
      }
      this.scrollIfNeeded();
    },
    scrollIfNeeded() {
      let focusedEl = document.getElementById('focused');
      let parent = document.getElementById('search-results');

      if (focusedEl !== null && parent !== null) {
        let focusedTop = this.focusIndex * focusedEl.offsetHeight;
        let focusedBottom = focusedTop + focusedEl.offsetHeight;
        if (focusedBottom > parent.offsetHeight + parent.scrollTop) {
          parent.scrollBy(0, focusedEl.offsetHeight);
        }
        if (parent.scrollTop > focusedTop) {
          parent.scrollBy(0, -focusedEl.offsetHeight);
        }
      }
    },
    openTransaction(camperID) {
      this.transactionCamperID = camperID;
      this.transactionCamper = this.campers[camperID];
      this.transactionModalOpen = true;
    },
    closeTransaction() {
      this.transactionModalOpen = false;
      this.searchString = '';
      this.search();
      this.focusOnSearchBar();
    },
    openAccountEditor() {
      this.accountEditorOpen = true;
    },
    switchAccountEditorTab(index) {
      this.accountEditorTab = index;
    },
    openAccountEditorImportTab() {
      this.switchAccountEditorTab(1);
      this.openAccountEditor();
    },
    closeAccountEditor() {
      this.accountEditorOpen = false;
    },
    openPermissionEditor() {
      this.permissionEditorOpen = true;
    },
    closePermissionEditor() {
      this.permissionEditorOpen = false;
    },
    saveCamperData(camperID, camper) {
      this.$firestore.bank.set({
        accounts: {
          [camperID]: camper
        }
      }, { merge: true })
      .catch((err) => console.log('Error adding transaction: ', err));

      this.transactionCamper = this.campers[camperID];
    },
    saveEditedCamperInfo(camper) {
      let id = camper.id;
      delete camper.id;
      this.saveCamperData(id, camper);
    },
    deleteCamperData(camper) {
      let camperID = camper.id;
      delete camper.id;
      this.$firestore.bank.set({
        deletedAccounts: {
          [camperID]: camper
        }
      }, { merge: true })
      .catch((err) => console.log('Error deleting account: ', err));

      this.$firestore.bank.set({
        accounts: {
          [camperID]: firebase.firestore.FieldValue.delete()
        }
      }, { merge: true })
      .catch((err) => console.log('Error deleting account: ', err));
    },
    recordTransaction(transaction) {
      let camper = this.campers[transaction.camperID];
      camper.transactions.push(transaction);

      this.saveCamperData(transaction.camperID, camper);
    },
    deleteTransaction(payload) {
      let camperID = payload.camperID;
      let transactionIndex = payload.transactionIndex;

      let camper = this.campers[camperID];
      let deletedTransactions = camper.deletedTransactions === undefined ? [] : camper.deletedTransactions;

      deletedTransactions.push(camper.transactions[transactionIndex]);
      camper.deletedTransactions = deletedTransactions;
      camper.transactions.splice(transactionIndex, 1);

      this.saveCamperData(camperID, camper);
    }
  },
  components: { Navbar, CamperDetail, TransactionModal, AccountEditor, PermissionEditor },
  watch: {
    sortedCamperList: function() {
      this.search();
      this.$nextTick(() => {
        this.focusOnSearchBar();
      });
    }
  },
  mounted() {
    //this.focusOnSearchBar();
    this.$nextTick(() => {
      let searchBox = document.getElementById('search-input');
      if (searchBox !== undefined && searchBox !== null) {
        searchBox.addEventListener('input', evt => {
          this.searchKeyUp(evt);
        });
      }
    });
  }
}

</script>