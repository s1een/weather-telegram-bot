const { setupBot } = require("./bot");

async function start() {
  try {
    await setupBot().launch();
  } catch (error) {
    console.log(error);
  }
}

start();
