<template>
  <q-page>
    <div class="q-pa-md">
      <q-table title="Treats" :rows="rows" :columns="columns" />
    </div>
  </q-page>
</template>
<script>
import { posts, gets } from "../services/api";
export default {
  name: "IndexPage",
  //Variaveis de dados

  data() {
    return {
      dado: [],
      rows: [],
      columns: [],
    };
  },
  login() {
    return {
      dados: {},
    };
  },

  //Metodos da aplicação
  methods: {
    async main() {
      const path = location.pathname;
      const res = [];
      if (path == "/login") {
        const log = this.data.login;
        this.login = await posts(log, res);
      } else if (path == "/pedido") {
        const log = this.data.login;
        this.login = await login(log, res);
        const token = this.login.responseBody.jsessionid.$;
        const req = this.data.pedido;
        const dados = await gets(req, res, token);
        //console.log(dados.responseBody.entities.entity);
        this.rows = dados.responseBody.entities.entity;
        const entity = dados.responseBody.entities.entity;
        const field = dados.responseBody.entities.metadata.fields.field;
        //console.log(field);
        for (var i = 0; i < field.length; i++) {
          const json =
            '{"name":' +
            JSON.stringify(field[i].name) +
            ', "label":' +
            JSON.stringify(field[i].name) +
            ',"field":"f' +
            i +
            '"}';
          console.log(json);
          const obj = JSON.parse(json);
          console.log(obj);
          field[i] = obj;
        }
        this.columns = field;
        console.log(field);
        for (var i = 0; i < entity.length; i++) {
          var obj = entity[i];
          for (var key in obj) {
            obj[key] = JSON.stringify(obj[key].$).replace(/[^a-z0-9/]/gi, "");
          }
          entity[i] = obj;
        }
      }
    },
  },

  //Start da Aplicação
  async beforeMount() {
    this.data = require("../json/request.json");
    await this.main();
  },
};
</script>
