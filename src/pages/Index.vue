<template>
  <q-page>
    <div>
      <h4>{{ meuhometitle }}</h4>
    </div>
  </q-page>
</template>
<script>
import { defineComponent, inject, onMounted } from "vue";
import { useRouter } from "vue-router";
import useNotify from "../services/useNotify";
import useApi from "../services/useApi";

export default defineComponent({
  name: "IndexPage",
  setup() {
    return {
      meuhometitle,
      title: "status do titulo",
    };
  },
  inject: ["message"],
  created() {
    console.log(this.message); // injected value
  },
});
</script>
