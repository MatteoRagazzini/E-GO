import axios from 'axios';
import authHeader from "@/services/auth-header";

const API_URL = 'http://localhost:3000/reservations';


class ReservationService {

  createReservation(user, station) {
    return axios.post(API_URL, {user: user, station: station}, {headers: authHeader()})
  }

  deleteReservation(user) {
    return axios.delete(API_URL + '/' + user._id, {headers: authHeader()})
  }
}

export default new ReservationService();
