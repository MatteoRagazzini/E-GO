import axios from 'axios';
import authHeader from "@/services/auth-header";

const API_URL = 'http://localhost:3000/charges';

class ChargeService {
  //ideally I would like to pass the vehicle_id directly here
  startCharge(user, station, tower_id){
    return axios.post(API_URL + 'start',
      {
        user: user,
        station: station,
        tower_id: tower_id,
      },
      { headers: authHeader()})
      .then(response => {
        return response.data;
      }).catch(function (error){
        throw new Error(error.response.data)
      });
  }

  endCharge(user){
    return axios.post(API_URL + 'end',
      {
        user: user
      },
      { headers: authHeader()})
      .then(response => {
        return response.data;
      }).catch(function (error){
        throw new Error(error.response.data)
      });
  }


  getChargeHistory(user_id){
    return axios.get(API_URL + '/'+ user_id, { headers: authHeader()})
  }

}
export default new ChargeService();
