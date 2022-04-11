const {By, until, Key} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const fs = require('fs');
const CD_PATH = require('chromedriver').path;

const checkExistence = (elementRef) => {
  if(elementRef){
    return true;
  } else return false;
};

const checkClickThrough = async (elementRef) => {
  try{
    await elementRef.click();
  } catch(e) {
    return new Error(e);
  }
}

const e2eSequence00 = () => { 
  // testing globals
  const GC_PATH = path.resolve(`./mac_chrome/Google\ Chrome.app/Contents/MacOS/Google\ Chrome`); // this path is relative to the jest runner file
  let driver;
  
  // global fp target elements
  const ABOUT_BTN = 'TEST_ABOUT_BUTTON';
  const ABOUT_BTN_MDL = 'TEST_ABOUT_BUTTON_MODAL';
  const ABOUT_MDL_CLOSE_BTN = 'TEST_MODAL_CLOSE_BUTTON';
  const GAME_MENU = 'TEST_GAME_MENU';
  const GAME_BTNS = 'TEST_GAME_BUTTONS';
  const GAME_MENU_MDL = 'TEST_GAME_MENU_MODAL';
  const GAME_MENU_MDL_CLOSE_BTN = 'TEST_GAME_MENU_MODAL_CLOSE_BUTTON';
  const GAME_MENU_MDL_BTNS = 'TEST_GAME_MENU_MODAL_BUTTONS';
  const CONNECT_WALLET_WARN = 'TEST_CONNECT_WALLET_WARNING';
  const GAME_MODE_BTNS = 'TEST_GAME_MODE_BUTTONS'
  const COLOR_SELECTION = 'TEST_COLOR_SELECTION';
  const WAGER_INPUT = 'TEST_WAGER_INPUT';
  const WAGER_SUBMIT = 'TEST_WAGER_SUBMIT';
  const WAGER_WARNING = 'TEST_WAGER_WARNING';
  const EXIT_GAME = 'TEST_EXIT_GAME';
  const F_LOGO_BTN = 'TEST_F_LOGO_BTN';
  const META_DEMO_BTN = 'TEST_META_DEMO_BTN';
  const META_DEMO_MODAL = 'TEST_META_MODAL_DEMO';
  
  beforeAll(async () => {
    const opt = new chrome.Options();
    opt.setChromeBinaryPath(GC_PATH);
    driver = chrome.Driver.createSession(opt, new chrome.ServiceBuilder(CD_PATH).build());
    await driver.get('http://localhost:3000');
    await driver.wait(until.elementsLocated(By.name(GAME_MENU)), 5000, '5 second timeout --> wait for page to load', 1000);
  });
  
  describe('canary test', () => {
    test('check chrome binary exists in /mac_chrome', async () => {
      let files = fs.readdirSync(`${path.resolve(process.cwd())}/mac_chrome/`);
      return expect(files.includes('Google\ Chrome.app')).toBe(true);
    });
  });
  
  describe('test about/info button', () => {
    test('check target strategy: ABOUT_BTN', async () => {
      const about = await driver.wait(until.elementLocated(By.name(ABOUT_BTN)), 5000, '5 second timeout --> check target strategy: ABOUT_BTN', 1000);
      return checkExistence(about);
    });

    // test('click on about/info button', async () => {
    //   const about = await driver.findElement(By.name(ABOUT_BTN));
    //   try {
    //     await about.click();
    //   } catch (e) {
    //     return new Error(e);
    //   }
    // });

    test('click on about/info button --> testing refactor', async () => {
      const about = await driver.findElement(By.name(ABOUT_BTN));
      return await checkClickThrough(about);
    });
    
    test('check target strategy: ABOUT_BTN_MDL', async () => {
      const modal = await driver.wait(until.elementLocated(By.name(ABOUT_BTN_MDL)), 5000, '5 second timeout --> check target strategy: ABOUT_BTN_MDL', 1000);
      return checkExistence(modal);
    });

    test('check if about/info modal displays', async () => {
      const modal = await driver.findElement(By.name(ABOUT_BTN_MDL));
      const isModalDisplayed = await modal.isDisplayed();
      return expect(isModalDisplayed).toBe(true);
    });

    test('check target strategy: ABOUT_MDL_CLOSE_BTN', async () => {
      const close = await driver.wait(until.elementLocated(By.name(ABOUT_MDL_CLOSE_BTN)), 5000, '5 second timeout --> check target strategy: ABOUT_MDL_CLOSE_BTN', 1000);
      return checkExistence(close);
    });
    
    test('close about/info modal', async () => {
      const close = await driver.findElement(By.name(ABOUT_MDL_CLOSE_BTN));
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
  
  describe('test wheel button', () => {
    test('check target strategy: GAME_BTNS[0]', async () => {
      const wheel = await driver.wait(until.elementsLocated(By.name(GAME_BTNS)), 5000, '5 second timeout --> check target strategy: GAME_BTNS[0]', 1000);
      return checkExistence(wheel[0])
    });

    test('click on wheel', async () => {
      const wheel = await driver.findElements(By.name(GAME_BTNS));
      try{
        await wheel[0].click();
      } catch(e){
        return new Error(e);
      }
    });

    test('check if game menu modal displays', async () => {
      const modal = await driver.findElement(By.name(GAME_MENU_MDL));
      const isModalDisplayed = await modal.isDisplayed();
      return expect(isModalDisplayed).toBe(true);
    });

    test('check target strategy: GAME_MENU_MDL_BTNS[1]', async () => {
      const connect = await driver.wait(until.elementsLocated(By.name(GAME_MENU_MDL_BTNS)), 5000, '5 second timeout --> check target strategy: GAME_MENU_MDL_BTNS[1]', 1000);
      return checkExistence(connect[1]);
    });

    test('click on connect wallet', async () => {
      const connect = await driver.findElements(By.name(GAME_MENU_MDL_BTNS));
      try {
        await connect[1].click();
      } catch(e) {
        return new Error(e);
      }
  
      const warning = await driver.wait(until.elementLocated(By.name(CONNECT_WALLET_WARN)), 5000, '5 second timeout', 1000);
      const isWarnDisplayed = await warning.isDisplayed();
  
      return expect(isWarnDisplayed).toBe(true);
    });
  
    test('click on close modal button', async() => {
      const close = await driver.findElement(By.name(GAME_MENU_MDL_CLOSE_BTN));
      try{
        await close.click();
      } catch(e){
        return new Error(e);
      }
    });
  });
  
  describe('test crash/rocket button', () => {
    test('check target strategy: GAME_BTNS[1]', async () => {
      const rocket = await driver.wait(until.elementsLocated(By.name(GAME_BTNS)), 5000, '5 second timeout --> check target strategy: GAME_BTNS[1]', 1000);
      return checkExistence(rocket[1]);
    });

    test('click on crash/rocket', async () => {
      const rocket = await driver.findElements(By.name(GAME_BTNS));
      try{
        await rocket[1].click();
      } catch(e){
        return new Error(e);
      }
    });
  
    test('check if game menu modal displays', async () => {
      const modal = await driver.findElement(By.name(GAME_MENU_MDL));
      const isModalDisplayed = await modal.isDisplayed();
      return expect(isModalDisplayed).toBe(true);
    });
  
    test('click on close modal button', async() => {
      const close = await driver.findElement(By.name(GAME_MENU_MDL_CLOSE_BTN));
      try{
        await close.click();
      } catch(e){
        return new Error(e);
      }
    });
  });

  
  describe('test dice button', () => {
    test('check target strategy: GAME_BTNS[2]', async () => {
      const dice = await driver.wait(until.elementsLocated(By.name(GAME_BTNS)), 5000, '5 second timeout --> check target strategy: GAME_BTNS[2]', 1000);
      return checkExistence(dice[2]);
    });

    test('click on dice', async () => {
      const dice = await driver.findElements(By.name(GAME_BTNS));
      try{
        await dice[2].click();
      } catch(e){
        return new Error(e);
      }
    });
  
    test('check if game menu modal displays', async () => {
      const modal = await driver.findElement(By.name(GAME_MENU_MDL));
      const isModalDisplayed = await modal.isDisplayed();
      return expect(isModalDisplayed).toBe(true);
    });
  
    test('click on close modal button', async() => {
      const close = await driver.findElement(By.name(GAME_MENU_MDL_CLOSE_BTN));
      try{
        await close.click();
      } catch(e){
        return new Error(e);
      }
    });
  });

  
  describe('click on join as guest and attempt to play', () => {
    test('check target strategy: GAME_BTNS[0]', async () => {
      const wheel = await driver.wait(until.elementsLocated(By.name(GAME_BTNS)), 5000, '5 second timeout --> check target strategy: GAME_BTNS[0]', 1000);
      return checkExistence(wheel[0]);
    });

    test('click on wheel', async () => {
      const wheel = await driver.findElements(By.name(GAME_BTNS));
      try{
        await wheel[0].click();
      } catch(e){
        return new Error(e);
      }
    });

    test('check target strategy: GAME_MENU_MDL_BTNS[0]', async () => {
      const guest = await driver.wait(until.elementsLocated(By.name(GAME_MENU_MDL_BTNS)), 5000, '5 second timeout --> check target strategy: GAME_MENU_MDL_BTNS[0]', 1000);
      return checkExistence(guest[0]);
    });
  
    test('click on join as guest', async () => {
      const guest = await driver.findElements(By.name(GAME_MENU_MDL_BTNS));
      try {
        await guest[0].click()
      } catch(e) {
        return new Error(e);
      }
    });

    test('check target strategy: GAME_MODE_BTNS[0]', async () => {
      const play2X = await driver.wait(until.elementsLocated(By.name(GAME_MODE_BTNS)), 5000, '5 second timeout --> check target strategy: GAME_MODE_BTNS[0]', 1000);
      if(play2X.length === 3){
        return true;
      } else return false;
    });

    test('click on play 2X', async () => {
      const play2X = await driver.findElements(By.name(GAME_MODE_BTNS));
      try {
        await play2X[0].click();
      } catch(e) {
        return new Error(e);
      }
    });

    test('check target strategy: COLOR_SELECTION', async () => {
      const colors = await driver.wait(until.elementsLocated(By.name(COLOR_SELECTION)), 5000, '5 second timeout --> check target strategy: COLOR_SELECTION', 1000);
      if(colors.length > 0){
        return expect(colors.length).toBe(2);
      } else return false;
    });

    test('click on red color', async () => {
      const red = await driver.findElement(By.name(COLOR_SELECTION));
      try{
        await red[1].click();
      } catch(e) {
        return new Error(e);
      }
    });

    test('enter wager amount and submit', async () => {
      const input = await driver.wait(until.elementLocated(By.name(WAGER_INPUT)), 5000, '5 second timeout', 1000);
      try{
        await input.click();
        await input.sendKeys('10000');
      } catch (e) {
        return new Error(e);
      }
  
      const submit = await driver.wait(until.elementLocated(By.name(WAGER_SUBMIT)), 5000, '5 second timeout', 1000);
      try{
        await submit.click();
      } catch(e) {
        return new Error(e);
      }
      const warning = await driver.wait(until.elementLocated(By.name(WAGER_WARNING)), 5000, '5 second timeout', 1000);
      const isWarnDisplayed = await warning.isDisplayed();
      return expect(isWarnDisplayed).toBe(true);
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
      const close = await driver.findElement(By.name(EXIT_GAME));
      try {
        await close.click()
      } catch(e) {
        return new Error(e);
      }
    });
  });

  describe('enter metaverse', () => {
    test('check target strategy: META_DEMO_BTN', async () => {
      const metaverse = await driver.wait(until.elementsLocated(By.name(META_DEMO_BTN)), 5000, '5 second timeout --> check target strategy: META_DEMO_BTN', 1000);
      return checkExistence(metaverse);
    });

    test('click on metaverse demo', async () => {
      const metaverse = await driver.findElement(By.name(META_DEMO_BTN));
      
      try { 
        await metaverse.click();
      } catch(e) {
        return new Error(e);
      }
    });

    test('check target strategy: META_DEMO_MODAL', async () => {
      const modal = await driver.wait(until.elementsLocated(By.name(META_DEMO_MODAL)), 20000, '20 second timeout --> check target strategy: META_DEMO_MODAL', 1000);
      return checkExistence(modal);
    });
    
    test('metaverse modal appears', async () => {
      const modal = await driver.findElement(By.name(META_DEMO_MODAL));
      const modalIsDisPlayed = await modal.isDisplayed();
    
      return expect(modalIsDisPlayed).toBe(true);
    });

    afterAll(async () => await driver.get('http://localhost:3000'));
  });

  describe('check F logo link', () => {
    test('check target strategy: F_LOGO_BTN', async () => {
      const logo = await driver.wait(until.elementsLocated(By.name(F_LOGO_BTN)), 5000, '5 second timeout --> check target strategy: F_LOGO_BTN', 1000);
      return checkExistence(logo);
    });

    test('open F logo in new tab', async () => {
      const logo = await driver.findElement(By.name(F_LOGO_BTN));
      const os = await driver.getCapabilities();
      const openInNewTab = os.getPlatform() === 'mac os x' ? Key.chord(Key.COMMAND, Key.RETURN) : Key.chord(Key.CONTROL, Key.RETURN);

      try{
        await logo.sendKeys(openInNewTab);

        let tabs = await driver.getAllWindowHandles();
        while (tabs.length < 2) {
          tabs = await driver.getAllWindowHandles();
        }
        await driver.switchTo().window(tabs[1]);
        
        // await driver.getCurrentUrl().then(url => expect(url).toBe('http://localhost:3000/'));
  
        return expect(tabs.length).toBe(2);
      } catch(e) {
        return new Error(e);
      }
    });
  });

  afterAll(async () => await driver.quit());
};

module.exports = e2eSequence00;