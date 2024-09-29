import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '',
            component: AppLayout,
            children: [
                {
                    path: '',
                    component: () => import('@/views/Home.vue')
                },
                {
                    path: '/dashboard',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/carteira',
                    name: 'wallet',
                    component: () => import('@/views/Wallet.vue')
                },
                {
                    path: '/configuracoes',
                    name: 'configs',
                    component: () => import('@/views/Configs.vue')
                },
                {
                    path: '/aporte',
                    name: 'invest',
                    component: () => import('@/views/Invest.vue')
                },
                {
                    path: '/proventos',
                    name: 'earnings',
                    component: () => import('@/views/Earnings.vue')
                }
            ]
        },
        {
            path: '/simuladores',
            component: AppLayout,
            children: [
                {
                    path: 'simulador-de-investimentos',
                    name: 'investiment-simulator',
                    component: () => import('@/views/simulators/InvestimentSimulator.vue')
                },
                {
                    path: 'aporte-mensal',
                    name: 'monthly-investiment-simulator',
                    component: () => import('@/views/simulators/MonthlyInvestimentSimulator.vue')
                },
                {
                    path: 'usufruto',
                    name: 'usufruct-simulator',
                    component: () => import('@/views/simulators/UsufructSimulator.vue')
                },
                {
                    path: 'financiamento-com-prestacoes-fixas',
                    name: 'financing-with-fixed-installments-simulator',
                    component: () => import('@/views/simulators/FinancingWithFixedInstallmentsSimulator.vue')
                }
            ]
        },
        {
            path: '/para-decidir',
            component: AppLayout,
            children: [
                {
                    path: 'compra-parcelada',
                    name: 'partial-payment-simulator',
                    component: () => import('@/views/to-decide/PartialPaymentSimulator.vue')
                },
                {
                    path: 'financiar-ou-alugar',
                    name: 'finance-tohire-invest-simulator',
                    component: () => import('@/views/to-decide/FinanceOrToHireSimulator.vue')
                },
                {
                    path: 'alugar-ou-fundos-imobiliarios',
                    name: 'tohire-reets-simulator',
                    component: () => import('@/views/to-decide/ToHireOrReetsSimulator.vue')
                }
            ]
        },
        {
            path: '/graficos',
            component: AppLayout,
            children: [
                {
                    path: 'liberdade-financeira',
                    name: 'financial-freedom-chart',
                    component: () => import('@/views/charts/FinancialFreedomChart.vue')
                }
            ]
        },
        {
            path: '/api/:tickers',
            name: 'api',
            component: () => import('@/views/Api.vue')
        }
    ]
});

export default router;
