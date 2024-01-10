<template>
  <q-layout view="hHh lpr fFf">
    <q-header reveal bordered class="bg-primary text-white">
      <q-toolbar>
        <!--<q-btn dense flat round icon="menu" @click="left = !left" />-->
        <q-btn dense flat round icon="home" @click="home" />
        <q-toolbar-title>
          <IndexPage />
        </q-toolbar-title>
        <q-btn dense flat round icon="restart_alt" @click="reload" />
        <!--<q-btn dense flat round icon="account_circle" @click="right = !right" />-->
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "MainLayout",
  data() {
    const link = ref("Home");
    return {
      link,
    };
  },
  async BeforeMount() {
    await this.getData();
  },
  methods: {
    getData() {
      this.link;
      console.log(this.link);
    },
    reload() {
      window.location.reload(false);
    },
    home() {
      window.location.replace("/home");
    },
  },
});
</script>
