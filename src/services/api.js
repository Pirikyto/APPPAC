import axios from "axios";
export { posts, gets };

// default options config: { expires: '1d', path: '/', domain: '', secure: '', sameSite: 'Lax' }

const api = axios.create({
  timeout: 10000,
  params: { outputType: "json" },
});
//Definição dos metodos para utilização da APIs em sistema Sankhya!!
//Metodo Post
const posts = async (req, res) => {
  api.defaults.params["serviceName"] = req.serviceName;
  res = await api
    //Para Utilização do metodo Post a Requisição sempre feita em URL/api devido ao proxy configurado no quasar.config(nunca utilizar na apliacação)
    .post("/api", req)
    .then((response) => {
      //console.log(response.data);
      res = response.data;
      //const hasIt = $q.cookies.has("cookies");
      console.log($q);
    })
    .catch((error) => {
      // handle error
      res = error.data;
    })
    .then(() => {
      //console.log(res);
      return res;
    });
  //console.log(res);
  return res;
};

const gets = async (req, res) => {
  api.defaults.params["serviceName"] = req.serviceName;
  api.defaults.params["mgeSession"] = req.Cookie;
  // api.defaults.headers.common["Cookie"] = req.Cookie;
  //console.log(api.defaults);
  //res = await
  api
    .get("/api", req)
    .then((response) => {
      console.log(response.data);
      //console.log("aki");
      res = response.data;
    })
    .catch((error) => {
      // handle error
      console.log(error);
      res = error.data;
    })
    .then(() => {
      //console.log(res);
      return res;
    });
  //console.log(res);
  //return res;
};
