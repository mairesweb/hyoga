<script lang="ts">
import { formatCurrency } from '@/utils/Numbers';

export default {
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
            profitability: null as number | null,
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
            this.profitability = null;
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
                return (this.profitability as number) / 100;
            } else if (this.preOuPos === 'cdi') {
                return 0.008;
            } else {
                return 0.0045;
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
        }
    },
    setup() {
        return {
            formatCurrency
        };
    }
};
</script>

<template>
    <div className="card">
        <h4>Simulador de investimentos</h4>
        <div className="p-fluid formgrid grid">
            <div className="field col-12 md:col-6">
                <label htmlFor="investmentType">Tipo de investimento</label>
                <div class="flex flex-wrap gap-3">
                    <div class="flex align-items-center">
                        <RadioButton v-model="investimentType" name="investimentType" value="tributado" />
                        <label for="tributado" class="ml-2">
                            Tributado
                            <i class="pi pi-question-circle" v-tooltip="'Investimentos em CDB, RDB, Tesouro Direto e Debêntures'"></i>
                        </label>
                    </div>
                    <div class="flex align-items-center">
                        <RadioButton v-model="investimentType" name="investimentType" value="isento" />
                        <label for="isento" class="ml-2">
                            Isento
                            <i class="pi pi-question-circle" v-tooltip="'Investimentos em LCI, LCA, LC, CRA e CRI'"></i>
                        </label>
                    </div>
                </div>
            </div>
            <div className="field col-12 md:col-6">
                <label htmlFor="investmentType">É Préfixado ou Pós-fixado?</label>
                <div class="flex flex-wrap gap-3">
                    <div class="flex align-items-center">
                        <RadioButton v-model="preOuPos" name="preOuPos" value="prefixado" />
                        <label for="prefixado" class="ml-2">
                            Préfixado
                            <i class="pi pi-question-circle" v-tooltip="'Rendem de acordo a uma taxa fixa pré-estabelecida'"></i>
                        </label>
                    </div>
                    <div class="flex align-items-center">
                        <RadioButton v-model="preOuPos" name="preOuPos" value="cdi" />
                        <label for="cdi" class="ml-2">
                            CDI
                            <i class="pi pi-question-circle" v-tooltip="'Rendem de acordo ao CDI (relacionado ao Selic)'"></i>
                        </label>
                    </div>
                    <div class="flex align-items-center">
                        <RadioButton v-model="preOuPos" name="preOuPos" value="ipca" />
                        <label for="ipca" class="ml-2">
                            IPCA
                            <i class="pi pi-question-circle" v-tooltip="'Rendem de acordo ao IPCA (relacionado a inflação)'"></i>
                        </label>
                    </div>
                </div>
            </div>
            <div className="field col-12 md:col-6">
                <label htmlFor="investmentValue">Investimento inicial</label>
                <InputGroup>
                    <InputGroupAddon>R$</InputGroupAddon>
                    <InputNumber v-model="investimentInitial" locale="pt-BR" :minFractionDigits="2" :maxFractionDigits="2" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-6">
                <label htmlFor="investmentValue">Investimento mensal</label>
                <InputGroup>
                    <InputGroupAddon>R$</InputGroupAddon>
                    <InputNumber v-model="investimentMonthly" locale="pt-BR" :minFractionDigits="2" :maxFractionDigits="2" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-6">
                <label htmlFor="investmentValue">Prazo</label>
                <InputGroup>
                    <InputNumber v-model="investimentTime.value" />
                    <SelectButton v-model="investimentTime.option" :options="optionsTime" aria-labelledby="basic" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-6">
                <label htmlFor="investmentValue">Rentabilidade <i class="pi pi-question-circle" v-tooltip="'Para CDI é considerado 0,8% ao mês e para IPCA é considerado 0,45% ao mês.'"></i></label>
                <InputGroup v-if="preOuPos === 'prefixado'">
                    <InputNumber v-model="profitability" :minFractionDigits="2" :maxFractionDigits="2" />
                    <InputGroupAddon>%</InputGroupAddon>
                </InputGroup>
                <InputGroup v-else-if="preOuPos === 'cdi'">
                    <InputNumber v-model="profitability" :minFractionDigits="2" :maxFractionDigits="2" />
                    <InputGroupAddon>%</InputGroupAddon>
                    <InputGroupAddon>CDI</InputGroupAddon>
                </InputGroup>
                <InputGroup v-else>
                    <InputGroupAddon>IPCA</InputGroupAddon>
                    <InputGroupAddon>+</InputGroupAddon>
                    <InputNumber v-model="profitability" :minFractionDigits="2" :maxFractionDigits="2" />
                    <InputGroupAddon>%</InputGroupAddon>
                </InputGroup>
            </div>
            <div className="field col-4 mt-3">
                <div class="flex align-items-center">
                    <Button label="Calcular" @click="calculate" />
                    <Button label="Limpar" @click="clearFields" link />
                </div>
            </div>
            <div className="col-12 mt-5 result" v-if="resultSimulation.total">
                <h4>Resultado</h4>
                <div class="grid mt-3">
                    <div class="col-4">
                        <Fieldset legend="Patrimônio total bruto">
                            <h5>{{ formatCurrency(resultSimulation.total) }}</h5>
                        </Fieldset>
                    </div>
                    <div class="col-4">
                        <Fieldset legend="Valor investido">
                            <h5 class="negative">{{ formatCurrency(resultSimulation.invested) }}</h5>
                        </Fieldset>
                    </div>
                    <div class="col-4">
                        <Fieldset legend="Valor em juros">
                            <h5 class="positive">{{ formatCurrency(resultSimulation.fees) }}</h5>
                        </Fieldset>
                    </div>
                    <div class="col-4">
                        <Fieldset legend="Taxa de imposto de renda">
                            <h5>{{ resultSimulation.taxesPercentage }}</h5>
                        </Fieldset>
                    </div>
                    <div class="col-4">
                        <Fieldset legend="Valor pago em imposto de renda">
                            <h5 class="negative">{{ formatCurrency(resultSimulation.taxes) }}</h5>
                        </Fieldset>
                    </div>
                    <div class="col-4">
                        <Fieldset legend="Patrimônio total líquido">
                            <h5 class="positive">{{ formatCurrency(resultSimulation.liquidity) }}</h5>
                        </Fieldset>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.result {
    border: 1px solid var(--color-primary);
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
