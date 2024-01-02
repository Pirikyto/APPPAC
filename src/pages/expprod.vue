<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handleLeitura">
      <p class="col-12 text-h5 text-center">Etiqueta</p>
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-input
          label="Etiqueta"
          v-model="form.etiqueta"
          lazy-rules
          ref="input"
          autofocus=""
        />

        <div class="full-width q-pt-md">
          <q-btn
            label="Incluir"
            color="primary"
            class="full-width"
            outline
            rounded
            type="submit"
            ref="selectOption"
          />
          <q-btn
            label="ENVIAR"
            color="primary"
            class="full-width"
            outline
            rounded
            ref="selectOption"
            @click="handleEtiqueta"
            :disable="loadingEnv"
          />
        </div>
      </div>
    </q-form>

    <div id="q-app" style="min-height: 100vh">
      <div class="q-pa-md">
        <q-table
          flat
          bordered
          :rows="rows"
          :columns="columns"
          row-key="id"
          :loading="loading"
          virtual-scroll
          v-model:pagination="pagination"
          :rows-per-page-options="[0]"
        >
          <template v-slot:header> </template>
          <template v-slot:top-row>
            <q-tr>
              <q-td></q-td>
              <q-td>#</q-td>
              <q-td>Etiquetas: {{ rowCount }}</q-td>
              <q-td>Peso : {{ peso }}</q-td>
            </q-tr>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td auto-width>
                <q-btn
                  size="xs"
                  color="accent"
                  round
                  dense
                  @click="handleExclu(props.pageIndex)"
                  :icon="'remove'"
                />
              </q-td>
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.value }}
              </q-td>
            </q-tr>
          </template>
          <template v-slot:no-data>
            <div class="full-width row flex-center text-accent">
              <span> Aguardando...</span>
            </div>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>
<script>
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import useNotify from "../services/useNotify";
import useApi from "../services/useApi";

export default defineComponent({
  name: "IndexPage",

  setup() {
    const columns = [
      {
        name: "index",
        label: "#",
        field: "index",
        style: "width: 5px",
      },
      {
        name: "peso",
        required: true,
        label: "Peso",
        align: "center",
        field: (row) => row.peso,
        format: (val) => `${val}`,
        style: "width: 10px",
      },
      {
        name: "name",
        required: true,
        label: "Etiqueta",
        align: "left",
        field: (row) => row.name,
        format: (val) => `${val}`,
      },
    ];

    const originalRows = [];

    const loading = ref(false);
    const loadingEnv = ref(true);

    const filter = ref("");
    const rowCount = ref(0);
    let peso = ref(0);
    const rows = ref([...originalRows]);
    const indexCount = ref(0);
    const router = useRouter();
    const { notifyError, notifySuccess } = useNotify();
    const { mge } = useApi();
    const json = require("../json/request.json");
    const req = json.conferencia;
    const seed = [];
    const form = ref({
      etiqueta: "",
    });

    const input = ref(null);
    const handleEtiqueta = async () => {
      loadingEnv.value = true;
      req.requestBody.records = seed.reverse();
      //console.log(req.requestBody.records);
      try {
        const res = await mge(req);
        if (res.status == 1) {
          notifySuccess("Incluido!");
          router.push({ name: "home" });
          window.location.reload(false);
          //req.requestBody.records = "";
          //console.log(req.requestBody.records);
        } else {
          notifyError(res.statusMessage);
          console.log(res);
        }
      } catch (error) {
        notifyError(error.message);
      }
    };

    const handleLeitura = async () => {
      if (form.value.etiqueta == "") {
        console.log("--");
      } else {
        loading.value = true;

        let arr = form.value.etiqueta.split("*");
        if (!isEtiquetaExistente(form.value.etiqueta)) {
          if (
            arr.length == 5 &&
            arr[0].length == 11 &&
            arr[1].length == 4 &&
            arr[2].length == 6 &&
            arr[3].length == 2 &&
            arr[4].length == 10
          ) {
            seed.unshift({ values: { 0: form.value.etiqueta } });
            originalRows.push({
              name: form.value.etiqueta,
              peso: parseInt(arr[2]) / 100,
            });
            //console.log(originalRows);
            setTimeout(() => {
              if (rows.value.length === 0) {
                rowCount.value = 0;
                indexCount.value = 0;
              }
              if (parseInt(arr[2]) / 100 > 1) {
                peso.value = peso.value + parseInt(arr[2]) / 100;
                //console.log(peso.value);
              }
              //console.log(rowCount);
              const index = indexCount.value,
                row = originalRows[rowCount.value];
              //console.log(seed);
              row.index = index;
              ++rowCount.value;
              ++indexCount.value;
              //console.log(rows.value);

              const newRow = { ...row };
              //console.log(newRow);
              rows.value.unshift(newRow);
              //console.log(rows.value);
              loading.value = false;
            }, 500);
            input.value.focus();
            form.value.etiqueta = "";
            loadingEnv.value = false;
          } else {
            var audio = new Audio("../media/error-1.mp3");
            audio.addEventListener("canplaythrough", function () {
              audio.play();
            });
            input.value.focus();
            form.value.etiqueta = "";
            notifyError("Etiqueta Fora do Padrão");
          }
        } else {
          var audio = new Audio("../media/error-1.mp3");
          audio.addEventListener("canplaythrough", function () {
            audio.play();
          });
          input.value.focus();
          form.value.etiqueta = "";
          notifyError("Etiqueta em Duplicidade");
        }
      }
    };
    const handleExclu = async (val) => {
      loading.value = true;
      //seed.push({ values: { 0: form.value.etiqueta } });
      //originalRows.push({ name: form.value.etiqueta });
      originalRows.splice(val, 1);
      --rowCount.value;

      setTimeout(() => {
        if (rows.value.length === 0) {
          rowCount.value = 0;
          indexCount.value = 0;
        }
        /*if (parseInt(arr[2]) / 100 > 1) {
          peso.value = peso.value + parseInt(arr[2]) / 100;
          console.log(peso.value);
        }*/
        //console.log(val);
        let arr = seed[val].values[0].split("*");
        if (parseInt(arr[2]) / 100 > 1) {
          peso.value = peso.value - parseInt(arr[2]) / 100;
          //console.log(peso.value);
        }
        seed.splice(val, 1);
        rows.value.splice(val, 1);
        //console.log(seed);
        loading.value = false;
      }, 500);
      input.value.focus();
      form.value.etiqueta = "";
    };
    const isEtiquetaExistente = (etiqueta) => {
      return seed.some((item) => {
        console.log("Item.values[0]:", item.values);
        return String(item.values[0]) === String(etiqueta);
      });
    };
    return {
      form,
      handleEtiqueta,
      handleLeitura,
      handleExclu,
      peso,
      columns,
      rows,
      loading,
      loadingEnv,
      filter,
      rowCount,
      input,
    };
  },
});
</script>
