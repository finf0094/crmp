<template>
  <LauncherPage pageClass="home" title="ГЛАВНАЯ" subtitle="Главная страница лаунчера">
    <HomePopular />
    <HomeReviews />
  </LauncherPage>
</template>

<script>
import HomePopular from '../components/HomePage/HomePopular.vue'
import HomeReviews from '../components/HomePage/HomeReviews.vue'
import LauncherPage from '../components/Base/LauncherPage.vue'
import { animate, stagger } from 'motion';

export default {
  name: 'HomePage',
  components: {
    HomePopular,
    HomeReviews,
    LauncherPage
  },
  mounted() {
    animate('.popular__content, .home__child-title, .reviews__content', { y: [-25, 0], opacity: [0, 100] }, {
      delay: stagger(0.15),
      duration: 1,
      easing: [0.5, 0, 0, 1],
    });
  },
};
</script>

<style>
.home .page__content {
  display: grid;
  grid-gap: 30px;
}

.home__child-title {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;
  margin-bottom: 30px;

  color: rgba(255, 255, 255, 0.49);
  font-size: 18px;
  font-weight: 400;
  letter-spacing: 7px;
  text-transform: uppercase;
  text-align: center;

  white-space: nowrap;
}

.home__child-title::before,
.home__child-title::after {
  content: "";
  display: block;
  width: 45%;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.20);
}
</style>