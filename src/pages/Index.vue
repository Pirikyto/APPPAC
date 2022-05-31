<template>
  <q-page>
    <div class="q-pa-md">abc</div>
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
      const requ = location.pathname;
      const res = {};
      //const dados = {};
      //JSON da Api

      //Definição do Fluxo Sistemico
      if (requ == "/login") {
        //Metodo Post
        const req1 = this.data.login;
        this.login = await posts(req1, res);
        console.log(this.login);
        this.data.pedido.Cookie =
          "JSESSIONID=" + this.login.responseBody.jsessionid;
        console.log(this.data.pedido.Cookie);
      } else if (requ == "/pedido") {
        const req1 = this.data.login;
        this.login = await posts(req1, res);
        //console.log(this.login);
        this.data.pedido.Cookie =
          "'SESSIONID=" +
          JSON.stringify(this.login.responseBody.jsessionid.$).replace(
            /"/g,
            ""
          );
        console.log(this.data.pedido.Cookie);
        //Metodo Get
        const req = this.data.pedido;
        const dados = await gets(req, res);
        //console.log(dados);
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
