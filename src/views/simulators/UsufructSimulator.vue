<script lang="ts">
import MainAdsenseBottom from '@/components/MainAdsenseBottom.vue';

export default {
    name: 'UsufructSimulator',
    components: { MainAdsenseBottom },
    head() {
        return {
            title: 'Simulador de Usufruto ou Fruição',
            meta: [
                {
                    name: 'description',
                    content: 'Calcule quanto tempo você conseguirá usufruir de uma renda pré-determinada, com base em um patrimônio acumulado. Simulador usado para planejamento financeiro e aposentadoria.'
                }
            ]
        };
    },
    data() {
        return {
            equity: null as number | null,
            optionsProfitability: [
                { name: 'a.m.', code: 'a.m.' },
                { name: 'a.a.', code: 'a.a.' }
            ],
            profitability: {
                value: null as number | null,
                option: { name: 'a.m.', code: 'a.m.' }
            },
            monthlyWithdrawal: null as number | null,
            resultSimulation: null as any
        };
    },
    methods: {
        calculate() {
            const profitability = this.profitability.option.name === 'a.m.' ? (this.profitability.value as number) / 100 : this.convertTaxeToMonthly(this.profitability.value as number);
            const result = Math.floor(Math.log((this.monthlyWithdrawal as number) / ((this.monthlyWithdrawal as number) - (this.equity as number) * profitability)) / Math.log(1 + profitability));
            console.log(result);

            this.resultSimulation = isNaN(result) || result === Infinity ? 'Pelo resto da vida' : this.formatYearsAndMonths(result);
        },
        clearFields() {
            this.equity = null;
            this.profitability = {
                value: null,
                option: { name: 'a.m.', code: 'a.m.' }
            };
            this.monthlyWithdrawal = null;
            this.resultSimulation = null;
        },
        // função que transforma meses em anos e meses
        formatYearsAndMonths(months: number) {
            const years = Math.floor(months / 12);
            const remainingMonths = months % 12;
            if (years === 0) return `${remainingMonths} m${remainingMonths > 1 ? 'e' : 'ê'}s${remainingMonths > 1 ? 'es' : ''}`;
            if (remainingMonths === 0) return `${years} ano${years > 1 ? 's' : ''}`;
            return `${years} ano${years > 1 ? 's' : ''} e ${remainingMonths} m${remainingMonths > 1 ? 'e' : 'ê'}s${remainingMonths > 1 ? 'es' : ''}`;
        },
        convertTaxeToMonthly(taxe: number) {
            return Math.pow(1 + taxe / 100, 1 / 12) - 1;
        }
    }
};
</script>

<template>
    <div className="card">
        <h4>Simulador de Usufruto ou Fruição</h4>
        <p>O resultado mostrará quanto tempo você conseguirá usufruir de uma renda pré-determinada, com base em um patrimônio acumulado.</p>
        <div className="p-fluid formgrid grid">
            <div className="field col-12 md:col-4">
                <label>Patrimônio</label>
                <InputGroup>
                    <InputGroupAddon>R$</InputGroupAddon>
                    <InputNumber v-model="equity" locale="pt-BR" :maxFractionDigits="2" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-4">
                <label>Rentabilidade <i class="pi pi-question-circle" v-tooltip.focus.top="'Taxa de rentabilidade onde o patrimônio está aplicado'" tabindex="1"></i></label>
                <InputGroup>
                    <InputNumber v-model="profitability.value" locale="pt-BR" :maxFractionDigits="2" />
                    <InputGroupAddon>%</InputGroupAddon>
                    <Dropdown v-model="profitability.option" :options="optionsProfitability" optionLabel="name" class="w-7rem" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-4">
                <label>Retirada mensal <i class="pi pi-question-circle" v-tooltip.focus.top="'Quanto você deseja retirar por mês'" tabindex="2"></i></label>
                <InputGroup>
                    <InputGroupAddon>R$</InputGroupAddon>
                    <InputNumber v-model="monthlyWithdrawal" locale="pt-BR" :maxFractionDigits="2" />
                </InputGroup>
            </div>
            <div className="field col-12 mt-3">
                <div class="flex flex-wrap sm:flex-nowrap" style="max-width: 500px">
                    <Button label="Calcular" @click="calculate" />
                    <Button label="Limpar" @click="clearFields" link />
                </div>
            </div>
        </div>
        <div className="col-12 mt-5 result" v-if="resultSimulation">
            <h4>Resultado</h4>
            <div class="grid mt-3">
                <div class="col-12 md:col-6 md:col-offset-3 xl:col-4 xl:col-offset-4">
                    <Fieldset legend="Tempo até zerar o patrimônio">
                        <h5 class="positive">{{ resultSimulation }}</h5>
                    </Fieldset>
                </div>
            </div>
        </div>
    </div>
    <MainAdsenseBottom />
</template>

<style scoped lang="scss">
.result {
    .grid {
        h5 {
            text-align: center;
            margin-bottom: 0;
            font-size: 24px;

            &.positive {
                color: var(--green-700);
            }
        }
    }
}
</style>
