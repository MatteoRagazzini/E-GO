import axios from 'axios';
import authHeader from "@/services/auth-header";

const SERVER_PORT = process.env.SERVER_DOCKER_PORT || 3000;
const CHARGE_API = `http://localhost:${SERVER_PORT}/api/charge/`

class ChargeService {
  //ideally I would like to pass the vehicle_id directly here
  startCharge(user, station, tower_id){
    return axios.post(CHARGE_API + 'start',
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
    return axios.post(CHARGE_API + 'end',
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


  getChargeHistory(user_id,){
    return axios.get(CHARGE_API + 'history/'+ user_id,
      { headers: authHeader()})
      .then(response => {
        return response.data;
      }).catch(function (error){
        console.log(error)
        throw new Error(error.response.data)
      });
  }

}
export default new ChargeService();
