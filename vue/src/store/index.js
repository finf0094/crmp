import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      config: {
        auth: {
          user: {
            username: "" | null,
            email: "",
            roles: [],
          },
          accessToken: "",
          refreshToken: "",
          isAuthenticated: false,
        },
        favouriteGames: [],
        lang: "ru",
        sampPath: "",
        radmirLauncherPath: "",
        SID: "",
        isFirstLaunch: true,
      },
      popularProducts: [
        {
          name: "Black Capture",
          rating: 3,
          id: "black-capture",
          imageUrl: "https://i.imgur.com/zcBnj9d.png",
          downloads: 192,
        },
        {
          name: "Black Capture",
          rating: 3,
          id: "black-capture",
          imageUrl: "https://i.imgur.com/zcBnj9d.png",
          downloads: 192,
        },
        {
          name: "Black Capture",
          rating: 3,
          id: "black-capture",
          imageUrl: "https://i.imgur.com/zcBnj9d.png",
          downloads: 192,
        },
        {
          name: "Black Capture",
          rating: 3,
          id: "black-capture",
          imageUrl: "https://i.imgur.com/zcBnj9d.png",
          downloads: 192,
        },
      ],
      reviews: [
        {
          id: "1",
          username: "Mikosh2010",
          date: "24 января 2024 года в 13:41",
          product: "Black Capture",
          message: "Это мой новый отзыв. Ваш проект самый лучший на свете!",
        },
        {
          id: "2",
          username: "User123",
          date: "24 января 2024 года в 13:41",
          product: "Cyber Radmir",
          message: "Это мой новый отзыв. Ваш проект самый лучший на свете!",
        },
        {
          id: "3",
          username: "Askhat2008",
          date: "24 января 2024 года в 13:41",
          product: "Space One",
          message: "Это мой новый отзыв. Ваш проект самый лучший на свете!",
        },
      ],
      langs: [
        {
          value: "ru",
          label: "Русский",
        },
        {
          value: "en",
          label: "English",
        },
        {
          value: "ua",
          label: "Українська",
        },
      ],
      launcherInfo: {
        products: [
          {
            id: "product-JDqrGia",
            product_id: "black-capture",
            name: "Black Capture",
            db_id: "blackCapture",
            is_free: false,
            is_private: false,
            product_url: "https://mikosh-sborka.com/black-capture",
            path_to_html: "black-capture/hudAssets/index.html",
            path_to_css: "black-capture/hudAssets/style.css",
            path_to_js: "black-capture/script.js",
            price: 300,
            profiles: [
              {
                id: "profile-rXOcH3R",
                name: "Новый профиль",
                parts: [
                  {
                    id: "part-eetW_BY",
                    name: "Новая часть",
                    description:
                      "Новая частьНовая частьНовая частьНовая частьНовая часть",
                    state: false,
                    plugins: [
                      {
                        id: "part-plugin-OiMsFll",
                        plugin_id: "Zmai0Y9lCcYmF1bA_Jcr6",
                        is_hidden: false,
                        state: "off",
                      },
                    ],
                  },
                ],
              },
            ],
            store_url: "https://i.imgur.com/UDhct5b.png",
            library_url: "https://i.imgur.com/uKbpYLW.png",
          },
          {
            id: "product-jEB5Gr1",
            product_id: "cyber-radmir",
            name: "Cyber Radmir",
            db_id: "cyberRadmir",
            is_free: true,
            is_private: false,
            product_url: "https://mikosh-sborka.com/cyber-radmir",
            path_to_html: "cyber-radmir/hudAssets/index.html",
            path_to_css: "cyber-radmir/hudAssets/style.css",
            path_to_js: "cyber-radmir/script.js",
            price: 0,
            profiles: [],
            store_url: "https://i.imgur.com/b1gN4gC.png",
            library_url: "https://i.imgur.com/MKYpVAz.png",
          },
          {
            id: "product-5VQj3Hy",
            product_id: "space-one",
            name: "Space One",
            db_id: "spaceOne",
            is_free: false,
            is_private: false,
            product_url: "https://mikosh-sborka.com/space-one",
            path_to_html: "space-one/hudAssets/index.html",
            path_to_css: "space-one/hudAssets/style.css",
            path_to_js: "space-one/script.js",
            price: 400,
            profiles: [],
            store_url: "https://i.imgur.com/MrSehax.png",
            library_url: "https://i.imgur.com/FHEpkAS.png",
          },
          {
            id: "product-JdPA8dx",
            product_id: "blue-darkness",
            name: "Blue Darkness",
            db_id: "blueDarkness",
            is_free: false,
            is_private: false,
            product_url: "https://mikosh-sborka.com/blue-darkness",
            path_to_html: "blue-darkness/hudAssets/index.html",
            path_to_css: "blue-darkness/hudAssets/style.css",
            path_to_js: "blue-darkness/script.js",
            price: 400,
            profiles: [],
            store_url: "https://i.imgur.com/MrSehax.png",
            library_url: "https://i.imgur.com/FHEpkAS.png",
          },
        ],
        plugins: [
          {
            id: "Zmai0Y9lCcYmF1bA_Jcr6",
            name: "Новый плагин",
            preview_url: "",
            product_url: "",
            description: "asdasdasdsadsad",
            type: 0,
            is_dangerous: false,
            is_subplugin: false,
            download_link: "",
            path_in_cloud: "",
            build: 0,
            archive_password: "",
            archive_hash: "",
            game_id: "",
            is_group_child: false,
            files: [],
            subplugins: [],
          },
        ],
        launcher_version: "",
      },
      gameState: {
        id: "",
        status: "none",
        isInstalled: false,
      },
      boughtGames: {},
    };
  },
  mutations: {
    setConfig(state, config) {
      state.config = config;
    },
    setLauncherInfo(state, launcherInfo) {
      state.launcherInfo = launcherInfo;
    },
    setBoughtGames(state, data) {
      const res = {};

      for (const game of data) {
        if (!Object.keys(res).includes(game.name)) {
          res[game.name] = [];
        }

        res[game.name].push(game.id);
      }

      state.boughtGames = res;
    },
    setFavouriteGames(state, data) {
      state.config.favouriteGames = data;
    },
    setProducts(state, products) {
      state.productsInfo.products = products;
    },
    setGameState(state, { id, status, isInstalled }) {
      state.gameState.id = id;
      state.gameState.status = status;
      if (typeof isInstalled !== "undefined")
        state.gameState.isInstalled = isInstalled;
    },

    setSampPath(state, path) {
      state.config.sampPath = path;
    },
    setRadmirLauncherPath(state, path) {
      state.config.radmirLauncherPath = path;
    },

    setUserData(state, userData) {
      state.config.auth.user = userData;
    },
    setAccessToken(state, token) {
      state.config.auth.accessToken = token;
    },
    setRefreshToken(state, token) {
      state.config.auth.refreshToken = token;
    },
    setIsAuthenticated(state, bool) {
      state.config.isAuthenticated = bool;
    },
    setRoles(state, roles) {
      state.config.auth.user.roles = roles;
    },
    logOut(state) {
      state.config.auth.user = {
        username: "" | null,
        email: "",
        roles: [],
      };
      state.config.auth.accessToken = "";
      state.config.auth.refreshToken = "";
      state.config.isAuthenticated = false;
      state.config.isFirstLaunch = true;
    },
    
    setLang(state, lang) {
      state.config.lang = lang;
    },

    setSID(state, SID) {
      state.config.SID = SID;
    },

    setIsFirstLaunch(state, bool) {
      state.config.isFirstLaunch = bool;
    },
  },
  getters: {
    allGames(state) {
      return {
        names: state.launcherInfo.products.map((game) => game.name),
        id: state.launcherInfo.products.map((game) => game.id),
        db_id: state.launcherInfo.products.map((game) => game.db_id),
      };
    },
    boughtGames(state) {
      return state.launcherInfo.products
        .filter(
          (game) =>
            !game.is_free &&
            !game.is_private &&
            Object.keys(state.boughtGames).includes(game.db_id)
        )
        .map((game) => game.id);
    },
    freeGames(state) {
      return state.launcherInfo.products
        .filter((game) => game.is_free && !game.is_private)
        .map((game) => game.id);
    },
    privateGames(state) {
      return state.launcherInfo.products
        .filter((game) => !game.is_free && game.is_private)
        .map((game) => game.id);
    },
    installedGame(state) {
      return state.launcherInfo.products[0];
    },
    popularProducts(state) {
      return state.popularProducts;
    },
  },
});

export default store;
