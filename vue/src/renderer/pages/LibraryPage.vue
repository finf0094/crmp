<template>
  <LauncherPage pageClass="library" title="Библиотека" subtitle="Страница со всеми ваши купленные сборки.">
    <LibraryCard v-for="game of $store.getters.boughtGames" :key="game" :gameId="game"  />
    <LibraryCard v-for="game of $store.getters.freeGames" :key="game" :gameId="game" :isFree="true" />
  </LauncherPage>
</template>
<script>
import LauncherPage from '../components/Base/LauncherPage.vue';
import LibraryCard from '../components/LibraryCard.vue';
import { animate, stagger } from 'motion';

export default {
  name: 'LibraryPage',
  components: {
    LauncherPage,
    LibraryCard
  },
  mounted() {
    animate('.library__card', { y: [-25, 0], opacity: [0, 100] }, {
      delay: stagger(0.15),
      duration: 1,
      easing: [0.5, 0, 0, 1],
    });
  },
}
</script>
<style>
.library .page__content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 25px;
}

</style>