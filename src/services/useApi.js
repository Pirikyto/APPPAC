import axios from "axios";
import useAuthUser from "./useAuthUser";

const api = axios.create({
  timeout: 10000,
  params: { outputType: "json" },
});
const jsonn = require("../json/request.json");
const reqq = jsonn.login;
//const user = ref(null);

const { login } = useAuthUser();
export default function useApi() {
  const posts = async (req, res) => {
    api.defaults.params["serviceName"] = req.serviceName;
    const form = await login(reqq);
    const aux = {
      Authorization: "Bearer " + form.bearerToken,
      "Content-Type": "application/json",
    };

    api.defaults["headers"] = aux;
    res = await api
      .post("/api", req)
      .then((response) => {
        res = response.data;
      })
      .catch((error) => {
        res = error.data;
        console.log(error.data);
      })
      .then(() => {
        //console.log(res);
        return res;
      });
    return res;
  };
  const mge = async (req, res) => {
    api.defaults.params["serviceName"] = req.serviceName;
    const form = await login(reqq);
    const aux = {
      Authorization: "Bearer " + form.bearerToken,
      "Content-Type": "application/json",
    };

    api.defaults["headers"] = aux;
    res = await api
      .post("/mge", req)
      .then((response) => {
        res = response.data;
      })
      .catch((error) => {
        console.log(error);
        res = error.data;
        console.log(error.data);
      })
      .then(() => {
        //console.log(res);
        return res;
      });
    return res;
  };
  const mgecom = async (req, res) => {
    api.defaults.params["serviceName"] = req.serviceName;
    const form = await login(reqq);
    const aux = {
      Authorization: "Bearer " + form.bearerToken,
      "Content-Type": "application/json",
    };

    api.defaults["headers"] = aux;
    res = await api
      .post("/com", req)
      .then((response) => {
        res = response.data;
      })
      .catch((error) => {
        res = error.data;
        console.log(error.data);
      })
      .then(() => {
        //console.log(res);
        return res;
      });
    return res;
  };
  return { posts, mge, mgecom };
}
