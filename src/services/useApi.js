import axios from "axios";
import { Cookies } from "quasar";

const api = axios.create({
  timeout: 10000,
  params: { outputType: "json" },
});

export default function useApi() {
  const posts = async (req, res) => {
    api.defaults.params["serviceName"] = req.serviceName;
    api.defaults.params["mgeSession"] = Cookies.get("JSESSIONID");
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
        console.log(res);
        //return res;
      });
    return res;
  };
  return { posts };
}
