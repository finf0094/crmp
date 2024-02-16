<template>
  <div class="review">
    <div class="review__head">
      <div class="review__user-info">
        <img src="https://svgshare.com/i/12Tx.svg" alt="" class="review__icon">
        <div class="review__info">
          <span class="review__info-name">{{ username }}</span>
          <span class="review__info-date">{{ date }}</span>
        </div>
      </div>
      <div class="review__product">{{ product }}</div>
    </div>
    <p class="review__message">{{ message }}</p>
  </div>
</template>
<script>
export default {
  props: ["username", "date", "product", "message"]
}
</script>
<style>
.review {
  max-width: calc(100vw - 74px);
  background: var(--field-bg);
  border: var(--field-border);
  border-radius: 15px;
  padding: 15px 17px;
}

.review__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 10px;
  border-bottom: 1px solid #ffffff1a;
}

.review__user-info {
  display: flex;
  align-items: center;
  gap: 5px;
}

.review__info {
  display: grid;
}

.review__info-name {
  font-size: 19px;
}

.review__info-date {
  color: rgba(255, 255, 255, 0.70);
  font-size: 16px;
  font-weight: 300;
}

.review__product {
  border-radius: 5px;
  background: rgba(149, 149, 149, 0.20);
  padding: 7px 13px;
  font-size: 14px;
  font-weight: 500;
  font-family: var(--raleway-font);
}

.review__message {
  padding-top: 15px;
  color: #C8C8C8;
  font-size: 16px;
  line-height: 1.5;
  word-wrap: break-word;
}
</style>