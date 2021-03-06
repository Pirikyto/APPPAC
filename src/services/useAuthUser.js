import { ref } from "vue";
import axios from "axios";
import { Cookies } from "quasar";

const api = axios.create({
  timeout: 10000,
  params: { outputType: "json" },
});

const user = ref(null);
export default function useAuthUser() {
  const login = async (req, res) => {
    api.defaults.params["serviceName"] = req.serviceName;
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
        if (res.status == 1) {
          api.defaults.params["mgeSession"] = res.responseBody.jsessionid.$;
          Cookies.set("JSESSIONID", res.responseBody.jsessionid.$);
        }
        return res;
      });
    return res;
  };
  const isLoggedIn = () => {
    console.log(!!res.status);
    return !!res.status;
  };
  return { login, isLoggedIn };
}
