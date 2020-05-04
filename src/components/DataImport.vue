<template>
    <div class="modal">
        <h1>Import Camper Data</h1>
        <p>To import camper data, create a .xls, .xlsx, or .csv file that follows the format shown in the sample below.  Note: the first row in the table should contain the column headers.</p>
        <table align="center" class="import-sample">
            <tr>
                <th>Cabin</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Age</th>
                <th>Starting Balance</th>
                <th>Weeks</th>
            </tr>
            <tr>
                <td>1</td>
                <td>Martin</td>
                <td>Klinger</td>
                <td>14.8</td>
                <td>24</td>
                <td>Boys Camp and Challenge Week</td>
            </tr>
            <tr>
                <td>1</td>
                <td>Henry</td>
                <td>Nguyen</td>
                <td>14.6</td>
                <td>20</td>
                <td>Boys Camp</td>
            </tr>
            <tr>
                <td>1</td>
                <td>Ramon</td>
                <td>Borjas</td>
                <td>14.5</td>
                <td>26</td>
                <td>Challenge Week</td>
            </tr>
            <tr>
                <td>&#8942;</td>
                <td>&#8942;</td>
                <td>&#8942;</td>
                <td>&#8942;</td>
                <td>&#8942;</td>
                <td>&#8942;</td>
            </tr>
        </table>
        
        <div style="text-align:center">
            <input type="file" multiple="false" id="sheetjs-input" class="inputfile" accept="' + acceptableExt + '" @change="onchange" />
            <label for="sheetjs-input">Upload a file</label>
        </div>
		<!--<br/>
		<button type="button" id="export-table" style="visibility:hidden" @click="onexport">Export to XLSX</button>
		<br/>-->
        <div style="visibility:hidden" id="save-instructions">
            <p>Your imported data is shown below.  If this looks incorrect, modify your input file accordingly and try again.  Otherwise, click the button below to add this data to the database.</p>
            <button type="button" @click="saveData">Add to Database</button>
        </div>
		<div id="out-table"></div>
	</div>
</template>

<script>
import XLSX from 'xlsx';
import db from '@/firebase/database.js';

let acceptableExt = [
        "xlsx", "xls", "csv", "txt", "ods"
    ].map(function(x) { return "." + x; }).join(",");

export default {
    data: function() {
        return {
            camperTable: []
        }
    },
    props: {
      bankId: {
        type: String,
        required: true
      }
    },
    methods: {
      onchange: function (evt) {
        let files = evt.target.files;

        if (!files || files.length == 0) return;

        let file = files[0];

        let reader = new FileReader();
        reader.onload = (e) => {
          // pre-process data
          let binary = "";
          let bytes = new Uint8Array(e.target.result);
          let length = bytes.byteLength;
          for (let i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }

          /* read workbook */
          let wb = XLSX.read(binary, {type: 'binary'});

          /* grab first sheet */
          let wsname = wb.SheetNames[0];
                  let ws = wb.Sheets[wsname];

          /* generate HTML */
                  let HTML = XLSX.utils.sheet_to_html(ws);
                  this.camperTable = XLSX.utils.sheet_to_json(ws, {header:1});

          /* update table */
          document.getElementById('out-table').innerHTML = HTML;
          /* show save button */
          document.getElementById('save-instructions').style.visibility = "visible";
        };

        reader.readAsArrayBuffer(file);
      },
      saveData: function () {
        let campers = [];
        for (let i = 1; i < this.camperTable.length; i++) {
          let row = this.camperTable[i];
          let bc = false;
          let cw = false;

          if (row[5].toLowerCase().includes('boys camp')) {
              bc = true;
          }
          if (row[5].toLowerCase().includes('challenge week')) {
              cw = true;
          }

          let camper = {
            cabin: row[0],
            firstName: row[1],
            lastName: row[2],
            age: row[3],
            startingBalance: row[4],
            transactions: [],
            boysCamp: bc,
            challengeWeek: cw
          };
          let camperID = camper.cabin.toString() + '-' + camper.firstName + camper.lastName + '-' + camper.age.toString();

          //db.collection('banks').doc(this.$props.bankId).collection('accounts').doc(camperID).set(camper)//add(camper)
          //.catch((err) => console.log('Error adding document: ', err));

          let docRef = db.collection('banks').doc(this.$props.bankId);
          docRef.set({
            accounts: {
              [camperID]: camper
            }
          }, { merge: true })
          .catch((err) => console.log('Error adding document: ', err));

          campers.push(camper);
        }
        this.$emit('close', campers);
      }
    }
}
</script>

