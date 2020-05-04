function transactionReducer(total, transaction) {
    return transaction['debit'] ? total - transaction.amount : total + transaction.amount;
}

export default {
    latestBalance: function(camper) {
        return camper.transactions.reduce(transactionReducer, camper.startingBalance);
    }
}