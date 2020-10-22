import axios from "axios";
import authHeader from "./auth-header";

// const API_Noti = "http://192.168.1.22:8080/users/"; //TO replace

// const API_DATA = "http://192.168.1.22:8080/data/";
const API_DATA = "http://localhost:8080/data/";


// const getNotifications = (idUser) => {
//   return axios.get(API_DATA + idUser, {
//     headers: authHeader() });
// };

const getSerieDay = (building,year,month,day) => {
  // console.log("By day")
  // console.log(API_DATA + "day/"+building+"/"+year+"/"+month+"/"+day)
  return axios.get(API_DATA + "day/"+building+"/"+year+"/"+month+"/"+day, { headers: authHeader() });
};

const getSerieWeek = (building,year,weekof) => {
  // console.log("By WEEK")
  // console.log(API_DATA + "week/"+building+"/"+year+"/"+weekof)
  return axios.get(API_DATA + "week/"+building+"/"+year+"/"+weekof, { headers: authHeader() });
};

const getCurrentOccupation = (area) => {
  // console.log("By Occupation")
  // console.log(API_DATA + "capacity/"+building)
  return axios.get(API_DATA + "capacity/"+area, { headers: authHeader() });
};


export default {
  // getNotifications,
  getSerieWeek,
  getSerieDay,
  getCurrentOccupation
};


