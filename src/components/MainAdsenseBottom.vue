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
    <div class="p-fluid flex justify-content-center mt-3 mb-6 main-ad-block w-full">
        <Adsense data-ad-client="ca-pub-2781432625181032" data-ad-slot="5627803764" style="display: block; width: 100%" data-full-width-responsive="yes"> </Adsense>
    </div>
</template>

<style lang="scss" scoped></style>
