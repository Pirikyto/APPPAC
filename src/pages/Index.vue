<template>
  <q-page>
    <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
      <div class="q-col-gutter-md row items-start"></div>
    </div>
  </q-page>
</template>
<script>
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import useNotify from "../services/useNotify";
//import { posts, gets } from "../services/useApi";
export default defineComponent({
  name: "IndexPage",
  setup() {
    const router = useRouter();
    const { notifyError, notifySuccess } = useNotify();
    const json = require("../json/request.json");
  },
});
</script>
