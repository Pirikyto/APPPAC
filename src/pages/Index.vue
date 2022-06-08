<template>
  <q-page>
    <div></div>
  </q-page>
</template>
<script>
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import useNotify from "../services/useNotify";
import useApi from "../services/useApi";

export default defineComponent({
  name: "IndexPage",

  setup() {
    const { posts } = useApi();
    const router = useRouter();
    const { notifyError, notifySuccess } = useNotify();
    const json = require("../json/request.json");
    const req = json.pedido;
    //const requestPost = async () => {
    console.log(req);
    //const res =
    posts(req);
    //console.log(res);
    //};
    //return { requestPost };
  },
});
</script>
