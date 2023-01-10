import axios from 'axios';
import authHeader from "@/services/auth-header";

axios.defaults.headers.common = {
  "Content-Type": "application/json"
}

const SERVER_PORT = process.env.SERVER_DOCKER_PORT || 3000;
const AUTH_API = `http://localhost:${SERVER_PORT}/api/auth/`;

class AuthService {
  login(user) {
    return axios
      .post(AUTH_API + 'signin', {
        username: user.username,
        password: user.password
      })
      .then(response => {
          if (response.data.accessToken) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('accessToken', response.data.accessToken)
            localStorage.setItem('roles', response.data.roles)
          }
          return response.data;
      }).catch(function (error){
        console.log(error)
        throw new Error(error.response.data.message)
      });
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('roles');
  }

  register(user) {
    return axios.post(AUTH_API + 'signup', {
      username: user.username,
      email: user.email,
      password: user.password
    });
  }
}

export default new AuthService();
