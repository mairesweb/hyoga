<script lang="ts">
import MInputNumber from '@/components/MInputNumber.vue';
import MainAdsenseBottom from '@/components/MainAdsenseBottom.vue';
import { formatCurrency } from '@/utils/Numbers';

export default {
    name: 'PartialPaymentSimulator',
    components: { MainAdsenseBottom, MInputNumber },
    head() {
        return {
            title: 'Pagamento à Vista ou Parcelado? Qual vale a pena?',
            meta: [
                {
                    name: 'description',
                    content: 'Simulador de pagamento à vista ou parcelado. Compare o valor final de uma compra à vista ou parcelada e veja qual opção é mais vantajosa.'
                }
            ]
        };
    },
    data() {
        return {
            cost: 0,
            optionsProfitability: [
                { name: 'a.m.', code: 'a.m.' },
                { name: 'a.a.', code: 'a.a.' }
            ],
            profitability: {
                value: 0,
                option: { name: 'a.m.', code: 'a.m.' }
            },
            optionsInCash: [
                { name: 'Valor final', code: 'valor' },
                { name: 'Dessconto (%)', code: 'percent' }
            ],
            inCash: {
                value: 0,
                option: { name: 'Valor final', code: 'valor' },
                discount: 0
            },
            resultSimulation: {
                inCash: 0,
                inTerm: 0
            },
            inTerm: {
                qtyParts: 1,
                taxe: 0,
                option: { name: 'a.m.', code: 'a.m.' }
            }
        };
    },
    methods: {
        clearFields() {
            this.cost = 0;
            this.profitability.value = 0;
            this.inTerm = {
                qtyParts: 1,
                taxe: 0,
                option: { name: 'a.m.', code: 'a.m.' }
            };
            this.inCash = {
                value: 0,
                option: { name: 'Valor final', code: 'valor' },
                discount: 0
            };
            this.resultSimulation = {
                inCash: 0,
                inTerm: 0
            };
        },
        calculate() {
            if (!this.cost) {
                this.$toast.add({ severity: 'warn', summary: 'Atenção', detail: 'Informe o valor da compra', life: 5000 });
                return;
            }

            if (!this.inCash.value && !this.inCash.discount) {
                this.$toast.add({ severity: 'warn', summary: 'Atenção', detail: 'Informe o valor ou o desconto à vista', life: 5000 });
                return;
            }

            if (!this.profitability.value) {
                this.$toast.add({ severity: 'warn', summary: 'Atenção', detail: 'Informe a rentabilidade', life: 5000 });
                return;
            }

            if (this.inCash.option.code === 'percent') {
                this.inCash.value = this.cost - this.cost * ((this.inCash.discount as number) / 100);
            }

            const totalInCash = this.inCash.option.code === 'valor' ? (this.inCash.value as number) : this.calculateDiscount();
            const discount = this.cost - totalInCash;
            const totalParts = this.cost / this.inTerm.qtyParts;

            this.resultSimulation.inCash = this.calculateFutureValue(discount);
            this.resultSimulation.inTerm = this.calcularValorFuturoComRetiradas(totalParts, this.getInterestTaxe());
        },
        calcularValorFuturoComRetiradas(retiradaMensal: number, interestTaxe = 0) {
            let valorFuturo = this.cost;
            let taxaMensal = this.getProfitabilityTaxe();

            for (let i = 0; i < this.inTerm.qtyParts; i++) {
                valorFuturo = ((valorFuturo as number) - retiradaMensal) * (1 + taxaMensal);
                retiradaMensal *= 1 + interestTaxe;
            }

            return valorFuturo;
        },
        calculateDiscount(): number {
            return (this.cost as number) - (this.cost as number) * ((this.inCash.discount as number) / 100);
        },
        calculateFutureValue(investValue: number): number {
            const taxe = this.getProfitabilityTaxe();
            const time = this.inTerm.qtyParts;
            const p = investValue;
            const pmt = 0;
            const i = taxe;
            const n = time;

            return Number((p * Math.pow(1 + i, n) + pmt * ((Math.pow(1 + i, n) - 1) / i)).toFixed(2));
        },
        getProfitabilityTaxe(): number {
            return this.profitability.option.name === 'a.m.' ? (this.profitability.value as number) / 100 : this.convertTaxeToMonthly(this.profitability.value as number);
        },
        getInterestTaxe(): number {
            return this.inTerm.option.name === 'a.m.' ? (this.inTerm.taxe as number) / 100 : this.convertTaxeToMonthly(this.inTerm.taxe as number);
        },
        convertTaxeToMonthly(taxe: number) {
            return Math.pow(1 + taxe / 100, 1 / 12) - 1;
        }
    },
    setup() {
        return { formatCurrency };
    }
};
</script>

<template>
    <div className="card">
        <h4>À vista ou parcelado, qual vale a pena?</h4>
        <p>
            O resultado mostrará quanto cada uma das opções terá ao final do período do parcelamento. Consideramos que o valor do desconto à vista está investido, assim como o valor total em caso de compra à prazo. Se você não tem o dinheiro da
            compra investido, esta simulação não é para você.
        </p>
        <div className="p-fluid formgrid grid">
            <div className="field col-12 md:col-4">
                <label>Valor da compra</label>
                <InputGroup>
                    <InputGroupAddon>R$</InputGroupAddon>
                    <MInputNumber v-model="cost" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-4">
                <label>Pagamento à vista <i class="pi pi-question-circle" v-tooltip.focus.top="'Digite o valor já com desconto ou apenas o percentual descontado.'" tabindex="1"></i></label>
                <InputGroup>
                    <Dropdown v-model="inCash.option" :options="optionsInCash" optionLabel="name" class="w-12rem" />
                    <InputGroupAddon v-if="inCash.option.code === 'valor'">R$</InputGroupAddon>
                    <MInputNumber v-if="inCash.option.code === 'valor'" v-model="inCash.value" />
                    <MInputNumber v-else v-model="inCash.discount" />
                    <InputGroupAddon v-if="inCash.option.code === 'percent'">%</InputGroupAddon>
                </InputGroup>
            </div>
            <div className="field col-12 md:col-4">
                <label>Pagamento à prazo <i class="pi pi-question-circle" v-tooltip.focus.top="'Número de parcelas e taxa de juros aplicado na compra parcelada.'" tabindex="2"></i></label>
                <InputGroup>
                    <InputNumber v-model="inTerm.qtyParts" suffix="x" placeholder="Nº de parcelas" />
                    <MInputNumber v-model="inTerm.taxe" suffix="%" placeholder="Taxa de juros" />
                    <Dropdown v-model="inTerm.option" :options="optionsProfitability" optionLabel="name" class="w-7rem" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-4">
                <label>Rentabilidade <i class="pi pi-question-circle" v-tooltip.focus.top="'Taxa de rentabilidade onde o dinheiro será aplicado'" tabindex="3"></i></label>
                <InputGroup>
                    <MInputNumber v-model="profitability.value" />
                    <InputGroupAddon>%</InputGroupAddon>
                    <Dropdown v-model="profitability.option" :options="optionsProfitability" optionLabel="name" class="w-7rem" />
                </InputGroup>
            </div>
            <div className="field col-12 mt-3">
                <div class="flex flex-wrap sm:flex-nowrap" style="max-width: 500px">
                    <Button label="Calcular" @click="calculate" />
                    <Button label="Limpar" @click="clearFields" link />
                </div>
            </div>
        </div>
        <div className="col-12 mt-5 result" v-if="resultSimulation.inCash && resultSimulation.inTerm">
            <h4>Resultado</h4>
            <div class="grid mt-3">
                <div class="col-12 md:col-6 xl:col-4 xl:col-offset-2">
                    <Fieldset legend="Pagando à vista (bruto)">
                        <h5 :class="resultSimulation.inCash > resultSimulation.inTerm ? 'positive' : 'negative'">{{ formatCurrency(resultSimulation.inCash) }}</h5>
                    </Fieldset>
                </div>
                <div class="col-12 md:col-6 xl:col-4 xl:col-offset-1">
                    <Fieldset legend="Pagando à prazo (bruto)">
                        <h5 :class="resultSimulation.inTerm > resultSimulation.inCash ? 'positive' : 'negative'">{{ formatCurrency(resultSimulation.inTerm) }}</h5>
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

            &.negative {
                color: var(--red-700);
            }
        }
    }
}
</style>
