import axios from 'axios';
import authHeader from './auth-header';
import {auth} from "@/store/auth.module";

const API_URL = 'http://localhost:3000/api/test/';

class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }

  getUserBoard() {
    console.log("user board")
    return axios.get(API_URL + 'user', { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_URL + 'mod', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + 'admin', { headers: authHeader() });
  }


  getVehicles(user_id){
    return axios.get('http://localhost:3000/api/user/vehicles/'+ user_id, { headers: authHeader() });
  }

  addVehicle(user_id, vehicle){
    console.log(user_id +","+ vehicle)
    return axios
      .post('http://localhost:3000/api/user/addVehicle', {
        user_id: user_id,
        name: vehicle.name,
        vehicleType: vehicle.type,
        icon: vehicle.icon,
        batteryLevel: vehicle.batteryLevel,
        isCharging: vehicle.isCharging,
        isCurrent: vehicle.isCurrent,
      },{ headers: authHeader() })
      .then(response => {
        console.log(response.data)
        return response.data;
      }).catch(function (error){
        console.log(error)
        throw new Error(error.response.data.message)
      });
  }

  // This should return the favourite stations of the user
  getFavouriteStations(user_id){
    return axios.get('http://localhost:3000/api/user/favouriteStations/'+ user_id, { headers: authHeader() });
  }

  addFavouriteStation(user_id, station_id){
    console.log(user_id +","+station_id)
    return axios
      .post('http://localhost:3000/api/user/addFavouriteStation', {
        user_id: user_id,
        station_id: station_id,
        img:""
      },{ headers: authHeader() })
      .then(response => {
        console.log(response.data)
        return response.data;
      }).catch(function (error){
        console.log(error)
        throw new Error(error.response.data.message)
      });
  }

  removeFavouriteStation(user_id, station_id){
    console.log(user_id +","+station_id)
    return axios
      .post('http://localhost:3000/api/user/removeFavouriteStation', {
        user_id: user_id,
        station_id: station_id,
        img:""
      },{ headers: authHeader() })
      .then(response => {
        console.log(response.data)
        return response.data;
      }).catch(function (error){
        console.log(error)
        throw new Error(error.response.data.message)
      });
  }
}

export default new UserService();
