<script lang="ts">
import { formatNumber, formatCurrency } from '@/utils/Numbers';
import MInputMoney from '@/components/MInputMoney.vue';

export default {
    name: 'FinanceOrToHireSimulator',
    components: { MInputMoney },
    head() {
        return {
            title: 'Financiar ou Alugar? Qual é melhor?',
            meta: [
                {
                    name: 'description',
                    content: 'Simulador para comparar financiamento imobiliário com aluguel e investimentos. Saiba qual será a média das parcelas, o valor total do financiamento, o valor total de juros pagos e muito mais.'
                }
            ]
        };
    },
    data() {
        return {
            propertyValue: 0,
            entry: 0,
            rate: {
                value: 0,
                option: 'a.m.'
            },
            time: {
                value: 420,
                option: 'Meses'
            },
            optionsRate: ['a.a.', 'a.m.'],
            optionsTime: ['Anos', 'Meses'],
            rentalValue: 0,
            rentAdjustment: {
                value: 0,
                option: 'a.a.'
            },
            investimentValue: 0,
            profitability: {
                value: 0,
                option: 'a.m.'
            }
        };
    },
    computed: {
        rateValue() {
            if (!this.rate.value) return 0;
            return this.rate.option === 'a.m.' ? this.rate.value / 100 : this.convertTaxeToMonthly(this.rate.value);
        },
        timeValue() {
            return this.time.option === 'Anos' ? this.time.value * 12 : this.time.value;
        },
        financingValue() {
            if (!this.propertyValue || !this.entry) return 0;
            return this.propertyValue ? this.propertyValue - this.entry : 0;
        },
        financingTotalValue() {
            if (!this.financingValue || !this.rate.value) return 0;
            return this.financingValue ? this.financingSAC().reduce((acc, curr) => acc + curr.installment, 0) : 0;
        },
        interestTotal() {
            if (!this.financingValue || !this.rate.value) return 0;
            return this.financingSAC().reduce((acc, curr) => acc + curr.interest, 0);
        },
        installmentAvg() {
            return this.calculateAvgInstallment();
        },
        investimentReturn() {
            if (!this.investimentValue || !this.profitability.value) return 0;
            const rate = this.profitability.option === 'a.m.' ? this.profitability.value / 100 : this.convertTaxeToMonthly(this.profitability.value);
            return this.calculateFutureValue(rate, this.timeValue, this.investimentValue);
        },
        propertyAppreciation() {
            if (!this.propertyValue || !this.rentAdjustment.value) return 0;
            const rate = this.rentAdjustment.option === 'a.m.' ? this.rentAdjustment.value / 100 : this.convertTaxeToMonthly(this.rentAdjustment.value);
            return this.calculateFutureValue(rate, this.timeValue, 0, this.propertyValue);
        },
        result() {
            if (!this.propertyAppreciation || !this.investimentReturn) return 0;
            return this.propertyAppreciation > this.investimentReturn
                ? `Financiar é ${formatCurrency(this.propertyAppreciation - this.investimentReturn)} mais vantajoso`
                : `Alugar é ${formatCurrency(this.investimentReturn - this.propertyAppreciation)} mais vantajoso`;
        }
    },
    methods: {
        financingSAC() {
            // Construir um array com dados de um financiamento SAC
            // O array deve conter um objeto para cada parcela do financiamento
            // Cada objeto deve conter o número da parcela, o saldo devedor, o valor da parcela, o valor da amortização e o valor dos juros
            // O saldo devedor da primeira parcela é o valor do financiamento
            // O saldo devedor das demais parcelas é o saldo devedor da parcela anterior menos o valor da amortização
            // O valor da parcela é a soma da amortização e dos juros
            // O valor da amortização é o valor do financiamento dividido pelo número de parcelas
            // O valor dos juros é o saldo devedor da parcela anterior multiplicado pela taxa de juros
            const financing = [];
            let balance = this.financingValue;
            const amortization = balance / this.timeValue;
            for (let i = 1; i <= this.timeValue; i++) {
                const interest = balance * this.rateValue;
                const installment = amortization + interest;
                financing.push({
                    nParcel: i,
                    balance,
                    installment,
                    amortization,
                    interest
                });
                balance -= amortization;
            }
            return financing;
        },
        convertTaxeToMonthly(taxe: number) {
            return Math.pow(1 + taxe / 100, 1 / 12) - 1;
        },
        calculateFutureValue(taxe: number, time: number, monthlyValue: number, initialValue = 0): number {
            const p = initialValue;
            const pmt = monthlyValue;
            const i = taxe;
            const n = time;

            return Number((p * Math.pow(1 + i, n) + pmt * ((Math.pow(1 + i, n) - 1) / i)).toFixed(2));
        },
        calculateAvgInstallment() {
            if (!this.financingValue || !this.rate.value) return 0;
            return this.financingSAC().reduce((acc, curr) => acc + curr.installment, 0) / this.timeValue;
        }
    },
    setup() {
        return {
            formatNumber,
            formatCurrency
        };
    }
};
</script>

<template>
    <div className="card">
        <h1>Alugar ou Financiar?</h1>
        <p>Qual a melhor decisão financeira quando o assunto é financiamento imobiliário?</p>
    </div>
    <div className="card">
        <h4>Dados do Financiamento</h4>
        <div className="p-fluid formgrid grid">
            <div className="field col-12 md:col-6">
                <label htmlFor="propertyValue">Valor do imóvel</label>
                <InputGroup>
                    <InputGroupAddon>R$</InputGroupAddon>
                    <MInputMoney v-model="propertyValue" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-6">
                <label htmlFor="entry"> Entrada <i class="pi pi-question-circle" v-tooltip.focus.top="'Normalmente, 20% do valor do imóvel deve ser o valor mínimo de entrada'" tabindex="1"></i></label>
                <InputGroup>
                    <InputGroupAddon>R$</InputGroupAddon>
                    <MInputMoney v-model="entry" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-6">
                <label htmlFor="rate">Taxa de juros (CET)</label>
                <InputGroup>
                    <MInputMoney v-model="rate.value" />
                    <InputGroupAddon>%</InputGroupAddon>
                    <Dropdown v-model="rate.option" :options="optionsRate" class="w-7rem" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-6">
                <label htmlFor="time">Prazo</label>
                <InputGroup>
                    <InputNumber v-model="time.value" :max="420" />
                    <SelectButton v-model="time.option" :options="optionsTime" aria-labelledby="basic" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-6 xl:col-3">
                <label htmlFor="time">Valor do Financiamento <i class="pi pi-question-circle" v-tooltip.focus.top="'Valor do imóvel subtraído a entrada'" tabindex="1"></i></label>
                <InputGroup>
                    <InputGroupAddon>R$</InputGroupAddon>
                    <InputNumber v-model="financingValue" disabled :minFractionDigits="2" :maxFractionDigits="2" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-6 xl:col-3">
                <label htmlFor="time">Total de Juros <i class="pi pi-question-circle" v-tooltip.focus.top="'Valor total de juros pagos'" tabindex="1"></i></label>
                <InputGroup>
                    <InputGroupAddon>R$</InputGroupAddon>
                    <InputNumber v-model="interestTotal" disabled :minFractionDigits="2" :maxFractionDigits="2" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-6 xl:col-3">
                <label htmlFor="time">Total a pagar do imóvel <i class="pi pi-question-circle" v-tooltip.focus.top="'Valor pago ao final do financiamento'" tabindex="1"></i></label>
                <InputGroup>
                    <InputGroupAddon>R$</InputGroupAddon>
                    <InputNumber v-model="financingTotalValue" disabled :minFractionDigits="2" :maxFractionDigits="2" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-6 xl:col-3">
                <label htmlFor="time">Valor médio das parcelas</label>
                <InputGroup>
                    <InputGroupAddon>R$</InputGroupAddon>
                    <InputNumber v-model="installmentAvg" disabled :minFractionDigits="2" :maxFractionDigits="2" />
                </InputGroup>
            </div>
        </div>
    </div>
    <div className="card">
        <h4>Dados do Aluguel e Investimentos</h4>
        <div className="p-fluid formgrid grid">
            <div className="field col-12 md:col-6">
                <label htmlFor="rentalValue">Valor do aluguel</label>
                <InputGroup>
                    <InputGroupAddon>R$</InputGroupAddon>
                    <MInputMoney v-model="rentalValue" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-6">
                <label htmlFor="rentAdjustment">Reajuste do imóvel <i class="pi pi-question-circle" v-tooltip.focus.top="'Valorização do imóvel'" tabindex="1"></i></label>
                <InputGroup>
                    <MInputMoney v-model="rentAdjustment.value" />
                    <InputGroupAddon>%</InputGroupAddon>
                    <Dropdown v-model="rentAdjustment.option" :options="optionsRate" class="w-7rem" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-6">
                <label htmlFor="investimentValue">Valor do aporte mensal <i class="pi pi-question-circle" v-tooltip.focus.top="'Valor que será investido já descontado o valor do aluguel'" tabindex="1"></i></label>
                <InputGroup>
                    <InputGroupAddon>R$</InputGroupAddon>
                    <MInputMoney v-model="investimentValue" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-6">
                <label htmlFor="profitability">Rentabilidade líquida do investimento</label>
                <InputGroup>
                    <MInputMoney v-model="profitability.value" />
                    <InputGroupAddon>%</InputGroupAddon>
                    <Dropdown v-model="profitability.option" :options="optionsRate" class="w-7rem" />
                </InputGroup>
            </div>
        </div>
    </div>
    <div className="card" v-if="propertyAppreciation && investimentReturn">
        <h4>Resultado</h4>
        <div className="p-fluid formgrid grid">
            <div className="field col-12 md:col-6">
                <label htmlFor="time">Valorização do Imóvel <i class="pi pi-question-circle" v-tooltip.focus.top="'Cálculo considera o valor do imóvel ajustado pelo valor de reajuste do imóvel.'" tabindex="1"></i></label>
                <InputGroup>
                    <InputGroupAddon>R$</InputGroupAddon>
                    <InputNumber v-model="propertyAppreciation" disabled :minFractionDigits="2" :maxFractionDigits="2" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-6">
                <label htmlFor="time">Retorno dos investimentos <i class="pi pi-question-circle" v-tooltip.focus.top="'Cálculo considera o valor do aporte, rentabilidade líquida do investimento e o tempo do financiamento.'" tabindex="1"></i></label>
                <InputGroup>
                    <InputGroupAddon>R$</InputGroupAddon>
                    <InputNumber v-model="investimentReturn" disabled :minFractionDigits="2" :maxFractionDigits="2" />
                </InputGroup>
            </div>
        </div>
        <InlineMessage v-if="result" class="flex p-3" severity="info">{{ result }}</InlineMessage>
    </div>
</template>

<style scoped lang="scss"></style>
