import axios from 'axios';
import authHeader from "@/services/auth-header";

const API_URL = 'http://localhost:3000/api/station/';

class StationService {
  getStation() {
    return axios.get(API_URL + 'retrieve',{ headers: authHeader()});
  }

  occupyStation(user_id, station_id){
    console.log(station_id +","+user_id)
    return axios.put(API_URL + 'tower/occupy',
      {
        user_id: user_id,
        station_id: station_id
      },
      { headers: authHeader()})
      .then(response => {
        console.log(response.data)
        return response.data;
      }).catch(function (error){
        console.log(error)
        throw new Error(error.response.data.message)
      });
  }
}
export default new StationService();
