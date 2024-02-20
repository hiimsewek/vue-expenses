import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import "primevue/resources/themes/aura-dark-teal/theme.css";
import "primeicons/primeicons.css";
import "@/assets/global.css";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(PrimeVue);

app.mount("#app");
