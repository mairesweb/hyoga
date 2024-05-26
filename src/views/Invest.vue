<script lang="ts">
import { appDatabase } from '@/database/AppDatabase';

export default {
    data() {
        return {
            auxCurrency: {
                name: 'Reais',
                symbol: 'R$',
                locale: 'pt-BR'
            },
            options: ['Reais', 'Dolares'],
            nInvest: 0,
            walletGoalTable: appDatabase.walletGoalTable,
            assets: [] as any[]
        };
    },
    mounted() {
        this.walletGoalTable
            .toArray()
            .then((walletGoal) => {
                if (walletGoal.length < 1) {
                    return;
                }

                const assets = walletGoal.map((goal) => {
                    goal.data.assets.forEach((asset: any) => {
                        asset.active = true;
                        asset.class = goal.data.label;
                        asset.qtdGoal = 0;
                        asset.investValue = 0.0;
                        asset.status = 1;
                    });
                    return goal.data.assets;
                });
                this.assets = assets.flat();
            })
            .catch((e) => console.error(e));
    },
    computed: {
        type: {
            get() {
                return this.auxCurrency.name;
            },
            set(value: string) {
                this.auxCurrency.name = value;
                this.auxCurrency.symbol = value === 'Reais' ? 'R$' : 'U$';
                this.auxCurrency.locale = value === 'Reais' ? 'pt-BR' : 'en-US';
            }
        }
    },
    methods: {
        getSeverity(data: any) {
            return data.status ? 'success' : 'warning';
        }
    }
};
</script>

<template>
    <div className="card p-fluid">
        <div class="flex flex-column md:flex-row gap-3">
            <div class="flex flex-row flex-nowrap">
                <label for="invest" class="w-6rem align-content-center">Aportar em</label>
                <SelectButton v-model="type" :options="options" aria-labelledby="basic" />
            </div>
            <InputGroup>
                <InputGroupAddon>{{ auxCurrency.symbol }}</InputGroupAddon>
                <InputNumber v-model.number="nInvest" mode="decimal" :minFractionDigits="2" :maxFractionDigits="2" :locale="auxCurrency.locale" />
                <Button label="Calcular" />
            </InputGroup>
        </div>
    </div>
    <div class="card">
        <DataTable :value="assets" tableStyle="min-width: 50rem">
            <Column header="Incluir">
                <template #body="slotProps">
                    <InputSwitch v-model="slotProps.data.active" />
                </template>
            </Column>
            <Column field="code" header="Código"></Column>
            <Column field="class" header="Classe"></Column>
            <Column field="custody" header="Custódia"></Column>
            <Column field="qtdGoal" header="Qtd Meta"></Column>
            <Column field="investValue" header="R$ Aporte"></Column>
            <Column field="status" header="Status">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.status ? 'COMPRAR' : 'AGUARDAR'" :severity="getSeverity(slotProps.data)" />
                </template>
            </Column>
            <Column>
                <template #body="slotProps">
                    <Button :disabled="!slotProps.data.status" label="Aportar" severity="success" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style scoped></style>
