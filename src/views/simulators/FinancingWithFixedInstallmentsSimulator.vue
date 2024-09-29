<script lang="ts">
import MInputNumber from '@/components/MInputNumber.vue';
import { formatCurrency } from '@/utils/Numbers';

export default {
    name: 'FinancingWithFixedInstallmentsSimulator',
    components: {
        MInputNumber
    },
    data() {
        return {
            monthsNumber: null as number | null,
            tax: null as number | null,
            installmentValue: null as number | null,
            financedValue: null as number | null,
            fees: null as number | null,
            total: null as number | null
        };
    },
    methods: {
        calculate() {
            if (this.monthsNumber && this.tax && this.installmentValue) {
                this.financedValue = ((1 - Math.pow(1 + this.tax / 100, -this.monthsNumber)) / (this.tax / 100)) * this.installmentValue;
                this.financedValue = Math.round(this.financedValue * 100) / 100;
                this.fees = this.installmentValue * this.monthsNumber - this.financedValue;
            } else if (this.monthsNumber && this.tax && this.financedValue) {
                this.installmentValue = (this.financedValue * this.tax) / 100 / (1 - Math.pow(1 + this.tax / 100, -this.monthsNumber));
                this.fees = this.installmentValue * this.monthsNumber - this.financedValue;
            }

            this.financedValue && this.fees && (this.total = this.financedValue + this.fees);
        },
        clearFields() {
            this.monthsNumber = null;
            this.tax = null;
            this.installmentValue = null;
            this.financedValue = null;
            this.fees = null;
            this.total = null;
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
        <h4>Financiamento/Empréstimo com prestações fixas</h4>
        <p>
            Este simulador permite calcular o valor da prestação fixa de um financiamento ou empréstimo, considerando o valor financiado, a taxa de juros mensal e o número de prestações. Também é possível saber o valor financiado a partir do valor da
            prestação, taxa de juros e número de prestações.
        </p>
        <div className="p-fluid formgrid grid">
            <div className="field col-12 md:col-6">
                <label>Número de meses</label>
                <InputNumber v-model="monthsNumber" />
            </div>
            <div className="field col-12 md:col-6">
                <label>Taxa de juros mensal</label>
                <InputGroup>
                    <MInputNumber v-model="tax as number" />
                    <InputGroupAddon>%</InputGroupAddon>
                </InputGroup>
            </div>
            <div className="field col-12 md:col-6">
                <label>Valor da prestação <i class="pi pi-question-circle" v-tooltip.focus.top="'Considera-se que a 1ª prestação não seja no ato.'" tabindex="2"></i></label>
                <InputGroup>
                    <InputGroupAddon>R$</InputGroupAddon>
                    <MInputNumber :disabled="!!financedValue" v-model="installmentValue as number" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-6">
                <label>Valor financiado <i class="pi pi-question-circle" v-tooltip.focus.top="'O valor financiado não inclui o valor da entrada.'" tabindex="2"></i></label>
                <InputGroup>
                    <InputGroupAddon>R$</InputGroupAddon>
                    <MInputNumber :disabled="!!installmentValue" v-model="financedValue as number" />
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
            <div className="col-12 mt-5 result" v-if="total">
                <h4>Resultado</h4>
                <div class="grid mt-3">
                    <div class="col-12 md:col-6 xl:col-4">
                        <Fieldset legend="Total do financiamento">
                            <h5>{{ formatCurrency(total) }}</h5>
                        </Fieldset>
                    </div>
                    <div class="col-12 md:col-6 xl:col-4">
                        <Fieldset legend="Valor da prestação">
                            <h5>{{ formatCurrency(installmentValue as number) }}</h5>
                        </Fieldset>
                    </div>
                    <div class="col-12 md:col-6 xl:col-4">
                        <Fieldset legend="Somente de juros">
                            <h5 class="negative">{{ formatCurrency(fees as number) }}</h5>
                        </Fieldset>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
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
