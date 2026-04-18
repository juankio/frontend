export default defineNuxtPlugin((nuxtApp) => { nuxtApp.vueApp.config.errorHandler = (err, vm, info) => { console.error("Vue Error:", err, info); }; });
