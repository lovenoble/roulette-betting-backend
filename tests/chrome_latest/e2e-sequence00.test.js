const {By, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('chromedriver').path;
let driver = chrome.Driver.createSession(new chrome.Options(), new chrome.ServiceBuilder(path).build());
let divs, wheel, rocket, dice;

// element classnames
const GAME_BUTTON_GROUP = 'sc-bdvvtL GmdXX';
const MODAL = 'sc-jIkXHa cEBdzH';
const MODAL_CLOSE_BTN = 'sc-jOxtWs dQZydE';

beforeAll(async () => {
  await driver.get('http://localhost:3000');
  await driver.wait(until.elementsLocated(By.className(GAME_BUTTON_GROUP)), 10000, '10 second timeout', 1000);
  divs = await driver.findElements(By.className(GAME_BUTTON_GROUP));
  wheel = divs[0], rocket = divs[1], dice = divs[2];
});

afterAll(async () => await driver.quit());

describe('canary test', () => {
  test('check test environment', async () => {
    await driver.getCurrentUrl().then(url => expect(url).toBe('http://localhost:3000/'));
  });
});

describe('click on wheel icon and close modal', () => {

  test('check if wheel displays', async () => {
    const isWheelDisplayed = await wheel.isDisplayed();
    expect(isWheelDisplayed).toBe(true);
  })

  test('click on wheel', async () => {
    try{
      await wheel.click();
    } catch(e){
      return new Error(e);
    }
  });

  test('check if modal displays', async () => {
    const modal = await driver.findElement(By.className(MODAL));
    const isModalDisplayed = await modal.isDisplayed();
    expect(isModalDisplayed).toBe(true);
  });
  
  test('check if modal close button displays', async () => {
    const close = await driver.findElement(By.className(MODAL_CLOSE_BTN));
    const isClosedDisplayed = await close.isDisplayed();
    expect(isClosedDisplayed).toBe(true);
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

describe('click on crash/rocket icon and close modal', () => {

  test('check if crash/rocket displays', async () => {
    const isRocketDisplayed = await rocket.isDisplayed();
    expect(isRocketDisplayed).toBe(true);
  });

  test('click on crash/rocket', async () => {
    try{
      await rocket.click();
    } catch(e){
      return new Error(e);
    }
  });

  test('check if modal displays', async () => {
    const modal = await driver.findElement(By.className(MODAL));
    const isModalDisplayed = await modal.isDisplayed();
    expect(isModalDisplayed).toBe(true);
  });
  
  test('check if modal close button displays', async () => {
    const close = await driver.findElement(By.className(MODAL_CLOSE_BTN));
    const isClosedDisplayed = await close.isDisplayed();
    expect(isClosedDisplayed).toBe(true);
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

  test('check if dice displays', async () => {
    const isDiceDisplayed = await dice.isDisplayed();
    expect(isDiceDisplayed).toBe(true);
  });

  test('click on dice', async () => {
    try{
      await dice.click();
    } catch(e){
      return new Error(e);
    }
  });

  test('check if modal displays', async () => {
    const modal = await driver.findElement(By.className(MODAL));
    const isModalDisplayed = await modal.isDisplayed();
    expect(isModalDisplayed).toBe(true);
  });
  
  test('check if modal close button displays', async () => {
    const close = await driver.findElement(By.className(MODAL_CLOSE_BTN));
    const isClosedDisplayed = await close.isDisplayed();
    expect(isClosedDisplayed).toBe(true);
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
    const guest = await driver.wait(until.elementLocated(By.className('sc-TBWPX ikVkVz')), 10000, '10 second timeout', 1000);
    try {
      await guest.click()
    } catch(e) {
      return new Error(e);
    }
  });

  
  test('click on play', async () => {
    const play = await driver.wait(until.elementsLocated(By.className('sc-dkPtRN dsFVlU sc-hKwDye hFSGnI game-panel')), 10000, '10 second timeout', 1000);
    try {
      // click on 2x
      await play[0].click();
    } catch(e) {
      return new Error(e);
    }
  });
  
  test('click on red color', async () => {
    const red = await driver.wait(until.elementLocated(By.className('sc-iqseJM hlqDqJ')), 10000, '10 second timeout', 1000);
    try{
      await red.click();
    } catch(e) {
      return new Error(e);
    }
  });

  test('enter wager amount and submit', async () => {
    const input = await driver.wait(until.elementLocated(By.xpath(`//html/body/div/section/div[2]/div/div[2]/div/div[2]/input`)), 10000, '10 second timeout', 1000);
    try{
      await input.click();
      await input.sendKeys('10000');
    } catch (e) {
      return new Error(e);
    }

    const submit = await driver.wait(until.elementLocated(By.className('sc-jrQzAO hTapAQ sc-kLwhqv hgglOf')), 10000, '10 second timeout', 1000);
    try{
      submit.click();
    } catch(e) {
      return new Error(e);
    }
    const warning = await driver.wait(until.elementLocated(By.xpath(`//html/body/div/section/div[2]/div/div[2]/div/div[2]/span`)), 10000, '10 second timeout', 1000);
    const isWarnDisplayed = await warning.isDisplayed();
    expect(isWarnDisplayed).toBe(true);
  });

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
});