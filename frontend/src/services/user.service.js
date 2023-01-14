import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:3000/users/';

class UserService {

  getVehicles(user_id) {
    return axios.get(API_URL + user_id + '/vehicles/', {headers: authHeader()});
  }

  addVehicle(user_id, vehicle) {
    return axios.post(API_URL + user_id + '/vehicles', vehicle, {headers: authHeader()})
  }

  removeVehicle(user_id, vehicle_id) {
    return axios.delete(API_URL + user_id + '/vehicles/' + vehicle_id, {headers: authHeader()})
  }

  updateVehicle(user_id, vehicle) {
    return axios.put(API_URL + user_id + '/vehicles/' + vehicle._id, {vehicle}, {headers: authHeader()})
  }

  getFavouriteStations(user_id) {
    return axios.get(API_URL + user_id + '/favouriteStations/', {headers: authHeader()});
  }

  getState(user_id) {
    return axios.get(API_URL + user_id, {headers: authHeader()});
  }

  addFavouriteStation(user_id, station_id) {
    return axios.post(API_URL + user_id + '/favouriteStations/', { station_id: station_id }, {headers: authHeader()})
  }

  removeFavouriteStation(user_id, station_id) {
    return axios.delete(API_URL + user_id + '/favouriteStations/' + station_id, {headers: authHeader()})
  }

  updateProfile(user_id, username, email, profilePicture) {
    return axios
      .put(API_URL + user_id, {
        username: username,
        email: email,
        profilePicture: profilePicture,
      }, {headers: authHeader()})
  }

  setShowOnlyFavourites(user_id, showOnlyFavourites) {
    return axios
      .put(API_URL + user_id, {
        showOnlyFavourites: showOnlyFavourites,
      }, {headers: authHeader()})
  }


}

export default new UserService();
