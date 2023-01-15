import axios from 'axios';
import authHeader from "@/services/auth-header";

const SERVER_PORT = process.env.SERVER_DOCKER_PORT || 3000;
const CHARGE_API = `http://localhost:${SERVER_PORT}/charges`


class ChargeService {
  startCharge(user, station, tower_id) {
    return axios.post(CHARGE_API,
      {
        user: user,
        station: station,
        tower_id: tower_id,
      },
      {headers: authHeader()})
  }

  endCharge(user, batteryLevel) {
    return axios.put(CHARGE_API + '/' + user._id, {batteryLevel: batteryLevel}, {headers: authHeader()})
  }

  getChargeHistory(user_id) {
    return axios.get(CHARGE_API + '/' + user_id, {headers: authHeader()})
  }

}

export default new ChargeService();
