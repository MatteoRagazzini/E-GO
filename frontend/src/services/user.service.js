import axios from 'axios';
import authHeader from './auth-header';

const SERVER_PORT = process.env.SERVER_DOCKER_PORT || 3000;
const USER_API = `http://localhost:${SERVER_PORT}/users`;

class UserService {

  getVehicles(user_id) {
    return axios.get(USER_API + user_id + '/vehicles/', {headers: authHeader()});
  }

  addVehicle(user_id, vehicle) {
    return axios.post(USER_API + user_id + '/vehicles', vehicle, {headers: authHeader()})
  }

  removeVehicle(user_id, vehicle_id) {
    return axios.delete(USER_API + user_id + '/vehicles/' + vehicle_id, {headers: authHeader()})
  }

  updateVehicle(user_id, vehicle) {
    return axios.put(USER_API + user_id + '/vehicles/' + vehicle._id, {vehicle}, {headers: authHeader()})
  }

  getFavouriteStations(user_id) {
    return axios.get(USER_API + user_id + '/favouriteStations/', {headers: authHeader()});
  }

  getState(user_id) {
    return axios.get(USER_API + user_id, {headers: authHeader()});
  }

  addFavouriteStation(user_id, station_id) {
    return axios.post(USER_API + user_id + '/favouriteStations/', { station_id: station_id }, {headers: authHeader()})
  }

  removeFavouriteStation(user_id, station_id) {
    return axios.delete(USER_API + user_id + '/favouriteStations/' + station_id, {headers: authHeader()})
  }

  updateProfile(user_id, username, email, profilePicture) {
    return axios
  }
}

export default new UserService();
