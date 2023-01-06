import axios from 'axios';
import authHeader from "@/services/auth-header";

const API_URL = 'http://localhost:3000/api/charge/';

class ChargeService {
  //ideally I would like to pass the vehicle_id directly here
  startCharge(user_id, station_id, tower_id){
    return axios.post(API_URL + 'start',
      {
        user_id:  user_id,
        station_id: station_id,
        tower_id: tower_id
      },
      { headers: authHeader()})
      .then(response => {
        return response.data;
      }).catch(function (error){
        throw new Error(error.response.data)
      });
  }

  endCharge(user_id, station_id, tower_id){
    return axios.post(API_URL + 'end',
      {
        user_id:  user_id,
        station_id: station_id,
        tower_id: tower_id,
      },
      { headers: authHeader()})
      .then(response => {
        return response.data;
      }).catch(function (error){
        throw new Error(error.response.data)
      });
  }


  getChargeHistory(user_id,){
    return axios.get(API_URL + 'history',
      { headers: authHeader()})
      .then(response => {
        return response.data;
      }).catch(function (error){
        throw new Error(error.response.data)
      });
  }

}
export default new ChargeService();
