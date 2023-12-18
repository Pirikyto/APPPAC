import { ref } from "vue";
import axios from "axios";
import { Cookies } from "quasar";

const log = axios.create({
  timeout: 10000,
  params: { outputType: "json" },
});

const user = ref(null);
export default function useAuthUser() {
  const login = async (req, res) => {
    log.defaults["headers"] = req;

    res = await log
      .post("/log", "")
      .then((response) => {
        res = response.data;
      })
      .catch((error) => {
        res = error.data;
        console.log(error.data);
      })
      .then(() => {
        if (res.error == null) {
          log.defaults.params["Authorization"] = "Bearer" + res.bearerToken.$;
          Cookies.set("Bearer", res.bearerToken.$);
        }
        return res;
      });
    return res;
  };
  return { login };
}
