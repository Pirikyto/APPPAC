import axios from "axios";
import { Cookies } from "quasar";
export { posts, gets };

const api = axios.create({
  timeout: 10000,
  params: { outputType: "json" },
});
//api.defaults.headers.common["Authorization"] = AUTH_TOKEN;

//Definição dos metodos para utilização da APIs em sistema Sankhya!!
//Metodo Post
const posts = async (req, res) => {
  api.defaults.params["serviceName"] = req.serviceName;
  res = await api
    //Para Utilização do metodo Post a Requisição sempre feita em URL/api devido ao proxy configurado no quasar.config(nunca utilizar na apliacação)
    .post("/api", req)
    .then((response) => {
      //console.log(response.data);
      res = response.data;
    })
    .catch((error) => {
      // handle error
      res = error.data;
    })
    .then(() => {
      //console.log(res);
      return res;
    });
  //console.log(res);
  return res;
};

const gets = async (req, res, token) => {
  Cookies.set("JSESSIONID", token);
  api.defaults.params["serviceName"] = req.serviceName;
  api.defaults.params["mgeSession"] = req.Cookie;
  res = await api
    .post("/api", req)
    .then((response) => {
      res = response.data;
    })
    .catch((error) => {
      // handle error
      //console.log(error);
      res = error.data;
    })
    .then(() => {
      //console.log(res);
      return res;
    });
  //console.log(res);
  return res;
};
