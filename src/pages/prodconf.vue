<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handleLeitura">
      <p class="col-12 text-h5 text-center">Etiqueta</p>
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-input
          label="Orden de Produção"
          v-model="form.ordenprod"
          lazy-rules
        />
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
            :disable="loadingEnv"
            @click="handleOP"
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
          row-key="index"
          :loading="loading"
          virtual-scroll
          v-model:pagination="pagination"
          :rows-per-page-options="[0]"
          no-data-label="Incluir Etiqueta"
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
                  size="sm"
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
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import useNotify from "../services/useNotify";
import useApi from "../services/useApi";

export default defineComponent({
  name: "IndexPage",

  setup() {
    const router = useRouter();
    const { notifyError, notifySuccess } = useNotify();
    const { mge } = useApi();
    const json = require("../json/request.json");
    let peso = ref(0);
    const seed = [];
    const form = ref({
      etiqueta: "",
      ordenprod: "",
    });
    const columns = [
      {
        name: "index",
        label: "#",
        field: "index",
        style: "width: 10px",
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
        sortable: true,
      },
    ];
    const originalRows = [];
    const loading = ref(false);
    const filter = ref("");
    const rowCount = ref(0);
    const indexCount = ref(0);
    const rows = ref([...originalRows]);
    const input = ref(null);
    const loadingEnv = ref(true);
    const barcode = ref([]);
    const handleImpressao = async () => {
      const chave = json.etiquetasproducao;
      const ret = await handleMge(chave);
      //barcode.value
      //console.log(ret.responseBody.result);
      const opt = ret.responseBody.result;
      //console.log(opt);
      for (const key in opt) {
        if (Array.isArray(opt[key]) && opt[key].length > 0) {
          barcode.value.push(opt[key][2]);
        }
      }
      //console.log(barcode.value);
    };
    onMounted(() => {
      handleImpressao();
    });

    const handleOP = async () => {
      loadingEnv.value = true;
      const req = json.conferenciaprod;
      req.requestBody.records = [
        {
          values: {
            0: "",
            1: form.value.ordenprod,
          },
        },
      ];

      try {
        const res = await mge(req);

        if (res.status == 1) {
          let arr = res.responseBody.result[0];
          const req = json.conferenciaprodetiq;
          const sseed = seed.reverse().map((i) => {
            return { values: { ...i.values, 1: arr[0] } };
          });

          req.requestBody.records = sseed;

          console.log(sseed);
          try {
            const res = await mge(req);
            if (res.status == 1) {
              notifySuccess("Incluido!");
              router.push({ name: "pro" });
              window.location.reload(false);
              //req.requestBody.records = "";
              //console.log(res);
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

    const handleLeitura = async () => {
      if (form.value.etiqueta == "") {
        console.log("--");
      } else {
        loading.value = true;

        let arr = form.value.etiqueta.split("*");
        //console.log(!isEtiquetaExistente(form.value.etiqueta));
        //P1652275050*1457*001144*00*0000051423
        console.log(
          !barcode.value.includes(form.value.etiqueta) &&
            !isEtiquetaExistente(form.value.etiqueta)
        );
        if (
          !barcode.value.includes(form.value.etiqueta) &&
          !isEtiquetaExistente(form.value.etiqueta)
        ) {
          if (
            arr.length == 5 &&
            arr[0].length == 11 &&
            arr[2].length == 6 &&
            arr[3].length == 2 &&
            arr[4].length == 10
          ) {
            seed.unshift({ values: { 0: form.value.etiqueta } });
            originalRows.push({
              name: form.value.etiqueta,
              peso: parseInt(arr[2]) / 100,
            });
            setTimeout(() => {
              if (rows.value.length === 0) {
                rowCount.value = 0;
                indexCount.value = 0;
              }
              if (parseInt(arr[2]) / 100 > 1) {
                peso.value = peso.value + parseInt(arr[2]) / 100;
                console.log(peso.value);
              }
              //console.log(rowCount);
              const index = indexCount.value,
                row = originalRows[rowCount.value];
              //console.log(seed);
              row.index = index;
              ++rowCount.value;
              ++indexCount.value;
              //console.log(row);

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
        let arr = seed[val].values[0].split("*");
        if (parseInt(arr[2]) / 100 > 1) {
          console.log(peso.value);
          peso.value = peso.value - parseInt(arr[2]) / 100;
          console.log(parseInt(arr[2]) / 100);
          console.log(peso.value);
        }
        //console.log(val);
        //console.log(index);
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
        return String(item.values[0]) === String(etiqueta);
      });
    };
    const handleMge = async (req) => {
      try {
        const res = await mge(req);
        if (res.status == 1) {
          notifySuccess("Incluido!");
          return res;
        } else {
          notifyError(res.statusMessage);
          return res;
        }
      } catch (error) {
        notifyError(error.message);
        return res;
      }
    };
    return {
      form,
      handleLeitura,
      handleOP,
      handleExclu,
      peso,
      columns,
      rows,
      loading,
      filter,
      rowCount,
      input,
      loadingEnv,
      selected: ref([]),
    };
  },
});
</script>
