import axios from 'axios';
import authHeader from "@/services/auth-header";

const SERVER_PORT = process.env.SERVER_DOCKER_PORT || 3000;
const STATION_API = `http://localhost:${SERVER_PORT}/api/reservation/`

class ReservationService {
  createReservation(user, station){
    return axios.post(STATION_API + 'create',
      {
        user: user,
        station: station
      },
      { headers: authHeader()})
      .then(response => {
        return response.data;
      }).catch(function (error){
        throw new Error(error.response.data)
      });
  }

  deleteReservation(user){
    console.log("inside delete frontend")
    return axios.post(STATION_API + 'delete',
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
}
export default new ReservationService();
