<template>
  <div class="modal-window">
    <div class="modal-window__bg"></div>

    <div class="modal-window__content">
      <div class="modal-window__head">
        <div class="modal-window__title">{{ title }}</div>
        <div class="modal-window__subtitle">{{ subTitle }}</div>
      </div>
      <div class="modal-window__data">
        <LauncherInput type="text" :info="placeholder" v-if="useInput" v-model="inputValue" :styles="'width: 470px'" />
        <div v-else class="modal-window__data-text" v-html="message"></div>
      </div>
      <div class="modal-window__buttons">
        <LauncherButton :class="{ 'modal-window__button': buttons.length > 2 }" :styles="'width: calc(100% + 30px)'"
          @click.prevent="callback(index, inputValue)" style v-for="(button, index) in buttons" :key="button">{{ button }}
        </LauncherButton>
      </div>
    </div>
  </div>
</template>
  
<script>
import LauncherInput from "./Base/LauncherInput.vue";
import LauncherButton from "./Base/LauncherButton.vue";

export default {
  name: "ModalWindow",
  components: {
    LauncherInput,
    LauncherButton,
  },
  emits: ["on-button-click"],
  props: {
    useInput: {
      type: Boolean,
      default: false,
    },
    buttons: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: "",
    },
    subTitle: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    message: {
      type: String,
      default: "",
    },
    callback: {
      type: Function,
      dafault: () => { },
    },
  },
  data() {
    return {
      inputValue: "",
    };
  },
};
</script>
  
<style>
.modal-window {
  position: absolute;
  z-index: 10;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  text-align: center;
}

.modal-window__subtitle {
  color: rgba(255, 255, 255, 0.60);
  text-shadow: var(--default-text-shadow);
}

.modal-window__button {
  padding: 0 25px;
  flex-grow: 1;
}

.modal-window__bg {
  background: #00000059;
  position: absolute;
  border-radius: 20px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}

.modal-window__content {
  padding: 30px 40px;
  background: var(--field-bg);
  backdrop-filter: blur(5px);
  border: var(--field-border);
  border-radius: 20px;
  box-shadow: 0px 0px 50px 0px rgba(0, 0, 0, 0.50);
  display: flex;
  flex-direction: column;
  gap: 1.563rem;
  transition: .25s ease-in-out;
}

.modal-window__title {
  text-shadow: var(--default-text-shadow);
  text-transform: uppercase;
  font-size: 40px;
  font-style: normal;
  font-weight: 700;
}

.modal-window__data-text {
  text-shadow: var(--default-text-shadow);
  line-height: 1.5;
  font-weight: 400;
  font-size: 1rem;
  white-space: pre-line;
  max-height: 19.475rem;
  overflow: auto;
}

.modal-window__data-text::-webkit-scrollbar {
  width: 0.3rem;
}

.modal-window__data-text::-webkit-scrollbar-track {
  background: rgba(250, 250, 250, 0.2);
  border-radius: 0.5rem;
}

.modal-window__data-text::-webkit-scrollbar-thumb {
  background: rgba(250, 250, 250, 0.8);
  border-radius: 0.5rem;
}

.modal-window__buttons {
  display: flex;
  gap: 1.25rem;
  justify-content: center;
}
</style>
  