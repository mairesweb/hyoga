<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        items: [
            { label: 'Visão Geral', icon: 'pi pi-fw pi-chart-bar', to: '/' },
            { label: 'Carteira', icon: 'pi pi-fw pi-wallet', to: '/carteira' },
            { label: 'Configurações', icon: 'pi pi-fw pi-chart-pie', to: '/configuracoes' },
            { label: 'Aporte', icon: 'pi pi-fw pi-shopping-cart', to: '/aporte' },
            { label: 'Proventos', icon: 'pi pi-fw pi-dollar', to: '/proventos' }
        ]
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
</template>

<style lang="scss" scoped></style>
