<template>
  <div class="greeting">
    <div class="greeting__head">
      <h1 class="greeting__title">ДОБРО ПОЖАЛОВАТЬ!</h1>
      <p key="desc" class="greeting__subtitle">
        В этом лаунчере вы можете ознакомиться с информацией нашего проекта MIKOSH SBORKA. Вы
        здесь можете купить сборку, запустить её, купить услугу, и т.д. В основном данный лаунчер был сделан для
        удобного
        запуска наших сборок быстро и просто. Устанавливаете сборку в один клик и получаете кайф от приятной игры. Для
        начала зарегистрируйтесь.
      </p>
    </div>
    <div class="greeting__register" key="register">
      <form action="" class="register__form" @submit.prevent="register">
        <div class="register__fields">
          <LauncherInput type="text" v-model="registerData.username" :class="{ 'error-valid': !isUsernameValid }"
            :iconSrc="'https://svgshare.com/i/125s.svg'" :info="usernameInfo" :styles="'width: 470px'" :maxlength="12" />
          <LauncherInput type="password" v-model="registerData.password"
            :class="{ 'error-valid': !registerData.password.length >= 8 }" :iconSrc="'https://svgshare.com/i/1292.svg'"
            :info="passwordInfo" :styles="'width: 470px'" :maxlength="8" />
          <LauncherInput type="text" v-model="registerData.email" :class="{ 'error-valid': !isEmailValid }"
            :iconSrc="'https://svgshare.com/i/128f.svg'" :info="emailInfo" :styles="'width: 470px'" />
        </div>
        <span @click.prevent="loginRoute" class="register__route">У меня уже есть аккаунт</span>
        <LauncherButton type="submit" :disabled="isButtonDisabled" :styles="'width: 470px'">Регистрация</LauncherButton>
      </form>
      <div class="register__oauth">
        <div class="register__oauth-item"><img src="https://svgshare.com/i/126F.svg" alt=""></div>
        <div class="register__oauth-item"><img src="https://i.imgur.com/6l5M6xH.png" alt=""></div>
        <div class="register__oauth-item"><img src="https://svgshare.com/i/129D.svg" alt=""></div>
      </div>
    </div>
  </div>
</template>
<script>
import LauncherInput from "../components/Base/LauncherInput.vue";
import LauncherButton from "../components/Base/LauncherButton.vue";
import { animate, stagger } from 'motion';

export default {
  name: "GreetingPage",
  emits: ["load-launcher"],
  components: {
    LauncherInput,
    LauncherButton,
  },
  data() {
    return {
      registerData: {
        username: "",
        password: "",
        email: "",
      },
      isButtonDisabled: true,
      isEmailValid: true,
      isUsernameValid: true,
      userValidMessage: "",
    };
  },
  computed: {
    usernameInfo() {
      if (!this.isUsernameValid) {
        this.userValidMessage = this.userValidMessage === "" ? 'Логин' : this.userValidMessage;
        return this.userValidMessage;
      }
      return 'Логин';
    },
    passwordInfo() {
      return this.registerData.password.length >= 8 ? 'Макс. символов 8.' : 'Пароль';
    },
    emailInfo() {
      return this.isEmailValid
        ? 'Email'
        : 'Введите корректный email';
    },
  },
  mounted() {
    animate('.greeting__title, .greeting__subtitle, .register__fields, .register__route', { y: [-10, 0], opacity: [0, 100] }, {
      delay: stagger(0.1),
      duration: 1,
      easing: [0.5, 0, 0, 1],
    });
    animate('.greeting__register .launcher-button', { scale: [.95, 1], opacity: [0, 100] }, { duration: 1 });
    animate('.register__oauth', { y: [10, 0], opacity: [0, 100] }, { duration: 1 });
  },
  watch: {
    'registerData.username': {
      handler(newUsername) {
        this.isUsernameValid = this.validateUsername(newUsername);
      },
    },
    'registerData.email': {
      handler(newEmail) {
        this.isEmailValid = this.validateEmail(newEmail);
      },
    },
    registerData: {
      handler(newRegisterData) {
        this.isButtonDisabled = !(newRegisterData.username && newRegisterData.password && newRegisterData.email && this.isUsernameValid && this.isEmailValid);
      },
      deep: true,
    },
  },
  methods: {
    loginRoute: () => window.openPage('LoginPage'),
    async register() {
      if (this.isUsernameValid && this.isEmailValid) {
        const { data, error } = await window.client.sendEvent('register', {
          username: this.registerData.username,
          email: this.registerData.email,
          password: this.registerData.password,
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

          window.log.info('Registration successful!');
        } else if (error) {
          console.log(error);
          if (error.message) {
            window.showModalWindow('Регистрация', 'Произошла ошибка при регистрации', error.message, ['Понял']);
            window.log.error(`[register] Registration error: ${error.message}. Status code: ${error.status}`);
          } else {
            window.showModalWindow('Регистрация', 'Произошла ошибка при регистрации', error, ['Понял']);
            window.log.error(`[register] Registration error: ${error}. Status code: ${error.status}`);
          }
        }
      } else {
        window.showModalWindow('Регистрация', 'Введите корректные данные', 'Имя, пароль или email введены неправильно.\nПожалуйста, проверьте введённые данные и попробуйте снова.', ['Понял']);
      }
    },
    
    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    validateUsername(username) {
      const isDigitOnly = /^\d+$/.test(username);
      const isUpperCase = /^[A-Z]+$/.test(username) && !/[a-z]/.test(username);
      const hasRussianLetters = /[а-яА-Я]/.test(username);
      if (isDigitOnly) this.userValidMessage = "Имя не должно содержать только цифры";
      if (isUpperCase) this.userValidMessage = "Имя не должно быть капсом";
      if (hasRussianLetters) this.userValidMessage = "Имя не должно содержать русские буквы";
      return !isDigitOnly && !isUpperCase && !hasRussianLetters;
    },
  }

}
</script>
<style>
.greeting {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.greeting__head {
  max-width: 820px;
  display: flex;
  flex-direction: column;
  gap: 13px;
  justify-content: center;
  margin-bottom: 25px;
}

.greeting__title {
  font: var(--title-font);
  font-size: 36px;
  text-shadow: var(--default-text-shadow);
}

.greeting__subtitle {
  font: var(--subtitle-font);
  text-shadow: var(--default-text-shadow);
  font-size: 16px;
  line-height: 1.8;
  color: var(--subtitle-color);
}

.register__form {
  display: grid;
}

.register__fields {
  display: grid;
  grid-gap: 30px;
  margin-bottom: 17px;
}

.register__route {
  color: #ffffff80;
  font-size: 18px;
  margin: 0 auto 17px;
  transition: color 0.25s ease-in-out;
  cursor: pointer;
  font-family: var(--manrope-font);
}

.register__route:hover {
  color: #fff;
}

.register__oauth {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-top: 15px;
}

.register__oauth-content {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 18px;
}

.register__oauth-item {
  background: var(--field-bg);
  border: var(--field-border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  opacity: .8;
  transition: .25s ease-out;
}

.register__oauth-item {
  width: 50px;
  height: 50px;
}

.register__oauth-item:hover {
  border: 1px solid rgba(255, 255, 255, 0.342);
}
</style>