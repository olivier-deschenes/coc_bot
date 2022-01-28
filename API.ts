import axios from 'axios';
import {Player} from './types/coc';

const api = axios.create({
  baseURL: 'https://api.clashofclans.com',
  headers: {Authorization: `Bearer ${process.env.COC_API}`},
  validateStatus: function(status) {
    return status >= 200 && status < 400;
  },
});

const verifyPlayer = async (playerTag: String, token: String) => {
  return (await api.post(
      `/v1/players/%23${playerTag}/verifytoken`,
      {
        token: token,
      }
  )).data;
};

const getPlayerInfo = async (playerTag: String): Promise<Player> => {
  return (await api.get(`/v1/players/%23${playerTag}`)).data;
};

export {verifyPlayer, getPlayerInfo};
