<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handleLogin">
      <p class="col-12 text-h5 text-center">login</p>
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-input label="Usuário" v-model="form.login" />
        <q-input label="Senha" v-model="form.password" />
        <div class="full-width q-pt-md">
          <q-btn
            label="Login"
            color="primary"
            class="full-width"
            outline
            rounded
            type="submit"
          />
        </div>
        <div class="full-width">
          <q-btn
            disable
            label="register"
            color="primary"
            class="full-width"
            flat
          />
        </div>
      </div>
    </q-form>
  </q-page>
</template>
<script>
import { defineComponent, ref } from "vue";
import useAuthUser from "../services/useAuthUser";
import useNotify from "../services/useNotify";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "PageLogin",

  setup() {
    const form = ref({
      login: "",
      password: "",
    });
    const { notifyError, notifySuccess } = useNotify();
    const { login } = useAuthUser();
    const json = require("../json/request.json");
    const req = json.login;

    const handleLogin = async () => {
      req.requestBody.INTERNO.$ = form.value.password;
      req.requestBody.NOMUSU.$ = form.value.login;
      try {
        const res = await login(req);
        console.log(res);
        if (res.status == 1) {
          notifySuccess("Login successfully!");
        } else {
          notifyError(res.statusMessage);
        }
      } catch (error) {
        notifyError(error.message);
      }
    };
    return { form, handleLogin };
  },
});
</script>
