<template>
  <LauncherPage pageClass="store" title="Магазин" subtitle="В магазине находятся все наши сборки.">
    <StoreCard v-for="game of $store.state.launcherInfo.products" 
      :key="game.id"
      :storeUrl="game.store_url"
      :name="game.name"
      :rating="3"
      :price="game.price"
      :gameId="game.id"
    />
  </LauncherPage>
</template>
<script>
import LauncherPage from '../components/Base/LauncherPage.vue';
import StoreCard from '..//components/StoreCard.vue'
import { animate, stagger } from 'motion';

export default {
  name: 'StorePage',
  components: {
    LauncherPage,
    StoreCard
  },
  mounted() {
    animate('.store__card', { y: [-25, 0], opacity: [0, 100] }, {
      delay: stagger(0.15),
      duration: 1,
      easing: [0.5, 0, 0, 1],
    });
  },
}
</script>
<style>
.store .page__content {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 20px;
}
</style>