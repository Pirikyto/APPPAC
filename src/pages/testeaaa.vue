<template>
  <q-page padding>
    <div class="q-pa-md q-gutter-md q-layout"></div>
    <div class="q-pa-md q-gutter-md">
      <q-carousel
        swipeable
        animated
        v-model="currentSlice"
        ref="carousel"
        infinite
      >
        <q-carousel-slide
          v-for="slide in slides"
          :key="slide.name"
          :name="slide.name"
          :img-src="slide.imgsrc"
        />
        <template v-slot:control>
          <q-carousel-control
            position="bottom-left"
            :offset="[18, 18]"
            class="q-gutter-xs"
          >
            <q-btn
              class="cursor-pointer"
              push
              dense
              icon="chevron_left"
              unelevated
              @click="$refs.carousel.previous()"
            />
          </q-carousel-control>
          <q-carousel-control
            position="bottom-right"
            :offset="[18, 18]"
            class="q-gutter-xs"
          >
            <q-btn
              class="cursor-pointer"
              push
              dense
              icon="chevron_right"
              unelevated
              @click="$refs.carousel.next()"
            />
          </q-carousel-control>
        </template>
      </q-carousel>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "IndexPage",

  setup() {
    let numeroAtual = 1288;
    const currentSlice = ref(1);

    const slides = [
      {
        name: 1,
        imgsrc:
          "http://193.123.121.64:8180/mge/Produto@IMAGEM@CODPROD=1288.dbimage",
      },

      { name: 2, imgsrc: "https://cdn.quasar.dev/img/parallax1.jpg" },

      { name: 3, imgsrc: "https://cdn.quasar.dev/img/parallax2.jpg" },

      { name: 4, imgsrc: "https://cdn.quasar.dev/img/quasar.jpg" },
    ];
    const imageSource = ref(
      `http://193.123.121.64:8180/mge/Produto@IMAGEM@CODPROD=${numeroAtual}.dbimage`
    );

    const proximo = () => {
      numeroAtual++;
      imageSource.value = `http://193.123.121.64:8180/mge/Produto@IMAGEM@CODPROD=${numeroAtual}.dbimage`;
      console.log(imageSource.value);
      console.log(numeroAtual);
    };

    const anterior = () => {
      if (numeroAtual > 1) {
        numeroAtual--;
        imageSource.value = `http://193.123.121.64:8180/mge/Produto@IMAGEM@CODPROD=${numeroAtual}.dbimage`;
        console.log(numeroAtual);
      }
    };
    const handleProduto = async () => {
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
    return {
      handleProduto,
      proximo,
      anterior,
      imageSource,
      numeroAtual,
      slides,
      currentSlice,
    };
  },
});
</script>
