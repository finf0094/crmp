<template>
  <div class="login">
    <div class="login__wrapper">
      <div class="login__head">
        <h1 class="login__title">АВТОРИЗАЦИЯ</h1>
        <p class="login__subtitle">Добро пожаловать в MIKOSH SBORKA</p>
      </div>
      <form class="login__form" @submit.prevent="login">
        <div class="login__fields">
          <LauncherInput 
            type="text" 
            v-model="loginData.username" 
            :iconSrc="'https://svgshare.com/i/125s.svg'" 
            :class="{ 'error-valid': errorMessage.includes('Пользователь') }"
            :info="usernameValidMessage" 
            :styles="'width: 470px'" />
          <LauncherInput 
            type="password" 
            v-model="loginData.password" 
            :iconSrc="'https://svgshare.com/i/1292.svg'" 
            :class="{ 'error-valid': errorMessage.includes('Пароль') }" 
            :info="passwordValidMessage" 
            :styles="'width: 470px'"
            :maxlength="8" />
        </div>
        <div class="login__links">
          <span @click.prevent="forgotPass" class="login__link">Я забыл свой пароль</span>
          <span @click.prevent="openGreetingPage" class="login__link">У меня нету аккаунта</span>
        </div>
        <LauncherButton type="submit" :styles="'width: 470px'" :disabled="!isButtonDisabled">Войти</LauncherButton>
      </form>
      <div class="login__oauth">
        <div class="login__oauth-head">
          <div class="divider first"></div>
          <span>или</span>
          <div class="divider second"></div>
        </div>
        <div class="login__oauth-content">
          <div class="login__oauth-item"><img src="https://svgshare.com/i/126F.svg" alt=""></div>
          <div class="login__oauth-item"><img src="https://i.imgur.com/6l5M6xH.png" alt=""></div>
          <div class="login__oauth-item"><img src="https://svgshare.com/i/129D.svg" alt=""></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LauncherInput from "../components/Base/LauncherInput.vue";
import LauncherButton from "../components/Base/LauncherButton.vue";
import { animate, stagger } from 'motion';

export default {
  name: "LoginPage",
  components: {
    LauncherInput,
    LauncherButton,
  },
  data() {
    return {
      loginData: {
        username: "",
        password: "",
      },
      errorMessage: "",
      isButtonDisabled: true,
    };
  },
  mounted() {
    animate('.login__head, .login__fields .launcher-input, .login__links, .login button, .login__oauth', { y: [-25, 0], opacity: [0, 100] }, {
      delay: stagger(0.15),
      duration: 1,
      easing: [0.5, 0, 0, 1],
    });
  },
  computed: {
    usernameValidMessage() {
      if (this.errorMessage.includes('Пользователь')) {
        return this.errorMessage;
      }

      return 'Логин';
    },
    passwordValidMessage() {
      if (this.errorMessage.includes('Пароль')) {
        return this.errorMessage;
      }

      return 'Пароль';
    },
    isButtonDisabled() {
      return this.loginData.username.length > 0 && this.loginData.password.length > 0
    }
  },
  methods: {
    async login() {
      try {
        const { data, error } = await window.client.sendEvent('login', {
          username: this.loginData.username,
          password: this.loginData.password,
          SID: this.$store.state.config.SID,
        });

        if (data) {
          this.$store.commit('setIsFirstLaunch', false);
          this.$store.commit('setIsAuthenticated', true);
          this.$store.commit('setUserData', data.userInfo);
          this.$store.commit('setAccessToken', data.access_token);
          this.$store.commit('setRefreshToken', data.refresh_token);
          
          await window.saveConfig();
          await window.loadLauncher();

          window.log.info('Login successful!');
        } else if (error.message) {
            this.errorMessage = error.message;
            window.log.error(`[register] Registration error: ${error.message}. Status code: ${error.status}`);
          } else {
            window.showError(error);
            window.log.error(`[register] Registration error: ${error}. Status code: ${error.status}`);
          }
      } catch (error) {
        if (error.message) window.showError(error.message);
        else window.showError(error);
      }

    },
    forgotPass: () => window.client.sendEvent("openLink", "http://localhost:3000/forgot-password"),
    openGreetingPage: () => window.openPage('GreetingPage')
  },
};
</script>

<style>
.login {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login__wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.login__head {
  margin-bottom: 35px;
}

.login__title {
  font: var(--title-font);
  text-shadow: var(--default-text-shadow);
  font-size: 48px;
}

.login__subtitle {
  font: var(--subtitle-font);
  text-shadow: var(--default-text-shadow);
  color: var(--subtitle-color);
  font-size: 17px;
}

.login__fields {
  display: grid;
  grid-gap: 30px;
}

.login__links {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
}

.login__link {
  color: #ffffff80;
  cursor: pointer;
  font-weight: 300;
  font-family: var(--manrope-font);
  transition: color .25s ease-in-out;
}

.login__link:hover {
  color: #fff;
}

.login__form {
  display: grid;
}

.login__fields {
  display: grid;
  grid-gap: 30px;
  margin-bottom: 17px;
}

.login__route:hover {
  color: #fff;
}

.login__oauth {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin: 24px auto 0;
}

.login__oauth-head {
  width: 270px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  white-space: nowrap;
  transition: width 1s cubic-bezier(0.5, 0, 0, 1) 0s;
}

.login__oauth-head .divider {
  width: 100%;
  border: 1px solid #ffffff1a;
  margin-top: 5px;
}

.login__oauth-head span {
  font-size: 20px;
  color: #ffffff49;
  font-family: var(--manrope-font);
}

.login__oauth-content {
  display: flex;
  align-items: center;
  gap: 18px;
}

.login__oauth-item {
  background: var(--field-bg);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  opacity: .8;
}

.login__oauth-item,
.login__oauth-item:after {
  width: 50px;
  height: 50px;
}

.login__oauth-item:after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  border: 1px solid #ffffff11;
  border-radius: 50%;
  transition: all .2s ease
}

.login__oauth-item:hover {
  box-shadow: 0 0 25px 0px rgba(73, 73, 73, 0.253);
  opacity: 1;
  transform: scale(.9) !important;
}

.login__oauth-item:hover:after {
  transform: scale(1.4);
}
</style>
