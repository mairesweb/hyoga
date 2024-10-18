<script lang="ts">
import MInputNumber from '@/components/MInputNumber.vue';
import MainAdsenseBottom from '@/components/MainAdsenseBottom.vue';
import { convertTaxeToMonthly } from '@/utils/Functions';

export default {
    name: 'FinancialFreedomChart',
    components: { MainAdsenseBottom, MInputNumber },
    head() {
        return {
            title: 'Alcance a Liberdade Financeira',
            meta: [
                {
                    name: 'description',
                    content:
                        'Descubra como alcançar a liberdade financeira com nossa simulação interativa. Planeje suas finanças, defina metas e veja como investir pode transformar seu futuro. Comece sua jornada para a independência financeira hoje!'
                }
            ]
        };
    },
    data() {
        return {
            equity: 0,
            costOfLiving: 0,
            investimentMonthly: 0,
            inflation: 0.35,
            optionsProfitability: [
                { name: 'a.m.', code: 'a.m.' },
                { name: 'a.a.', code: 'a.a.' }
            ],
            profitability: {
                value: 0.8,
                option: { name: 'a.m.', code: 'a.m.' }
            },
            initialDate: new Date().setMonth(new Date().getMonth() + 1),
            result: [] as any[],
            lineOptions: {
                plugins: {
                    legend: {
                        labels: {
                            color: '#495057'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context: any) => `R$ ${context.parsed.y.toFixed(2)}`
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#495057'
                        },
                        grid: {
                            color: '#ebedef'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#495057'
                        },
                        grid: {
                            color: '#ebedef'
                        }
                    }
                }
            }
        };
    },
    computed: {
        lineDataComputed() {
            if (!this.result.length) return { labels: [], datasets: [] };
            return {
                labels: this.result.map((item: any) => item.dateFormatted),
                datasets: [
                    {
                        label: 'Renda Real',
                        data: this.result.map((item: any) => item.realIncome),
                        fill: false,
                        backgroundColor: '#00bb7e',
                        borderColor: '#00bb7e',
                        tension: 0.4
                    },
                    {
                        label: 'Custo de Vida',
                        data: this.result.map((item: any) => item.custoDeVida),
                        fill: false,
                        backgroundColor: '#2f4860',
                        borderColor: '#2f4860',
                        tension: 0.4
                    }
                ]
            };
        }
    },
    methods: {
        clearFields() {
            this.equity = 0;
            this.costOfLiving = 0;
            this.investimentMonthly = 0;
            this.profitability.value = 0.8;
            this.inflation = 0.35;
            this.result = [];
        },
        calculate() {
            const profitability = this.profitability.option.name === 'a.m.' ? (this.profitability.value as number) / 100 : convertTaxeToMonthly(this.profitability.value as number);
            const inflation = (this.inflation as number) / 100;
            const result = [];
            let equity = this.equity as number;
            let costOfLiving = this.costOfLiving as number;
            let investimentMonthly = this.investimentMonthly as number;
            let date = new Date(this.initialDate);
            let realIncome = 0;

            do {
                const month = date.getMonth() + 1;
                const year = date.getFullYear();
                const dateFormatted = `${month}/${year}`;
                const contribution = investimentMonthly + realIncome;
                const acumulado = equity * (1 + profitability) + contribution;
                realIncome = acumulado * (profitability - inflation);
                const custoDeVida = costOfLiving * (1 + inflation);
                result.push({ dateFormatted, contribution, acumulado, realIncome, custoDeVida });
                equity = acumulado;
                costOfLiving = custoDeVida;
                date.setMonth(date.getMonth() + 1);
            } while (realIncome < costOfLiving && result.length < 800);

            if (realIncome < costOfLiving) {
                this.$toast.add({ severity: 'warn', summary: 'Atenção', detail: 'O cálculo ultrapassou o limite de 800 meses.', life: 5000 });
            }

            this.result = result;
        }
    }
};
</script>

<template>
    <div className="card">
        <h4>Alcance a Liberdade Financeira</h4>
        <p>O gráfico exibirá duas linhas: uma representando o custo de vida e outra a renda real. O ponto em que essas linhas se cruzam indica a conquista da liberdade financeira.</p>
        <div className="p-fluid formgrid grid">
            <div className="field col-12 md:col-4">
                <label>Patrimônio atual <i class="pi pi-question-circle" v-tooltip.focus.top="'Quanto tem investido atualmente.'" tabindex="1"></i></label>
                <InputGroup>
                    <InputGroupAddon>R$</InputGroupAddon>
                    <MInputNumber v-model="equity" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-4">
                <label>Custo de vida atual <i class="pi pi-question-circle" v-tooltip.focus.top="'Valor que você precisa para pagar suas contas.'" tabindex="2"></i></label>
                <InputGroup>
                    <InputGroupAddon>R$</InputGroupAddon>
                    <MInputNumber v-model="costOfLiving" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-4">
                <label>Investimento mensal <i class="pi pi-question-circle" v-tooltip.focus.top="'Quanto você investe todos os meses, pode ser uma média.'" tabindex="3"></i></label>
                <InputGroup>
                    <InputGroupAddon>R$</InputGroupAddon>
                    <MInputNumber v-model="investimentMonthly" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-4">
                <label>Rentabilidade <i class="pi pi-question-circle" v-tooltip.focus.top="'Taxa de rentabilidade onde o patrimônio está aplicado'" tabindex="1"></i></label>
                <InputGroup>
                    <MInputNumber v-model="profitability.value" />
                    <InputGroupAddon>%</InputGroupAddon>
                    <Dropdown v-model="profitability.option" :options="optionsProfitability" optionLabel="name" class="w-7rem" />
                </InputGroup>
            </div>
            <div className="field col-12 md:col-4">
                <label>Inflação mensal <i class="pi pi-question-circle" v-tooltip.focus.top="'Taxa inflacionária que deseja usar para o cálculo.'" tabindex="2"></i></label>
                <InputGroup>
                    <MInputNumber v-model="inflation" />
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
        <div className="col-12 mt-5 result" v-if="result.length > 0">
            <h4>Resultado</h4>
            <Chart type="line" :data="lineDataComputed" :options="lineOptions" />
        </div>
    </div>
    <MainAdsenseBottom />
</template>

<style scoped lang="scss"></style>
