<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { ref, onBeforeMount } from 'vue';

const route = useRoute();
const assets = ref([]);

onBeforeMount(() => {
    try {
        const url = 'https://fintz.herokuapp.com/api/b3/acoes/indicadores?tickers=';
        const tickers = route.params.tickers;
        fetch(url + tickers)
            .then((response) => response.json())
            .then((data) => {
                assets.value = data;
                console.log(data);
            });
    } catch (error) {
        console.error(error);
    }
});
</script>

<template>
    <table>
        <tr v-for="asset in assets" :key="asset.ticker">
            <td>{{ asset.ticker }}</td>
            <td>{{ asset.setor }}</td>
            <td>{{ asset.subsetor }}</td>
            <td>{{ asset.dy }}</td>
            <td>{{ asset.pl }}</td>
            <td>{{ asset.pvp }}</td>
            <td>{{ asset.lpa }}</td>
            <td>{{ asset.vpa }}</td>
            <td>{{ asset.roe }}</td>
            <td>{{ asset.roic }}</td>
            <td>{{ asset.pebit }}</td>
            <td>{{ asset.liquidezCorrente }}</td>
            <td>{{ asset.receitaLiquida12Meses }}</td>
            <td>{{ asset.margemEbit }}</td>
            <td>{{ asset.margemBruta }}</td>
            <td>{{ asset.margemLiquida }}</td>
            <td>{{ asset.evEbitda }}</td>
            <td>{{ asset.valorDeMercado }}</td>
        </tr>
    </table>
</template>

<style scoped lang="scss"></style>
