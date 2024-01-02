<template>
  <q-page padding>
    <p class="col-12 text-h5 text-center">
      Recebimento
      <q-btn
        round
        dense
        flat
        icon="tune"
        @click="handleTune(true)"
        type="submit"
      />
      <q-btn
        round
        dense
        flat
        icon="tune"
        @click="handleImpressao"
        type="submit"
      />
    </p>
    <q-form class="row justify-center" @submit.prevent="handleEtiqueta">
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
    <q-form class="row justify-center" @submit.prevent="handleEtiqueta">
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-select
          v-model="model"
          :options="options"
          label="Produto"
          input-debounce="0"
          @filter="filterFn"
          style="width: 250px"
          behavior="dialog"
          popup-cover
          popup-content-class="custom-q-select"
          :disable="disablePRO"
          :loading="loading"
          @update:model-value="handleSelectChange(model)"
        />
      </div>
    </q-form>
    <q-form class="row justify-center" @submit.prevent="handleEtiqueta">
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-input
          bottom-slots
          v-model="form.datefab"
          label="Data de Fabricação"
          type="date"
          lazy-rules
          :disable="disableFAB"
        >
          <template v-slot:append>
            <q-icon
              v-if="form.datefab !== ''"
              name="close"
              @click="form.datefab = ''"
              class="cursor-pointer"
            />
          </template>
          <template v-slot:after>
            <q-btn
              round
              dense
              flat
              icon="send"
              :disable="disableFAB"
              @click="handleFabricacao"
              type="submit"
            />
          </template>
        </q-input>
      </div>
    </q-form>
    <q-form class="row justify-center" @submit.prevent="handleEtiqueta">
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-input
          bottom-slots
          v-model="form.dateval"
          label="Data de Validade"
          type="date"
          lazy-rules
          :disable="disableVAL"
        >
          <template v-slot:append>
            <q-icon
              v-if="form.dateval !== ''"
              name="close"
              @click="form.dateval = ''"
              class="cursor-pointer"
            />
          </template>
          <template v-slot:after>
            <q-btn
              round
              dense
              flat
              icon="send"
              :disable="disableVAL"
              type="sub"
              @click="handleValidade"
            />
          </template>
        </q-input>
      </div>
    </q-form>
    <q-form class="row justify-center" @submit.prevent="handleEtiqueta">
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-input
          bottom-slots
          v-model="form.qtd"
          label="Quantidade"
          type="number"
          lazy-rules
          :disable="disableQTD"
          ref="input"
        >
          <template v-slot:append>
            <q-icon
              v-if="form.qtd !== ''"
              name="close"
              @click="form.qtd = ''"
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
              @click="handleQtd"
            />
          </template>
        </q-input>

        <q-btn
          label="Enviar"
          color="primary"
          class="full-width"
          outline
          rounded
          type="submit"
          ref="selectOption"
          :disable="loadingEnv"
        />
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
              <q-td>Peso : {{ peso }}</q-td>
              <q-td>Produto: {{ rowCount }}</q-td>
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

    <q-dialog v-model="imageDialogVisible">
      <div>
        <q-card class="q-pa-md">
          <q-card-actions align="center">
            <q-input
              bottom-slots
              v-model="range.min"
              label="Inicial"
              lazy-rules
              type="number"
              outlined
            >
              <template v-slot:append>
                <q-icon
                  v-if="range.min !== 0"
                  name="close"
                  @click="range.min = 0"
                  class="cursor-pointer"
                />
              </template>
            </q-input>
            <q-input
              bottom-slots
              v-model="range.max"
              label="Final"
              lazy-rules
              type="number"
              outlined
            >
              <template v-slot:append>
                <q-icon
                  v-if="range.max !== 0"
                  name="close"
                  @click="range.max = 0"
                  class="cursor-pointer"
                />
              </template>
            </q-input>
          </q-card-actions>
          <q-card-actions align="center">
            <q-btn color="primary" label="OK" @click="handleTune(false)" />
          </q-card-actions>
        </q-card>
      </div>
    </q-dialog>
  </q-page>
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
        label: "Produto",
        align: "left",
        field: (row) => row.name,
        format: (val) => `${val}`,
      },
    ];
    const range = ref({
      min: 0,
      max: 0,
    });
    const originalRows = [];
    const form = ref({
      notafiscal: "",
      datefab: "",
      dateval: "",
      qtd: "",
      nota: "",
    });
    const options = ref([]);
    const imageDialogVisible = ref(false);
    const router = useRouter();
    const disableNF = ref(false);
    const disablePRO = ref(true);
    const disableFAB = ref(true);
    const disableVAL = ref(true);
    const disableQTD = ref(true);
    const loadingEnv = ref(true);
    const loading = ref(false);
    const rowCount = ref(0);
    const indexCount = ref(0);
    const model = ref("");
    const rows = ref([...originalRows]);
    const { notifyError, notifySuccess } = useNotify();
    const { mge } = useApi();
    const json = require("../json/request.json");
    const parameter = [];
    const records = [];
    const seed = [];
    const input = ref(null);
    let peso = ref(0);

    var CODINS = "";
    var CODDADOSET = "";

    const handleNunota = async () => {
      //json da busca

      //valida se foi informado o numero unico da nota
      if (form.value.notafiscal == "") {
        console.log("--");
      } else {
        parameter.unshift({
          $: form.value.notafiscal,
          type: "S",
        });
        const chave = json.consultaNotaChave;
        chave.requestBody.dataSet.criteria.parameter = parameter;
        const nota = await obterNunota(chave);
        console.log(nota);
        parameter.splice(0, parameter.length);
        form.value.notafiscal = nota;
        const req = json.conferenciageretiq;
        parameter.unshift({
          type: "I",
          value: form.value.notafiscal,
        });
        req.requestBody.criteria.parameters = parameter;
        try {
          const res = await mge(req);
          if (res.status == 1 && res.responseBody.total == 1) {
            try {
              const res = await mge(req);
              if (res.status == 1) {
                notifySuccess("Localizado!");
                const arr = res.responseBody.result[0];
                //console.log(arr[0]);
                parameter.splice(0);
                parameter.unshift({
                  type: "N",
                  value: arr[0],
                });
                //console.log(parameter);
                const req2 = json.consultaproduto;
                req2.requestBody.criteria.parameters = parameter;
                //console.log(req2);
                try {
                  const res2 = await mge(req2);
                  if (res2.status == 1) {
                    try {
                      const res2 = await mge(req2);
                      //console.log(res2);
                      if (res2.status == 1) {
                        disableNF.value = true;
                        disablePRO.value = false;
                        loading.value = true;
                        setTimeout(() => {
                          notifySuccess("Carregando Produtos!");
                          router.push({ name: "rec" });
                          const opt = res2.responseBody.result;
                          //console.log(opt);
                          for (const key in opt) {
                            if (
                              Array.isArray(opt[key]) &&
                              opt[key].length > 0
                            ) {
                              options.value.push({
                                label: opt[key][0] + " - " + opt[key][5],
                                value: opt[key][1],
                                fab: opt[key][2],
                                val: opt[key][3],
                                nota: opt[key][4],
                              });
                            }
                          }
                        }, 500);
                        //console.log(options.value);
                        loading.value = false;
                        loadingEnv.value = false;
                      } else {
                        notifyError(res.statusMessage);
                        console.log(res2);
                      }
                    } catch (error) {
                      notifyError(error.message);
                    }
                  } else {
                    notifyError(res2.statusMessage);
                    console.log(res2);
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
          } else {
            notifyError(res.statusMessage);
            console.log(res);
          }
        } catch (error) {
          notifyError(error.message);
        }
      }
    };
    const handleSelectChange = async (selectedModel) => {
      //console.log(selectedModel);
      loading.value = true;
      if (selectedModel.fab == "") {
        form.value.datefab = "";
        disableFAB.value = false;
      } else {
        disableFAB.value = false;
        const dataFormato = selectedModel.fab;
        const partesData = dataFormato.split("/"); // Dividir a data em partes
        form.value.datefab = `${partesData[2]}-${partesData[1]}-${partesData[0]}`;
        disableFAB.value = true;
        console.log(form.value);
      }
      if (selectedModel.val == "") {
        disableVAL.value = false;
      } else {
        disableVAL.value = false;
        const dataFormato = selectedModel.val;
        const partesData = dataFormato.split("/"); // Dividir a data em partes
        form.value.dateval = `${partesData[2]}-${partesData[1]}-${partesData[0]}`;
        disableVAL.value = true;
      }
      if (disableVAL.value == true && disableFAB.value == true) {
        disableQTD.value = false;
      }
      //console.log(selectedModel.nota);
      CODINS = selectedModel.nota;
      CODDADOSET = selectedModel.value;
      //1547930
      console.log(CODINS);
      loading.value = false;
    };
    const handleFabricacao = async () => {
      const dataFormato = form.value.datefab;
      const partesData = dataFormato.split("-"); // Dividir a data em partes
      const dataFormata = `${partesData[2]}/${partesData[1]}/${partesData[0]}`;
      model.value.fab = dataFormata;
      records.splice(0);
      records.unshift({
        pk: {
          CODINS: CODINS,
          CODDADOSET: CODDADOSET,
        },
        foreignKey: {
          CODINS: CODINS,
        },
        values: {
          5: dataFormata,
        },
      });
      const req = json.atualizafabricacao;
      req.requestBody.records = records;
      try {
        const res = await mge(req);
        if (res.status == 1) {
          try {
            const res = await mge(req);

            if (res.status == 1) {
              setTimeout(() => {
                notifySuccess("Data Incluida!");
                disableFAB.value = true;
                if (disableVAL.value == true && disableFAB.value == true) {
                  disableQTD.value = false;
                }
              }, 500);
              //loading.value = false;
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
    const handleValidade = async () => {
      const dataFormato = form.value.dateval;
      const partesData = dataFormato.split("-"); // Dividir a data em partes
      const dataFormata = `${partesData[2]}/${partesData[1]}/${partesData[0]}`;
      model.value.val = dataFormata;
      records.splice(0);
      records.unshift({
        pk: {
          CODINS: CODINS,
          CODDADOSET: CODDADOSET,
        },
        foreignKey: {
          CODINS: CODINS,
        },
        values: {
          6: dataFormata,
        },
      });
      const req = json.atualizafabricacao;
      req.requestBody.records = records;
      try {
        const res = await mge(req);
        if (res.status == 1) {
          try {
            const res = await mge(req);

            if (res.status == 1) {
              setTimeout(() => {
                notifySuccess("Data Incluida!");
                disableVAL.value = true;
                if (disableVAL.value == true && disableFAB.value == true) {
                  disableQTD.value = false;
                }
              }, 500);
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

    const handleQtd = async () => {
      form.value.qtd = obterParteString(
        form.value.qtd,
        range.value.min,
        range.value.max
      );
      if (form.value.qtd == "") {
        console.log("--");
      } else {
        loading.value = true;
        seed.unshift({
          foreignKey: {
            CODDADOSET: CODDADOSET,
            CODINS: CODINS,
          },

          values: {
            3: form.value.qtd,
          },
        });

        let arr = form.value.qtd;
        originalRows.push({
          name: model.value.label,
          peso: form.value.qtd,
        });
        console.log(originalRows);
        setTimeout(() => {
          if (rows.value.length === 0) {
            rowCount.value = 0;
            indexCount.value = 0;
          }
          peso.value = peso.value + parseInt(arr);
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
        form.value.qtd = "";
      }
    };
    const handleEtiqueta = async () => {
      loadingEnv.value = true;
      const req = json.atualizapeso;
      req.requestBody.records = seed.reverse();
      console.log(req);
      try {
        const res = await mge(req);
        if (res.status == 1) {
          await handleImpressao();
          notifySuccess("Incluido!");
          setTimeout(() => {
            router.push({ name: "rec" });
            window.location.reload(false);
          }, 10000);
        } else {
          notifyError(res.statusMessage);
          console.log(res);
        }
      } catch (error) {
        notifyError(error.message);
      }
      notifySuccess("Incluido!");
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
        console.log(seed);
        let arr = seed[val].values[3];
        peso.value = peso.value - parseInt(arr);
        seed.splice(val, 1);
        rows.value.splice(val, 1);
        loading.value = false;
      }, 500);
      input.value.focus();
      form.value.etiqueta = "";
    };
    const handleTune = async (tune) => {
      imageDialogVisible.value = tune;
    };

    const obterParteString = (string, inicio, fim) => {
      // Certifique-se de que as posições são válidas
      if (inicio === 0 && fim === 0) {
        return string;
      }

      // Certifique-se de que as posições são válidas
      if (inicio >= 0 && fim >= inicio && fim <= string.length) {
        const parteDaString = string.substring(inicio, fim);

        // Tente converter a parte da string em número
        const numero = parseFloat(parteDaString);

        if (!isNaN(numero)) {
          // Se for um número válido, divida por 100
          return numero / 100;
        } else {
          return ""; // ou qualquer valor que você deseje retornar em caso de erro
        }
      } else {
        return ""; // ou qualquer valor que você deseje retornar em caso de erro
      }
    };
    const obterNunota = async (json) => {
      const notafiscal = form.value.notafiscal;
      if (notafiscal.length === 44) {
        try {
          const res = await mge(json);
          if (res.status == 1) {
            return res.responseBody.entities.entity.f0.$;
          } else {
            return notifyError(res.statusMessage);
          }
        } catch (error) {
          return notifyError(error.message);
        }
      } else {
        return form.value.notafiscal;
      }
    };

    const handleImpressao = async () => {
      const req = json.executeScript;
      const nota = await handleMge(req);
      req.requestBody.runScript.rows.row[0].field = {
        fieldName: "CODINS",
        $: CODINS,
      };
      console.log(req);
      const req2 = json.saveSubstitutePrinter;
      req2.requestBody.substitutePrintersRequest.transactionId = {
        $: nota.transactionId,
      };
      const nota2 = await handleMge(req2);
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
      model,
      options,
      disableNF,
      disablePRO,
      disableFAB,
      disableVAL,
      disableQTD,
      loadingEnv,
      loading,
      columns,
      rows,
      rowCount,
      input,
      peso,
      range,
      imageDialogVisible,
      handleNunota,
      handleSelectChange,
      handleFabricacao,
      handleValidade,
      handleQtd,
      handleEtiqueta,
      handleExclu,
      handleTune,
      handleImpressao,
    };
  },
});
</script>
