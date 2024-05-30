<script lang="ts">
import { formatCurrency } from '@/utils/Numbers';

export default {
    name: 'PartialPaymentSimulator',
    data() {
        return {
            cost: null as number | null,
            optionsProfitability: [
                { name: 'a.m.', code: 'a.m.' },
                { name: 'a.a.', code: 'a.a.' }
            ],
            profitability: {
                value: null as number | null,
                option: { name: 'a.m.', code: 'a.m.' }
            },
            qtyParts: 1,
            taxe: 0,
            optionsInCash: [
                { name: 'Valor final', code: 'valor' },
                { name: 'Dessconto (%)', code: 'percent' }
            ],
            inCash: {
                value: null as number | null,
                option: { name: 'Valor final', code: 'valor' }
            },
            resultSimulation: {
                inCash: null as number | null,
                inTerm: null as number | null
            }
        };
    },
    methods: {
        clearFields() {
            this.cost = null;
            this.profitability.value = null;
            this.qtyParts = 1;
            this.taxe = 0;
            this.inCash.value = null;
            this.resultSimulation = null;
        },
        calculate() {
            if (!this.cost) {
                this.$toast.add({ severity: 'warn', summary: 'Atenção', detail: 'Informe o valor da compra' });
                return;
            }

            if (!this.profitability.value) {
                this.$toast.add({ severity: 'warn', summary: 'Atenção', detail: 'Informe a rentabilidade' });
                return;
            }

            if (!this.inCash.value) {
                this.$toast.add({ severity: 'warn', summary: 'Atenção', detail: 'Informe o valor à vista' });
                return;
            }

            if (this.inCash.option.code === 'percent') {
                this.inCash.value = this.cost - this.cost * (this.inCash.value / 100);
            }

            const totalInCash = this.inCash.option.code === 'valor' ? this.inCash.value : this.calculateDiscount();
            const discount = this.cost - totalInCash;
            const totalParts = this.cost / this.qtyParts;
            const totalPartsWithTaxe = totalParts + totalParts * (this.taxe / 100);

            this.resultSimulation.inCash = this.calculateFutureValue(discount);
            this.resultSimulation.inTerm = this.calcularValorFuturoComRetiradas(totalPartsWithTaxe);
        },
        calcularValorFuturoComRetiradas(retiradaMensal: number) {
            let valorFuturo = this.cost;
            let taxaMensal = this.getTaxe();

            for (let i = 0; i < this.qtyParts; i++) {
                valorFuturo = (valorFuturo - retiradaMensal) * (1 + taxaMensal);
            }

            return valorFuturo;
        },
        calculateDiscount(): number {
            return this.cost - this.cost * (this.inCash.value / 100);
        },
        calculateFutureValue(investValue: number): number {
            const taxe = this.getTaxe();
            const time = this.qtyParts;
            const p = investValue;
            const pmt = 0;
            const i = taxe;
            const n = time;

            return Number((p * Math.pow(1 + i, n) + pmt * ((Math.pow(1 + i, n) - 1) / i)).toFixed(2));
        },
        getTaxe(): number {
            return this.profitability.option.name === 'a.m.' ? (this.profitability.value as number) / 100 : this.convertTaxeToMonthly(this.profitability.value as number);
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
                    <InputNumber v-model="cost" locale="pt-BR" :maxFractionDigits="2" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-4">
                <label>Pagamento à vista <i class="pi pi-question-circle" v-tooltip.focus.top="'Digite o valor já com desconto ou apenas o percentual descontado.'" tabindex="1"></i></label>
                <InputGroup>
                    <Dropdown v-model="inCash.option" :options="optionsInCash" optionLabel="name" class="w-12rem" />
                    <InputNumber v-model="inCash.value" locale="pt-BR" :maxFractionDigits="2" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-4">
                <label>Pagamento à prazo <i class="pi pi-question-circle" v-tooltip.focus.top="'Número de parcelas e taxa de juros aplicado na compra parcelada.'" tabindex="2"></i></label>
                <InputGroup>
                    <InputNumber v-model="qtyParts" locale="pt-BR" suffix="x" placeholder="Nº de parcelas" :maxFractionDigits="2" />
                    <InputNumber v-model="taxe" suffix="%" locale="pt-BR" placeholder="Taxa de juros" :maxFractionDigits="2" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-4">
                <label>Rentabilidade <i class="pi pi-question-circle" v-tooltip.focus.top="'Taxa de rentabilidade onde o dinheiro será aplicado'" tabindex="3"></i></label>
                <InputGroup>
                    <InputNumber v-model="profitability.value" locale="pt-BR" :maxFractionDigits="2" />
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
    <div class="p-fluid">
        <Adsense data-ad-client="ca-pub-2781432625181032" data-ad-slot="5627803764" data-ad-format="auto" data-full-width-responsive="true"></Adsense>
    </div>
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
