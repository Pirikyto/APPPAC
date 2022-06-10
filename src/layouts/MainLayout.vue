<template>
  <q-layout view="hHh lpr fFf">
    <q-header reveal bordered class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
          <IndexPage />
        </q-toolbar-title>
        <q-btn dense flat round icon="account_circle" @click="right = !right" />
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
      <q-img
        class="absolute-top"
        src="https://cdn.quasar.dev/img/material.png"
        style="height: 75px"
      >
      </q-img>
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
          <div class="text-weight-bold">Razvan Stoenescu</div>
          <div>@rstoenescu</div>
        </div>
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
    /*
    //dados do usuario falta implementar
    const { posts } = useApi();
    const router = useRouter();
    const { notifyError, notifySuccess } = useNotify();
    const json = require("../json/request.json");
    const req = json.pedido;
    //const requestPost = async () => {
    //console.log(req);
    //const res =
    //posts(req);
    //console.log(res);
    //};
    //return { requestPost };*/
    const miniState = ref(false);
    const link = ref("Home");
    return {
      left: false,
      right: false,
      drawer: ref(false),
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
});
</script>
