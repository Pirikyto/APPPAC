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

    <q-drawer
      show-if-above
      v-model="left"
      :mini="!left || miniState"
      @click.capture="drawerClick"
      side="left"
      elevated
    >
      <!-- drawer content -->
      <!-- <q-item clickable v-ripple></q-item> -->

      <q-scroll-area
        style="
          height: calc(100% - 75px);
          margin-top: 75px;
          border-right: 1px solid #ddd;
        "
      >
        <q-list>
          <template v-for="(menuItem, index) in menuList" :key="index">
            <q-item
              clickable
              :active="menuItem.label === link"
              @click="link = menuItem.label"
              v-ripple
            >
              <q-item-section avatar>
                <q-icon :name="menuItem.icon"></q-icon>
              </q-item-section>
              <q-item-section>
                {{ menuItem.label }}
              </q-item-section>
            </q-item>
            <q-separator
              :key="'sep' + index"
              v-if="menuItem.separator"
            ></q-separator>
          </template>
        </q-list>
      </q-scroll-area>
      <div class="q-mini-drawer-hide absolute" style="top: 15px; right: -17px">
        <q-btn
          dense
          round
          unelevated
          color="accent"
          icon="chevron_left"
          @click="miniState = true"
        ></q-btn>
      </div>
    </q-drawer>

    <q-drawer show-if-above v-model="right" side="right" elevated>
      <!-- drawer content -->
      <q-img
        class="absolute-top"
        src="https://cdn.quasar.dev/img/material.png"
        style="height: 150px"
      >
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
        </div>
        <div class="text-weight-bold">Razvan Stoenescu</div>
      </q-img>
      <q-scroll-area
        style="
          height: calc(100% - 150px);
          margin-top: 150px;
          border-right: 1px solid #ddd;
        "
      >
        <q-list>
          <template v-for="(menuItem, index) in menuUser" :key="index">
            <q-item
              clickable
              :active="menuItem.label === link"
              @click="link = menuItem.label"
              v-ripple
            >
              <q-item-section avatar>
                <q-icon :name="menuItem.icon"></q-icon>
              </q-item-section>
              <q-item-section>
                {{ menuItem.label }}
              </q-item-section>
            </q-item>
            <q-separator
              :key="'sep' + index"
              v-if="menuItem.separator"
            ></q-separator>
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import useNotify from "../services/useNotify";
import useApi from "../services/useApi";

export default defineComponent({
  name: "MainLayout",
  data() {
    const menuUser = [
      {
        icon: "inbox",
        label: "Inbox",
        separator: true,
      },
      {
        icon: "send",
        label: "Outbox",
        separator: false,
      },
      {
        icon: "delete",
        label: "Trash",
        separator: false,
      },
      {
        icon: "error",
        label: "Spam",
        separator: true,
      },
      {
        icon: "settings",
        label: "Settings",
        separator: false,
      },
      {
        icon: "feedback",
        label: "Send Feedback",
        separator: false,
      },
      {
        icon: "help",
        iconColor: "primary",
        label: "Help",
        separator: false,
      },
    ];
    const menuList = [
      {
        icon: "home",
        label: "Home",
        separator: true,
      },
      {
        icon: "add_task",
        label: "PAC",
        separator: false,
      },
      {
        icon: "auto_stories",
        label: "Registros",
        separator: false,
      },
      {
        icon: "assignment",
        label: "Documentos",
        separator: false,
      },
      {
        icon: "task",
        label: "Assinatura PAC",
        separator: false,
      },
      {
        icon: "calendar_month",
        label: "Agendamentos",
        separator: false,
      },
      {
        icon: "engineering",
        label: "PDCA",
        separator: false,
      },
      {
        icon: "crisis_alert",
        label: "Ver e Agir",
        separator: false,
      },
      {
        icon: "public",
        label: "Geolocalização",
        separator: true,
      },
      {
        icon: "settings",
        label: "Settings",
        separator: false,
      },
      {
        icon: "feedback",
        label: "Send Feedback",
        separator: false,
      },
      {
        icon: "help",
        iconColor: "primary",
        label: "Help",
        separator: false,
      },
    ];
    const miniState = ref(true);
    const link = ref("Home");
    const left = ref(false);
    const right = ref(false);
    const drawer = ref(false);
    return {
      left,
      right,
      drawer,
      miniState,
      link,
      drawerClick(e) {
        if (miniState.value) {
          miniState.value = false;
          e.stopPropagation();
        }
      },
      menuList,
      menuUser,
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
