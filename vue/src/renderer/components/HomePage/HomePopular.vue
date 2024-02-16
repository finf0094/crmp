<template>
  <div class="home__popular">
    <div class="home__child-title">Популярные сборки</div>
    <div class="popular__content">
      <div class="popular__item" v-for="item of $store.getters.popularProducts" @click.prevent="productInfoLink" :key="item.id" :style="`background: url(${item.imageUrl})`">
        <div class="popular__item-info">
          <div class="popular__item-name">{{ item.name }}</div>
          <span class="popular__item-link">Подробнее</span>
        </div>
        <div class="popular__item-footer">
          <div class="popular__item-rating" title="Рейтинг">
            <img v-for="star in 5" :key="star" :style="{ 'opacity': star <= item.rating ? 1 : 0.5 }"
              src="https://svgshare.com/i/12Qo.svg" alt="star" />
          </div>
          <div class="popular__item-downloads" title="Скачивания">
            <span>{{ item.downloads }}</span>
            <img src="https://svgshare.com/i/12Pm.svg" alt="downloads">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    productInfoLink: (id) => window.openPage('ProductInfo', { gameId: id })
  },
}
</script>
<style>

.popular__content {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  cursor: pointer;
}

.popular__item {
  width: 100%;
  height: 120px;
  display: flex;
  flex-direction: column;
  padding: 15px 18px;
  background-size: cover;
  border-radius: 15px;
  border: var(--field-border);
}

.popular__item-name {
  font-size: 20px;
  font-weight: 600;
  text-shadow: var(--default-text-shadow);
}

.popular__item-link {
  color: rgba(255, 255, 255, 0.60);
  font-size: 15px;
  font-weight: 400;
  text-shadow: var(--default-text-shadow);
}

.popular__item-footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.popular__item-rating {
  display: flex;
  align-items: center;
  gap: 5px;
}

.popular__item-downloads {
  display: flex;
  align-items: center;
  gap: 5px;
  border-radius: 5px 0px 0px 5px;
  background: #95959533;
  padding: 4px 7px;
  position: relative;
  left: 18px;
}

.popular__item-downloads span {
  font-family: var(--manrope-font);
}

.popular__item-downloads img {
  width: 18px;
}
</style>