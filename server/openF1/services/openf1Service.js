import axios from "axios";

const openf1Client = axios.create({
  baseURL: "https://api.openf1.org/v1",
  timeout: 5000
});

export const getWeatherFromOpenF1 = async (query) => {
  const response = await openf1Client.get("/weather", { params: query });
  return response.data;
};

export const getRaceControlFromOpenF1 = async (query) => {
  const response = await openf1Client.get("/race_control", { params: query });
  return response.data;
};

export const getTeamRadioFromOpenF1 = async (query) => {
  const response = await openf1Client.get("/team_radio", { params: query });
  return response.data;
};
export const getSessionsFromOpenF1 = async (query) => {
  const response = await openf1Client.get("/sessions", {
    params: query
  });

  return response.data;
};