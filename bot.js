const { Telegraf, Scenes, session } = require("telegraf");
const { mainMenu, secondMenu } = require("./ui");
const { SMD_TEXT } = require("./const");
const {
  whatWeatherScene,
  weatherByCityScene,
  forecastByCity,
  forecastByLocation,
} = require("./weatherScenes");
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);

const stage = new Scenes.Stage([
  whatWeatherScene,
  weatherByCityScene,
  forecastByCity,
  forecastByLocation,
]);

// const stage = new Scenes.Stage([])
function setupBot() {
  bot.use(session({ collectionName: "sessions" }));
  bot.use(stage.middleware());

  bot.use((ctx, next) => {
    // console.log(ctx);
    return next();
  });
  // cmd
  bot.start((ctx) =>
    ctx.replyWithHTML(
      `
Hello, <a href="https://t.me/${ctx.from.username}">${ctx.from.first_name}.</a> 🤩
I'm @my_node_test_bot 🤖 and my purpose is to show you the weather forecast. Choose a search method, and let's check out what I can do.`,
      {
        disable_web_page_preview: true,
        ...mainMenu,
      }
    )
  );
  bot.help((ctx) => ctx.reply("Some help text"));
  // menu btns
  bot.hears(SMD_TEXT.currentWeatherByLocation, (ctx) =>
    ctx.scene.enter("weatherByLocation")
  );
  bot.hears(SMD_TEXT.currentWeatherByCity, (ctx) =>
    ctx.scene.enter("weatherByCity")
  );
  bot.hears(SMD_TEXT.forecastByLocation, (ctx) =>
    ctx.scene.enter("forecastByLocation")
  );
  bot.hears(SMD_TEXT.forecastByCity, (ctx) =>
    ctx.scene.enter("forecastByCity")
  );
  return bot;
}

module.exports = {
  setupBot,
};
