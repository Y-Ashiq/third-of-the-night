import axios from "axios";
import * as cheerio from "cheerio";
import moment from "moment";
import express from "express";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());
async function scrapePrayerTimes(url) {
  try {
    const { data } = await axios.get(url);

    const $ = cheerio.load(data);

    const prayerTimes = [];

    $(".ptTable tbody tr").each((index, element) => {
      const columns = $(element).find("td");

      if (columns.length === 2) {
        const prayer = $(columns[0]).text().trim();
        const time = $(columns[1]).text().trim();

        if (prayer && time) {
            const adjustedTime = moment(time, "hh:mm A").add(1, "hour").format("hh:mm A");

          prayerTimes.push({ prayer, time: adjustedTime  });
        }
      }
    });

    const firstRowFifthTd = $("table.prayertimerange tbody tr")
      .eq(0)
      .find("td")
      .eq(5)
      .text()
      .trim();

    const secondRowSecondTd = $("table.prayertimerange tbody tr")
      .eq(1)
      .find("td")
      .eq(1)
      .text()
      .trim();
    const dateText = $('b:contains("Date")').parent().text().trim();

    const timeResults = timeDiff(firstRowFifthTd, secondRowSecondTd);

    return { ...timeResults, prayerTimes, dateText };
  } catch (error) {
    console.error("Error scraping data:", error);
  }
}

function timeDiff(magh, fajr) {
  const diff = moment(fajr, "hh:mm A")
    .add(1, "day")
    .diff(moment(magh, "hh:mm a"), "minutes");

  let secondNight =
    moment(magh, "HH:mm A")
      .add(Math.abs(diff) / 3, "minutes").format("hh:mm") + "PM";
  let thirdNight =
    moment(secondNight, "HH:mm A")
      .add(Math.abs(diff) / 3, "minutes").format("hh:mm") + "AM";

  return { moment(secondNight, "hh:mm A").add(1, "hour").format("hh:mm A");, moment(thirdNight, "hh:mm A").add(1, "hour").format("hh:mm A"); };
}

app.get("/", async (req, res) => {
  let location = req.query.location || "alexandria";

  let Time = await scrapePrayerTimes(
    `https://timesprayer.com/en/prayer-times-in-${location}.html`
  );

  res.status(200).json({ prayTime: Time });
});

app.listen(port, () => console.log(`listening on port ${port}!`));
