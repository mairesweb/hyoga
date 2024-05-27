<script lang="ts">
export default {
    name: 'UsufructSimulator',
    data() {
        return {
            equity: null as number | null,
            profitability: null as number | null,
            monthlyWithdrawal: null as number | null,
            resultSimulation: null as any
        };
    },
    methods: {
        calculate() {
            const profitability = (this.profitability as number) / 100;
            const result = Math.floor(Math.log((this.monthlyWithdrawal as number) / ((this.monthlyWithdrawal as number) - (this.equity as number) * profitability)) / Math.log(1 + profitability));

            this.resultSimulation = !isNaN(this.resultSimulation) ? 'Pelo resto da vida' : this.formatYearsAndMonths(result);
        },
        clearFields() {
            this.equity = null;
            this.profitability = null;
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
                    <InputNumber v-model="equity" locale="pt-BR" :minFractionDigits="2" :maxFractionDigits="2" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-4">
                <label>Rentabilidade <i class="pi pi-question-circle" v-tooltip="'Taxa de rentabilidade onde o patrimônio está aplicado'"></i></label>
                <InputGroup>
                    <InputNumber v-model="profitability" :minFractionDigits="2" :maxFractionDigits="2" />
                    <InputGroupAddon>%</InputGroupAddon>
                </InputGroup>
            </div>
            <div className="field col-12 md:col-4">
                <label>Retirada mensal <i class="pi pi-question-circle" v-tooltip="'Quanto você deseja retirar por mês'"></i></label>
                <InputGroup>
                    <InputGroupAddon>R$</InputGroupAddon>
                    <InputNumber v-model="monthlyWithdrawal" locale="pt-BR" :minFractionDigits="2" :maxFractionDigits="2" />
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
    <Adsense data-ad-client="ca-pub-2781432625181032" data-ad-slot="5627803764" data-ad-format="auto" data-full-width-responsive="true"></Adsense>
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
