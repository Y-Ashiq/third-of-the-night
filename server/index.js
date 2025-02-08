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

    // $("tbody").each((index, element) => {
    //   const prayerTime = $(element).find("td:nth-child(2)").text().trim();

    //   prayerTimes.push(prayerTime);
    // });
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

    return timeDiff(firstRowFifthTd, secondRowSecondTd);
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
      .add(Math.abs(diff) / 3, "minutes")
      .format("hh:mm") + "PM";
  let thirdNight =
    moment(secondNight, "HH:mm A")
      .add(Math.abs(diff) / 3, "minutes")
      .format("hh:mm") + "AM";

  let today = moment().format("MMM Do YY");

  return { secondNight, thirdNight, today };
}

app.get("/", async (req, res) => {
  let location = req.query.location || "alexandria";

  let Time = await scrapePrayerTimes(
    `https://timesprayer.com/en/prayer-times-in-${location}.html`
  );

  res.status(200).json({ prayTime: Time });
});

app.listen(port, () => console.log(`listening on port ${port}!`));
