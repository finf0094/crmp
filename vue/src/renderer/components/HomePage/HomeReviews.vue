<template>
  <div class="home-reviews">
    <div class="home__child-title">ОТЗЫВЫ</div>
    <div class="reviews__content">
      <Review v-for="review of $store.state.reviews" :key="review.id" v-bind="review"/>
    </div>
  </div>
</template>
<script>
import Review from '../Review.vue'

export default {
  components: {
    Review
  }
}
</script>
<style scoped>
.reviews__content {
  display: grid;
  grid-gap: 30px;
}
</style>