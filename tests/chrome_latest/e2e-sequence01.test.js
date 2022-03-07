const {By, until} = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');
const chrome = require('selenium-webdriver/chrome');
const CD_PATH = require('chromedriver').path;
const metamask = '10.10.2_0.crx'
const MM_PATH = `./${metamask}`;
const opt = new chrome.Options();
const driver = chrome.Driver.createSession(opt.addExtensions(MM_PATH), new chrome.ServiceBuilder(CD_PATH).build());

afterAll(async () => await driver.quit());

describe('check testing environment', () => {
  
  test('METAMASK_PASSPHRASE and PASSWORD setup in /tests', () => {
    expect(process.env.METAMASK_PASSPHRASE.length > 0 && process.env.PASSWORD.length > 0).toBe(true);
  });

  test('check if .crx is in /tests', () => {
    let files = fs.readdirSync(path.resolve(process.cwd()));
    expect(files.includes(metamask)).toBe(true);
  });
});

describe('set up MetaMask extension and connect with DAPP', () => {
  beforeAll(async () => {
    const tabs = await driver.getAllWindowHandles();
  
    await driver.switchTo().window(tabs[0]);
    await driver.wait(until.elementLocated(By.xpath(`//html/body/div[1]/div/div[2]/div/div/div/button[contains(., 'Get Started')]`)), 20000, '20 second timeout', 1000);
    await driver.findElement(By.xpath(`//html/body/div[1]/div/div[2]/div/div/div/button[contains(., 'Get Started')]`)).click();
    await driver.findElement(By.xpath(`//html/body/div[1]/div/div[2]/div/div/div[2]/div/div[2]/div[1]/button[contains(., 'Import wallet')]`)).click();
    await driver.findElement(By.xpath(`//html/body/div[1]/div/div[2]/div/div/div/div[5]/div[1]/footer/button[contains(., 'No Thanks')]`)).click();
    await driver.wait(until.elementLocated(By.xpath(`//html/body/div[1]/div/div[2]/div/div/form/div[4]/div[1]/div/input`)), 20000, '20 second timeout', 1000);
    
    const input0 = await driver.findElement(By.xpath('//html/body/div[1]/div/div[2]/div/div/form/div[4]/div[1]/div/input'));
    await input0.click();
    await input0.sendKeys(process.env.METAMASK_PASSPHRASE);
    
    const input1 = await driver.findElement(By.xpath(`//html/body/div[1]/div/div[2]/div/div/form/div[5]/div/input`));
    await input1.click();
    await input1.sendKeys(process.env.PASSWORD);
  
    const input2 = await driver.findElement(By.xpath(`//html/body/div[1]/div/div[2]/div/div/form/div[6]/div/input`));
    await input2.click();
    await input2.sendKeys(process.env.PASSWORD);
  
    await driver.findElement(By.xpath(`//html/body/div[1]/div/div[2]/div/div/form/div[7]/div`)).click();
    await driver.findElement(By.xpath(`//html/body/div[1]/div/div[2]/div/div/form/button[contains(., 'Import')]`)).click();
    await driver.wait(until.elementLocated(By.xpath(`//html/body/div[1]/div/div[2]/div/div/button[contains(., 'All Done')]`)), 20000, '20 second timeout', 1000);
    await driver.findElement(By.xpath(`//html/body/div[1]/div/div[2]/div/div/button[contains(., 'All Done')]`)).click();
    await driver.get('http://localhost:3000');
    await driver.wait(until.elementLocated(By.xpath(`//html/body/div/section/div[1]/div[2]`)), 20000, '20 second timeout', 1000);
  });

  afterAll(async () => {
    let windows = await driver.getAllWindowHandles();

    // wait for MetaMask popup to auto close
    while(windows.length === 3){
      windows = await driver.getAllWindowHandles();
    }

    await driver.switchTo().window(windows[0]);
    await driver.manage().window().maximize();
    // await driver.wait(until.elementLocated(By.xpath(`//html/body/div/section/div[2]/div/div/div[4][contains(., 'X')]`)), 20000, '20 second timeout', 1000);
  });

  test('click on rocket', async () => {
    const rocket = await driver.findElement(By.xpath(`//html/body/div/section/div[1]/div[2]`));
    try {
      await rocket.click();
    } catch(e) {
      return new Error(e);
    }
  });

  test('click on Connect Wallet', async () => {
    const wallet = await driver.findElement(By.xpath(`//html/body/div/section/div[2]/div/div/div[3]/button[2][contains(., 'Connect Wallet')]`));
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
    await driver.wait(until.elementLocated(By.xpath(`//html/body/div[1]/div/div[2]/div/div[2]/div[3]/div[2]/button[2][contains(., 'Next')]`)), 20000, '20 second timeout', 1000);
    await driver.findElement(By.xpath(`//html/body/div[1]/div/div[2]/div/div[2]/div[3]/div[2]/button[2][contains(., 'Next')]`)).click();
    await driver.findElement(By.xpath(`//html/body/div[1]/div/div[2]/div/div[2]/div[2]/div[2]/footer/button[2][contains(., 'Connect')]`)).click();
    await driver.wait(until.elementLocated(By.xpath(`//html/body/div[1]/div/div[2]/div/div[3]/button[2][contains(., 'Sign')]`)), 20000, '20 second timeout', 1000);
    await driver.findElement(By.xpath(`//html/body/div[1]/div/div[2]/div/div[3]/button[2][contains(., 'Sign')]`)).click();
    expect(windows.length).toBe(3);
  });

  describe('test metamask connection', () => {
    test('close game option screen', async () => {
      try{
        await driver.wait(until.elementLocated(By.xpath(`//html/body/div/section/div[2]/div/div/div[4][contains(., 'X')]`)), 20000, '20 second timeout', 1000);
      } catch(e) {
        return new Error(e);
      }

      const optWindow = await driver.findElement(By.xpath(`//html/body/div/section/div[2]/div/div/div[4][contains(., 'X')]`));
      try{
        await optWindow.click();
      } catch(e) {
        return new Error(e);
      }
    });
  });
});