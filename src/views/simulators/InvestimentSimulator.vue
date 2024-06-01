<script lang="ts">
import MainAdsenseBottom from '@/components/MainAdsenseBottom.vue';
import { formatCurrency } from '@/utils/Numbers';

export default {
    name: 'InvestimentSimulator',
    components: { MainAdsenseBottom },
    // head() {
    //     return {
    //         title: 'Simulador de Investimentos',
    //         meta: [
    //             {
    //                 name: 'description',
    //                 content: 'Simule o rendimento de um investimento com base no tipo de investimento, valor inicial, valor mensal, prazo e rentabilidade.'
    //             }
    //         ]
    //     };
    // },
    data() {
        return {
            investimentType: 'tributado',
            preOuPos: 'prefixado',
            investimentInitial: null as number | null,
            investimentMonthly: null as number | null,
            investimentTime: {
                value: 1,
                option: 'Meses'
            },
            optionsTime: ['Meses', 'Anos'],
            optionsProfitability: [
                { name: 'a.m.', code: 'a.m.' },
                { name: 'a.a.', code: 'a.a.' }
            ],
            profitability: {
                value: null as number | null,
                option: { name: 'a.m.', code: 'a.m.' }
            },
            resultSimulation: {
                total: 0,
                invested: 0,
                taxes: 0,
                taxesPercentage: '0%',
                fees: 0,
                liquidity: 0
            }
        };
    },
    methods: {
        clearFields() {
            this.investimentInitial = null;
            this.investimentMonthly = null;
            this.investimentTime.value = 1;
            this.profitability = {
                value: null,
                option: { name: 'a.m.', code: 'a.m.' }
            };
        },
        calculate() {
            this.resultSimulation.total = this.calculateFutureValue();
            this.resultSimulation.invested = this.calculateAmountInvested();
            this.resultSimulation.fees = this.resultSimulation.total - this.resultSimulation.invested;
            this.resultSimulation.taxes = this.resultSimulation.fees * this.calculateAliquot();
            this.resultSimulation.liquidity = this.resultSimulation.total - this.resultSimulation.taxes;
        },
        getTaxe() {
            if (this.preOuPos === 'prefixado') {
                const profitabilityMonthly = this.profitability.option.name === 'a.m.' ? (this.profitability.value as number) / 100 : this.convertTaxeToMonthly(this.profitability.value as number);
                return profitabilityMonthly;
            } else if (this.preOuPos === 'cdi') {
                return ((this.profitability.value as number) / 100) * 0.008;
            } else {
                return this.convertTaxeToMonthly(this.profitability.value as number) + 0.0045;
            }
        },
        getTime() {
            return this.investimentTime.option === 'Meses' ? this.investimentTime.value : this.investimentTime.value * 12;
        },
        calculateFutureValue(): number {
            const taxe = this.getTaxe();
            const time = this.getTime();
            const p = this.investimentInitial as number;
            const pmt = this.investimentMonthly as number;
            const i = taxe;
            const n = time;

            return Number((p * Math.pow(1 + i, n) + pmt * ((Math.pow(1 + i, n) - 1) / i)).toFixed(2));
        },
        calculateAmountInvested(): number {
            const time = this.getTime();
            const p = this.investimentInitial as number;
            const pmt = this.investimentMonthly as number;
            const n = time;

            return Number((p + pmt * n).toFixed(2));
        },
        calculateAliquot() {
            if (this.investimentType === 'tributado') {
                if (this.getTime() <= 6) {
                    this.resultSimulation.taxesPercentage = '22,5%';
                    return 0.225;
                } else if (this.getTime() <= 12) {
                    this.resultSimulation.taxesPercentage = '20%';
                    return 0.2;
                } else if (this.getTime() <= 24) {
                    this.resultSimulation.taxesPercentage = '17,5%';
                    return 0.175;
                } else {
                    this.resultSimulation.taxesPercentage = '15%';
                    return 0.15;
                }
            }

            return 0;
        },
        convertTaxeToMonthly(taxe: number) {
            return Math.pow(1 + taxe / 100, 1 / 12) - 1;
        }
    },
    setup() {
        return {
            formatCurrency
        };
    },
    watch: {
        preOuPos(newValue) {
            this.profitability.option = newValue === 'prefixado' ? this.optionsProfitability[0] : this.optionsProfitability[1];
        }
    }
};
</script>

<template>
    <div className="card">
        <h4>Simulador de investimentos</h4>
        <p>Simule o rendimento de um investimento com base no tipo de investimento, valor inicial, valor mensal, prazo e rentabilidade.</p>
        <div className="p-fluid formgrid grid">
            <div className="field col-12 md:col-6">
                <label htmlFor="investmentType">Tipo de investimento</label>
                <div class="flex flex-wrap gap-3">
                    <div class="flex align-items-center">
                        <RadioButton v-model="investimentType" inputId="tributado" name="investimentType" value="tributado" />
                        <label for="tributado" class="ml-2">
                            Tributado
                            <i class="pi pi-question-circle" v-tooltip.focus.top="'Investimentos em CDB, RDB, Tesouro Direto e Debêntures'" tabindex="1"></i>
                        </label>
                    </div>
                    <div class="flex align-items-center">
                        <RadioButton v-model="investimentType" inputId="isento" name="investimentType" value="isento" />
                        <label for="isento" class="ml-2">
                            Isento
                            <i class="pi pi-question-circle" v-tooltip.focus.top="'Investimentos em LCI, LCA, LC, CRA e CRI'" tabindex="2"></i>
                        </label>
                    </div>
                </div>
            </div>
            <div className="field col-12 md:col-6">
                <label htmlFor="investmentType">É Préfixado ou Pós-fixado?</label>
                <div class="flex flex-wrap gap-3">
                    <div class="flex align-items-center">
                        <RadioButton v-model="preOuPos" inputId="prefixado" name="preOuPos" value="prefixado" />
                        <label for="prefixado" class="ml-2">
                            Préfixado
                            <i class="pi pi-question-circle" v-tooltip.focus.top="'Rendem de acordo a uma taxa fixa pré-estabelecida'" tabindex="3"></i>
                        </label>
                    </div>
                    <div class="flex align-items-center">
                        <RadioButton v-model="preOuPos" inputId="cdi" name="preOuPos" value="cdi" />
                        <label for="cdi" class="ml-2">
                            CDI
                            <i class="pi pi-question-circle" v-tooltip.focus.top="'Rendem de acordo ao CDI (relacionado ao Selic)'" tabindex="4"></i>
                        </label>
                    </div>
                    <div class="flex align-items-center">
                        <RadioButton v-model="preOuPos" inputId="ipca" name="preOuPos" value="ipca" />
                        <label for="ipca" class="ml-2">
                            IPCA
                            <i class="pi pi-question-circle" v-tooltip.focus.top="'Rendem de acordo ao IPCA (relacionado a inflação)'" tabindex="5"></i>
                        </label>
                    </div>
                </div>
            </div>
            <div className="field col-12 md:col-6">
                <label>Investimento inicial</label>
                <InputGroup>
                    <InputGroupAddon>R$</InputGroupAddon>
                    <InputNumber v-model="investimentInitial" locale="pt-BR" :maxFractionDigits="2" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-6">
                <label>Investimento mensal</label>
                <InputGroup>
                    <InputGroupAddon>R$</InputGroupAddon>
                    <InputNumber v-model="investimentMonthly" locale="pt-BR" :maxFractionDigits="2" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-6">
                <label>Prazo</label>
                <InputGroup>
                    <InputNumber v-model="investimentTime.value" />
                    <SelectButton v-model="investimentTime.option" :options="optionsTime" aria-labelledby="basic" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-6">
                <label>Rentabilidade <i class="pi pi-question-circle" v-tooltip.focus.top="'Para CDI é considerado 0,8% ao mês e para IPCA é considerado 0,45% ao mês.'" tabindex="6"></i></label>
                <InputGroup>
                    <InputGroupAddon v-if="preOuPos === 'ipca'">5,54</InputGroupAddon>
                    <InputGroupAddon v-if="preOuPos === 'ipca'">+</InputGroupAddon>
                    <InputNumber v-model="profitability.value" locale="pt-BR" :maxFractionDigits="2" />
                    <InputGroupAddon>%</InputGroupAddon>
                    <InputGroupAddon v-if="preOuPos === 'cdi'">CDI</InputGroupAddon>
                    <Dropdown v-if="preOuPos === 'prefixado'" v-model="profitability.option" :options="optionsProfitability" optionLabel="name" class="w-7rem" />
                    <InputGroupAddon v-if="preOuPos === 'ipca'">a.a.</InputGroupAddon>
                </InputGroup>
            </div>
            <div className="field col-12 mt-3">
                <div class="flex flex-wrap sm:flex-nowrap" style="max-width: 500px">
                    <Button label="Calcular" @click="calculate" />
                    <Button label="Limpar" @click="clearFields" link />
                </div>
            </div>
        </div>
        <div class="p-fluid grid">
            <div className="col-12 mt-5 result" v-if="resultSimulation.total">
                <h4>Resultado</h4>
                <div class="grid mt-3">
                    <div class="col-12 md:col-6 xl:col-4">
                        <Fieldset legend="Patrimônio total bruto">
                            <h5>{{ formatCurrency(resultSimulation.total) }}</h5>
                        </Fieldset>
                    </div>
                    <div class="col-12 md:col-6 xl:col-4">
                        <Fieldset legend="Valor investido">
                            <h5 class="negative">{{ formatCurrency(resultSimulation.invested) }}</h5>
                        </Fieldset>
                    </div>
                    <div class="col-12 md:col-6 xl:col-4">
                        <Fieldset legend="Valor em juros">
                            <h5 class="positive">{{ formatCurrency(resultSimulation.fees) }}</h5>
                        </Fieldset>
                    </div>
                    <div class="col-12 md:col-6 xl:col-4">
                        <Fieldset legend="Taxa de imposto de renda">
                            <h5>{{ resultSimulation.taxesPercentage }}</h5>
                        </Fieldset>
                    </div>
                    <div class="col-12 md:col-6 xl:col-4">
                        <Fieldset legend="Imposto de renda pago">
                            <h5 class="negative">{{ formatCurrency(resultSimulation.taxes) }}</h5>
                        </Fieldset>
                    </div>
                    <div class="col-12 md:col-6 xl:col-4">
                        <Fieldset legend="Patrimônio total líquido">
                            <h5 class="positive">{{ formatCurrency(resultSimulation.liquidity) }}</h5>
                        </Fieldset>
                    </div>
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

            &.negative {
                color: var(--red-700);
            }
        }
    }
}
</style>
