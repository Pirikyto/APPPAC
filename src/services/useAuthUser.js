import { ref } from "vue";
import axios from "axios";

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
      })
      .then(() => {});
  };
  return { login };
}
