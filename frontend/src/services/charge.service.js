import axios from 'axios';
import authHeader from "@/services/auth-header";

const API_URL = 'http://localhost:3000/charges';

class ChargeService {
  //ideally I would like to pass the vehicle_id directly here
  startCharge(user, station, tower_id){
    return axios.post(API_URL,
      {
        user: user,
        station: station,
        tower_id: tower_id,
      },
      { headers: authHeader()})
  }

  endCharge(user, batteryLevel){
    console.log(batteryLevel)
    return axios.put(API_URL + '/' + user._id,
      {
        batteryLevel: batteryLevel
    },
    { headers: authHeader()})
  }


  getChargeHistory(user_id){
    return axios.get(API_URL + '/'+ user_id, { headers: authHeader()})
  }

}
export default new ChargeService();
