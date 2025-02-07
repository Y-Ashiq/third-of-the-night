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

    $("tbody").each((index, element) => {
      const prayerTime = $(element).find("td:nth-child(2)").text().trim();

      prayerTimes.push(prayerTime);
    });

    let test = prayerTimes[0].split(" ");

    return timeDiff(test[0] + "AM", test[4].replace("PM", "") + "PM");
  } catch (error) {
    console.error("Error scraping data:", error);
  }
}

function timeDiff(magh, fajr) {
  const diff = moment(fajr, "HH:mm A").diff(moment(magh, "HH:mm A"), "minutes");

  let secondNight =
    moment(magh, "HH:mm A")
      .add(Math.abs(diff) / 3, "minutes")
      .format("hh:mm") + "PM";
  let thirdNight =
    moment(secondNight, "HH:mm A")
      .add(Math.abs(diff) / 3, "minutes")
      .format("hh:mm") + "AM";
  return { secondNight, thirdNight };
}

app.get("/", async (req, res) => {
  let Time = await scrapePrayerTimes(
    "https://timesprayer.com/en/prayer-times-in-alexandria.html"
  );

  res.status(200).json({ prayTime: Time });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
