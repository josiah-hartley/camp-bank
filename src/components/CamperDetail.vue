<template>
    <div class="camper-details">
        <span class="cabin-number">{{ camper.cabin }}</span>
        <span class="person">
            <span class="name">{{ camper.firstName }} {{ camper.lastName }}</span>
            <span class="age">({{ camper.age.toFixed(1) }})</span>
        </span>
        <span class="balance">
            <span class="current-balance"
                :class="{ 'positive-balance' : currentBalance > 0,
                    'negative-balance' : currentBalance < 0 }">${{ Math.abs(currentBalance).toFixed(2) }}</span>
            <span class="initial-balance">
                (${{ camper.startingBalance.toFixed(2) }})
            </span>
        </span>
    </div>
</template>

<script>
import balance from '@/helpers/balance.js';

export default {
    props: {
        camper: {
            type: Object,
            required: true
        }
    },
    computed: {
        currentBalance: function() {
            return balance.latestBalance(this.$props.camper);
        }
    }
}
</script>