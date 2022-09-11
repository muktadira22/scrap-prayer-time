const axios = require("axios");
const cheerio = require("cheerio");

const baseUrl = "https://www.jadwalsholat.org/adzan/monthly.php";

const scrapData = async (req, res, next) => {
  try {
    const {
      query: { m, y },
    } = req;
    const params = {
      id: "58",
      m,
      y,
    };
    const { data } = await axios.get(baseUrl, {
      params,
    });

    const $ = cheerio.load(data);

    const tablePrayer = $(".table_adzan tr");

    const tableTitle = $(tablePrayer).children(".table_title td");
    const tableHeader = $(tablePrayer).children(".table_header td");
    const title = $(tableTitle).children("h1").text();
    const date = $(tableTitle).children("h2").text();

    const prayerTimes = [];
    const parameterDesc = [];
    const fiqhDesc = [];

    let countingDescription = 0;

    tablePrayer.each((index, element) => {
      const tr = $(element);
      const td = $(element).children("td");
      let temp = {};
      let tempDesc = {};
      let tempFiqh = {};

      if (
        tr.hasClass("table_dark") ||
        tr.hasClass("table_light") ||
        tr.hasClass("table_highlight")
      ) {
        tableHeader.each((indexHeader, elementHeader) => {
          const tdHeader = $(elementHeader).text().toLowerCase();
          temp[tdHeader] = td.eq(indexHeader).text();
        });
        prayerTimes.push(temp);
      } else if (tr.hasClass("table_block_content")) {
        const key = td.eq(0).text().trim();
        const value = td.eq(1).text().trim();
        if (countingDescription >= 0 && countingDescription < 3) {
          tempDesc[key] = value;
          parameterDesc.push(tempDesc);
        }

        if (countingDescription >= 3 && countingDescription < 8) {
          tempFiqh[key] = value.substring(2);
          fiqhDesc.push(tempFiqh);
        }

        countingDescription++;
      }
    });

    res.json({
      title: title,
      date: date,
      prayer_times: prayerTimes,
      parameter: parameterDesc,
      fiqh: fiqhDesc,
    });
  } catch (e) {
    res.json({ status: "failed", message: e.message }).status(500);
  }
};

module.exports = scrapData;
