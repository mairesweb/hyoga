import { Dexie, type Table } from 'dexie';

const DATABASE_NAME = 'Hyoga';
const DATABASE_VERSION = 1;

export type Asset = { number: number; code: string; custody: number; weight: number; percentageClass: number };
export type WalletGoal = { key: string; data: { label: string; percentage: number; assets: Asset[] } };

let bHasIndexedDB = false;
let initialized = false;
if (self.indexedDB) {
    const r = indexedDB.open('dummy', 1);
    r.onerror = function (evt) {
        bHasIndexedDB = false;
        initialized = true;
        alert('Browser não funcionar corretamente neste browser.');
    };
    r.onsuccess = function (evt) {
        bHasIndexedDB = true;
        initialized = true;
    };
}

export class AppDatabase extends Dexie {
    walletGoalTable: Table<WalletGoal>;
    constructor() {
        super(DATABASE_NAME);
        this.version(DATABASE_VERSION).stores({
            walletGoalTable: '&key'
        });

        this.walletGoalTable = this.table('walletGoalTable');
    }

    public isReady() {
        return initialized;
    }

    public hasIndexedDB() {
        return bHasIndexedDB;
    }
}

export const appDatabase = new AppDatabase();
