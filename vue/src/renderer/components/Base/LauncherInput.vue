<template>
  <div class="launcher-input" :style=styles>
    <div class="launcher-input__inner">
      <div class="launcher-input__icon">
        <img :src="iconSrc" alt="">
      </div>
      <div class="launcher-input__content">
        <input name="launcherInput" required @input="$emit('update:model-value', $event.target.value)" :value="modelValue"
          v-bind="$attrs" />
        <transition name="info-fade" mode="out-in">
          <label :key="info" for="launcherInput" class="launcher-input__placeholder">{{ info }}</label>
        </transition>
      </div>
    </div>
  </div>
</template>
    
<script>
export default {
  name: "LauncherInput",
  emits: ["update:model-value"],
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    iconSrc: {
      type: String,
      default: "https://svgshare.com/i/12Bx.svg",
    },
    info: {
      type: String,
      default: "Введите значение",
    },
    styles: {
      type: String,
      default: "",
    },
  },
};
</script>
    
<style scoped>
.launcher-input {
  border-radius: 10px;
  color: #fff;
  border: var(--field-border);
  background: var(--field-bg);
  backdrop-filter: var(--bg-blur);
  display: flex;
  align-items: center;
  padding: 15px;
  transition: .25s ease-in-out;
}

.launcher-input__inner {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 15px;
}

.launcher-input__content {
  display: grid;
  grid-gap: 3px;
  width: 100%;
  position: relative;
}

.launcher-input__placeholder {
  color: #ffffff80;
  font-size: 19px;
  text-align: left;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  transition: .5s cubic-bezier(0.5, 0, 0, 1) 0s;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
  font-family: var(--raleway-font);
}

.launcher-input input {
  width: 100%;
  height: 100%;
  background: none;
  font-size: 17px;
  outline: none;
  border: none;
  transition: .5s cubic-bezier(0.5, 0, 0, 1) 0s;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.launcher-input input:focus~label,
.launcher-input input:valid~label {
  font-size: 15px;
  transform: translateY(-20px);
}

.launcher-input input:focus,
.launcher-input input:valid {
  transform: translateY(10px);
}

.launcher-input input::placeholder {
  font-family: var(--raleway-font);
}

.launcher-input input,
.launcher-input input::placeholder {
  color: #fff;
}

.launcher-input__icon {
  width: 55px;
  height: 50px;
  border-radius: 6px;
  border: var(--field-border);
  background: var(--field-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: .25s ease-in-out;
}

.error-valid .launcher-input__placeholder {
  color: #df1e40;
  font-weight: 600;
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
    