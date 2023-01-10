import axios from 'axios';
import authHeader from "@/services/auth-header";

const SERVER_PORT = process.env.SERVER_DOCKER_PORT || 3000;
const STATION_API = `http://localhost:${SERVER_PORT}/api/station/`

class StationService {
  getStations() {
    return axios.get(STATION_API + 'retrieve',{ headers: authHeader()});
  }
  getStation(station_id) {
    return axios.get(STATION_API + 'retrieve/'+ station_id,{ headers: authHeader()});
  }
  occupyTower(user_id,station_id){
    return axios.post(STATION_API + 'tower/occupy',
      {
        user_id: user_id,
        station_id: station_id
      },
      { headers: authHeader()})
      .then(response => {
        return response.data;
      }).catch(function (error){
        throw new Error(error.response.data)
      });
  }

  releaseTower(station_id, tower_id){
    return axios.post(STATION_API + 'tower/release',
      {
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

}
export default new StationService();
