import axios from "axios";
import { Cookies } from "quasar";
import { ref } from "vue";

const user = ref(null);

export default function sankhyaapi() {
  const api = axios.create({
    timeout: 10000,
    params: { outputType: "json" },
  });
  //Definição dos metodos para utilização da APIs em sistema Sankhya!!
  const login = async (req, res) => {
    api.defaults.params["serviceName"] = req.serviceName;
    res = await api
      .post("/api", req)
      .then((response) => {
        res = response.data;
      })
      .catch((error) => {
        res = error.data;
      })
      .then(() => {
        return res;
      });
    //console.log(res);
    return res;
  };

  const posts = async (req, res, token) => {
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
}
