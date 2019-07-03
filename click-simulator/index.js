const puppeteer = require("puppeteer");
const program = require("commander");
const faker = require("faker");
const winston = require("winston");

program
  .version("0.1.0")
  .option("-u, --users <number>", "Number of users to simulate", parseInt)
  .parse(process.argv);

const sizes = [[1920, 1080], [828, 1792], [1125, 2436]];

const executeSimulatuion = async () => {
  // Configure Browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent(faker.internet.userAgent());
  await page.setGeolocation({
    latitude: parseFloat(faker.address.latitude()),
    longitude: parseFloat(faker.address.longitude())
  });
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setRequestInterception(true);
  page.on("request", request => {
    if (request.resourceType() === "image") request.abort();
    else request.continue();
  });
  await page.goto("https://personalize.aws.cliffordduke.dev");


  await page.click("button.submit");
  let cognito  = await page.evaluate(() => {
    return localStorage.getItem('aws.cognito.identity-id.us-west-2:d79b0895-c0df-4a45-8251-5206f369166c')
  })

  console.log(cognito);
  await page.waitForSelector("#recommendationList button.movie");
  await page.screenshot({ path: "load.png" });
  let movies = await page.$$("#recommendationList button.movie");
  await movies[Math.floor(Math.random() * movies.length)].click();
  await page.screenshot({ path: "click.png" });
  await page.waitForSelector("#formSubmit");
  await page.click("#formSubmit");
  await page.screenshot({ path: "submit.png" });
  await page.waitForResponse(
    "https://api-summit.aws.cliffordduke.dev/users/1562135123118/record_event"
  );
  await browser.close();
};

let processes = [];
executeSimulatuion();
