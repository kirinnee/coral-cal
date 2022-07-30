import {createApp} from 'vue'
import App from './App.vue'
import {Inkline, components} from '@inkline/inkline';
import '@inkline/inkline/inkline.scss';
import "./main.scss";
import {Kore} from "@kirinnee/core";
import "@js-joda/timezone";

const core = new Kore();
core.ExtendPrimitives();
const app = createApp(App);

app.use(Inkline, {
    components,
    colorMode: 'dark'
});
app.mount('#app');
export {core};
