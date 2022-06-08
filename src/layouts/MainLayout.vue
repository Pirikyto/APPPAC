<template>
  <q-layout view="hHh lpr fFf">
    <q-header reveal bordered class="bg-primary text-white">
      <q-toolbar>
        <!-- <q-btn dense flat round icon="menu" @click="left = !left" /> -->

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
          APP
        </q-toolbar-title>

        <q-btn dense flat round icon="menu" @click="right = !right" />
      </q-toolbar>
    </q-header>

    <!-- <q-drawer show-if-above v-model="left" side="left" elevated>
       drawer content
    </q-drawer> -->

    <q-drawer show-if-above v-model="right" side="right" elevated>
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
          <template v-for="(menuItem, index) in menuList" :key="index">
            <q-item clickable :active="menuItem.label === 'Outbox'" v-ripple>
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
import { defineComponent } from "vue";

export default defineComponent({
  name: "MainLayout",

  data() {
    const menuList = [
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
    return {
      drawer: true,
      menuList,
      left: false,
      right: false,
    };
  },
});
</script>
