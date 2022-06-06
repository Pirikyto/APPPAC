<template>
  <q-page>
    <div class="q-pa-md">
      <q-table title="Treats" :rows="rows" :columns="columns" row-key="name" />
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
      columns: [
        {
          name: "f0",
          label: "f0",
          align: "left",
          sortable: true,
        },
        {
          name: "f1",
          label: "f1",
          align: "left",
          sortable: true,
        },
      ],
      rows: [],
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
        this.login = await posts(log, res);
        const token = this.login.responseBody.jsessionid.$;
        const req = this.data.pedido;
        const dados = await gets(req, res, token);
        //console.log(dados.responseBody.entities.entity);
        this.rows = dados.responseBody.entities.entity;
        //console.log(this.rows);

        const entity = dados.responseBody.entities.entity;
        const field = dados.responseBody.entities.metadata.fields.field;
        //console.log(entity);
        //console.log(field);
        // entity.map((res, index) => {
        //   //const aux = entity[index];
        //   console.log(res, field[index]);
        // });

        // field.map((f0) => {
        //   //console.log(f0);
        // });
        // entity.forEach((res, index, array) => {
        //   console.log(res, index);
        // });
        const novoArray = [];
        // console.log(novoArray);
        for (var i = 0; i < entity.length; i++) {
          //console.log(i);
          var obj = entity[i];
          var e = 0;
          var str = "";
          for (var key in obj) {
            //console.log(field[e].name);
            //console.log(obj[key]);

            //obj[key] = JSON.stringify(obj[key].$).replace(/[^a-z0-9/]/gi, "");
            str =
              str +
              JSON.stringify(field[e].name).replace(/[^a-z0-9/]/gi, "") +
              ":" +
              JSON.stringify(obj[key].$).replace(/[^a-z0-9/]/gi, "") +
              ", ";
            //console.log(str);
            e++;
          }
          novoArray.push(JSON.parse("{" + str + "}"));
          console.log(novoArray);
          //console.log(obj);
          entity[i] = obj;
          //console.log(entity);
        }
        //this.rows = entity;
        console.log(this.rows);
      }
    },
  },

  //Start da Aplicação
  async beforeMount() {
    this.data = require("../json/request.json");
    await this.main();
    //console.log(this.rows);
  },
};
</script>
