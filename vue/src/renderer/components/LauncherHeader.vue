<template>
  <header class="header">
    <transition name="fade">
      <div class="header__second" v-if="isSecondHeader">
        <div class="header__profile">
          <img src="https://svgshare.com/i/12SA.svg" alt="user" class="header__profile-img">
          <div class="header__profile-info">
            <div class="header__profile-name">MIKOSH</div>
            <div class="header__profile-balance">LAUNCHER</div>
          </div>
        </div>
      </div>
      <div class="header__main" v-else>
        <div class="header__profile">
          <img src="https://svgshare.com/i/12NL.svg" alt="user" class="header__profile-img" @click.prevent="openSideBar">
          <div class="header__profile-info">
            <div class="header__profile-name">{{ $store.state.config.auth.user.username }}</div>
            <div class="header__profile-balance">{{ balance }} ₽</div>
          </div>
        </div>
        <nav class="header__nav">
          <ul class="nav__list">
            <li class="nav__item" :class="{ 'selected': openedPage === 'HomePage' }"
              @click.prevent="linkClick('HomePage')">Главная</li>
            <li class="nav__item" :class="{ 'selected': openedPage === 'LibraryPage' }"
              @click.prevent="linkClick('LibraryPage')">Библиотека</li>
            <li class="nav__item" :class="{ 'selected': openedPage === 'StorePage' }"
              @click.prevent="linkClick('StorePage')">Магазин</li>
          </ul>
        </nav>
      </div>
    </transition>
    <div class="controls">
        <div @click.prevent="minimizeApp">
          <img src="../assets/minimize.svg" alt="" class="controls__minimize" />
        </div>
        <div @click.prevent="closeApp">
          <img src="../assets/close.svg" alt="" class="controls__close" />
        </div>
      </div>
  </header>
</template>
<script>

export default {
  props: ["openedPage", "username", "balance", "isSecondHeader", "sideBar"],
  methods: {
    openSideBar: () => window.openSideBar(),
    closeApp: () => window.client.sendEvent('closeApp'),
    minimizeApp: () => window.client.sendEvent('minApp'),
    playClickSound: () => window.playClickSound(),
    linkClick(page) {
      if (this.openedPage !== page) { 
        window.openPage(page)
        this.playClickSound();
      }
    },
    
  }
}
</script>
<style>
.header {
  height: 95px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-bottom: 1px solid rgba(202, 202, 202, 0.07);
  background: #8b8b8b0f;
}

.header__main,
.header__second {
  display: flex;
  align-items: center;
  justify-content: space-between;
  -webkit-app-region: no-drag;
  transition: opacity 0.5s ease;
}

.header__second .header__profile {
  left: 33px;
}

.header__second .header__profile-img {
  cursor: auto;
}

.header__profile {
  display: flex;
  align-items: center;
  position: absolute;
  left: 30px;
  gap: 10px;
}

.header__profile-img {
  cursor: pointer;
  -webkit-app-region: no-drag;
}

.header__profile-name {
  color: #FFF;
  text-shadow: 2px 2px 15px rgba(0, 0, 0, 0.75);
  font-size: 21px;
  font-weight: 500;
}

.header__profile-balance {
  color: rgba(255, 255, 255, 0.45);
  font-size: 16px;
}

.header__nav {
  display: flex;
  align-items: center;
  gap: 30px;
}

.header__nav::before,
.header__nav::after {
  content: "";
  display: block;
  width: 100px;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.20);
}

.nav__list {
  display: flex;
  align-items: center;
  gap: 30px;
}

.nav__item {
  font-size: 20px;
  color: #ffffff80;
  cursor: pointer;
  font-family: var(--raleway-font);
  transition: .25s ease-in-out;
}

.nav__item:hover,
.nav__item.selected {
  color: #fff;
}

.controls {
    position: absolute;
    right: 20px;
    top: 17px;
    display: flex;
    align-items: center;
    gap: 15px;
    -webkit-app-region: no-drag;
}

.controls>div {
    cursor: pointer;
}

.controls__minimize {
    margin-bottom: 5px;
}

.controls__minimize,
.controls__close {
    width: 25px;
}
</style>