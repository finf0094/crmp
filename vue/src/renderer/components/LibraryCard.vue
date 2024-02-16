<template>
  <div class="library__card" @click.prevent="productInfoLink(gameId)" :title="gameParams.name">
    <div class="library__card-content">
      <img :src="gameParams.library_url" class="library__card-img">
      <div class="library__card-info">
        <div class="library__card-name">{{ gameParams.name }}</div>
        <div class="library__card-status">
          <img :src="statusIcon" alt="">
          {{ statusText }}
        </div>
      </div>
    </div>
    <span class="library__card-free" v-if="isFree">FREE</span>
    <img src="https://svgshare.com/i/12bY.svg" @click.prevent="(e) => toggleFavourite(gameId, e)" :class="{ 'favouriteGame': this.$store.state.config.favouriteGames.includes(gameId) }" class="library__card-favourite">
  </div>
</template>
<script>
export default {
  props: {
    gameId: {
      type: String,
      default: "",
    },
    isFree: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    statusText() {
      if (this.$store.state.gameState.id === this.gameParams.id && this.$store.state.gameState.status === "downloading") return "Скачивается";
      if (this.$store.state.gameState.id === this.gameParams.id && this.$store.state.gameState.status === "check-files") return "Проверка файлов";

      if (this.$store.getters.installedGame.id === this.gameParams.id && this.$store.state.gameState.status === "launch") return "Запустить";
      if (this.$store.getters.installedGame.id === this.gameParams.id && this.$store.state.gameState.status === "launched") return "Запущено";
      if (this.$store.getters.installedGame.id === this.gameParams.id && this.$store.state.gameState.status === "launching") return "Подготовка к запуску";

      return "Скачать";
    },
    statusIcon() {
      if (this.$store.state.gameState.id === this.gameParams.id && (this.$store.state.gameState.status === "downloading" || this.$store.state.gameState.status === "check-files")) return "library__card-launched";

      if (this.$store.getters.installedGame.id === this.gameParams.id && this.$store.state.gameState.status === "launch") return "https://svgshare.com/i/12hs.svg";
      if (this.$store.getters.installedGame.id === this.gameParams.id && this.$store.state.gameState.status === "launched") return "library__card-launched";
      if (this.$store.getters.installedGame.id === this.gameParams.id && this.$store.state.gameState.status === "launching") return "library__card-launched";

      return "https://svgshare.com/i/12hg.svg";
    },
    gameParams() {
      return this.$store.state.launcherInfo.products.find((game) => game.id === this.gameId) || {};
    },
  },
  methods: {
    toggleFavourite: (gameId, e) => {
      e.stopPropagation();
      window.toggleFavourite(gameId)
    },
    productInfoLink: (id) => window.openPage('ProductInfo', { gameId: id })
  },
}
</script>
<style>
.library__card {
  width: 330px;
  background: var(--field-bg);
  border: var(--field-border);
  border-radius: 15px;
  padding: 13px;
  position: relative;
  cursor: pointer;
  transition: .25s ease-out;
}

.library__card:hover {
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.library__card-img {
  box-shadow: var(--center-shadow);
}

.library__card-content {
  display: flex;
  align-items: center;
  margin-right: 50px;
  gap: 13px;
}

.library__card-favourite {
  position: absolute;
  top: 12px;
  right: 12px;
  opacity: .5;
  transition: .25s ease-out;
}

.library__card-favourite:hover, .library__card-favourite.favouriteGame {
  opacity: 1;
}

.library__card-info {
  display: grid;
  grid-gap: 2px;
}

.library__card-name {
  height: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-shadow: var(--center-text-shadow);
  font-weight: 500;
  font-size: 21px;
  margin-bottom: 3px;
}

.library__card-status {
  font-size: 16px;
  color: #ffffff99;
  font-family: var(--raleway-font);
  text-shadow: var(--default-text-shadow);
  display: flex;
  align-items: center;
  gap: 5px;
}

.library__card-status img {
  height: 15px;
  width: 11px;
  margin-bottom: 2px;
}

.library__card-free {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 2px;

  padding: 3px 7px;
  border-radius: 3px; 
  background: #2674f3;

  position: absolute;
  bottom: 12px;
  right: 10px;
}
</style>