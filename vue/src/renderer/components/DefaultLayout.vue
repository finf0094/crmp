<template>
  <div class="layout">
    <transition name="fade">
      <ModalWindow :key="isOpenModal ? 'modal-window' : 'no-modal-window'" @on-button-click="onButtonClick" v-if="isOpenModal" v-bind="globalBind" />
    </transition>
    <main key="main">
      <LauncherHeader :openedPage="openedPage" key="header" :username="username" :balance="balance" :isSecondHeader="!isHeaderSecond" :sideBar="sideBar" />
      <div class="main__content" key="main-content">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<script>
import LauncherHeader from "./LauncherHeader.vue";
import ModalWindow from "./ModalWindow.vue";

export default {
  name: "DefaultLayout",
  data() {
    return {
      showHeader: false,
      isLoggedIn: true,
      username: 'Mikosh',
      balance: 500,
    };
  },
  props: ["openedPage", "isLauncherLoading", "sideBar"],
  components: {
    LauncherHeader,
    ModalWindow
  },
  computed: {
    isHeaderSecond() {
      return !this.isLauncherLoading && this.openedPage !== 'GreetingPage' && this.openedPage !== 'LoginPage' && this.openedPage !== 'SelectPaths';
    },
    onButtonClick() {
      return window.modalWindowParams.callback;
    },
    globalBind() {
      return window.modalWindowParams;
    },
    isOpenModal() {
      return window.modalWindowParams.isOpen;
    }
  },
  methods: {
    handleToggleSidebar() {
      this.showSidebar = !this.showSidebar;
      this.$emit('toggle-sidebar');
    },
    handleClose() {
      this.showSidebar = false;
      this.$emit('close-sidebar');
    },
  },
};
</script>
