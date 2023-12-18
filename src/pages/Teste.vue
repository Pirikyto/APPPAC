<template>
  <q-select
    outlined
    v-model="selection"
    :options="filteredOptions"
    label="Produtos"
    option-label="label"
    option-value="label"
    filled
    use-input
    hide-selected
    fill-input
    input-debounce="0"
    @filter="filterFunction"
    menu-anchor="self"
  >
  </q-select>
  <q-list bordered padding separator>
    <q-item>
      <q-item-section>
        <q-item-label header>Produto</q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-item-label header>Qtd.</q-item-label>
      </q-item-section>
    </q-item>
    <q-item v-for="lists in filteredOptions" :key="lists.ID">
      <q-item-section avatar>
        <img
          :src="
            'http://193.123.121.64:8180/mge/Produto@IMAGEM@CODPROD=' +
            lists.value +
            '.dbimage'
          "
          alt="Ícone"
          class="q-icon"
          @click="
            openImageDialog(
              'http://193.123.121.64:8180/mge/Produto@IMAGEM@CODPROD=' +
                lists.value +
                '.dbimage'
            )
          "
        />
      </q-item-section>
      <q-item-section>
        <q-item-label caption
          >{{ lists.value }} - Qtd.:
          {{ formatEstoque(lists.estoque) }}</q-item-label
        >
        <q-item-label>{{ lists.label }}</q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-item-label>
          <q-input
            maxlength="4"
            suffix="Kg"
            style="width: 70px"
            type="number"
            v-model="inputValues[lists.value]"
          ></q-input
        ></q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
  <q-dialog v-model="imageDialogVisible">
    <q-img
      :src="largeImageUrl"
      spinner-color="white"
      :ratio="16 / 9"
      height="90%"
      :fit="contain"
    />
  </q-dialog>
</template>
<style scoped>
.q-icon {
  border-radius: 10%; /* Para criar uma borda circular se necessário */
}
</style>
<script>
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import useNotify from "../services/useNotify";
import useApi from "../services/useApi";

export default defineComponent({
  name: "IndexPage",

  setup() {
    const options = ref([]); // Usando um ref para a lista
    const filteredOptions = ref([]);
    const selection = ref();
    const router = useRouter();
    const { notifyError, notifySuccess } = useNotify();
    const { mge } = useApi();
    const json = require("../json/request.json");
    const req = json.consultaEstoque;
    const imageDialogVisible = ref(false);
    const searchDialogVisible = ref(false);
    const largeImageUrl = ref("");
    const search = ref(""); // Alterado
    const showBottomButton = ref(true);
    const inputValues = ref([]);

    const handleProdutos = async () => {
      try {
        const res = await mge(req);
        if (res.status == 1) {
          notifySuccess("Localizado!");
          router.push({ name: "teste" });
          options.value = res.responseBody.entities.entity.map((item) => ({
            label: item.f0.$ + " - " + item.f7.$,
            value: item.f0.$,
            estoque: item.f1.$,
            qtd: "1",
          }));

          filteredOptions.value = options.value;
        } else {
          notifyError(res.statusMessage);
          console.log(res);
        }
      } catch (error) {
        notifyError(error.message);
      }
    };

    const openImageDialog = (imageUrl) => {
      largeImageUrl.value = imageUrl;
      imageDialogVisible.value = true;
    };
    const formatEstoque = (estoque) => {
      // Aplicar máscara ao estoque (duas casas decimais e substituir ponto por vírgula)
      if (estoque !== null && estoque !== undefined) {
        const formattedEstoque = parseFloat(estoque)
          .toFixed(4)
          .replace(".", ",");
        return formattedEstoque;
      }
      return "";
    };
    const filterFunction = (val, update) => {
      if (val === "") {
        update(() => {
          filteredOptions.value = options.value;
        });
      }

      update(() => {
        const needle = val.toLowerCase();

        filteredOptions.value = options.value.filter((option) => {
          return option.label.toLowerCase().includes(needle);
        });
      });
    };

    const handleScroll = (event) => {
      const { target } = event;
      const atBottom =
        target.scrollHeight - target.scrollTop === target.clientHeight;
      showBottomButton.value = !atBottom;
    };

    onMounted(() => {
      handleProdutos();
    });

    return {
      options,
      filteredOptions,
      selection,
      handleProdutos,
      imageDialogVisible,
      searchDialogVisible,
      largeImageUrl,
      formatEstoque,
      openImageDialog,
      filterFunction,
      showBottomButton,
      handleScroll,
      inputValues,
      search, // Adicionado
    };
  },
});
</script>
