const { Scenes } = require("telegraf");
const { getMoreBtn, nextBtn, prevBtn } = require("./ui");
const { getWeather, getCoords, getForecast } = require("./weatherApi");

const whatWeatherScene = new Scenes.BaseScene("weatherByLocation");
whatWeatherScene.enter((ctx) => ctx.reply("Send me your location..."));

whatWeatherScene.on("location", async (ctx) => {
  try {
    const msg = ctx.message;
    const { latitude, longitude } = msg.location;
    const data = await getWeather(latitude, longitude);
    makeWeatherMsg(data, ctx);
    return ctx.scene.leave("weatherByLocation");
  } catch (error) {
    console.log(error);
    ctx.reply("Ooops,error!");
    return ctx.scene.leave("weatherByLocation");
  }
});

const weatherByCityScene = new Scenes.BaseScene("weatherByCity");
weatherByCityScene.enter((ctx) => ctx.reply("Send me city name..."));

weatherByCityScene.on("text", async (ctx) => {
  try {
    const city = ctx.message.text;
    const data = await getCoords(city);
    const result = await getWeather(data[0].lat, data[0].lon);
    ctx.replyWithSticker(`${getSticker(result.weather[0].main)}`, {
      reply_markup: {
        inline_keyboard: [[getMoreBtn]],
      },
    });
    weatherByCityScene.on("callback_query", async (ctx) => {
      ctx.deleteMessage();
      makeWeatherMsg(result, ctx);
      return ctx.scene.leave("weatherByCity");
    });
  } catch (error) {
    console.log(error);
    ctx.reply("Ooops,error!");
    return ctx.scene.leave("weatherByCity");
  }
});

const forecastByLocation = new Scenes.BaseScene("forecastByLocation");
forecastByLocation.enter((ctx) => ctx.reply("Send me your location..."));
forecastByLocation.on("location", async (ctx) => {
  try {
    const msg = ctx.message;
    const { latitude, longitude } = msg.location;
    const data = await getForecast(latitude, longitude);
    const { list } = data;
    let count = 0;
    await ctx.reply(makeForecastMsg(list, count), {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[prevBtn, nextBtn]],
      },
    });
    forecastByLocation.on("callback_query", async (ctx) => {
      ctx.answerCbQuery();
      if (ctx.callbackQuery.data === "next") {
        count += 1;
      } else count -= 1;
      if (count <= list.length - 1 && count >= 0) {
        await ctx.editMessageText(makeForecastMsg(list, count), {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [[prevBtn, nextBtn]],
          },
        });
      } else ctx.reply("Last Page");
    });
  } catch (error) {
    console.log(error);
    ctx.reply("Ooops,error!");
    return ctx.scene.leave("forecastByLocation");
  }
});

const forecastByCity = new Scenes.BaseScene("forecastByCity");
forecastByCity.enter((ctx) => ctx.reply("Send me city name..."));
forecastByCity.on("text", async (ctx) => {
  try {
    const city = ctx.message.text;
    const data = await getCoords(city);
    const result = await getForecast(data[0].lat, data[0].lon);
    const { list } = result;
    let count = 0;
    await ctx.reply(makeForecastMsg(list, count), {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[prevBtn, nextBtn]],
      },
    });
    forecastByCity.on("callback_query", async (ctx) => {
      ctx.answerCbQuery();
      if (ctx.callbackQuery.data === "next") {
        count += 1;
      } else count -= 1;
      if (count <= list.length - 1 && count >= 0) {
        await ctx.editMessageText(makeForecastMsg(list, count), {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [[prevBtn, nextBtn]],
          },
        });
      } else ctx.reply("Last Page");
    });
  } catch (error) {
    console.log(error);
    ctx.reply("Ooops,error!");
    return ctx.scene.leave("forecastByCity");
  }
});

module.exports = {
  whatWeatherScene,
  weatherByCityScene,
  forecastByCity,
  forecastByLocation,
};

async function makeWeatherMsg(data, ctx) {
  const { weather, main, wind } = data;
  let emj = getEmoji(data.weather[0].main);
  await ctx.replyWithHTML(`
<em>${data.name} ${data.sys.country}</em>
<b>${weather[0].main}</b> ${emj}
Description: ${weather[0].description}
Feels Like: ${Math.floor(main.feels_like)} °C
Temp: ${Math.floor(main.temp)} °C
Temp intervals: ${Math.floor(main.temp_min)} - ${Math.floor(main.temp_max)} °C
Pressure: ${main.pressure}
Humidity: ${main.humidity} %
Wind Speed: ${wind.speed} km/h
      `);
}
function getEmoji(weather) {
  if (weather === "Clouds") return "☁️";
  else if (weather === "Sun") return "☀️";
  else if (weather === "Rain") return "🌧️";
  else if (weather === "Snow") return "🌨️";
  else return "☀️";
}

function makeForecastMsg(list, count) {
  return `
<em>${list[count].dt_txt}</em>
<b>${list[count].weather[0].main}</b> ${getEmoji(list[count].weather[0].main)}
Description: ${list[count].weather[0].description}
Feels Like: ${Math.floor(list[count].main.feels_like)} °C
Temp: ${Math.floor(list[count].main.temp)} °C
Temperature intervals: ${Math.floor(list[count].main.temp_min)} - ${Math.floor(
    list[count].main.temp_max
  )} °C
Pressure: ${list[count].main.pressure}
Humidity: ${list[count].main.humidity} %
    `;
}
function getSticker(weather) {
  if (weather === "Clouds")
    return "https://tlgrm.ru/_/stickers/cb8/759/cb87594f-a181-3b29-9f38-391169c75c7a/11.webp";
  else if (weather === "Sun")
    return "https://tlgrm.ru/_/stickers/cb8/759/cb87594f-a181-3b29-9f38-391169c75c7a/4.webp";
  else if (weather === "Rain")
    return "https://tlgrm.ru/_/stickers/cb8/759/cb87594f-a181-3b29-9f38-391169c75c7a/9.webp";
  else if (weather === "Snow")
    return "https://tlgrm.ru/_/stickers/cb8/759/cb87594f-a181-3b29-9f38-391169c75c7a/7.webp";
  else
    return "https://tlgrm.ru/_/stickers/893/dd2/893dd2f0-1a6e-4244-af64-ce6ab5c4e74a/12.webp";
}
