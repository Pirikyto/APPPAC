<template>
  <div class="q-pa-md text-center">
    <div class="q-gutter-md">
      <q-btn
        class="btn-fixed-width"
        color="blue"
        type="submit"
        padding="lg"
        stack
        glossy
        @click="handleReceb"
      >
        <q-icon name="qr_code" size="xl" />
        <div><font size="1">Recebimento Mercadoria</font></div>
      </q-btn>
      <q-btn
        class="btn-fixed-width"
        color="blue"
        type="submit"
        padding="lg"
        stack
        glossy
        @click="handleCat"
      >
        <q-icon name="assignment" size="xl" />
        <div><font size="1">Conferencia Produção</font></div>
      </q-btn>
      <q-btn
        class="btn-fixed-width"
        color="blue"
        type="submit"
        padding="lg"
        stack
        glossy
        @click="handleExped"
      >
        <q-icon name="assignment_turned_in" size="xl" />
        <div><font size="1">Recepção Expedição</font></div>
      </q-btn>
      <q-btn
        class="btn-fixed-width"
        color="blue"
        type="submit"
        padding="lg"
        stack
        glossy
        @click="handleFilaconf"
      >
        <q-icon name="qr_code_scanner" size="xl" />
        <div><font size="1">Fila de Conferencia</font></div>
      </q-btn>
      <q-btn
        class="btn-fixed-width"
        color="blue"
        type="submit"
        padding="lg"
        stack
        glossy
      >
        <q-icon name="add_shopping_cart" size="xl" />
        <div><font size="1">Catalogo</font></div>
      </q-btn>
      <q-btn
        class="btn-fixed-width"
        color="blue"
        type="submit"
        padding="lg"
        stack
        glossy
        @click="handleIndica"
      >
        <q-icon name="query_stats" size="xl" />
        <div><font size="1">Indicadores</font></div>
      </q-btn>
    </div>
  </div>
</template>
<style lang="sass" scoped>
.btn-fixed-width
  width: 185px
</style>
<script>
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "IndexPage",

  setup() {
    const router = useRouter();
    const handleExped = async () => {
      router.push({ name: "exp" });
    };
    const handleProd = async () => {
      router.push({ name: "pro" });
    };
    const handleCat = async () => {
      router.push({ name: "pro" });
    };
    const handleReceb = async () => {
      router.push({ name: "rec" });
    };
    const handleIndica = async () => {
      router.push({ name: "ind" });
    };
    const handleFilaconf = async () => {
      router.push({ name: "ven" });
    };

    return {
      handleExped,
      handleProd,
      handleCat,
      handleReceb,
      handleIndica,
      handleFilaconf,
    };
  },
});
</script>
