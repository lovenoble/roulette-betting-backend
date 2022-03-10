const {By, until, Key} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('chromedriver').path;
let driver = chrome.Driver.createSession(new chrome.Options(), new chrome.ServiceBuilder(path).build());
let divs, wheel, rocket, dice;

// global fp elements
const GAME_BTN_GROUP = 'sc-bdvvtL GmdXX';
const GAME_BTN_GROUP_MODAL = 'sc-jIkXHa cEBdzH';
const MODAL_CLOSE_BTN = 'sc-jOxtWs dQZydE';
const ABOUT_BTN = `//html/body/div/div/img`;
const ABOUT_MODAL = `//html/body/div/div[2]/div/button`;
const CONNECT_WALLET_BTN = `//html/body/div/section/div[2]/div/div/div[3]/button[2][contains(., 'Connect Wallet')]`;
const CONNECT_WALLET_WARN = `//html/body/div/section/div[2]/div/div/div[3]`;
const GUEST_BTN = 'sc-TBWPX ikVkVz';
const PLAY_BTN_GROUP = 'sc-dkPtRN dsFVlU sc-hKwDye hFSGnI game-panel';
const RED_OPT_BTN = 'sc-iqseJM hlqDqJ';
const WAGER_INPUT = `//html/body/div/section/div[2]/div/div[2]/div/div[2]/input`;
const WAGER_SUBMIT = 'sc-jrQzAO hTapAQ sc-kLwhqv hgglOf';
const WAGER_WARN = `//html/body/div/section/div[2]/div/div[2]/div/div[2]/span`;
const EXIT_GAME = `//html/body/div/section/div[2]/div/div[4]`;
const F_LOGO_BTN = `//html/body/div/div/div/a`;
const META_DEMO_BTN = `//html/body/div/section/div[3][contains(., 'Metaverse Demo')]`;
const META_DEMO_MODAL = 'sc-hZpJaK bLpxBW';

beforeAll(async () => {
  await driver.get('http://localhost:3000');
  await driver.wait(until.elementsLocated(By.className(GAME_BTN_GROUP)), 10000, '10 second timeout', 1000);
  divs = await driver.findElements(By.className(GAME_BTN_GROUP));
  wheel = divs[0], rocket = divs[1], dice = divs[2];
});

afterAll(async () => await driver.quit());

describe('canary test', () => {
  test('check test environment', async () => {
    await driver.getCurrentUrl().then(url => expect(url).toBe('http://localhost:3000/'));
  });
});

describe('test about button', () => {
  test('click on about/info button', async () => {
    const about = await driver.wait(until.elementLocated(By.xpath(ABOUT_BTN)), 20000, '20 second timeout', 1000);
    try {
      await about.click();
    } catch (e) {
      return new Error(e);
    }
  });

  test('close about/info modal', async () => {
    const close = await driver.wait(until.elementLocated(By.xpath(ABOUT_MODAL)), 20000, '20 second timeout', 1000);
    try {
      await close.click();
    } catch(e) {
      return new Error(e);
    }
  });
  
  // future features
  /* 
  test('click on about/info button', async () => {
    const about = await driver.wait(until.elementLocated(By.xpath(`//html/body/div/div/img`)), 20000, '20 second timeout', 1000);
    try {
      await about.click();
    } catch (e) {
      return new Error(e);
    }
  });

  test('click on whitepaper button', async () => {
    const whitepaper = await driver.wait(until.elementLocated(By.xpath(`//html/body/div/div[2]/div/div/div/div[2]/button[1]`)), 20000, '20 second timeout', 1000);
    try {
      await whitepaper.click();
    } catch(e) {
      return new Error(e);
    }

    expect('white paper does not appear').toBe(true);
  });

  test('click on about/info button', async () => {
    const about = await driver.wait(until.elementLocated(By.xpath(`//html/body/div/div/img`)), 20000, '20 second timeout', 1000);
    try {
      await about.click();
    } catch (e) {
      return new Error(e);
    }
  });

  test('click on simulation button', async () => {
    const simulation = await driver.wait(until.elementLocated(By.xpath(`//html/body/div/div[2]/div/div/div/div[2]/button[1]`)), 20000, '20 second timeout', 1000);
    try {
      await simulation.click();
    } catch(e) {
      return new Error(e);
    }

    expect('simulation does not appear').toBe(true);
  });
  */
});

describe('click on wheel icon, click on connect wallet, and close modal', () => {
  test('click on wheel', async () => {
    try{
      await wheel.click();
    } catch(e){
      return new Error(e);
    }
  });

  test('check if modal displays', async () => {
    const modal = await driver.findElement(By.className(GAME_BTN_GROUP_MODAL));
    const isModalDisplayed = await modal.isDisplayed();
    expect(isModalDisplayed).toBe(true);
  });

  test('click on connect wallet', async () => {
    const button = await driver.wait(until.elementLocated(By.xpath(CONNECT_WALLET_BTN)), 10000, '10 second timeout', 1000);
    try {
      await button.click();
    } catch(e) {
      return new Error(e);
    }

    const warning = await driver.wait(until.elementLocated(By.xpath(CONNECT_WALLET_WARN)), 10000, '10 second timeout', 1000);
    const isWarnDisplayed = await warning.isDisplayed();

    expect(isWarnDisplayed).toBe(true);
  });

  test('click on close modal button', async() => {
    const close = await driver.findElement(By.className(MODAL_CLOSE_BTN));
    try{
      await close.click();
    } catch(e){
      return new Error(e);
    }
  });
});

describe('click on crash/rocket icon and close modal', () => {
  test('click on crash/rocket', async () => {
    try{
      await rocket.click();
    } catch(e){
      return new Error(e);
    }
  });

  test('check if modal displays', async () => {
    const modal = await driver.findElement(By.className(GAME_BTN_GROUP_MODAL));
    const isModalDisplayed = await modal.isDisplayed();
    expect(isModalDisplayed).toBe(true);
  });

  test('click on close modal button', async() => {
    const close = await driver.findElement(By.className(MODAL_CLOSE_BTN));
    try{
      await close.click();
    } catch(e){
      return new Error(e);
    }
  })
});

describe('click on dice icon and close modal', () => {
  test('click on dice', async () => {
    try{
      await dice.click();
    } catch(e){
      return new Error(e);
    }
  });

  test('check if modal displays', async () => {
    const modal = await driver.findElement(By.className(GAME_BTN_GROUP_MODAL));
    const isModalDisplayed = await modal.isDisplayed();
    expect(isModalDisplayed).toBe(true);
  });

  test('click on close modal button', async() => {
    const close = await driver.findElement(By.className(MODAL_CLOSE_BTN));
    try{
      await close.click();
    } catch(e){
      return new Error(e);
    }
  })
});

describe('click on join as guest and attempt to play', () => {
  test('click on dice', async () => {
    try{
      await dice.click();
    } catch(e){
      return new Error(e);
    }
  });

  test('click on join as guest', async () => {
    const guest = await driver.wait(until.elementLocated(By.className(GUEST_BTN)), 10000, '10 second timeout', 1000);
    try {
      await guest.click()
    } catch(e) {
      return new Error(e);
    }
  });

  
  test('click on play', async () => {
    const play = await driver.wait(until.elementsLocated(By.className(PLAY_BTN_GROUP)), 10000, '10 second timeout', 1000);
    try {
      // click on 2x play option
      await play[0].click();
    } catch(e) {
      return new Error(e);
    }
  });
  
  test('click on red color', async () => {
    const red = await driver.wait(until.elementLocated(By.className(RED_OPT_BTN)), 10000, '10 second timeout', 1000);
    try{
      await red.click();
    } catch(e) {
      return new Error(e);
    }
  });

  test('enter wager amount and submit', async () => {
    const input = await driver.wait(until.elementLocated(By.xpath(WAGER_INPUT)), 10000, '10 second timeout', 1000);
    try{
      await input.click();
      await input.sendKeys('10000');
    } catch (e) {
      return new Error(e);
    }

    const submit = await driver.wait(until.elementLocated(By.className(WAGER_SUBMIT)), 10000, '10 second timeout', 1000);
    try{
      submit.click();
    } catch(e) {
      return new Error(e);
    }
    const warning = await driver.wait(until.elementLocated(By.xpath(WAGER_WARN)), 10000, '10 second timeout', 1000);
    const isWarnDisplayed = await warning.isDisplayed();
    expect(isWarnDisplayed).toBe(true);
  });
  
  // future features
  /* 
  test('deposit button appears', async () => {
    const deposit = await driver.wait(until.elementLocated(By.className('sc-hBUSln ioNfJn')), 10000, '10 second timeout', 1000);
    try {
      await deposit.click();
    } catch(e) {
      return new Error(e); 
    }
  });

  test('withrdaw button appears', async () => {
    const withdraw = await driver.wait(until.elementLocated(By.className('sc-dlVxhl iVbvpI')), 10000, '10 second timeout', 1000);
    try {
      await withdraw.click();
    } catch(e) {
      return new Error(e); 
    }
  });
  */
  
  test('exit game', async () => {
    const close = await driver.wait(until.elementLocated(By.xpath(EXIT_GAME)), 10000, '10 second timeout', 1000);
    try {
      await close.click()
    } catch(e) {
      return new Error(e);
    }
  });
});

describe('check F logo link', () => {
  test('open F logo in new tab and check address', async () => {
    const logo = await driver.wait(until.elementLocated(By.xpath(F_LOGO_BTN)), 20000, '20 second timeout', 1000);
    const os = await driver.getCapabilities();
    const openInNewTab = os.getPlatform() === 'mac os x' ? Key.chord(Key.COMMAND, Key.RETURN) : Key.chord(Key.CONTROL, Key.RETURN);
    
    try{
      await logo.sendKeys(openInNewTab);
    } catch(e) {
      return new Error(e);
    }

    let tabs = await driver.getAllWindowHandles();
    while (tabs.length < 2) {
      tabs = await driver.getAllWindowHandles();
    }
    await driver.switchTo().window(tabs[1]);
    await driver.getCurrentUrl().then(url => expect(url).toBe('http://localhost:3000/'));
  });
});

describe('enter metaverse', () => {
  test('click on metaverse demo', async () => {
    const metaverse = await driver.wait(until.elementLocated(By.xpath(META_DEMO_BTN)), 20000, '20 second timeout', 1000);
    try { 
      await metaverse.click();
    } catch(e) {
      return new Error(e);
    }
  });
  
  test('metaverse modal appears', async () => {
    const modal = await driver.wait(until.elementLocated(By.className(META_DEMO_MODAL)), 20000, '20 second timeout', 1000);
    const modalIsDisPlayed = await modal.isDisplayed();
  
    expect(modalIsDisPlayed).toBe(true);
  });
});