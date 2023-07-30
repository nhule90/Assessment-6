const { Builder, Browser, By, until } = require("selenium-webdriver");

let driver;

beforeEach(async () => {
  driver = await new Builder().forBrowser(Browser.CHROME).build();
});

afterEach(async () => {
  await driver.quit();
});

describe("Duel Duo tests", () => {
  test("page loads with title", async () => {
    await driver.get("http://localhost:3000");
    await driver.wait(until.titleIs("Duel Duo"), 1000);
  });
  test('Draw button displays div with id choices', async () =>{
    await driver.get("http://localhost:3000");
    await driver.findElement(By.id('draw')).click();
    var element = await driver.findElement(By.id('choices'));
    var childElements = await element.findElements(By.xpath('.//*'));
    expect(childElements.length>0).toBe(true);
  });
  test('Add to dual button displays div with id player duo', async () =>{
    await driver.get("http://localhost:3000");
    await driver.findElement(By.id('draw')).click();
    element = await driver.findElement(By.id('choices'));
    childElements = await element.findElements(By.className('bot-btn'));
    await childElements[0].click();
    element = await driver.findElement(By.id('player-duo'));
    var childElements = await element.findElements(By.xpath('.//*'));
    expect(childElements.length>0).toBe(true);
  })
});