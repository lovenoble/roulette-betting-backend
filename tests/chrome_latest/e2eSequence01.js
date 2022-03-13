const {By, until} = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');
const chrome = require('selenium-webdriver/chrome');
const CD_PATH = require('chromedriver').path;

const e2eSequence01 = () => {
  // global metamask elements
  const GET_STARTED_BTN = `//html/body/div[1]/div/div[2]/div/div/div/button[contains(., 'Get Started')]`;
  const IMPORT_WALLET_BTN = `//html/body/div[1]/div/div[2]/div/div/div[2]/div/div[2]/div[1]/button[contains(., 'Import wallet')]`;
  const NO_THANKS_BTN = `//html/body/div[1]/div/div[2]/div/div/div/div[5]/div[1]/footer/button[contains(., 'No Thanks')]`;
  const INPUT_0 = `//html/body/div[1]/div/div[2]/div/div/form/div[4]/div[1]/div/input`;
  const INPUT_1 = `//html/body/div[1]/div/div[2]/div/div/form/div[5]/div/input`;
  const INPUT_2 = `//html/body/div[1]/div/div[2]/div/div/form/div[6]/div/input`;
  const CHECKBOX = `//html/body/div[1]/div/div[2]/div/div/form/div[7]/div`;
  const IMPORT_BTN = `//html/body/div[1]/div/div[2]/div/div/form/button[contains(., 'Import')]`;
  const ALL_DONE_BTN = `//html/body/div[1]/div/div[2]/div/div/button[contains(., 'All Done')]`;
  const NEXT_BTN = `//html/body/div[1]/div/div[2]/div/div[2]/div[3]/div[2]/button[2][contains(., 'Next')]`;
  const CONNECT_BTN = `//html/body/div[1]/div/div[2]/div/div[2]/div[2]/div[2]/footer/button[2][contains(., 'Connect')]`;
  const SIGN_BTN = `//html/body/div[1]/div/div[2]/div/div[3]/button[2][contains(., 'Sign')]`;

  // global fp elements
  const ROCKET_BTN = `//html/body/div/section/div[1]/div[2]`;
  const CONNECT_WALLET_BTN = `//html/body/div/section/div[2]/div/div/div[3]/button[2][contains(., 'Connect Wallet')]`;
  const CLOSE_BTN = `//html/body/div/section/div[2]/div/div/div[4][contains(., 'X')]`;

  const metamask = '10.10.2_0.crx'
  const MM_PATH = `./${metamask}`;
  const opt = new chrome.Options();
  let driver;

  describe('check testing environment', () => {
    test('check if METAMASK_PASSPHRASE and PASSWORD setup in /tests/.env', () => {
      expect(process.env.METAMASK_PASSPHRASE.length > 0 && process.env.PASSWORD.length > 0).toBe(true);
    });

    test('check if .crx is in /tests', () => {
      let files = fs.readdirSync(path.resolve(process.cwd()));
      expect(files.includes(metamask)).toBe(true);
    });
  });

  describe('set up MetaMask extension and connect with DAPP', () => {
    beforeAll(async () => {
      driver = chrome.Driver.createSession(opt.addExtensions(MM_PATH), new chrome.ServiceBuilder(CD_PATH).build());
      const tabs = await driver.getAllWindowHandles();
    
      await driver.switchTo().window(tabs[0]);
      await driver.wait(until.elementLocated(By.xpath(GET_STARTED_BTN)), 20000, '20 second timeout', 1000);
      await driver.findElement(By.xpath(GET_STARTED_BTN)).click();
      await driver.findElement(By.xpath(IMPORT_WALLET_BTN)).click();
      await driver.findElement(By.xpath(NO_THANKS_BTN)).click();
      await driver.wait(until.elementLocated(By.xpath(INPUT_0)), 20000, '20 second timeout', 1000);
      
      const input0 = await driver.findElement(By.xpath(INPUT_0));
      await input0.click();
      await input0.sendKeys(process.env.METAMASK_PASSPHRASE);
      
      const input1 = await driver.findElement(By.xpath(INPUT_1));
      await input1.click();
      await input1.sendKeys(process.env.PASSWORD);
    
      const input2 = await driver.findElement(By.xpath(INPUT_2));
      await input2.click();
      await input2.sendKeys(process.env.PASSWORD);
    
      await driver.findElement(By.xpath(CHECKBOX)).click();
      await driver.findElement(By.xpath(IMPORT_BTN)).click();
      await driver.wait(until.elementLocated(By.xpath(ALL_DONE_BTN)), 20000, '20 second timeout', 1000);
      await driver.findElement(By.xpath(ALL_DONE_BTN)).click();
      await driver.get('http://localhost:3000');
      await driver.wait(until.elementLocated(By.xpath(ROCKET_BTN)), 20000, '20 second timeout', 1000);
    });
    
    afterAll(async () => {
      let windows = await driver.getAllWindowHandles();

      // wait for MetaMask popup to auto close
      while(windows.length === 3){
        windows = await driver.getAllWindowHandles();
      }

      await driver.switchTo().window(windows[0]);
      await driver.manage().window().maximize();
    });
    
    test('click on rocket', async () => {
      const rocket = await driver.findElement(By.xpath(ROCKET_BTN));
      try {
        await rocket.click();
      } catch(e) {
        return new Error(e);
      }
    });

    test('click on Connect Wallet', async () => {
      const wallet = await driver.findElement(By.xpath(CONNECT_WALLET_BTN));
      try {
        await wallet.click();
      } catch(e) {
        return new Error(e);
      }
    });

    test('MetaMask pop up occurs', async () => {
      let windows = await driver.getAllWindowHandles();

      // wait for MetaMask pop up
      while (windows.length < 3) {
        windows = await driver.getAllWindowHandles();
      }
    
      await driver.switchTo().window(windows[2]);
      await driver.wait(until.elementLocated(By.xpath(NEXT_BTN)), 20000, '20 second timeout', 1000);
      await driver.findElement(By.xpath(NEXT_BTN)).click();
      await driver.findElement(By.xpath(CONNECT_BTN)).click();
      await driver.wait(until.elementLocated(By.xpath(SIGN_BTN)), 20000, '20 second timeout', 1000);
      await driver.findElement(By.xpath(SIGN_BTN)).click();
      
      return expect(windows.length).toBe(3);
    });
  });

  describe('test metamask connection', () => {
    test('close game option screen', async () => {
      const optWindow = await driver.wait(until.elementLocated(By.xpath(CLOSE_BTN)), 20000, '20 second timeout', 1000);
      try{
        await optWindow.click();
      } catch(e) {
        return new Error(e);
      }
    });
  });

  afterAll(async () => await driver.quit());
};

module.exports = e2eSequence01;