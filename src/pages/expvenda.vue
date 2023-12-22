<template>
  <q-page padding>
    <q-btn
      round
      dense
      flat
      icon="tune"
      @click="handleImpressao"
      type="submit"
    />
    <q-form class="row justify-center" @submit.prevent="handleConferencia">
      <p class="col-12 text-h5 text-center">Fila de Conferencia</p>
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-input
          bottom-slots
          v-model="form.notafiscal"
          label="Nr. Unico NF-e"
          lazy-rules
          :disable="disableNF"
        >
          <template v-slot:append>
            <q-icon
              v-if="form.notafiscal !== ''"
              name="close"
              @click="form.notafiscal = ''"
              class="cursor-pointer"
            />
          </template>
          <template v-slot:after>
            <q-btn
              round
              dense
              flat
              icon="send"
              :disable="disableNF"
              @click="handleNunota"
              type="submit"
            />
          </template>
        </q-input>
      </div>
    </q-form>
    <q-form class="row justify-center" @submit.prevent="handleLeitura">
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-input
          bottom-slots
          v-model="form.etiqueta"
          label="Etiqueta"
          lazy-rules
          ref="input"
          :disable="disableEtiqueta"
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
              :disable="disableEtiqueta"
              icon="send"
              @click="handleLeitura"
              type="submit"
            />
          </template>
        </q-input>
        <div class="full-width q-pt-md">
          <q-btn
            label="ENVIAR"
            color="primary"
            class="full-width"
            outline
            rounded
            ref="selectOption"
            Recebimento
            @click="handleTune(true)"
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
    <q-dialog v-model="imageDialogVisible">
      <div>
        <q-card class="q-pa-md">
          <q-card-actions align="center">
            <q-input
              bottom-slots
              v-model="form.volume"
              label="Qtd. Valume"
              lazy-rules
              type="number"
              outlined
            >
              <template v-slot:append>
                <q-icon
                  v-if="form.notafiscal !== ''"
                  name="close"
                  @click="form.notafiscal = ''"
                  class="cursor-pointer"
                />
              </template>
            </q-input>
          </q-card-actions>
          <q-card-actions align="center">
            <q-btn
              label="OK"
              color="primary"
              class="full-width"
              outline
              rounded
              ref="selectOption"
              Recebimento
              @click="handleConferencia"
            />
          </q-card-actions>
        </q-card>
      </div>
    </q-dialog>
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
    const form = ref({
      notafiscal: "",
      etiqueta: "",
      numConf: "",
      volume: "",
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
    const router = useRouter();
    const imageDialogVisible = ref(false);
    const { notifyError, notifySuccess } = useNotify();
    const { mge, mgecom } = useApi();
    const json = require("../json/request.json");
    const disableNF = ref(false);
    const disableEtiqueta = ref(true);
    const parameter = [];
    const parameters = [];
    const records = [];
    const itens = [];
    const seed = [];
    const originalRows = [];
    const loading = ref(false);
    const filter = ref("");
    const rowCount = ref(0);
    const indexCount = ref(0);
    const rows = ref([...originalRows]);
    const input = ref(null);
    let params = [];
    let peso = ref(0);

    const handleNunota = async () => {
      if (form.value.notafiscal == "") {
        console.log("--");
      } else {
        const req = json.conferenciavendalocnota;
        parameter.unshift({
          type: "I",
          value: form.value.notafiscal,
        });
        req.requestBody.criteria.parameters = parameter;
        const res = await handleMge(req);
        if (res.status == 1) {
          if (res.responseBody.result.length == 0) {
            const req = json.conferenciavendalannota;
            records.unshift({
              values: {
                0: form.value.notafiscal,
              },
            });
            req.requestBody.records = records;

            req.requestBody.records = records;
            const res = await handleMge(req);
            if (res.status == 1) {
              const req = json.salvarCabecalhoConferencia;
              params.unshift({
                nuNota: form.value.notafiscal,
                iniciarRecontagem: false,
              });
              req.requestBody.params = params;
              const conf = await handleMgecom(req);
              form.value.numConf = conf.responseBody.numConf;
              console.log(form.value.numConf);
              notifySuccess("Incluido!");
              disableNF.value = true;
              disableEtiqueta.value = false;
            } else {
              notifyError(res.statusMessage);
              console.log(res);
            }
          } else {
            const req = json.salvarCabecalhoConferencia;
            params.unshift({
              nuNota: form.value.notafiscal,
              iniciarRecontagem: false,
            });
            req.requestBody.params = params;
            const conf = await handleMgecom(req);
            form.value.numConf = conf.responseBody.numConf;
            console.log(form.value.numConf);
            disableNF.value = true;
            disableEtiqueta.value = false;
          }

          const req = json.conferenciavendaitensnota;
          parameters.unshift({
            type: "N",
            value: form.value.notafiscal,
          });
          req.requestBody.criteria.parameters = parameters;
          const ress = await handleMge(req);
          if (ress.status == 1) {
            ress.responseBody.result.forEach(([chave], index) => {
              itens.unshift({
                values: {
                  0: chave,
                },
              });
              // Ou atribua o valor que você quiser aqui
            });

            console.log(itens);
          } else {
            notifyError(ress.statusMessage);
            console.log(ress);
          }
        } else {
          notifyError(res.statusMessage);
          console.log(res);
        }
      }
    };

    const handleConferencia = async () => {
      const req = json.etiquetaConferenciaVenda;
      req.requestBody.records = seed.reverse();
      const res = await handleMge(req);
      if (res.status == 1) {
        await isEtiquetaFila(seed);
        notifySuccess("Incluido!");
        router.push({ name: "ven" });
        window.location.reload(false);
        req.requestBody.records = "";
      } else {
        notifyError(res.statusMessage);
        console.log(res);
      }
    };

    const handleLeitura = async () => {
      if (form.value.etiqueta == "") {
        console.log("--");
      } else {
        loading.value = true;
        let arr = form.value.etiqueta.split("*");
        console.log(!isProdutoExistente(arr[1]));
        if (!isEtiquetaExistente(form.value.etiqueta)) {
          if (
            arr.length == 5 &&
            arr[0].length == 11 &&
            arr[2].length == 6 &&
            arr[3].length == 2 &&
            arr[4].length == 10
          ) {
            if (isProdutoExistente(arr[1])) {
              seed.unshift({
                foreignKey: {
                  NUNOTA: form.value.notafiscal,
                },
                values: {
                  2: form.value.etiqueta,
                },
              });
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
                  //console.log(peso.value);
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
              form.value.etiqueta = "";
              input.value.focus();
            } else {
              var audio = new Audio("../media/error-1.mp3");
              audio.addEventListener("canplaythrough", function () {
                audio.play();
              });
              input.value.focus();
              form.value.etiqueta = "";
              notifyError("O produto conferido não existe no pedido/nota.");
            }
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
      originalRows.splice(val, 1);
      --rowCount.value;

      setTimeout(() => {
        if (rows.value.length === 0) {
          rowCount.value = 0;
          indexCount.value = 0;
        }
        let arr = seed[val].values[0].split("*");
        if (parseInt(arr[2]) / 100 > 1) {
          //console.log(peso.value);
          peso.value = peso.value - parseInt(arr[2]) / 100;
          //console.log(parseInt(arr[2]) / 100);
          //console.log(peso.value);
        }
        seed.splice(val, 1);
        rows.value.splice(val, 1);
        loading.value = false;
      }, 500);
      input.value.focus();
      form.value.etiqueta = "";
    };

    const isEtiquetaExistente = (etiqueta) => {
      return seed.some((item) => {
        //console.log(etiqueta, item.values);
        return String(item.values[2]) === String(etiqueta);
      });
    };

    const isProdutoExistente = (etiqueta) => {
      return itens.some((item) => {
        console.log(item.values);
        return String(item.values[0]) === String(etiqueta);
      });
    };

    const isEtiquetaFila = async (etiqueta) => {
      //return
      const dados = etiqueta.map((item) => {
        return item.values[2].split("*");
      });
      const somaPorChave = {};

      // Percorre os dados
      dados.forEach((item) => {
        const codBarra = item[1];
        const controle = item[4];
        const chave = `${codBarra}_${controle}`;
        // Verifica se a chave já existe no objeto
        if (somaPorChave[chave] == undefined) {
          somaPorChave[chave] = { codBarra, controle, qtdConf: 0 };
        }
        // Soma o valor na posição 2
        somaPorChave[chave].qtdConf += parseInt(item[2]) / 100;
      });
      for (const chave in somaPorChave) {
        const obj = somaPorChave[chave];
        const req = json.salvarItemConferido;
        req.requestBody.params = {
          numConf: form.value.numConf,
          nuNota: form.value.notafiscal,
          codBarra: obj.codBarra,
          controle: "",
          qtdConf: obj.qtdConf,
          substituirProduto: true,
          volume: "",
          exigeIdentificadores: "N",
          codUMA: "",
        };
        await handleMgecom(req);
      }
      const req = json.salvarVolumeSimplificado;
      req.requestBody.params = {
        numConf: form.value.numConf,
        nuNota: form.value.notafiscal,
        volume: form.value.volume,
      };
      await handleMgecom(req);
      const reqc = json.cortar;
      reqc.requestBody.params = {
        nuNota: form.value.notafiscal,
        peso: 0,
        qtdVol: 0,
      };
      await handleMgecom(reqc);
      const reqf = json.finalizarConferencia;
      reqf.requestBody.params = {
        nuConf: form.value.numConf,
        peso: 0,
        qtdVol: 0,
      };
      await handleMgecom(reqf);
    };
    const handleImpressao = async () => {
      const chave = json.impressao;
      const nota = await handleMge(chave);
      console.log(nota);
    };
    const handleMgecom = async (req) => {
      try {
        const res = await mgecom(req);
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
    const handleTune = async (tune) => {
      if (seed == "") {
        notifyError("Sem Produtos");
      } else {
        imageDialogVisible.value = tune;
      }
    };
    return {
      handleLeitura,
      handleConferencia,
      handleExclu,
      handleNunota,
      handleTune,
      handleImpressao,
      form,
      imageDialogVisible,
      disableNF,
      disableEtiqueta,
      peso,
      columns,
      rows,
      loading,
      filter,
      rowCount,
      input,
      selected: ref([]),
    };
  },
});
</script>
