<template>
  <div class="sideBar">
    <div class="sideBar__inner">
      <div class="sideBar__head sideBar__block">
        <img src="https://svgshare.com/i/12TJ.svg" class="sideBar__close" @click.prevent="close" />
        <div class="sideBar__lang">
          <div class="sideBar__lang-head" @click.prevent="toggleDropdown">
            <img src="https://svgshare.com/i/12YB.svg" alt="" class="sideBar__lang-icon">
            <transition name="info-fade" mode="out-in">
              <span :key="$store.state.config.lang">{{ $store.state.config.lang }}</span>
            </transition>
          </div>
          <transition name="dropdown">
            <div class="sideBar__lang-dropdown" v-if="isOpen">
              <ul :class="{ 'show': isOpen }">
                <li v-for="(option, index) of $store.state.langs" :key="index" :class="{ 'selectedOption': option.value === selectedOption }" @click="selectOption(option)">
                  {{ option.label }}
                </li>
              </ul>
            </div>
          </transition>
        </div>
      </div>
      <div class="sideBar__menu sideBar__block">
        <ul class="sideBar__menu-list">
          <li v-for="link of menuLinks" :key="link.page"
            :class="{ 'selected': openedPage === link.page, 'sideBar__menu-item': true }"
            @click.prevent="openPage(link.page)">
            <img :src="link.iconUrl" alt="" class="sideBar__menu-icon">
            <span>{{ link.name }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="sideBar__favourites">
      <div v-if="$store.state.config.favouriteGames.length < 1" class="sideBar__favourites-empty">
        <img src="https://svgshare.com/i/12bY.svg" class="sideBar__favourites-icon">
        Добавляйте сборки в избранное для их быстрого запуска.
      </div>
      <div v-else class="sideBar__favourites-content">
        <div class="sideBar__favourites-head"><span>{{ $store.state.config.favouriteGames.length }}</span> ИЗБРАННЫХ </div>
        <div class="sideBar__favourites-list">
          <div class="sideBar__favourites-item" v-for="game of gameParams" @click.prevent="onFavouriteGameClick">
            <img :src="game.library_url" alt="" class="sideBar__favourites-img">
            <div class="sideBar__favourites-info">
              <span class="sideBar__favourites-name">{{ game.name }}</span>
              <div class="sideBar__favourites-status"><img :src="statusIcon" alt="">{{ statusText }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="sideBar__footer sideBar__menu sideBar__block">
      <ul class="sideBar__menu-list">
        <li class='sideBar__menu-item' @click.prevent="openPage('SettingsPage')">
          <img src="https://svgshare.com/i/12ZL.svg" alt="" class="sideBar__menu-icon">
          <span>Настройки</span>
        </li>
        <li class='sideBar__menu-item' @click.prevent="logOut">
          <img src="https://svgshare.com/i/12Zc.svg" alt="" class="sideBar__menu-icon">
          <span>Выйти</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SideBar',
  props: ['openedPage'],
  data() {
    return {
      menuLinks: [
        {
          iconUrl: 'https://svgshare.com/i/12XA.svg',
          name: 'Главная',
          page: 'HomePage'
        },
        {
          iconUrl: 'https://svgshare.com/i/12XT.svg',
          name: 'Библиотека',
          page: 'LibraryPage'
        },
        {
          iconUrl: 'https://svgshare.com/i/12Wm.svg',
          name: 'Магазин',
          page: 'StorePage'
        },
        {
          iconUrl: 'https://svgshare.com/i/12YD.svg',
          name: 'Промокоды',
          page: 'PromocodePage'
        },
        {
          iconUrl: 'https://svgshare.com/i/12ZD.svg',
          name: 'Вопросы',
          page: 'QuestionsPage'
        },
        {
          iconUrl: 'https://svgshare.com/i/12Yj.svg',
          name: 'Рефералка',
          page: 'ReferralPage'
        },
      ],
      isOpen: false,
      selectedOption: null,
    };
  },
  computed: {
    statusText() {
      if (this.gameParams.find((game) => this.$store.state.gameState.id === game.id) && this.$store.state.gameState.status === "downloading") return "Скачивается";
      if (this.gameParams.find((game) => this.$store.state.gameState.id === game.id) && this.$store.state.gameState.status === "check-files") return "Проверка файлов";

      if (this.$store.getters.installedGame.id === this.gameParams.id && this.$store.state.gameState.status === "launch") return "Запустить";
      if (this.$store.getters.installedGame.id === this.gameParams.id && this.$store.state.gameState.status === "launched") return "Запущено";
      if (this.$store.getters.installedGame.id === this.gameParams.id && this.$store.state.gameState.status === "launching") return "Подготовка к запуску";

      return "Скачать";
    },
    statusIcon() {
      if (this.$store.state.gameState.id === this.gameParams.id && (this.$store.state.gameState.status === "downloading" || this.$store.state.gameState.status === "check-files")) return "https://svgshare.com/i/12hs.svg";

      if (this.$store.getters.installedGame.id === this.gameParams.id && this.$store.state.gameState.status === "launch") return "https://svgshare.com/i/12hs.svg";
      if (this.$store.getters.installedGame.id === this.gameParams.id && this.$store.state.gameState.status === "launched") return "https://svgshare.com/i/12hs.svg";
      if (this.$store.getters.installedGame.id === this.gameParams.id && this.$store.state.gameState.status === "launching") return "https://svgshare.com/i/12hs.svg";

      return "https://svgshare.com/i/12hg.svg";
    },
    gameParams() {
      return this.$store.state.launcherInfo.products.filter(game => this.$store.state.config.favouriteGames.includes(game.id));
    },
  },
  methods: {
    close: () => window.closeSideBar(),
    logOut: () => window.logOut(),
    playClickSound: () => window.playClickSound(),
    openPage(page) {
      window.openPage(page);
      this.playClickSound();
      this.close();
    },
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    selectOption(option) {
      this.$store.commit('setLang', option.value);
      window.saveConfig();
      this.isOpen = false;
      this.$emit('selectOption', option);
    },
    onFavouriteGameClick(game) {
      if (game.id !== this.$store.getters.installedGame.id) {
        window.installGame(game.id);
      } else {
        window.launchGame(game.id);
      }
    }
  }
}
</script>

<style>
.sideBar {
  width: 350px;
  height: 100%;
  padding: 15px 25px;

  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  border-right: 1px solid rgba(149, 149, 149, 0.10);
  backdrop-filter: blur(10px);
  -webkit-app-region: no-drag;
}

.sideBar__block {
  padding: 25px 10px;
  border-bottom: 1px solid #ffffff1f;
}

.sideBar__lang {
  position: relative;
}

.sideBar__head {
  padding-top: 15px;
  border-bottom: 1px solid #ffffff1f;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sideBar__lang-head {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  -webkit-app-region: no-drag;
}

.sideBar__lang-head span {
  width: 30px;
  font-size: 23px;
  color: #ffffffb3;
  text-transform: uppercase;
}

.sideBar__lang-head img {
  width: 27px;
  margin-bottom: 2px;
}

.sideBar__lang-dropdown {
  width: 150px;
  position: absolute;
  top: 40px;
  right: 0;
  background: var(--field-bg);
  border: var(--field-border);
  border-radius: 10px;
  padding: 5px;
}

.sideBar__lang-dropdown li {
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: .25s ease-out;
}


.sideBar__lang-dropdown li:hover,
.sideBar__lang-dropdown li.selectedOption {
  background: #ffffff11;
}

.sideBar__close {
  cursor: pointer;
  opacity: .5;
  transition: .25s ease-in-out;
}

.sideBar__close:hover {
  opacity: 1;
}

.sideBar__menu-list {
  display: grid;
  grid-gap: 15px;
}

.sideBar__menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.sideBar__menu-item span {
  font-size: 19px;
  font-family: var(--raleway-font);
}

.sideBar__menu-item:first-child img,
.sideBar__menu-item:nth-child(2) img {
  width: 27px;
  margin-bottom: 3px;
}

.sideBar__menu-item:nth-child(4) img {
  margin-top: 3px;
}

.sideBar__menu-item span,
.sideBar__menu-item img {
  opacity: 0.7;
  transition: .25s ease-in-out;
}

.sideBar__menu-item.selected span,
.sideBar__menu-item.selected img,
.sideBar__menu-item:hover img,
.sideBar__menu-item:hover span {
  opacity: 1;
}


.sideBar__favourites {
  margin-top: 20px;
}

.sideBar__favourites-list {
  display: grid;
  grid-gap: 30px;
}

.sideBar__favourites-img {
  width: 50px;
  box-shadow: var(--center-shadow);
}

.sideBar__favourites-empty {
  max-width: 250px;

  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  text-align: center;
  gap: 10px;

  font-size: 15px;
  font-weight: 300;
  color: #ffffff80;
  
}

.sideBar__favourites-icon {
  width: 25px;
  opacity: .5;
}

.sideBar__favourites-head {
  font-size: 14px;
  margin-bottom: 20px;
  letter-spacing: 2px;
  color: #ffffffbd;
}

.sideBar__favourites-head span {
  font-weight: 500;
  color: #fff;
  letter-spacing: normal;
}


.sideBar__favourites-item {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 15px;
}

.sideBar__favourites-info {
  display: grid;
  grid-gap: 2px;
}

.sideBar__favourites-name {
  font-size: 19px;
  font-weight: 600;
  text-shadow: var(--default-text-shadow);
}

.sideBar__favourites-status {
  font-size: 15px;
  color: #ffffff99;
  text-shadow: var(--default-text-shadow);
  display: flex;
  align-items: center;
  gap: 5px;
}

.sideBar__favourites-status img {
  height: 15px;
  width: 11px;
  margin-bottom: 2px;
}


.sideBar__footer {
  margin-top: auto;
  border: 0;
  padding-bottom: 15px;
}

.sideBar__footer li:last-child img {
  width: 25px;
  margin-left: 2px;
}

.sideBar__footer li:last-child span {
  color: #FE4242;
  text-shadow: 0px 0px 25px #FE4242;
  font-weight: 500;
}

.dropdown {
  opacity: 0;
  transform: translateY(-10px);
  transition: transform .12s cubic-bezier(0, 0, 0.2, 1), opacity .12s cubic-bezier(0, 0, 0.2, 1);
}

.dropdown-visible {
  opacity: 1;
  transform: translateY(0);
}

.dropdown-hidden {
  opacity: 0;
  transform: translateY(0);
  transition: opacity .1s linear;
}

/* Vue based overlay animations */
.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: transform .12s cubic-bezier(0, 0, 0.2, 1), opacity .12s cubic-bezier(0, 0, 0.2, 1);
}

.info-fade-enter-active,
.info-fade-leave-active {
  transition: opacity .1s ease-in-out;
}

.info-fade-enter-from,
.info-fade-leave-to {
  opacity: 0;
}
</style>