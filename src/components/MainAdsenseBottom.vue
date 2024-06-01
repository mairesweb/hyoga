<script lang="ts">
import { useMainStore } from '@/store/MainStore';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'MainAdsenseBottom',
    computed: {
        fixedwidth: () => useMainStore().layoutMainWidth
    }
});
</script>

<template>
    <div class="p-fluid flex justify-content-center mt-3 mb-6 main-ad-block" :style="{ width: (fixedwidth || 1024) + 'px' }">
        <Adsense data-ad-client="ca-pub-2781432625181032" data-ad-slot="5627803764" data-ad-format="auto" data-full-width-responsive="true"></Adsense>
    </div>
</template>

<style lang="scss" scoped>
.main-ad-block {
    margin: 0 auto;
}
</style>
