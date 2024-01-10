<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="">
      <p class="col-12 text-h5 text-center">Etiqueta</p>
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-input
          bottom-slots
          v-model="form.etiqueta"
          label="Etiqueta"
          :type="typePeso"
          :disable="disableQTD"
          ref="input"
        >
          <template v-slot:append>
            <q-icon
              v-if="form.etiqueta !== ''"
              name="close"
              @click="form.etiqueta = ''"
              class="cursor-pointer"
            />
          </template>
          <template v-slot:after>
            <q-btn
              round
              dense
              flat
              icon="send"
              :disable="disableQTD"
              type="sub"
              @click="handleLeitura"
            />
          </template>
        </q-input>
      </div>
    </q-form>
    <div class="q-pa-md">
      <q-card class="q-pa-md column justify-center content-center">
        <div class="row" v-for="(item, chave) in somaPorChave" :key="chave">
          <q-card-actions align="center">
            <b
              >{{ item.codBarra }} - {{ formatarQuantidade(item.qtdConf) }} -
              {{ item.count }}</b
            >
          </q-card-actions>
        </div>
      </q-card>
    </div>
    <div id="q-app">
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
              <q-td>Etiquetas</q-td>
              <q-td>Peso </q-td>
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
import useNotify from "../services/useNotify";

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
    const filter = ref("");
    const rowCount = ref(0);
    let peso = ref(0);
    const rows = ref([...originalRows]);
    const indexCount = ref(0);
    const somaPorChave = ref({});
    const { notifyError } = useNotify();
    const seed = [];
    const form = ref({
      etiqueta: "",
    });

    const input = ref(null);

    const handleLeitura = async () => {
      if (form.value.etiqueta == "") {
        console.log("--");
      } else {
        loading.value = true;

        let arr = form.value.etiqueta.split("*");
        if (1 == 1 /*!isEtiquetaExistente(form.value.etiqueta)*/) {
          if (
            arr.length == 5 &&
            // arr[0].length == 11 &&
            arr[2].length == 6 &&
            arr[3].length == 2 //&&
            //arr[4].length == 10
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
              }
              const index = indexCount.value,
                row = originalRows[rowCount.value];
              row.index = index;
              ++rowCount.value;
              ++indexCount.value;
              const newRow = { ...row };
              rows.value.unshift(newRow);
              loading.value = false;
            }, 500);
            input.value.focus();
            form.value.etiqueta = "";
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
        const dados = seed.map((item) => {
          //console.log(item.values);
          return item.values[0].split("*");
        });

        somaPorChave.value = {};
        dados.forEach((item) => {
          const codBarra = item[1];
          const controle = item[4];
          //const chave = `${codBarra}_${controle}`;
          const chave = `${codBarra}`;
          if (somaPorChave.value[chave] == undefined) {
            somaPorChave.value[chave] = { codBarra, qtdConf: 0, count: 0 };
          }
          somaPorChave.value[chave].qtdConf += parseInt(item[2]) / 100;
          somaPorChave.value[chave].count += 1;
        });
      }
    };

    const isEtiquetaExistente = (etiqueta) => {
      return seed.some((item) => {
        return String(item.values[0]) === String(etiqueta);
      });
    };
    const handleExclu = async (val) => {
      loading.value = true;
      originalRows.splice(val, 1);
      --rowCount.value;
      setTimeout(() => {
        if (rows.value.length === 0) {
          rowCount.value = 0;
          indexCount.value = 0;
        }

        let arr = seed[val].values[0].split("*");
        if (parseInt(arr[2]) / 100 > 1) {
          peso.value = peso.value - parseInt(arr[2]) / 100;
        }
        seed.splice(val, 1);
        rows.value.splice(val, 1);
        loading.value = false;
      }, 500);
      input.value.focus();
      form.value.etiqueta = "";
      const arr = seed;
      console.log(arr);
      const dados = seed.map((item) => {
        return item.values[0].split("*");
      });
      console.log(dados);
      somaPorChave.value = {};
      dados.forEach((item) => {
        const codBarra = item[1];
        const controle = item[4];
        //const chave = `${codBarra}_${controle}`;
        const chave = `${codBarra}`;
        if (somaPorChave.value[chave] == undefined) {
          somaPorChave.value[chave] = { codBarra, qtdConf: 0, count: 0 };
        }
        somaPorChave.value[chave].qtdConf += parseInt(item[2]) / 100;
        somaPorChave.value[chave].count += 1;
      });
    };
    const formatarQuantidade = (qtdConf) => {
      // Lógica para formatar a quantidade, por exemplo, adicionar uma máscara
      // Aqui, estou apenas arredondando para 2 casas decimais como exemplo
      return qtdConf.toFixed(2);
    };
    return {
      form,
      handleLeitura,
      handleExclu,
      formatarQuantidade,
      somaPorChave,
      peso,
      columns,
      rows,
      loading,
      filter,
      rowCount,
      input,
    };
  },
});
</script>
