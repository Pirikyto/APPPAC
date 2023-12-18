<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-btn class="btn-fixed-width" color="blue" padding="lg" stack glossy>
        <q-icon name="add_shopping_cart" size="xl" />
        <div><font size="1">Novo Pedido</font></div>
      </q-btn>
      <q-btn class="btn-fixed-width" color="blue" padding="lg" stack glossy>
        <q-icon name="groups" size="45px" />
        <div><font size="1">Clientes</font></div>
      </q-btn>
      <q-btn class="btn-fixed-width" color="blue" padding="lg" stack glossy>
        <q-icon name="calendar_month" size="xl" />
        <div><font size="1">Agenda</font></div>
      </q-btn>
      <q-btn class="btn-fixed-width" color="blue" padding="lg" stack glossy>
        <q-icon name="shopping_cart" size="xl" />
        <div><font size="1">Pedidos</font></div>
      </q-btn>
      <q-btn class="btn-fixed-width" color="blue" padding="lg" stack glossy>
        <q-icon name="storefront" size="xl" />
        <div><font size="1">Produtos</font></div>
      </q-btn>
      <q-btn class="btn-fixed-width" color="blue" padding="lg" stack glossy>
        <q-icon name="query_stats" size="xl" />
        <div><font size="1">Gerencial</font></div>
      </q-btn>
      <q-btn class="btn-fixed-width" color="blue" padding="lg" stack glossy>
        <q-icon name="forum" size="xl" />
        <div><font size="1">Recados</font></div>
      </q-btn>
      <q-btn class="btn-fixed-width" color="blue" padding="lg" stack glossy>
        <q-icon name="sync" size="xl" />
        <div><font size="1">Sincronização</font></div>
      </q-btn>
      <q-btn class="btn-fixed-width" color="blue" padding="lg" stack glossy>
        <q-icon name="add_business" size="xl" />
        <div><font size="1">Novo Cliente</font></div>
      </q-btn>
      <q-btn class="btn-fixed-width" color="blue" padding="lg" stack glossy>
        <q-icon name="feed" size="xl" />
        <div><font size="1">Novidades</font></div>
      </q-btn>
      <q-btn class="btn-fixed-width" color="blue" padding="lg" stack glossy>
        <q-icon name="cake" size="xl" />
        <div><font size="1">Aniversarios</font></div>
      </q-btn>
      <q-btn class="btn-fixed-width" color="blue" padding="lg" stack glossy>
        <q-icon name="settings" size="xl" />
        <div><font size="1">Opções</font></div>
      </q-btn>
    </div>
  </div>
</template>
<style lang="sass" scoped>
.btn-fixed-width
  width: 130px
</style>
<script>
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import useNotify from "../services/useNotify";
import useApi from "../services/useApi";

export default defineComponent({
  name: "IndexPage",

  setup() {
    //:icon="'remove'"
    const router = useRouter();
    const { notifyError, notifySuccess } = useNotify();
    const { mge } = useApi();
    const json = require("../json/request.json");
    const handleCatalogo = async () => {
      const req = json.consultaproduto;
      try {
        const res = await mge(req);
        if (res.status == 1) {
          const req = json.consultaproduto;
          console.log(req);
          try {
            const res = await mge(req);
            if (res.status == 1) {
              notifySuccess("Incluido!");
              router.push({ name: "teste" });
              //window.location.reload(false);
              //req.requestBody.records = "";
              console.log(res);
            } else {
              notifyError(res.statusMessage);
              console.log(res);
            }
          } catch (error) {
            notifyError(error.message);
          }
        } else {
          notifyError(res.statusMessage);
          console.log(res);
        }
      } catch (error) {
        notifyError(error.message);
      }
    };
    return { handleCatalogo };
  },
});
</script>
