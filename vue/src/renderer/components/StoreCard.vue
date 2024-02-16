<template>
  <div class="store__card" @click.prevent="productInfoLink(gameId)" :style="`background: url(${storeUrl}) center no-repeat`">
    <div class="store__card-bg"></div>
    <div class="store__card-content">
      <div class="store__card-info">
        <div class="store__card-name">{{ name }}</div>
        <span class="store__card-link">Подробнее</span>
      </div>
      <div class="store__card-rating" title="Рейтинг">
        <img v-for="star in 5" :key="star" :style="{ 'opacity': star <= rating ? 1 : 0.5 }" src="https://svgshare.com/i/12Qo.svg" alt="star" />
      </div>
    </div>
    <div class="store__card-price" v-if="price !== 0 && !isBought && !isFree">{{ price }} ₽</div>
    <div class="store__card-free" v-if="isFree">FREE</div>
    <div class="store__card-bought" v-if="isBought">КУПЛЕНО</div>
  </div>
</template>
<script>
export default {
  props: {
    gameId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    storeUrl: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true
    }
  },
  computed: {
    isFree() {
      return this.$store.getters.freeGames.includes(this.gameId) && this.price === 0;
    },
    isBought() {
      return this.$store.getters.boughtGames.includes(this.gameId);
    }
  },
  methods: {
    productInfoLink: (id) => window.openPage('ProductInfo', { gameId: id })
  },
}
</script>
<style>
.store__card {
  width: 300px;
  height: 120px;
  background-size: cover;
  border-radius: 15px;
  overflow: hidden;
  border: .5px solid #4242421a;
  padding: 16px 18px;
  position: relative;
  cursor: pointer;
}

.store__card-bg {
  width: 100%;
  height: 100%;
  background: linear-gradient(73deg, rgb(0, 0, 0) 0.19%, rgba(0, 0, 0, 0) 57.93%);

  position: absolute;
  top: 0;
  left: 0;
}

.store__card-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-right: 50px;
  gap: 13px;
  position: relative;
  z-index: 1;
}

.store__card-name {
  font-size: 19px;
  font-weight: 500;
  text-shadow: var(--default-text-shadow);
  margin-bottom: 1px;
}

.store__card-link {
  font-size: 15px;
  color: #ffffff99;
}

.store__card-rating img {
  width: 22px;
  display: flex;
  align-items: center;
  gap: 3px;
}

.store__card-rating {
  display: flex;
  align-items: center;
  gap: 5px;
}

.store__card-price {
  position: absolute;
  top: 12px;
  right: 12px;
  opacity: .7;
}

.store__card-free {
  text-shadow: var(--default-text-shadow);
  box-shadow: var(--default-shadow);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 2px;
  padding: 2px 6px;
  border-radius: 3px;
  background: #2674f3;
  position: absolute;
  top: 12px;
  right: 12px;
}

.store__card-bought {
  text-shadow: var(--default-text-shadow);
  box-shadow: var(--default-shadow);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 2px;
  padding: 4px 8px;
  border-radius: 3px;
  background: #ffffff3a;
  position: absolute;
  top: 12px;
  right: 12px;
}
</style>