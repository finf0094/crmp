<template>
  <div className='not-found page'>
    <h1>4<span>0</span>4</h1>
    <h2 className='desc__title'>Данная страница не была найдена.</h2>
    <p className='desc__subtitle'>Возможно, страница еще в разработке.</p>
    <span @click.prevent="goHome" className='home__link'>На главную</span>
  </div>
</template>
<script>
export default {
  name: 'NotFoundPage',
  methods: {
    goHome: () => window.openPage('HomePage')
  }
}
</script>
<style>
.not-found {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.not-found h1 {
  color: var(--heading);
  font-size: 12.5rem;
  text-shadow: 0.05em 0.05em 0 rgba(0, 0, 0, 0.25);
  white-space: nowrap;
}

.not-found h2 {
  color: var(--heading);
  font-size: 26px;
  margin-top: 15px;
  font-family: var(--manrope-font);
}

.not-found p {
  color: #ccc;
  margin: 0;
  margin-bottom: 45px;
  font-size: 22px;
  font-family: var(--manrope-font);
}

.home__link {
  background: var(--field-bg);
  border: var(--field-border);
  backdrop-filter: var(--bg-blur);
  padding: 15px 35px;
  text-transform: uppercase;
  font-weight: 600;
  color: #fff;
  border-radius: 30px;
  font-size: 16px;
  cursor: pointer;
  transition: .25s ease-in-out;
}

.home__link:hover {
  background: #fff;
  color: #000;
}

</style>