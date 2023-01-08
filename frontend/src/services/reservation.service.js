import axios from 'axios';
import authHeader from "@/services/auth-header";

const API_URL = 'http://localhost:3000/api/reservation/';

class ReservationService {
  createReservation(user, station){
    return axios.post(API_URL + 'create',
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
    return axios.post(API_URL + 'delete',
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
