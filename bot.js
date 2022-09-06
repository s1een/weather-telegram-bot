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
    ctx.reply("Welcome", {
      ...mainMenu,
    })
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
  bot.hears("dev", (ctx) =>
    ctx.reply(new Date(1662434374).toLocaleTimeString())
  );
  return bot;
}

module.exports = {
  setupBot,
};
