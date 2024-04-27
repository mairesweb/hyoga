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
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/aporte',
                    name: 'invest',
                    component: () => import('@/views/Invest.vue')
                },
                {
                    path: '/configuracoes',
                    name: 'configs',
                    component: () => import('@/views/Configs.vue')
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
