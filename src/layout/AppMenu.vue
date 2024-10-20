<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Simuladores',
        items: [
            { label: 'Investimentos', icon: 'pi pi-fw pi-chart-line', to: '/simuladores/simulador-de-investimentos' },
            { label: 'Aporte Mensal', icon: 'pi pi-fw pi-calculator', to: '/simuladores/aporte-mensal' },
            { label: 'Usufruto de Patrimônio', icon: 'pi pi-fw pi-replay', to: '/simuladores/usufruto' },
            { label: 'Prestações de Financiamento', icon: 'pi pi-fw pi-calculator', to: '/simuladores/financiamento-com-prestacoes-fixas' }
        ]
    },
    {
        label: 'Para Decidir',
        items: [
            { label: 'À Vista ou Parcelado', icon: 'pi pi-fw pi-shopping-cart', to: '/para-decidir/compra-parcelada' },
            { label: 'Financiar ou Alugar', icon: 'pi pi-fw pi-home', to: '/para-decidir/financiar-ou-alugar' }
            // { label: 'Alugar ou FII?', icon: 'pi pi-fw pi-sync', to: '/para-decidir/alugar-ou-fundos-imobiliarios' }
        ]
    },
    {
        label: 'Gráficos',
        items: [{ label: 'Liberdade Financeira', icon: 'pi pi-fw pi-chart-line', to: '/graficos/liberdade-financeira' }]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
    <div class="p-fluid flex justify-content-center mt-6 w-full">
        <Adsense data-ad-client="ca-pub-2781432625181032" data-ad-slot="4017101513" style="display: block; width: 100%"> </Adsense>
    </div>
</template>

<style lang="scss" scoped></style>
