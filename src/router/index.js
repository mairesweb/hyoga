import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '',
                    name: 'basic-investiment-simulator',
                    component: () => import('@/views/simulators/BasicInvestimentSimulator.vue')
                },
                {
                    path: '/simulador-aporte-mensal',
                    name: 'monthly-investiment-simulator',
                    component: () => import('@/views/simulators/MonthlyInvestimentSimulator.vue')
                },
                {
                    path: '/simulador-usufruto',
                    name: 'usufruct-simulator',
                    component: () => import('@/views/simulators/UsufructSimulator.vue')
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
        }
    ]
});

export default router;
