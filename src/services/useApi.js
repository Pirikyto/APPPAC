import { ref } from "vue";
import axios from "axios";
import { Cookies } from "quasar";

const api = axios.create({
  timeout: 10000,
  params: { outputType: "json" },
});

export default function useAuthUser() {}
