<script lang="ts">
import { toRaw } from 'vue';
import { appDatabase, type Asset, type WalletGoal } from '../database/AppDatabase';
import { formatPercentage } from '@/utils/Numbers';
import type { DataTableCellEditCompleteEvent } from 'primevue/datatable';
import FormAddAsset from '@/components/FormAddAsset.vue';

export default {
    components: { FormAddAsset },
    data() {
        return {
            percentageClasses: 0,
            percentageAcoes: 0,
            walletGoalTable: appDatabase.walletGoalTable,
            walletGoal: [] as WalletGoal[]
        };
    },
    mounted() {
        this.walletGoalTable
            .toArray()
            .then((walletGoal) => {
                if (walletGoal.length < 1) {
                    this.walletGoal = [
                        {
                            key: '00Acoes',
                            data: {
                                label: 'Ações',
                                percentage: 0,
                                assets: [
                                    { number: 1, code: 'PETR4', custody: 0, weight: 5, percentageClass: 50 },
                                    { number: 2, code: 'VALE3', custody: 0, weight: 5, percentageClass: 50 }
                                ]
                            }
                        },
                        { key: '01FIIs', data: { label: 'FIIs', percentage: 0, assets: [] } },
                        { key: '02Stocks', data: { label: 'Stocks', percentage: 0, assets: [] } },
                        { key: '03Reits', data: { label: 'REITs', percentage: 0, assets: [] } },
                        { key: '04Bdrs', data: { label: 'BDRs', percentage: 0, assets: [] } },
                        { key: '05EtfsBE', data: { label: 'ETFs BR', percentage: 0, assets: [] } },
                        { key: '06EtfsEUA', data: { label: 'ETFs EUA', percentage: 0, assets: [] } },
                        { key: '07Criptomoedas', data: { label: 'Criptomoedas', percentage: 0, assets: [] } },
                        { key: '08RendaFixa', data: { label: 'Renda Fixa', percentage: 0, assets: [] } },
                        { key: '09RendaFixaEUA', data: { label: 'R. Fixa EUA', percentage: 0, assets: [] } }
                    ];
                    return;
                }

                this.walletGoal = walletGoal;
                this.percentageClasses = this.calculePercentageClasses();
            })
            .catch((e) => console.error(e));
    },
    computed: {
        tabsShow() {
            return this.walletGoal.filter((item: WalletGoal) => item.data.percentage > 0);
        }
    },
    methods: {
        changeValueClass(key: number) {
            let sumPercentage = this.calculePercentageClasses();
            if (sumPercentage > 100) {
                this.walletGoal[key].data.percentage = 100 - (sumPercentage - this.walletGoal[key].data.percentage);
                sumPercentage = 100;
            }

            this.percentageClasses = sumPercentage;
            sumPercentage === 100 && this.saveDatabase();
        },
        saveDatabase() {
            this.walletGoalTable.bulkPut(toRaw(this.walletGoal));
        },
        calculePercentageClasses() {
            return this.walletGoal.reduce((accumulator, currentValue) => accumulator + currentValue.data.percentage, 0);
        },
        calculePercentageClass(arrAssets: Asset[]) {
            const nTotal = arrAssets.reduce((accumulator, currentValue) => accumulator + currentValue.weight, 0);

            arrAssets.forEach((asset, index) => {
                arrAssets[index].percentageClass = (asset.weight / nTotal) * 100;
            });

            return arrAssets;
        },
        onCellEditComplete(nIndexTab: number, event: DataTableCellEditCompleteEvent) {
            let { data, newValue, field } = event;

            if (field === 'weight') {
                data[field] = newValue;
                this.walletGoal[nIndexTab].data.assets.forEach((asset, key) => {
                    if (asset.code === data.code) {
                        this.walletGoal[nIndexTab].data.assets[key].weight = Number(newValue);
                        return;
                    }
                });
                this.walletGoal[nIndexTab].data.assets = this.calculePercentageClass(this.walletGoal[nIndexTab].data.assets);
                this.saveDatabase();
            }

            if (field === 'custody') {
                data[field] = newValue;
                this.walletGoal[nIndexTab].data.assets.forEach((asset, key) => {
                    if (asset.code === data.code) {
                        this.walletGoal[nIndexTab].data.assets[key].custody = Number(newValue);
                        return;
                    }
                });
                this.walletGoal[nIndexTab].data.assets = this.calculePercentageClass(this.walletGoal[nIndexTab].data.assets);
                this.saveDatabase();
            }
        },
        onAddAsset(event: any, nIndexTab: number) {
            const overlaysAddAsset = this.$refs.overlayAddAsset as any;
            overlaysAddAsset[nIndexTab].toggle(event);
        },
        onAddedAsset([arrAssets, nIndexTab]: [Asset[], number]) {
            this.walletGoal[nIndexTab].data.assets = this.calculePercentageClass(arrAssets);
            this.saveDatabase();
        }
    },
    setup() {
        return {
            formatPercentage
        };
    }
};
</script>

<template>
    <div className="card">
        <TabView>
            <TabPanel header="Classes">
                <div class="card">
                    <ProgressBar :value="percentageClasses">{{ percentageClasses }}/100</ProgressBar>
                    <Divider />
                    <div class="grid p-fluid">
                        <div v-for="(item, index) in walletGoal" :key="item.key" class="col-12 md:col-4 sm:col-6">
                            <h5>{{ item.data.label }}</h5>
                            <InputNumber v-model.number="item.data.percentage" @update:modelValue="changeValueClass(index)" />
                            <Slider v-model="item.data.percentage" @slideend="changeValueClass(index)" />
                        </div>
                    </div>
                </div>
            </TabPanel>
            <TabPanel header="Carteira">
                <TabView :scrollable="true">
                    <template v-for="(tab, index) in tabsShow" :key="tab.key">
                        <TabPanel :header="tab.data.label">
                            <DataTable
                                removableSort
                                editMode="cell"
                                @cell-edit-complete="onCellEditComplete(index, $event)"
                                :value="tab.data.assets"
                                :pt="{
                                    column: {
                                        bodycell: ({ state }: any) => ({
                                            style: state['d_editing'] && 'padding-top: 0.6rem; padding-bottom: 0.6rem'
                                        })
                                    }
                                }"
                            >
                                <Column field="number" header="#"></Column>
                                <Column field="code" sortable header="Código"></Column>
                                <Column field="custody" sortable header="Custódia" style="cursor: pointer">
                                    <template #editor="{ data, field }">
                                        <InputText v-model="data[field]" />
                                    </template>
                                </Column>
                                <Column field="weight" sortable header="Nota" style="cursor: pointer">
                                    <template #editor="{ data, field }">
                                        <InputText v-model="data[field]" />
                                    </template>
                                </Column>
                                <Column field="percentageClass" sortable header="% Classe">
                                    <template #body="{ data, field }">
                                        {{ formatPercentage(data[field]) + '%' }}
                                    </template>
                                </Column>
                                <template #empty>Nenhum ativo encontrado em {{ tab.data.label }}.</template>
                            </DataTable>
                            <div class="flex justify-content-end mt-3">
                                <Button icon="pi pi-plus" label="Adicionar" @click="onAddAsset($event, index)" rounded />
                                <OverlayPanel ref="overlayAddAsset" appendTo="body" style="max-width: 350px">
                                    <FormAddAsset :walletIndex="index" @addedAsset="onAddedAsset" />
                                </OverlayPanel>
                            </div>
                        </TabPanel>
                    </template>
                </TabView>
            </TabPanel>
        </TabView>
    </div>
</template>

<style scoped></style>
