<template>
  <div :class="`${pageClass} page`">
    <div class="page__wrapper">
      <div class="page__head">
        <h1 class="page__title">{{ title }}</h1>
        <h1 class="page__subtitle">{{ subtitle }}</h1>
      </div>
      <div class="page__content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'LauncherPage',
  props: ['pageClass', 'title', 'subtitle']
}
</script>
<style>
.page {
  height: 100%;
  padding: 30px 15px 60px;
}

.page__wrapper {
  overflow-x: hidden;
  overflow: auto;
  height: 100%;
  padding: 0 20px;
}

.page__head {
  text-align: center;
  margin-bottom: 40px;
}

.page__title {
  font: var(--title-font);
  font-size: 38px;
  text-shadow: var(--default-text-shadow);
  text-transform: uppercase;
}

.page__subtitle {
  font: var(--subtitle-font);
  font-size: 20px;
  text-shadow: var(--default-text-shadow);
  color: var(--subtitle-color);
}

.page__wrapper::-webkit-scrollbar {
  width: 5px
}

.page__wrapper::-webkit-scrollbar-track {
  background: #282e395e;
  border-radius: 0.5rem;
}

.page__wrapper::-webkit-scrollbar-thumb {
  background: #282e39;
  border-radius: 0.5rem;
}
</style>