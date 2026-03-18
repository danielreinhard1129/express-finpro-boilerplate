import { App } from "./app.js";

const main = async () => {
  const app = new App();
  await app.start();
};

main();
