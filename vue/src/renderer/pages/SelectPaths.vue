<template>
  <div class="select">
    <div class="select__head">
      <h1 class="select__title">УКАЖИТЕ ПУТИ</h1>
      <p class="select__subtitle">Автоматически подобранные пути к игре и лаунчеру RADMIR не совпадают с настоящими. Проверьте их и исправьте пути</p>
    </div>
    <div class="select__content">
      <LauncherInput type="text" v-model="$store.state.config.radmirLauncherPath" readonly :iconSrc="'https://svgshare.com/i/12Kp.svg'" :info="'Путь к Radmir Launcher'" :styles="'width: 680px'" />
      <LauncherInput type="text" v-model="$store.state.config.sampPath" readonly :iconSrc="'https://svgshare.com/i/12Kp.svg'" :info="'Путь к игре'" :styles="'width: 680px'" />

      <LauncherButton :disabled="isSelectingPath" @click.prevent="onBtnClick">{{ buttonText }}</LauncherButton>
    </div>
  </div>
</template>
<script>
import LauncherInput from "../components/Base/LauncherInput.vue";
import LauncherButton from "../components/Base/LauncherButton.vue";
import { animate, stagger } from 'motion';

export default {
  name: 'SelectPaths',
  components: {
    LauncherInput,
    LauncherButton,
  },
  data() {
    return {
      isSelectingPath: false,
    }
  },
  computed: {
    buttonText() {
      if (this.isSelectingPath) {
        return "Выбор пути...";
      } else if (this.$store.state.config.radmirLauncherPath === "" || this.$store.state.config.radmirLauncherPath === null) {
        return "Выбрать путь (Radmir Launcher)";
      } else if ((this.$store.state.config.sampPath === "" || this.$store.state.config.sampPath === null) && (this.$store.state.config.radmirLauncherPath !== "" || this.$store.state.config.radmirLauncherPath !== null)) {
        return "Выбрать путь (Игра)";
      } else if ((this.$store.state.config.sampPath !== "" || this.$store.state.config.sampPath !== null) && (this.$store.state.config.radmirLauncherPath !== "" || this.$store.state.config.radmirLauncherPath !== null)) {
        return "Сохранить";
      }

      
    }
  },
  watch: {
    buttonText: {
      handler(newButtonText) {
        this.buttonText = newButtonText;
      },
    },
  },
  mounted() {
    animate('.select__title, .select__subtitle, .select__content, .select button', { y: [-10, 0], opacity: [0, 100] }, {
      delay: stagger(0.15),
      duration: .7,
      easing: [0.5, 0, 0, 1],
    });
  },
  methods: {
    async onBtnClick() {
      if (this.isSelectingPath) {
        return;
      }

      if (this.$store.state.config.radmirLauncherPath === "" || this.$store.state.config.radmirLauncherPath === null) {
        await this.setRadmirLauncherPath();
        window.log.info("Radmir Launcher path: " + this.$store.state.config.radmirLauncherPath);
      } else if ((this.$store.state.config.sampPath === "" || this.$store.state.config.sampPath === null) && (this.$store.state.config.radmirLauncherPath !== "" || this.$store.state.config.radmirLauncherPath !== null)) {
        await this.setSampPath();
      } else if ((this.$store.state.config.sampPath !== "" || this.$store.state.config.sampPath !== null) && (this.$store.state.config.radmirLauncherPath !== "" || this.$store.state.config.radmirLauncherPath !== null)) {
        await this.submit();
      }
    },
    async setSampPath() {
      this.isSelectingPath = true;
      await window.selectSampPath();
      this.isSelectingPath = false;
    },
    async setRadmirLauncherPath() {
      this.isSelectingPath = true;
      await window.selectRLPath();
      this.isSelectingPath = false;
    },
    async submit() {
      window.saveConfig();
      window.loadLauncher();
    }
  }
}
</script>
<style>
.select {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.select__head {
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  margin-bottom: 30px;
}

.select__title {
  font: var(--title-font);
  text-shadow: var(--default-text-shadow);
}

.select__subtitle {
  font: var(--subtitle-font);
  text-shadow: var(--default-text-shadow);
  font-size: 18px;
  line-height: 1.8;
  color: var(--subtitle-color);
}

.select__content {
  display: grid;
  grid-gap: 30px;
  margin-bottom: 30px;
}

.select .launcher-input__placeholder {
  font-size: 15px;
  transform: translateY(-20px);
}

.select .launcher-input input {
  transform: translateY(10px);
}

.select .launcher-button {
  width: auto;
  margin: 15px auto 0;
  padding: 15px 40px;
}
</style>