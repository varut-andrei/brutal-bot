import puppeteer from "puppeteer";
import { min, random } from "radash";
import { client } from "./whatsapp.ts";
import { BRUTALIST, URL, mokangeala } from "./constants.ts";

export const getLowestPrice = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setViewport({ width: 1080, height: 1024 });

  await page.goto(URL, { waitUntil: "domcontentloaded" });

  const tableData = await page.evaluate((tableSelector) => {
    const rows = Array.from(document.querySelectorAll(`${tableSelector} tr`));
    return rows
      .map((row) => {
        const cells = Array.from(row.querySelectorAll("th, td"));
        return cells.map((cell) => cell.textContent || "");
      })
      .filter((row) => {
        const [name] = row;

        const reg = /festival pass/gim;

        if (reg.test(name)) {
          return true;
        }

        return false;
      })
      .map((row) => {
        const [name, price, date] = row;

        const parsedPrice = parseFloat(price.split(" ")[1]);

        return { name, price: parsedPrice, date };
      });
  }, "table");

  await browser.close();

  return min(tableData, (row) => row.price);
};

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

const calculateDuration = (duration: number) => {
  // const hours = Math.floor(duration / HOUR);
  const minutes = Math.floor((duration % HOUR) / MINUTE);
  const seconds = Math.floor(((duration % HOUR) % MINUTE) / SECOND);
  const milliseconds = Math.floor(((duration % HOUR) % MINUTE) % SECOND);

  return `${minutes} minutes ${seconds} seconds ${milliseconds} milliseconds`;
};

let firstRun = true;
let count = 0;
const STARTING_INTERVAL = 1 * SECOND;
const MIN_INTENDED_INTERVAL = 15 * MINUTE;
const MAX_INTENDED_INTERVAL = 30 * MINUTE;

const recursiveRun = () => {
  const startTime = Date.now();
  const processingTime = Math.floor(random(0, STARTING_INTERVAL));

  if (firstRun) {
    console.log("Started scouting.");
    console.log(
      `Function execution scheduled in ${calculateDuration(processingTime)}.`
    );
  }

  setTimeout(async () => {
    const endTime = Date.now();
    const duration = endTime - startTime;

    const lowestPrice = await getLowestPrice();

    count = count + 1;
    console.log(
      `${count} Function completed execution. Processing time was ${calculateDuration(duration)} minutes.`
    );
    if (lowestPrice) {
      console.log(`Lowest festival pass price: ${lowestPrice.price}€`);

      if (firstRun) {
        firstRun = false;
        // client.sendMessage(DELUTA_STELUTA, mokangeala(lowestPrice.price));
      }

      if (lowestPrice.price < 150) {
        await client.sendMessage(BRUTALIST, mokangeala(lowestPrice.price));
      }
    }
    // Calculate the next delay to approximately maintain the interval
    const nextDelay = random(MIN_INTENDED_INTERVAL, MAX_INTENDED_INTERVAL); // Intended interval minus actual duration

    console.log(
      `Next function execution scheduled in ${calculateDuration(nextDelay)} minutes.`
    );
    setTimeout(recursiveRun, nextDelay); // Schedule next execution
  }, processingTime);
};

export const run = () => recursiveRun();
