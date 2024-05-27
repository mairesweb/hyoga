<script lang="ts">
import { formatCurrency } from '@/utils/Numbers';

export default {
    name: 'MonthlyInvestimentSimulator',
    data() {
        return {
            goalEquity: null as number | null,
            investimentTime: { value: 1, option: 'Meses' },
            profitability: null as number | null,
            optionsTime: ['Meses', 'Anos'],
            resultSimulation: null as number | null
        };
    },
    methods: {
        calculate() {
            const investimentTime = this.investimentTime.option === 'Meses' ? this.investimentTime.value : this.investimentTime.value * 12;
            const profitability = (this.profitability as number) / 100;
            this.resultSimulation = (this.goalEquity as number) / ((Math.pow(1 + profitability, investimentTime) - 1) / profitability);
        },
        clearFields() {
            this.goalEquity = 0;
            this.investimentTime.value = 0;
            this.investimentTime.option = 'Meses';
            this.profitability = 0;
            this.resultSimulation = null;
        }
    },
    setup() {
        return { formatCurrency };
    }
};
</script>

<template>
    <div className="card">
        <h4>Simulador de Aporte Mensal</h4>
        <p>O resultado mostrará quanto você deverá investir mensalmente a fim de atingir um patrimônio "alvo" atribuído por você.</p>
        <div className="p-fluid formgrid grid">
            <div className="field col-12 md:col-4">
                <label>Patrimônio "alvo"</label>
                <InputGroup>
                    <InputGroupAddon>R$</InputGroupAddon>
                    <InputNumber v-model="goalEquity" locale="pt-BR" :minFractionDigits="2" :maxFractionDigits="2" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-4">
                <label>Prazo</label>
                <InputGroup>
                    <InputNumber v-model="investimentTime.value" />
                    <SelectButton v-model="investimentTime.option" :options="optionsTime" aria-labelledby="basic" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-4">
                <label>Rentabilidade</label>
                <InputGroup>
                    <InputNumber v-model="profitability" :minFractionDigits="2" :maxFractionDigits="2" />
                    <InputGroupAddon>%</InputGroupAddon>
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
                    <Fieldset legend="Investimento mensal">
                        <h5 class="positive">{{ formatCurrency(resultSimulation) }}</h5>
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
        }
    }
}
</style>
