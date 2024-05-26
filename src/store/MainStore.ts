import { appDatabase } from '@/database/AppDatabase';
import { defineStore } from 'pinia';

export const useMainStore = defineStore('mainStore', {
    state: () => ({
        walletGoal: appDatabase.walletGoalTable.toArray()
    })
});
