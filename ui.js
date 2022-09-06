const { Markup } = require("telegraf");
const { SMD_TEXT } = require("./const");

const mainMenu = Markup.keyboard([
  [SMD_TEXT.currentWeatherByLocation],
  [SMD_TEXT.currentWeatherByCity],
  [SMD_TEXT.forecastByLocation],
  [SMD_TEXT.forecastByCity],
]).resize();

// const secondMenu = Markup.keyboard([
// [SMD_TEXT.weaherByCity],
// [SMD_TEXT.weatherByLocation],
// ]).resize();

const getMoreBtn = Markup.button.callback(SMD_TEXT.getMore, "get_more");
const nextBtn = Markup.button.callback("❯", "next");
const prevBtn = Markup.button.callback("❮", "prev");

module.exports = {
  mainMenu,
  getMoreBtn,
  nextBtn,
  prevBtn,
};
