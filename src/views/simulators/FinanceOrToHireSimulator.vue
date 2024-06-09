<script lang="ts">
import { formatNumber, formatCurrency } from '@/utils/Numbers';

export default {
    name: 'FinanceOrToHireSimulator',
    data() {
        return {
            propertyValue: null as number | null,
            entry: null as number | null,
            rate: {
                value: null as number | null,
                option: 'a.m.'
            },
            time: {
                value: 420,
                option: 'Meses'
            },
            optionsRate: ['a.a.', 'a.m.'],
            optionsTime: ['Anos', 'Meses'],
            rentalValue: null as number | null,
            rentAdjustment: {
                value: 0,
                option: 'a.a.'
            },
            investimentValue: null as number | null,
            profitability: {
                value: null as number | null,
                option: 'a.m.'
            }
        };
    },
    computed: {
        rateValue() {
            if (!this.rate.value) return null;
            return this.rate.option === 'a.m.' ? (this.rate.value as number) / 100 : this.convertTaxeToMonthly(this.rate.value as number);
        },
        timeValue() {
            return this.time.option === 'Anos' ? (this.time.value as number) * 12 : this.time.value;
        },
        financingValue() {
            if (!this.propertyValue || !this.entry) return null;
            return this.propertyValue ? this.propertyValue - (this.entry as number) : null;
        },
        financingTotalValue() {
            if (!this.financingValue || !this.rate.value) return null;
            return this.financingValue ? this.financingSAC().reduce((acc, curr) => acc + curr.installment, 0) : null;
        },
        interestTotal() {
            if (!this.financingValue || !this.rate.value) return null;
            return this.financingSAC().reduce((acc, curr) => acc + curr.interest, 0);
        },
        installmentAvg() {
            return this.calculateAvgInstallment();
        },
        investimentReturn() {
            if (!this.investimentValue || !this.profitability.value) return null;
            const rate = this.profitability.option === 'a.m.' ? (this.profitability.value as number) / 100 : this.convertTaxeToMonthly(this.profitability.value as number);
            return this.calculateFutureValue(rate, this.timeValue, this.investimentValue);
        },
        propertyAppreciation() {
            if (!this.propertyValue || !this.rentAdjustment.value) return null;
            const rate = this.rentAdjustment.option === 'a.m.' ? (this.rentAdjustment.value as number) / 100 : this.convertTaxeToMonthly(this.rentAdjustment.value as number);
            return this.calculateFutureValue(rate, this.timeValue, 0, this.propertyValue);
        },
        twentyPercent() {
            return this.propertyValue ? this.propertyValue * 0.2 : null;
        },
        result() {
            if (!this.financingTotalValue || !this.investimentReturn) return null;
            return this.financingTotalValue > this.investimentReturn
                ? `Financiar é ${formatCurrency(this.financingTotalValue - this.investimentReturn)} mais vantajoso`
                : `Alugar é ${formatCurrency(this.investimentReturn - this.financingTotalValue)} mais vantajoso`;
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
            let balance = this.financingValue as number;
            const amortization = balance / (this.timeValue as number);
            for (let i = 1; i <= this.timeValue; i++) {
                const interest = balance * (this.rateValue as number);
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
            if (!this.financingValue || !this.rate.value) return null;
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
                    <InputNumber v-model="propertyValue" locale="pt-BR" :maxFractionDigits="2" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-6">
                <label htmlFor="entry"> Entrada <i class="pi pi-question-circle" v-tooltip.focus.top="'Normalmente, 20% do valor do imóvel deve ser o valor mínimo de entrada'" tabindex="1"></i></label>
                <InputGroup>
                    <InputGroupAddon>R$</InputGroupAddon>
                    <InputNumber v-model="entry" locale="pt-BR" :placeholder="twentyPercent ? formatNumber(twentyPercent) : ''" :maxFractionDigits="2" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-6">
                <label htmlFor="rate">Taxa de juros (CET)</label>
                <InputGroup>
                    <InputNumber v-model="rate.value" locale="pt-BR" :maxFractionDigits="2" />
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
                    <InputNumber v-model="financingValue" disabled locale="pt-BR" :minFractionDigits="2" :maxFractionDigits="2" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-6 xl:col-3">
                <label htmlFor="time">Total de Juros <i class="pi pi-question-circle" v-tooltip.focus.top="'Valor total de juros pagos'" tabindex="1"></i></label>
                <InputGroup>
                    <InputGroupAddon>R$</InputGroupAddon>
                    <InputNumber v-model="interestTotal" disabled locale="pt-BR" :minFractionDigits="2" :maxFractionDigits="2" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-6 xl:col-3">
                <label htmlFor="time">Total a pagar do imóvel <i class="pi pi-question-circle" v-tooltip.focus.top="'Valor pago ao final do financiamento'" tabindex="1"></i></label>
                <InputGroup>
                    <InputGroupAddon>R$</InputGroupAddon>
                    <InputNumber v-model="financingTotalValue" disabled locale="pt-BR" :minFractionDigits="2" :maxFractionDigits="2" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-6 xl:col-3">
                <label htmlFor="time">Valor médio das parcelas</label>
                <InputGroup>
                    <InputGroupAddon>R$</InputGroupAddon>
                    <InputNumber v-model="installmentAvg" disabled locale="pt-BR" :minFractionDigits="2" :maxFractionDigits="2" />
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
                    <InputNumber v-model="rentalValue" locale="pt-BR" :maxFractionDigits="2" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-6">
                <label htmlFor="rentAdjustment">Reajuste do imóvel <i class="pi pi-question-circle" v-tooltip.focus.top="'Valorização do imóvel'" tabindex="1"></i></label>
                <InputGroup>
                    <InputNumber v-model="rentAdjustment.value" locale="pt-BR" :maxFractionDigits="2" />
                    <InputGroupAddon>%</InputGroupAddon>
                    <Dropdown v-model="rentAdjustment.option" :options="optionsRate" class="w-7rem" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-6">
                <label htmlFor="investimentValue">Valor do aporte mensal <i class="pi pi-question-circle" v-tooltip.focus.top="'Valor que será investido já descontado o valor do aluguel'" tabindex="1"></i></label>
                <InputGroup>
                    <InputGroupAddon>R$</InputGroupAddon>
                    <InputNumber v-model="investimentValue" locale="pt-BR" :maxFractionDigits="2" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-6">
                <label htmlFor="profitability">Rentabilidade líquida do investimento</label>
                <InputGroup>
                    <InputNumber v-model="profitability.value" locale="pt-BR" :maxFractionDigits="2" />
                    <InputGroupAddon>%</InputGroupAddon>
                    <Dropdown v-model="profitability.option" :options="optionsRate" class="w-7rem" />
                </InputGroup>
            </div>
        </div>
    </div>
    <div className="card">
        <h4>Resultado</h4>
        <div className="p-fluid formgrid grid">
            <div className="field col-12 md:col-6">
                <label htmlFor="time">Valorização do Imóvel <i class="pi pi-question-circle" v-tooltip.focus.top="'Cálculo considera o valor do imóvel ajustado pelo valor de reajuste do imóvel.'" tabindex="1"></i></label>
                <InputGroup>
                    <InputGroupAddon>R$</InputGroupAddon>
                    <InputNumber v-model="propertyAppreciation" disabled locale="pt-BR" :minFractionDigits="2" :maxFractionDigits="2" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-6">
                <label htmlFor="time">Retorno dos investimentos <i class="pi pi-question-circle" v-tooltip.focus.top="'Cálculo considera o valor do aporte, rentabilidade líquida do investimento e o tempo do financiamento.'" tabindex="1"></i></label>
                <InputGroup>
                    <InputGroupAddon>R$</InputGroupAddon>
                    <InputNumber v-model="investimentReturn" disabled locale="pt-BR" :minFractionDigits="2" :maxFractionDigits="2" />
                </InputGroup>
            </div>
        </div>
        <InlineMessage v-if="result" class="flex p-3" severity="info">{{ result }}</InlineMessage>
    </div>
</template>

<style scoped lang="scss"></style>
