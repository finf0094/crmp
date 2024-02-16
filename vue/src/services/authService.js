// authService.js
import axios from 'axios';
import store from '../store/index';
import log from 'electron-log';
import constants from '@/constants/constants';

const apiUrl = constants.serverUrl;

const baseQuery = async (args, extraOptions = {}) => {
  const options = {
    ...extraOptions,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${store.state.access_token}`,
      ...(extraOptions.headers || {}),
    },
  };

  try {
    const response = await axios(args, options);
    return { data: response.data };
  } catch (error) {
    return { error: error.response.data };
  }
};

const authService = {
  async login(body) {
    const { data, error } = await baseQuery({
      url: `${apiUrl}/auth/login`,
      method: 'POST',
      data: body,
    });

    log.info(data);

    if (error) {
      log.error('Login error: ', JSON.stringify(error));
    }

    return { data, error };
  },

  async register(body) {
    const { data, error } = await baseQuery({
      url: `${apiUrl}/auth/register`,
      method: 'POST',
      data: body,
    });

    log.info(body);

    if (data) {
      const userData = await this.login({ username: body.username, SID: body.SID, password: body.password });
      return userData;
    }

    return { data, error };
  },
};

export default authService;
