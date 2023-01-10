import axios from 'axios';
import authHeader from './auth-header';
import {auth} from "@/store/auth.module";

const SERVER_PORT = process.env.SERVER_DOCKER_PORT || 3000;

const USER_API = `http://localhost:${SERVER_PORT}/api/user/`;

class UserService {

  getVehicles(user_id){
    return axios.get(USER_API+'vehicles/'+ user_id, { headers: authHeader() });
  }

  getVehicle(user_id, vehicle_id){
    return axios.get(USER_API + user_id + '/vehicles/' + vehicle_id, { headers: authHeader() });
  }

  addVehicle(user_id, vehicle){
    console.log(user_id +","+ vehicle)
    return axios
      .post(USER_API + 'addVehicle', {
        user_id: user_id,
        name: vehicle.name,
        vehicleType: vehicle.type,
        img: vehicle.img,
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

  removeVehicle(user_id, vehicle_id) {
    console.log(user_id + "," + vehicle_id)
    return axios
      .post(USER_API+ 'removeVehicle', {
        user_id: user_id,
        vehicle_id: vehicle_id,
      }, {headers: authHeader()})
      .then(response => {
        console.log(response.data)
        return response.data;
      }).catch(function (error) {
        console.log(error)
        throw new Error(error.response.data.message)
      });
  }

  updateVehicle(user_id, vehicle) {
    console.log(user_id , vehicle)
    return axios
      .post( USER_API + 'setVehicleInUse', {
        user_id: user_id,
        vehicle_id: vehicle._id,
        name: vehicle.name,
        vehicleType: vehicle.vehicleType,
        img: vehicle.img,
        batteryLevel: vehicle.batteryLevel,
        isCharging: vehicle.isCharging,
        isCurrent: vehicle.isCurrent,
      }, {headers: authHeader()})
      .then(response => {
        console.log(response.data)
        return response.data;
      }).catch(function (error) {
        console.log(error)
        throw new Error(error.response.data.message)
      });
  }

    // This should return the favourite stations of the user
  getFavouriteStations(user_id){
    return axios.get(USER_API + 'favouriteStations/'+ user_id, { headers: authHeader() });
  }

  getState(user_id){
    return axios.get(USER_API + 'state/'+ user_id, { headers: authHeader() });
  }

  addFavouriteStation(user_id, station_id){
    console.log(user_id +","+station_id)
    return axios
      .post(USER_API + 'addFavouriteStation', {
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
      .post(USER_API + 'removeFavouriteStation', {
        user_id: user_id,
        station_id: station_id,
        img:""
      },{ headers: authHeader() })
      .then(response => {
        console.log(response.data)
        return response.data;
      }).catch(function (error){
        console.log(error)
        throw new Error(error.response.data)
      });
  }

  updateProfile(user_id, username, email, profilePicture){
    return axios
      .post('http://localhost:3000/api/user/updateProfile', {
        user_id: user_id,
        username: username,
        email: email,
        profilePicture: profilePicture,
      },{ headers: authHeader() })
      .then(response => {
        console.log(response.data)
        return response.data;
      }).catch(function (error){
        console.log(error)
        throw new Error(error.response.data)
      });
  }

}

export default new UserService();
