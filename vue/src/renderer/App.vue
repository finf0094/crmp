<template>
  <div class="app">
    <div class="drag-header"></div>
    <transition name="fade">
      <div class="sideBar-bg" v-if="sideBar" @click.prevent="closeSideBar"></div>
    </transition>
    <transition name="slide-in-out">
      <SideBar v-show="sideBar" :openedPage="page" />
    </transition>
    <DefaultLayout :openedPage="page" :isLauncherLoading="isLauncherLoading" :sideBar="sideBar">
      <transition name="page" appear mode="out-in">
        <component :is="page" v-bind="pageParams" v-if="!isLauncherLoading"></component>
        <LoadingPage v-else />
      </transition>
    </DefaultLayout>
  </div>
</template>

<script>
import DefaultLayout from "./components/DefaultLayout.vue";
import SideBar from "./components/SideBar.vue";
import LoadingPage from './pages/LoadingPage.vue';
import GreetingPage from './pages/GreetingPage.vue';
import SelectPaths from './pages/SelectPaths.vue';
import LoginPage from './pages/LoginPage.vue';
import NotFoundPage from './pages/NotFoundPage.vue';

import HomePage from './pages/HomePage.vue';
import LibraryPage from './pages/LibraryPage.vue';
import StorePage from './pages/StorePage.vue';

import clickSound from './assets/click.wav';

export default {
  name: "App",
  components: {
    DefaultLayout,
    SideBar,
    LoadingPage,
    GreetingPage,
    SelectPaths,
    LoginPage,
    NotFoundPage,

    HomePage,
    LibraryPage,
    StorePage
  },
  data() {
    return {
      page: "LoadingPage",
      pageParams: {},
      isLauncherLoading: true,
      sideBar: false,
      modalWindowParams: {
        isOpen: false,
        title: "",
        placeholder: "",
        message: "",
        useInput: false,
        buttons: [],
        callback: () => { },
      },
    };
  },
  methods: {
    showModalWindow(title, subTitle, message, buttons = [], callback = () => { }, useInput = false, placeholder = "placeholder") {
      this.modalWindowParams.title = title;
      this.modalWindowParams.subTitle = subTitle;
      this.modalWindowParams.message = message;
      this.modalWindowParams.buttons = buttons;
      this.modalWindowParams.useInput = useInput;
      this.modalWindowParams.placeholder = placeholder;

      this.modalWindowParams.callback = (...data) => {
        this.modalWindowParams.isOpen = false;

        callback(...data);
      };

      this.modalWindowParams.isOpen = true;
    },
    showError(error) {
      window.setLoadingParams(error.replace(/Error.*':/gm, ""));
      this.showModalWindow("Ошибка", "Произошла ошибка", `${error.replace(/Error.*':/gm, "")} \n\n Хотите открыть файл логов для показа администрации?`, ["Да", "Нет"], (index) => {
        if (index === 1) {
          return;
        }

        window.client.sendEvent('openLogsFile');
        this.showModalWindow("Файл логов", "Вы открыли файл логов", "Скопируйте содержимое файла, и скиньте администрации \n для упрощения решения проблемы.", ["Понял"])
      });
    },
    openPage(page, pageParams = {}) {
      const isValidPage = Object.keys(this.$options.components).includes(page);

      if (isValidPage) {
        window.log.info(`[openPage] Page: ${page}`);
        if (page === 'GreetingPage' && !this.$store.state.config.isFirstLaunch) page = 'HomePage';
        if (page === 'LoginPage' && this.$store.state.config.isAuthenticated) page = 'HomePage';

        this.page = page;

        if (pageParams) this.pageParams = pageParams;
      } else {
        window.log.info(`[openPage] Page: "${page}" not found, show the NotFoundPage`);
        this.page = 'NotFoundPage';
      }
    },
    openSideBar() {
      this.sideBar = true;
    },
    closeSideBar() {
      this.sideBar = false;
    },
    playClickSound() {
      const audio = new Audio(clickSound);
      audio.currentTime = .1;
      audio.volume = .2;
      audio.play();
    },
    logOut() {
      this.sideBar = false;

      this.showModalWindow("Выход", "Выход из аккаунта", "Вы действительно хотите выйти из текущего аккаунта?", ["Выйти", "Отмена"], async (index) => {
        if (index === 0) {
          window.log.info('Log out...');

          this.$store.commit("logOut");
          this.saveConfig();

          this.openPage("LoginPage");
          return;
        }

        window.log.info("[logOut] Cancel log out");
      });
    },
    async selectRLPath() {
      const selectedPath = await window.client.sendEvent("selectRLPath");

      window.log.info(`[setRLPath] Selected path: "${selectedPath}"`);

      switch (selectedPath) {
        case "invalid-path":
          window.showModalWindow("Путь", "Неправильный путь", "Вы выбрали неправильный путь к Radmir Launcher.\n Проверьте путь и попробуйте еще раз.", ["Понял"]);
          return;
        case false:
          return;
      }

      this.$store.commit("setRadmirLauncherPath", selectedPath);
      this.saveConfig();
    },
    async selectSampPath() {
      const selectedPath = await window.client.sendEvent("selectSampPath");

      window.log.info(`Set samp path: "${selectedPath}"`);

      switch (selectedPath) {
        case "invalid-path":
          window.showModalWindow("Путь", "Неправильный путь", "Вы выбрали неправильный путь к игре.\nПроверьте путь и попробуйте еще раз.", ["Понял"]);
          return;
        case false: return;
      }

      this.$store.commit("setSampPath", selectedPath);
      this.saveConfig();
    },
    async savePaths() {
      this.isLauncherLoading = true;
      window.setLoadingParams('Ожидание выбора');
      this.showModalWindow("Пути", "Выполнение поиска путей", "Выполнить поиск путей лаунчера RADMIR и игры? \n Это займет некоторое время, но если вы не \n хотите ждать вы можете указать пути сами.", ["Поиск", "Указать пути"], async (index) => {
        if (index === 1) {
          this.openPage("SelectPaths");
          this.isLauncherLoading = false;
          return;
        }

        try {
          window.setLoadingParams('Поиск путей. Пожалуйста, подождите');

          const paths = await window.client.sendEvent("searchPaths");
          if (paths[0] === null || paths[1] === null || paths[0] === "" || paths[1] === "") {
            window.log.info("[savePaths] Failed to search paths. Open a SelectPaths page.");
            this.openPage("SelectPaths");
            return;
          }

          this.$store.commit("setRadmirLauncherPath", paths[0]);
          this.$store.commit("setSampPath", paths[1]);

          
          window.log.info(`[savePaths] Paths saved successfully! RLPath: ${this.$store.state.config.radmirLauncherPath}, SampPath: ${this.$store.state.config.sampPath}`);
          window.saveConfig();
          
          this.isLauncherLoading = false;
          window.openPage("HomePage");

        } catch (e) {
          window.log.error(`[savePaths] Error while search the paths: ${e}`);
          this.openPage("SelectPaths");
          this.isLauncherLoading = false;
          return;
        }
      });
    },
    setGameStatus(gameId, status) {
      this.$store.commit("setGameState", {
        id: gameId,
        gameState: status,
      });
    },
    toggleFavourite(gameId) {
      if (this.$store.state.config.favouriteGames.includes(gameId)) {
        window.log.info(`[toggleFavourite] Game is already exists, deleting`);
        this.$store.state.config.favouriteGames.shift(gameId);
        window.saveConfig();
      } else {
        this.$store.state.config.favouriteGames.push(gameId);
        window.saveConfig();
        window.log.info(`[toggleFavourite] Game succesfully added to favorites`);
      }
    },
    saveConfig() {
      window.client.sendEvent("saveConfig", JSON.stringify(this.$store.state.config));
    },
    async loadConfig() {
      const config = await window.client.sendEvent("getConfig");
      window.setLoadingParams('Загрузка конфигурации лаунчера');
      this.$store.commit("setConfig", config);
    },
    async loadBoughtGames() {
      window.setLoadingParams("Загрузка купленных сборок");
      const boughtGames = await window.client.sendEvent("getBoughtGames");

      if (boughtGames) {
        window.log.info("[loadBoughtGames] Bought games loaded successfully!");
        this.$store.commit("setBoughtGames", boughtGames);
      }
      
    },
    async saveLauncherInfo() {
      window.setLoadingParams("Загрузка списка сборок");

      const launcherInfo = await window.client.sendEvent("getLauncherInfo");

      this.$store.commit("setLauncherInfo", launcherInfo);
    },
    async openDesiredPage() {

      if (this.$store.state.config.isFirstLaunch) {
        window.log.info("First launch. Open the Greeting page");
        this.openPage("GreetingPage");
        this.isLauncherLoading = false;
        return;
      }

      if (this.$store.state.config.auth.refresh_token === "") {
        window.log.info("[openDesiredPage] User doesn't logged in. Open a login page.");
        this.openPage("LoginPage");
        this.isLauncherLoading = false;
      }

      if (this.$store.state.config.auth.accessToken !== '' && this.$store.state.config.auth.refreshToken !== '' && this.$store.state.config.isAuthenticated && !this.$store.state.config.isFirstLaunch) {
        window.log.info("[openDesiredPage] User is logged in. Open a home page.");
        // await this.checkGameInstallation();
        if (this.$store.state.config.radmirLauncherPath === null || this.$store.state.config.sampPath === null || this.$store.state.config.radmirLauncherPath === "" || this.$store.state.config.sampPath === "") {
          await this.savePaths();
        } else {
          this.openPage("HomePage");
          this.isLauncherLoading = false;
        }
      } else {
        if (this.$store.state.config.isFirstLaunch && !this.$store.state.config.isAuthenticated) {
          this.openPage("LoginPage");
          this.isLauncherLoading = false;
        } else if (!this.$store.state.config.isFirstLaunch) {
          this.openPage("GreetingPage");
          this.isLauncherLoading = false;
        }
      }
    },
    async loadLauncher(isLaunch) {
      window.log.info('================================');
      window.log.info("[loadLauncher] Start loading info...");

      try {
        this.isLauncherLoading = true;

        await window.client.sendEvent('getSID');
        await this.loadConfig();
        // await this.saveLauncherInfo();
        await this.openDesiredPage();
        if (this.$store.state.config.isAuthenticated) await this.loadBoughtGames();

        if (isLaunch) this.isLauncherLoading = false;

        window.log.info("[loadLauncher] Info loaded successfully.");
        window.log.info('================================');
      } catch (error) {
        if (error.message) this.showError(error.message);
        else this.showError(error);
        window.log.error(`[loadLauncher] ${error}`);
      }
    },
  },
  created() {
    window.modalWindowParams = this.modalWindowParams;
    window.showModalWindow = this.showModalWindow;
    window.showError = this.showError;
    window.openPage = this.openPage;
    window.playClickSound = this.playClickSound;
    window.logOut = this.logOut;
    window.openSideBar = this.openSideBar;
    window.closeSideBar = this.closeSideBar;
    window.selectRLPath = this.selectRLPath;
    window.selectSampPath = this.selectSampPath;
    window.toggleFavourite = this.toggleFavourite;
    window.saveConfig = this.saveConfig;
    window.savePaths = this.savePaths;
    window.loadLauncher = this.loadLauncher;
    window.store = this.$store;

    this.loadLauncher();
  }
}
</script>

<style>
@font-face {
  font-family: 'Raleway';
  font-weight: 300;
  src: url('./fonts/Raleway-Light.ttf') format('truetype');
}

@font-face {
  font-family: 'Raleway';
  font-weight: 400;
  src: url('./fonts/Raleway-Regular.ttf') format('truetype');
}

@font-face {
  font-family: 'Raleway';
  font-weight: 500;
  src: url('./fonts/Raleway-Medium.ttf') format('truetype')
}

@font-face {
  font-family: 'Raleway';
  font-weight: 600;
  src: url('./fonts/Raleway-SemiBold.ttf') format('truetype')
}

@font-face {
  font-family: 'Raleway';
  font-weight: 700;
  src: url('./fonts/Raleway-Bold.ttf') format('truetype')
}

@font-face {
  font-family: 'Manrope';
  font-weight: 400;
  src: url('./fonts/Manrope-Regular.ttf') format('truetype')
}

@font-face {
  font-family: 'Manrope';
  font-weight: 500;
  src: url('./fonts/Manrope-Medium.ttf') format('truetype')
}

@font-face {
  font-family: 'Manrope';
  font-weight: 700;
  src: url('./fonts/Manrope-Bold.ttf') format('truetype')
}

@font-face {
  font-family: 'Gotham Pro';
  font-weight: 400;
  src: url('./fonts/gothampro.ttf') format('truetype')
}

@font-face {
  font-family: 'Gotham Pro';
  font-weight: 500;
  src: url('./fonts/gothampro_medium.ttf') format('truetype')
}

@font-face {
  font-family: 'Gotham Pro';
  font-weight: 700;
  src: url('./fonts/gothampro_bold.ttf') format('truetype')
}

@font-face {
  font-family: 'Inter var';
  font-weight: 100 900;
  font-display: block;
  font-style: normal;
  font-named-instance: "Regular";
  src: url(./fonts/Inter-var.woff2) format("woff2")
}

:root {
  --default-text-shadow: 3px 3px 10px #000;
  --center-text-shadow: 0 0 25px #000000;
  --default-shadow: 3px 3px 10px 0 #000;
  --center-shadow: 0 0 25px 0 #00000080;
  --bg-blur: 5px;
  --dark-color: #ffffff99;
  --input-bg: #4848484d;
  --input-border: 1px solid rgba(92, 92, 92, 0.50);
  --gotham-pro-font: 'Gotham Pro', sans-serif;
  --raleway-font: 'Raleway', sans-serif;
  --manrope-font: 'Manrope', sans-serif;
  --inter-var-font: 'Inter var', sans-serif;
  --field-bg: linear-gradient(268deg, rgba(255, 255, 255, 0.08) 0.2%, rgba(149, 149, 149, 0.05) 102.16%);
  --field-border: 1px solid rgba(255, 255, 255, 0.10);
  --title-font: 700 40px var(--raleway-font);
  --subtitle-font: 400 20px var(--raleway-font);
  --subtitle-color: #ffffffb3;
}

*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-user-drag: none;
  font-family: var(--manrope-font);
  color: #fff;
}

body {
  padding: 0.5rem;
  width: 100vw;
  height: 100vh;
  background: transparent;
  color: white;
  font-size: 1rem;
  text-rendering: auto;
}

#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background: url('./assets/launcher-bg.jpg') center center/cover no-repeat;
  border-radius: 20px;
  background-size: cover;
  user-select: none;
}

.main__content {
  overflow: auto;
  overflow-x: hidden;
  height: calc(100vh - 85px);
}

.app {
  height: 100%;
  display: grid;
}

a {
  text-decoration: none;
}

button {
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
}

li {
  list-style: none;
}

.drag-header {
  width: 100%;
  height: 50px;
  position: absolute;
  top: 0;
  left: 0;
  -webkit-app-region: drag;
  z-index: -10;
}

main {
  width: 100%;
  transition: .3s all;
}

.sideBar-bg {
  width: 100vw;
  height: 100vh;
  border-radius: 20px;
  background: #0000006e;

  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;

  transition: .25s ease-in-out;
}


/* Transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity .3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-in-out-enter-active,
.slide-in-out-leave-active {
  transition: transform 0.45s ease;
}

.slide-in-out-enter-from,
.slide-in-out-leave-to {
  transform: translate3d(-100%, 0, 0);
}
</style>
