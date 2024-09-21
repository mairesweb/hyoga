<script lang="ts">
import MInputNumber from '@/components/MInputNumber.vue';

export default {
    name: 'ToHireOrReetsSimulator',
    components: { MInputNumber },
    data() {
        return {
            propertyValue: 0,
            rentalValue: 0,
            rentAdjustment: {
                value: 0,
                option: 'a.a.'
            },
            rentInvest: {
                value: 0,
                option: 'a.a.'
            },
            fiiProfit: {
                value: 0,
                option: 'a.m.'
            },
            time: {
                value: 10,
                option: 'Anos'
            },
            optionsRate: ['a.a.', 'a.m.'],
            optionsTime: ['Anos', 'Meses']
        };
    },
    computed: {
        timeValue() {
            return this.time.option === 'Anos' ? this.time.value * 12 : this.time.value;
        },
        rentReturn() {
            const rentAdjustment = this.rentAdjustment.option === 'a.a.' ? this.convertTaxeToMonthly(this.rentAdjustment.value) : this.rentAdjustment.value / 100;
            const rentInvest = this.rentInvest.option === 'a.a.' ? this.convertTaxeToMonthly(this.rentInvest.value) : this.rentInvest.value / 100;

            return this.calculateFutureValueWithMonthlyAdjustment(rentAdjustment, this.timeValue, this.rentalValue, this.propertyValue);
        },
        investimentReturn() {
            const fiiProfit = this.fiiProfit.option === 'a.a.' ? this.convertTaxeToMonthly(this.fiiProfit.value) : this.fiiProfit.value / 100;
            const rentInvest = this.rentInvest.option === 'a.a.' ? this.convertTaxeToMonthly(this.rentInvest.value) : this.rentInvest.value / 100;

            return this.calculateFutureValue(fiiProfit, this.timeValue, 0, this.propertyValue);
        },
        result() {
            if (this.rentReturn && this.investimentReturn) {
                if (this.rentReturn > this.investimentReturn) {
                    return 'Alugar é a melhor opção!';
                } else {
                    return 'Investir em FII é a melhor opção!';
                }
            }
            return '';
        }
    },
    methods: {
        convertTaxeToMonthly(taxe: number) {
            return Math.pow(1 + taxe / 100, 1 / 12) - 1;
        },
        convertTaxeToAnnual(taxe: number) {
            return Math.pow(1 + taxe / 100, 12) - 1;
        },
        // Função para calcular o valor futuro de um investimento
        // o valor mensal deve ser reajustado pela taxa de juros a cada 12 meses
        calculateFutureValueWithMonthlyAdjustment(rate: number, time: number, monthlyValue: number, initialValue: number) {
            let futureValue = initialValue;
            for (let i = 0; i < time; i++) {
                futureValue = futureValue * (1 + rate) + monthlyValue;
                if (i % 12 === 0) {
                    monthlyValue = monthlyValue * (1 + this.convertTaxeToAnnual(rate));
                }
            }
            return futureValue;
        },
        calculateFutureValue(taxe: number, time: number, monthlyValue: number, initialValue = 0): number {
            const p = initialValue;
            const pmt = monthlyValue;
            const i = taxe;
            const n = time;

            return Number((p * Math.pow(1 + i, n) + pmt * ((Math.pow(1 + i, n) - 1) / i)).toFixed(2));
        }
    }
};
</script>

<template>
    <div className="card">
        <h1>Alugar ou Fundos Imobiliários?</h1>
        <p>Qual a melhor opção quando o assunto são investimentos em imóveis?</p>
    </div>
    <div className="p-fluid formgrid grid">
        <div className="field col-12 md:col-6">
            <label htmlFor="propertyValue">Valor do imóvel</label>
            <InputGroup>
                <InputGroupAddon>R$</InputGroupAddon>
                <MInputNumber v-model="propertyValue" />
            </InputGroup>
        </div>
        <div className="field col-12 md:col-6">
            <label htmlFor="propertyValue">Valor do aluguel</label>
            <InputGroup>
                <InputGroupAddon>R$</InputGroupAddon>
                <MInputNumber v-model="rentalValue" />
            </InputGroup>
        </div>
        <div className="field col-12 md:col-6">
            <label htmlFor="rentAdjustment">Reajuste do imóvel <i class="pi pi-question-circle" v-tooltip.focus.top="'Valorização do imóvel'" tabindex="1"></i></label>
            <InputGroup>
                <MInputNumber v-model="rentAdjustment.value" />
                <InputGroupAddon>%</InputGroupAddon>
                <Dropdown v-model="rentAdjustment.option" :options="optionsRate" class="w-7rem" />
            </InputGroup>
        </div>
        <div className="field col-12 md:col-6">
            <label htmlFor="fiiProfit">Rentabilidade do FII (proventos)</label>
            <InputGroup>
                <MInputNumber v-model="fiiProfit.value" />
                <InputGroupAddon>%</InputGroupAddon>
                <Dropdown v-model="fiiProfit.option" :options="optionsRate" class="w-7rem" />
            </InputGroup>
        </div>
        <div className="field col-12 md:col-6">
            <label htmlFor="rentInvest">Rentabilidade dos dividendos <i class="pi pi-question-circle" v-tooltip.focus.top="'Considera-se que os valores recebidos do aluguel e do FII serão reinvestidos.'" tabindex="1"></i></label>
            <InputGroup>
                <MInputNumber v-model="rentInvest.value" />
                <InputGroupAddon>%</InputGroupAddon>
                <Dropdown v-model="rentInvest.option" :options="optionsRate" class="w-7rem" />
            </InputGroup>
        </div>
        <div className="field col-12 md:col-6">
            <label htmlFor="time">Prazo</label>
            <InputGroup>
                <InputNumber v-model="time.value" :max="420" />
                <SelectButton v-model="time.option" :options="optionsTime" aria-labelledby="basic" />
            </InputGroup>
        </div>
    </div>
    <div className="card" v-if="rentReturn && investimentReturn">
        <h4>Resultado</h4>
        <div className="p-fluid formgrid grid">
            <div className="field col-12 md:col-6">
                <label htmlFor="time"
                    >Retorno do Imóvel <i class="pi pi-question-circle" v-tooltip.focus.top="'Cálculo considera o valor do imóvel ajustado pelo valor de reajuste, acrescido ao aluguel recebido e os juros do reinvestimento.'" tabindex="1"></i
                ></label>
                <InputGroup>
                    <InputGroupAddon>R$</InputGroupAddon>
                    <InputNumber v-model="rentReturn" disabled :minFractionDigits="2" :maxFractionDigits="2" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-6">
                <label htmlFor="time">Retorno do FII <i class="pi pi-question-circle" v-tooltip.focus.top="'Cálculo considera o valor do imóvel e os dividendos recebidos reajustados pelo D.Y.'" tabindex="1"></i></label>
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
