<script lang="ts">
// import investingBro from '/layout/images/investing-bro.svg';
export default {
    computed: {
        forSale() {
            return '/layout/images/for-sale-amico.svg';
        },
        investingBro() {
            return '/layout/images/investing-bro.svg';
        },
        investingPana() {
            return '/layout/images/investing-pana.svg';
        },
        manageMoney() {
            return '/layout/images/manage-money-amico.svg';
        },
        refundBro() {
            return '/layout/images/refund-bro.svg';
        },
        savingsBro() {
            return '/layout/images/savings-bro.svg';
        },
        ManageMoneyBro() {
            return '/layout/images/manage-money-bro.svg';
        }
    },
    methods: {
        goTo(path: string) {
            this.$router.push(path);
        }
    }
};
</script>

<template>
    <div id="simulators" class="py-4 px-4 lg:px-8 my-2 md:my-4">
        <div class="text-center">
            <h2 class="text-900 font-normal mb-2">Simuladores</h2>
        </div>

        <div class="grid justify-content-center mt-8 md:mt-0">
            <div class="col-12 lg:col-6 xl:col-3">
                <div
                    @click="goTo('/simuladores/simulador-de-investimentos')"
                    class="card p-3 flex flex-column border-200 simulators-card cursor-pointer border-2 hover:border-primary transition-duration-300 transition-all"
                    style="border-radius: 10px"
                >
                    <img :src="investingBro" class="w-10 mx-auto my-3" alt="Investimentos" />
                    <h4 class="text-900 text-center mb-3">Investimentos</h4>
                </div>
            </div>
            <div class="col-12 lg:col-6 xl:col-3 mt-8 md:mt-0">
                <div @click="goTo('/simuladores/aporte-mensal')" class="card p-3 flex flex-column border-200 simulators-card cursor-pointer border-2 hover:border-primary transition-duration-300 transition-all" style="border-radius: 10px">
                    <img :src="refundBro" class="w-10 mx-auto my-3" alt="Aporte Mensal" />
                    <h4 class="text-900 text-center mb-3">Aporte Mensal</h4>
                </div>
            </div>
            <div class="col-12 lg:col-6 xl:col-3 mt-8 md:mt-0">
                <div @click="goTo('/simuladores/usufruto')" class="card p-3 flex flex-column border-200 simulators-card cursor-pointer border-2 hover:border-primary transition-duration-300 transition-all" style="border-radius: 10px">
                    <img :src="savingsBro" class="w-10 mx-auto my-3" alt="Usufruto" />
                    <h4 class="text-900 text-center mb-3">Usufruto</h4>
                </div>
            </div>
            <div class="col-12 lg:col-6 xl:col-3 mt-8 md:mt-0">
                <div
                    @click="goTo('/simuladores/financimanento-com-prestacoes-fixas')"
                    class="card p-3 flex flex-column border-200 simulators-card cursor-pointer border-2 hover:border-primary transition-duration-300 transition-all"
                    style="border-radius: 10px"
                >
                    <img :src="ManageMoneyBro" class="w-10 mx-auto my-3" alt="Prestações de Financiamento" />
                    <h4 class="text-900 text-center mb-3">Prestações de Financiamento</h4>
                </div>
            </div>
        </div>
    </div>
    <div id="to-decide" class="py-4 px-4 lg:px-8 my-2 md:my-4">
        <div class="text-center">
            <h2 class="text-900 font-normal mb-2">Para Decidir</h2>
        </div>

        <div class="grid justify-content-center mt-8 md:mt-0">
            <div class="col-12 lg:col-6 xl:col-3">
                <div @click="goTo('/para-decidir/compra-parcelada')" class="card p-3 flex flex-column border-200 to-decide-card cursor-pointer border-2 hover:border-primary transition-duration-300 transition-all" style="border-radius: 10px">
                    <img :src="forSale" class="w-10 mx-auto my-3" alt="free" />
                    <h4 class="text-900 text-center mb-3">À vista ou Financiado</h4>
                </div>
            </div>
            <div class="col-12 lg:col-6 xl:col-3 mt-4 md:mt-0">
                <div @click="goTo('/para-decidir/financiar-ou-alugar')" class="card p-3 flex flex-column border-200 to-decide-card cursor-pointer border-2 hover:border-primary transition-duration-300 transition-all" style="border-radius: 10px">
                    <img :src="manageMoney" class="w-10 mx-auto my-3" alt="startup" />
                    <h4 class="text-900 text-center mb-3">Financiar ou Alugar</h4>
                </div>
            </div>
            <!--div class="col-12 lg:col-6 xl:col-3 mt-4 md:mt-0">
                <div class="card p-3 flex flex-column border-200 to-decide-card cursor-pointer border-2 hover:border-primary transition-duration-300 transition-all" style="border-radius: 10px">
                    <img src="investingBro" class="w-10 mx-auto my-3" alt="enterprise" />
                    <h4 class="text-900 text-center mb-3">Alugar ou FII</h4>
                </div>
            </div-->
        </div>
    </div>
    <div id="graphics" class="py-4 px-4 lg:px-8 my-2 md:my-4">
        <div class="text-center">
            <h2 class="text-900 font-normal mb-2">Gráficos</h2>
        </div>

        <div class="grid justify-content-center mt-8 md:mt-0">
            <div class="col-12 lg:col-6 xl:col-3">
                <div @click="goTo('/graficos/liberdade-financeira')" class="card p-3 flex flex-column border-200 graphics-card cursor-pointer border-2 hover:border-primary transition-duration-300 transition-all" style="border-radius: 10px">
                    <img :src="investingPana" class="w-10 mx-auto my-3" alt="free" />
                    <h4 class="text-900 text-center mb-3">Liberdade Financeira</h4>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
