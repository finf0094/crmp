<template>
  <button class="launcher-button" :style="styles" type="button" v-bind="$attrs">
    <slot></slot>
  </button>
</template>
    
<script>
export default {
  name: "LauncherButton",
  props: ["styles"],
};
</script>
    
<style>
.launcher-button {
  color: #fff;
  border-radius: 10px;
  border: var(--field-border);
  font-family: var(--raleway-font);
  background: rgba(204, 204, 204, 0.05);
  backdrop-filter: blur(5px);
  font-size: 22px;
  padding: 14px 0;
  cursor: pointer;
  transition: background .3s ease-in-out, color .3s ease-in-out, border .3s ease-in-out, box-shadow .3s ease-in-out;
}

.launcher-button:hover {
  background: #fff;
  color: #000;
  border: 1px solid transparent;
  box-shadow: 0 0 25px 0 #ffffff59;
  opacity: 1;
}

.launcher-button:active {
  background: #fafafa;
  color: #1a1a1a;
}

.launcher-button:active path {
  stroke: black;
}

.launcher-button:disabled {
  opacity: .8;
  color: rgba(255, 255, 255, 0.26);
  cursor: not-allowed;
}

.launcher-button:disabled:hover {
  background: rgba(204, 204, 204, 0.05);
  color: rgba(255, 255, 255, 0.26);
  border: var(--field-border);
  box-shadow: none;
}
</style>
    