<script lang="ts">
import { appDatabase, type Asset, type WalletGoal } from '@/database/AppDatabase';
import { useMainStore } from '@/store/MainStore';
import { defineComponent, toRaw } from 'vue';

export default defineComponent({
    props: {
        walletIndex: {
            type: Number,
            required: true
        }
    },
    emits: ['addedAsset'],
    data() {
        return {
            form: {} as Asset,
            walletGoalTable: appDatabase.walletGoalTable,
            walletGoal: [] as WalletGoal[]
        };
    },
    async mounted() {
        const store = useMainStore();
        this.walletGoal = await store.walletGoal;
    },
    methods: {
        addAsset() {
            const arrAssets = this.walletGoal[this.walletIndex].data.assets;
            this.form.number = arrAssets.length + 1;
            this.form.percentageClass = 0;
            this.walletGoal[this.walletIndex].data.assets.push(this.form);
            this.$emit('addedAsset', [this.walletGoal[this.walletIndex].data.assets, this.walletIndex]);
            this.saveDatabase();
        },
        saveDatabase() {
            this.walletGoalTable.bulkPut(toRaw(this.walletGoal));
        }
    }
});
</script>

<template>
    <form class="p-fluid">
        <div class="field">
            <label for="code">Código</label>
            <InputText v-model="form.code" type="text" />
        </div>
        <div class="formgrid grid">
            <div class="field col">
                <label for="custody">Custódia</label>
                <InputNumber v-model.number="form.custody" type="number" />
            </div>
            <div class="field col">
                <label for="weight">Nota</label>
                <InputNumber v-model.number="form.weight" type="number" />
            </div>
        </div>
        <Button label="Salvar" @click="addAsset" rounded />
    </form>
</template>

<style scoped></style>
