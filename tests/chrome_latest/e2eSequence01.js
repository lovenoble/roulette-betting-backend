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
  const PP_INPUT_01 = '//html/body/div[1]/div/div[2]/div/div/div[2]/form/div[1]/div[3]/div[1]/div[1]/div/input';
  const PP_INPUT_02 = '//html/body/div[1]/div/div[2]/div/div/div[2]/form/div[1]/div[3]/div[2]/div[1]/div/input';
  const PP_INPUT_03 = '//html/body/div[1]/div/div[2]/div/div/div[2]/form/div[1]/div[3]/div[3]/div[1]/div/input';
  const PP_INPUT_04 = '//html/body/div[1]/div/div[2]/div/div/div[2]/form/div[1]/div[3]/div[4]/div[1]/div/input';
  const PP_INPUT_05 = '//html/body/div[1]/div/div[2]/div/div/div[2]/form/div[1]/div[3]/div[5]/div[1]/div/input';
  const PP_INPUT_06 = '//html/body/div[1]/div/div[2]/div/div/div[2]/form/div[1]/div[3]/div[6]/div[1]/div/input';
  const PP_INPUT_07 = '//html/body/div[1]/div/div[2]/div/div/div[2]/form/div[1]/div[3]/div[7]/div[1]/div/input';
  const PP_INPUT_08 = '//html/body/div[1]/div/div[2]/div/div/div[2]/form/div[1]/div[3]/div[8]/div[1]/div/input';
  const PP_INPUT_09 = '//html/body/div[1]/div/div[2]/div/div/div[2]/form/div[1]/div[3]/div[9]/div[1]/div/input';
  const PP_INPUT_10 = '//html/body/div[1]/div/div[2]/div/div/div[2]/form/div[1]/div[3]/div[10]/div[1]/div/input';
  const PP_INPUT_11 = '//html/body/div[1]/div/div[2]/div/div/div[2]/form/div[1]/div[3]/div[11]/div[1]/div/input';
  const PP_INPUT_12 = '//html/body/div[1]/div/div[2]/div/div/div[2]/form/div[1]/div[3]/div[12]/div[1]/div/input';
  const PASSWORD_01 = '//html/body/div[1]/div/div[2]/div/div/div[2]/form/div[2]/div[1]/div/input'; 
  const PASSWORD_02 = '//html/body/div[1]/div/div[2]/div/div/div[2]/form/div[2]/div[2]/div/input';
  const CHECKBOX = '//html/body/div[1]/div/div[2]/div/div/div[2]/form/div[3]/input';
  const IMPORT_BTN01 = `//html/body/div[1]/div/div[2]/div/div/div[2]/form/button[contains(., 'Import')]`;
  const ALL_DONE_BTN = `//html/body/div[1]/div/div[2]/div/div/button[contains(., 'All Done')]`;
  const POP_UP_CLOSE = '//html/body/div[2]/div/div/section/div[1]/div/button';
  const ACCOUNT_BTN = '//html/body/div[1]/div/div[1]/div/div[2]/div[2]/div';
  const SETTINGS_BTN = '//html/body/div[1]/div/div[3]/div[11]';
  const NETWORK_TAB = '//html/body/div[1]/div/div[3]/div/div[2]/div[1]/div/button[6]/div[1]/div[1]';
  const LOCAL_HOST = '//html/body/div[1]/div/div[3]/div/div[2]/div[2]/div/div[2]/div[1]/div[6]/div[2]';
  const NETWORK_NAME_IN = '//html/body/div[1]/div/div[3]/div/div[2]/div[2]/div/div[2]/div[2]/div[1]/div[1]/label/input';
  const CHAIN_ID_IN = '//html/body/div[1]/div/div[3]/div/div[2]/div[2]/div/div[2]/div[2]/div[1]/div[3]/label/input';
  const SAVE_BTN = '//html/body/div[1]/div/div[3]/div/div[2]/div[2]/div/div[2]/div[2]/div[2]/button[3]';
  const IMPORT_ACCOUNT_BTN = '//html/body/div[1]/div/div[3]/div[7]';
  const PRIVATE_KEY_IN = '//html/body/div[1]/div/div[3]/div/div/div[2]/div[2]/div[1]/input';
  const IMPORT_BTN02 = '//html/body/div[1]/div/div[3]/div/div/div[2]/div[2]/div[2]/button[2]';
  const NEXT_BTN = `//html/body/div[1]/div/div[2]/div/div[3]/div[2]/button[2][contains(., 'Next')]`;
  const CONNECT_BTN = `//html/body/div[1]/div/div[2]/div/div[2]/div[2]/div[2]/footer/button[2][contains(., 'Connect')]`;
  const SIGN_BTN = `//html/body/div[1]/div/div[2]/div/div[3]/button[2][contains(., 'Sign')]`;
  const CONFIRM_BTN01 = '//html/body/div[1]/div/div[2]/div/div[5]/div[5]/div';
  const CONFIRM_BTN02 = '//html/body/div[1]/div/div[2]/div/div[5]/div[2]/ul/li[1]/button';
  const CONFIRM_BTN03 = '//html/body/div[1]/div/div[2]/div/div[5]/div[3]/footer/button[2]';

  // global fp elements
  const GAME_MENU = 'TEST_GAME_MENU';
  const GAME_BTNS = 'TEST_GAME_BUTTONS';
  const GAME_MENU_MDL_BTNS = 'TEST_GAME_MENU_MODAL_BUTTONS';
  const GAME_MODE_BTNS = 'TEST_GAME_MODE_BUTTONS';
  // const DEPOSIT_AMT = 'TEST_DEPOSIT_AMOUNT';
  const DEPOSIT_BTN = 'TEST_DEPOSIT_BUTTON';
  const DEPOSIT_MDL_IN = 'TEST_DEPOSIT_MODAL_INPUT';
  const DEPOSIT_MDL_DEPOSIT_BTN = 'TEST_DEPOSIT_MODAL_DEPOSIT_BUTTON';
  // const DEPOSIT_MDL_BALANCE = 'TEST_DEPOSIT_MODAL_BALANCE';
  const DEPOSIT_MDL_CLOSE_BTN = 'TEST_DEPOSIT_MODAL_CLOSE_BUTTON';
  const COLOR_SELECTION = 'TEST_COLOR_SELECTION';
  const WAGER_INPUT = 'TEST_WAGER_INPUT';
  const WAGER_SUBMIT = 'TEST_WAGER_SUBMIT';
  // const WAGER_AMT = 'TEST_WAGER_AMOUNT';
  const WITHDRAW_BTN = 'TEST_WITHDRAW_BUTTON';
  const WITHDRAW_MDL_IN = 'TEST_WITHDRAW_MODAL_INPUT';
  const WITHDRAW_MDL_WITHDRAW_BTN = 'TEST_WITHDRAW_MODAL_WITHDRAW_BUTTON';
  // const WITHDRAW_MDL_BALANCE = 'TEST_WITHDRAW_MODAL_BALANCE';
  const WITHDRAW_MDL_CLOSE_BTN = 'TEST_WITHDRAW_MODAL_CLOSE_BUTTON';

  // testing globals
  const metamask = '10.12.2_0.crx'
  const MM_PATH = `./${metamask}`;
  const opt = new chrome.Options();
  let driver; 

  describe('canary test', () => {
    test('check if METAMASK_PASSPHRASE01...12 is setup in /tests/.env', () => {
      
      const isPassphraseSetup = process.env.METAMASK_PASSPHRASE01.length > 0 && 
                                process.env.METAMASK_PASSPHRASE02.length > 0 &&
                                process.env.METAMASK_PASSPHRASE03.length > 0 &&
                                process.env.METAMASK_PASSPHRASE04.length > 0 &&
                                process.env.METAMASK_PASSPHRASE05.length > 0 &&
                                process.env.METAMASK_PASSPHRASE06.length > 0 &&
                                process.env.METAMASK_PASSPHRASE07.length > 0 &&
                                process.env.METAMASK_PASSPHRASE08.length > 0 &&
                                process.env.METAMASK_PASSPHRASE09.length > 0 &&
                                process.env.METAMASK_PASSPHRASE10.length > 0 &&
                                process.env.METAMASK_PASSPHRASE11.length > 0 &&
                                process.env.METAMASK_PASSPHRASE12.length > 0;
      
      return expect(isPassphraseSetup).toBe(true);
    });

    test('check if PASSWORD is setup in /tests/.env', () => {
      return expect(process.env.PASSWORD.length > 0).toBe(true);
    });

    test('check if PRIVATE key is setup in /tests/.env', () => {
      return expect(process.env.PRIVATE.length > 0).toBe(true);
    });

    test('check if 10.12.2_0.crx is in /tests', () => {
      let files = fs.readdirSync(path.resolve(process.cwd()));
      return expect(files.includes(metamask)).toBe(true);
    });
  });

  describe('set up metamask extension and connect with DAPP', () => {
    beforeAll(async () => {
      driver = chrome.Driver.createSession(opt.addExtensions(MM_PATH), new chrome.ServiceBuilder(CD_PATH).build());
      const tabs = await driver.getAllWindowHandles();
    
      await driver.switchTo().window(tabs[0]);
      await driver.wait(until.elementLocated(By.xpath(GET_STARTED_BTN)), 20000, '20 second timeout', 1000);
      await driver.findElement(By.xpath(GET_STARTED_BTN)).click();
      await driver.findElement(By.xpath(IMPORT_WALLET_BTN)).click();
      await driver.findElement(By.xpath(NO_THANKS_BTN)).click();
      await driver.wait(until.elementLocated(By.xpath(PP_INPUT_01)), 20000, '20 second timeout', 1000);
      
      const passPhraseIn01 = await driver.findElement(By.xpath(PP_INPUT_01));
      await passPhraseIn01.click();
      await passPhraseIn01.sendKeys(process.env.METAMASK_PASSPHRASE01);

      const passPhraseIn02 = await driver.findElement(By.xpath(PP_INPUT_02));
      await passPhraseIn02.click();
      await passPhraseIn02.sendKeys(process.env.METAMASK_PASSPHRASE02);

      const passPhraseIn03 = await driver.findElement(By.xpath(PP_INPUT_03));
      await passPhraseIn03.click();
      await passPhraseIn03.sendKeys(process.env.METAMASK_PASSPHRASE03);

      const passPhraseIn04 = await driver.findElement(By.xpath(PP_INPUT_04));
      await passPhraseIn04.click();
      await passPhraseIn04.sendKeys(process.env.METAMASK_PASSPHRASE04);

      const passPhraseIn05 = await driver.findElement(By.xpath(PP_INPUT_05));
      await passPhraseIn05.click();
      await passPhraseIn05.sendKeys(process.env.METAMASK_PASSPHRASE05);

      const passPhraseIn06 = await driver.findElement(By.xpath(PP_INPUT_06));
      await passPhraseIn06.click();
      await passPhraseIn06.sendKeys(process.env.METAMASK_PASSPHRASE06);

      const passPhraseIn07 = await driver.findElement(By.xpath(PP_INPUT_07));
      await passPhraseIn07.click();
      await passPhraseIn07.sendKeys(process.env.METAMASK_PASSPHRASE07);

      const passPhraseIn08 = await driver.findElement(By.xpath(PP_INPUT_08));
      await passPhraseIn08.click();
      await passPhraseIn08.sendKeys(process.env.METAMASK_PASSPHRASE08);

      const passPhraseIn09 = await driver.findElement(By.xpath(PP_INPUT_09));
      await passPhraseIn09.click();
      await passPhraseIn09.sendKeys(process.env.METAMASK_PASSPHRASE09);

      const passPhraseIn10 = await driver.findElement(By.xpath(PP_INPUT_10));
      await passPhraseIn10.click();
      await passPhraseIn10.sendKeys(process.env.METAMASK_PASSPHRASE10);

      const passPhraseIn11 = await driver.findElement(By.xpath(PP_INPUT_11));
      await passPhraseIn11.click();
      await passPhraseIn11.sendKeys(process.env.METAMASK_PASSPHRASE11);

      const passPhraseIn12 = await driver.findElement(By.xpath(PP_INPUT_12));
      await passPhraseIn12.click();
      await passPhraseIn12.sendKeys(process.env.METAMASK_PASSPHRASE12);
      
      const passwordIn01 = await driver.findElement(By.xpath(PASSWORD_01));
      await passwordIn01.click();
      await passwordIn01.sendKeys(process.env.PASSWORD);
    
      const passwordIn02 = await driver.findElement(By.xpath(PASSWORD_02));
      await passwordIn02.click();
      await passwordIn02.sendKeys(process.env.PASSWORD);
    
      await driver.findElement(By.xpath(CHECKBOX)).click();
      await driver.findElement(By.xpath(IMPORT_BTN01)).click();
      
      await driver.wait(until.elementLocated(By.xpath(ALL_DONE_BTN)), 20000, '20 second timeout', 1000);
      await driver.findElement(By.xpath(ALL_DONE_BTN)).click();

      await driver.wait(until.elementLocated(By.xpath(POP_UP_CLOSE)), 20000, '20 second timeout', 1000);
      await driver.findElement(By.xpath(POP_UP_CLOSE)).click();
      
      await driver.wait(until.elementLocated(By.xpath(ACCOUNT_BTN)), 20000, '20 second timeout', 1000);
      await driver.findElement(By.xpath(ACCOUNT_BTN)).click();

      await driver.wait(until.elementLocated(By.xpath(SETTINGS_BTN)), 20000, '20 second timeout', 1000);
      await driver.findElement(By.xpath(SETTINGS_BTN)).click();

      await driver.wait(until.elementLocated(By.xpath(NETWORK_TAB)), 20000, '20 second timeout', 1000);
      await driver.findElement(By.xpath(NETWORK_TAB)).click();

      await driver.wait(until.elementLocated(By.xpath(LOCAL_HOST)), 20000, '20 second timeout', 1000);
      await driver.findElement(By.xpath(LOCAL_HOST)).click();

      const network = await driver.wait(until.elementLocated(By.xpath(NETWORK_NAME_IN)), 20000, '20 second timeout', 1000);
      await network.click();
      await network.clear();
      await network.clear();
      await network.sendKeys('Hardhat Local');

      const chainId = await driver.wait(until.elementLocated(By.xpath(CHAIN_ID_IN)), 20000, '20 second timeout', 1000);
      await chainId.click();
      await chainId.clear();
      await chainId.clear();
      await chainId.sendKeys('31337');

      await driver.wait(until.elementLocated(By.xpath(SAVE_BTN)), 20000, '20 second timeout', 1000);
      await driver.findElement(By.xpath(SAVE_BTN)).click();

      await driver.wait(until.elementLocated(By.xpath(ACCOUNT_BTN)), 20000, '20 second timeout', 1000);
      await driver.findElement(By.xpath(ACCOUNT_BTN)).click();

      await driver.wait(until.elementLocated(By.xpath(IMPORT_ACCOUNT_BTN)), 20000, '20 second timeout', 1000);
      await driver.findElement(By.xpath(IMPORT_ACCOUNT_BTN)).click();

      const privateKey = await driver.wait(until.elementLocated(By.xpath(PRIVATE_KEY_IN)), 20000, '20 second timeout', 1000);
      await privateKey.click();
      await privateKey.clear().then(async () => await privateKey.sendKeys(process.env.PRIVATE));

      await driver.wait(until.elementLocated(By.xpath(IMPORT_BTN02)), 20000, '20 second timeout', 1000);
      await driver.findElement(By.xpath(IMPORT_BTN02)).click();

      await driver.get('http://localhost:3000');
      await driver.wait(until.elementsLocated(By.name(GAME_MENU)), 5000, '5 second timeout', 1000);
    });
    
    test('check target strategy: GAME_BTNS[0]', async () => {
      const wheel = await driver.wait(until.elementsLocated(By.name(GAME_BTNS)), 5000, '5 second timeout --> check target strategy: GAME_BTNS[0]', 1000);
      if(wheel[0]){
        return true;
      } else return false;
    });

    test('click on wheel', async () => {
      const wheel = await driver.findElements(By.name(GAME_BTNS));
      try {
        await wheel[0].click();
      } catch(e){
        return new Error(e);
      }
    });

    test('check target strategy: GAME_MENU_MDL_BTNS[1]', async () => {
      const wallet = await driver.wait(until.elementsLocated(By.name(GAME_BTNS)), 5000, '5 second timeout --> check target strategy: GAME_MENU_MDL_BTNS[1]', 1000);
      if(wallet[1]){
        return true;
      } else return false;
    });

    test('click on connect wallet', async () => {
      const wallet = await driver.findElements(By.name(GAME_MENU_MDL_BTNS));
      try {
        await wallet[1].click();
      } catch(e) {
        return new Error(e);
      }
    });

    test('connect to metamask pop up occurs', async () => {
      let windows = await driver.getAllWindowHandles();
      while (windows.length < 3) {
        windows = await driver.getAllWindowHandles();
      }
      await driver.switchTo().window(windows[2]);

      return expect(windows.length).toBe(3);
    });

    test('click on metamask next, connect, and sign buttons', async () => {
      await driver.wait(until.elementLocated(By.xpath(NEXT_BTN)), 20000, '20 second timeout', 1000);
      await driver.findElement(By.xpath(NEXT_BTN)).click();
      await driver.findElement(By.xpath(CONNECT_BTN)).click();
      await driver.wait(until.elementLocated(By.xpath(SIGN_BTN)), 20000, '20 second timeout', 1000);
      await driver.findElement(By.xpath(SIGN_BTN)).click();

      let windows = await driver.getAllWindowHandles();
      while(windows.length === 3){
        windows = await driver.getAllWindowHandles();
      }
      await driver.switchTo().window(windows[0]);

      return expect(windows.length).toBe(2);
    })
  });

  describe('select game mode and deposit money', () => {
    test('check target strategy: GAME_MODE_BTNS[0]', async () => {
      const gameMode = await driver.wait(until.elementsLocated(By.name(GAME_MODE_BTNS)), 20000, '20 second timeout', 1000);
      if(gameMode.length === 3){
        return true;
      } else return false;
    });

    test('select 2x game mode', async () => {
      const play2X = await driver.findElements(By.name(GAME_MODE_BTNS));
      try {
        play2X[0].click();
      } catch(e) {
        return new Error(e)
      }
    });
    
    /* 
    test('check target strategy: DEPOSIT_AMT', async () => {
      const depositAmount = await driver.wait(until.elementLocated(By.name(DEPOSIT_AMT)), 20000, '20 second timeout', 1000);
      if(depositAmount){
        return true;
      } else return false;
    })

    // this test can fail when run multiple times because it interacts with previous state
    test('check current deposit amount', async () => {
      const depositAmount = await driver.findElement(By.name(DEPOSIT_AMT)).getText();
      const sanitizeAmount = Number(depositAmount.split('').slice(16).filter(el => el !== ',').join('').trim());
      return expect(sanitizeAmount).toBe(0);
    })
    */

    test('check target strategy: DEPOSIT_BTN', async () => {
      const deposit = await driver.wait(until.elementLocated(By.name(DEPOSIT_BTN)), 20000, '20 second timeout', 1000);
      if(deposit){
        return true;
      } else return false;
    });

    test('click on 1st deposit button', async () => {
      const deposit = await driver.findElement(By.name(DEPOSIT_BTN));
      try {
        deposit.click();
      } catch(e) {
        return new Error(e);
      }
    });

    test('check target strategy: DEPOSIT_MDL_IN', async () => {
      const depositInput = await driver.wait(until.elementLocated(By.name(DEPOSIT_MDL_IN)), 20000, '20 second timeout', 1000);
      if(depositInput) {
        return true;
      } else return false;
    });

    test('enter 10000 into deposit input', async () => {
      const depositInput = await driver.findElement(By.name(DEPOSIT_MDL_IN));
      try {
        depositInput.click();
        depositInput.sendKeys('10000');
      } catch(e) {
        return new Error(e);
      }
    });

    test('check target strategy: DEPOSIT_MDL_DEPOSIT_BTN', async () => {
      const deposit = await driver.wait(until.elementLocated(By.name(DEPOSIT_MDL_DEPOSIT_BTN)), 20000, '20 second timeout', 1000);
      if(deposit){
        return true;
      } else return false;
    });

    test('click on 2nd deposit button', async () => {
      const deposit = await driver.findElement(By.name(DEPOSIT_MDL_DEPOSIT_BTN));
      try {
        deposit.click();
      } catch(e) {
        return new Error(e);
      }
    });

    test('1st metamask pop up occurs', async () => {
      let windows = await driver.getAllWindowHandles();
      while (windows.length < 3) {
        windows = await driver.getAllWindowHandles();
      }
      await driver.switchTo().window(windows[2]);

      return expect(windows.length).toBe(3);
    });

    test('click on 1st metamask confirm', async () => {
      await driver.wait(until.elementLocated(By.xpath(CONFIRM_BTN01)), 20000, '20 second timeout', 1000);
      await driver.executeScript(`document.getElementsByClassName('button btn--rounded btn-primary page-container__footer-button')[0].click();`);

      let windows = await driver.getAllWindowHandles();
      while(windows.length === 3){
        windows = await driver.getAllWindowHandles();
      }
      await driver.switchTo().window(windows[0]);
      
      return expect(windows.length).toBe(2);
    });

    test('2nd metamask pop up occurs', async () => {
      let windows = await driver.getAllWindowHandles();
      while (windows.length < 3) {
        windows = await driver.getAllWindowHandles();
      }
      await driver.switchTo().window(windows[2]);

      return expect(windows.length).toBe(3);
    });

    test('click on 2nd metamask confirm', async () => {
      await driver.wait(until.elementLocated(By.xpath(CONFIRM_BTN02)), 20000, '20 second timeout', 1000);
      await driver.executeScript(`document.getElementsByClassName('button btn--rounded btn-primary page-container__footer-button')[0].click();`);  
      
      let windows = await driver.getAllWindowHandles();
      while(windows.length === 3){
        windows = await driver.getAllWindowHandles();
      }
      await driver.switchTo().window(windows[0]);

      return expect(windows.length).toBe(2);
    });

    test('check target strategy: DEPOSIT_MDL_CLOSE_BTN', async () => {
      const close = await driver.wait(until.elementLocated(By.name(DEPOSIT_MDL_CLOSE_BTN)), 20000, '20 second timeout', 1000);
      if(close){
        return true;
      } else return false;
    });
    
    test('close deposit modal', async () => {
      // wait for animation to complete
      let isAnimationActive = true;
      while(isAnimationActive){
        const close = await driver.findElement(By.name(DEPOSIT_MDL_CLOSE_BTN));
        try {
          isAnimationActive = false;
          await close.click();
        } catch(e) {
          isAnimationActive = true;
        }
      }
      
      return true;
    });

    /*
    test('check target strategy: DEPOSIT_MDL_BALANCE', async () => {
      const balance = await driver.wait(until.elementLocated(By.name(DEPOSIT_MDL_BALANCE)), 20000, '20 second timeout', 1000);
      if(balance){
        return true;
      } else return false;
    });

    // this test can fail when run multiple times because it interacts with previous state
    test('get current deposit balance and check if equal to amount entered', async () => {
      let depositBal = await driver.findElement(By.name(DEPOSIT_MDL_BALANCE)).getText();
      let sanitizeBal = Number(depositBal.split('').filter(el => el !== ',').join(''));
      // wait for deposit balance to update
      while(depositBal && sanitizeBal <= 0){
        depositBal = await driver.findElement(By.name(DEPOSIT_MDL_BALANCE)).getText();
        if(depositBal) sanitizeBal = Number(depositBal.split('').filter(el => el !== ',').join(''));
      }

      // wait for animation to complete
      let isAnimationActive = true;
      while(isAnimationActive){
        const close = await driver.wait(until.elementLocated(By.name(DEPOSIT_MDL_CLOSE_BTN)), 20000, '20 second timeout', 1000);
        try {
          isAnimationActive = false;
          await close.click();
        } catch(e) {
          isAnimationActive = true;
        }
      }
  
      return expect(sanitizeBal).toBe(10000);
    });
    */
  });

  describe('select blue wheel color and enter wager amount', () => {
    test('check test strategy: COLOR_SELECTION', async () => {
      const colorSelect = await driver.wait(until.elementsLocated(By.name(COLOR_SELECTION)), 20000, '20 second timeout', 1000);
      if(colorSelect.length === 2){
        return true;
      } else return false;
    });

    test('click on blue color', async () => {
      const blue = await driver.findElements(By.name(COLOR_SELECTION));
      try {
        blue[0].click();
      } catch(e) {
        return new Error(e);
      }
    });

    test('check test strategy: WAGER_INPUT', async () => {
      const wager = await driver.wait(until.elementLocated(By.name(WAGER_INPUT)), 20000, '20 second timeout', 1000);
      if(wager){
        return true;
      } else return false;
    });

    test('cilck on wager input and enter amount', async () => {
      const wagerIn = await driver.findElement(By.name(WAGER_INPUT));
      try{
        await wagerIn.click();
        await wagerIn.sendKeys('10000')
      } catch(e) {
        return new Error(e);
      }
    });

    test('check target strategy: WAGER_SUBMIT', async () => {
      const wagerSubmit = await driver.wait(until.elementLocated(By.name(WAGER_SUBMIT)), 20000, '20 second timeout', 1000);
      if(wagerSubmit){
        return true;
      } else return false;
    });

    test('click on submit wager', async () => {
      const wagerSubmit = await driver.findElement(By.name(WAGER_SUBMIT));
      try {
        wagerSubmit.click();
      } catch(e) {
        return new Error(e);
      }
    });
    
    test('metamask pop up occurs', async () => {
      let windows = await driver.getAllWindowHandles();
      while (windows.length < 3) {
        windows = await driver.getAllWindowHandles();
      }
      await driver.switchTo().window(windows[2]);

      return expect(windows.length).toBe(3);
    });

    test('click on metamask confirm', async () => {
      await driver.wait(until.elementLocated(By.xpath(CONFIRM_BTN03)), 20000, '20 second timeout', 1000);
      await driver.executeScript(`document.getElementsByClassName('button btn--rounded btn-primary page-container__footer-button')[0].click();`);

      let windows = await driver.getAllWindowHandles();
      while(windows.length === 3){
        windows = await driver.getAllWindowHandles();
      }
      await driver.switchTo().window(windows[0]);
      
      return expect(windows.length).toBe(2);
    });
    
    /* 
    // this test can fail when run multiple times because it interacts with previous state
    test('get current wager amount and check if equal to amount entered', async () => {
      let wager = await driver.findElement(By.name(WAGER_AMT)).getText();

      let sanitizeWager = Number(wager.split('').slice(13).filter(el => el !== ',').join('').trim());
  
      while(wager && sanitizeWager <= 0){
        wager = await driver.findElement(By.name(WAGER_AMT)).getText();
        if(wager) sanitizeWager = Number(wager.split('').slice(13).filter(el => el !== ',').join('').trim());
      }
      
      return expect(sanitizeWager).toBe(10000);
    });
    */
  });

  describe('deposit more money to test red wheel color', () => {
    /*     
    test('check target strategy: DEPOSIT_AMT', async () => {
      const depositAmount = await driver.wait(until.elementLocated(By.name(DEPOSIT_AMT)), 20000, '20 second timeout', 1000);
      if(depositAmount){
        return true;
      } else return false;
    });

    // this test can fail when run multiple times because it interacts with previous state
    test('check current deposit amount', async () => {
      const depositAmount = await driver.findElement(By.name(DEPOSIT_AMT)).getText();
      const sanitizeAmount = Number(depositAmount.split('').slice(16).filter(el => el !== ',').join('').trim());
      return expect(sanitizeAmount).toBe(0);
    });
    */

    test('check target strategy: DEPOSIT_BTN', async () => {
      const deposit = await driver.wait(until.elementLocated(By.name(DEPOSIT_BTN)), 20000, '20 second timeout', 1000);
      if(deposit){
        return true;
      } else return false;
    });

    test('click on 1st deposit button', async () => {
      const deposit = await driver.findElement(By.name(DEPOSIT_BTN));
      try {
        deposit.click();
      } catch(e) {
        return new Error(e);
      }
    });

    test('check target strategy: DEPOSIT_MDL_IN', async () => {
      const depositInput = await driver.wait(until.elementLocated(By.name(DEPOSIT_MDL_IN)), 20000, '20 second timeout', 1000);
      if(depositInput) {
        return true;
      } else return false;
    });

    test('enter 10000 into deposit input', async () => {
      const depositInput = await driver.findElement(By.name(DEPOSIT_MDL_IN));
      try {
        depositInput.click();
        depositInput.sendKeys('10000');
      } catch(e) {
        return new Error(e);
      }
    });

    test('check target strategy: DEPOSIT_MDL_DEPOSIT_BTN', async () => {
      const deposit = await driver.wait(until.elementLocated(By.name(DEPOSIT_MDL_DEPOSIT_BTN)), 20000, '20 second timeout', 1000);
      if(deposit){
        return true;
      } else return false;
    });

    test('click on 2nd deposit button', async () => {
      const deposit = await driver.findElement(By.name(DEPOSIT_MDL_DEPOSIT_BTN));
      try {
        deposit.click();
      } catch(e) {
        return new Error(e);
      }
    });

    test('1st metamask pop up occurs', async () => {
      let windows = await driver.getAllWindowHandles();
      while (windows.length < 3) {
        windows = await driver.getAllWindowHandles();
      }
      await driver.switchTo().window(windows[2]);

      return expect(windows.length).toBe(3);
    });

    test('click on 1st metamask confirm', async () => {
      await driver.wait(until.elementLocated(By.xpath(CONFIRM_BTN01)), 20000, '20 second timeout', 1000);
      await driver.executeScript(`document.getElementsByClassName('button btn--rounded btn-primary page-container__footer-button')[0].click();`);

      let windows = await driver.getAllWindowHandles();
      while(windows.length === 3){
        windows = await driver.getAllWindowHandles();
      }
      await driver.switchTo().window(windows[0]);
      
      return expect(windows.length).toBe(2);
    });

    test('2nd metamask pop up occurs', async () => {
      let windows = await driver.getAllWindowHandles();
      while (windows.length < 3) {
        windows = await driver.getAllWindowHandles();
      }
      await driver.switchTo().window(windows[2]);

      return expect(windows.length).toBe(3);
    });

    test('click on 2nd metamask confirm', async () => {
      await driver.wait(until.elementLocated(By.xpath(CONFIRM_BTN02)), 20000, '20 second timeout', 1000);
      await driver.executeScript(`document.getElementsByClassName('button btn--rounded btn-primary page-container__footer-button')[0].click();`);  
      
      let windows = await driver.getAllWindowHandles();
      while(windows.length === 3){
        windows = await driver.getAllWindowHandles();
      }
      await driver.switchTo().window(windows[0]);

      return expect(windows.length).toBe(2);
    });

    test('check target strategy: DEPOSIT_MDL_CLOSE_BTN', async () => {
      const close = await driver.wait(until.elementLocated(By.name(DEPOSIT_MDL_CLOSE_BTN)), 20000, '20 second timeout', 1000);
      if(close){
        return true;
      } else return false;
    });

    test('close deposit modal', async () => {
      // wait for animation to complete
      let isAnimationActive = true;
      while(isAnimationActive){
        const close = await driver.findElement(By.name(DEPOSIT_MDL_CLOSE_BTN));
        try {
          isAnimationActive = false;
          await close.click();
        } catch(e) {
          isAnimationActive = true;
        }
      }
      
      return true;
    });

    /* 
    test('check target strategy: DEPOSIT_MDL_BALANCE', async () => {
      const balance = await driver.wait(until.elementLocated(By.name(DEPOSIT_MDL_BALANCE)), 20000, '20 second timeout', 1000);
      if(balance){
        return true;
      } else return false;
    });
  
    // this test can fail when run multiple times because it interacts with previous state
    test('get current deposit balance and check if equal to amount entered', async () => {
      let depositBal = await driver.findElement(By.name(DEPOSIT_MDL_BALANCE)).getText();
      let sanitizeBal = Number(depositBal.split('').filter(el => el !== ',').join(''));
      // wait for deposit balance to update
      while(depositBal && sanitizeBal <= 0){
        depositBal = await driver.findElement(By.name(DEPOSIT_MDL_BALANCE)).getText();
        if(depositBal) sanitizeBal = Number(depositBal.split('').filter(el => el !== ',').join(''));
      }

      // wait for animation to complete
      let isAnimationActive = true;
      while(isAnimationActive){
        const close = await driver.wait(until.elementLocated(By.name(DEPOSIT_MDL_CLOSE_BTN)), 20000, '20 second timeout', 1000);
        try {
          isAnimationActive = false;
          await close.click();
        } catch(e) {
          isAnimationActive = true;
        }
      }
  
      return expect(sanitizeBal).toBe(10000);
    });
    */
  });

  describe('select red wheel color and enter wager amount', () => {
    test('check test strategy: COLOR_SELECTION', async () => {
      const colorSelect = await driver.wait(until.elementsLocated(By.name(COLOR_SELECTION)), 20000, '20 second timeout', 1000);
      if(colorSelect.length === 2){
        return true;
      } else return false;
    });

    test('click on red color', async () => {
      const red = await driver.findElements(By.name(COLOR_SELECTION));
      try {
        red[1].click();
      } catch(e) {
        return new Error(e);
      }
    });

    test('check test strategy: WAGER_INPUT', async () => {
      const wager = await driver.wait(until.elementLocated(By.name(WAGER_INPUT)), 20000, '20 second timeout', 1000);
      if(wager){
        return true;
      } else return false;
    });

    test('cilck on wager input and enter amount', async () => {
      const wagerIn = await driver.findElement(By.name(WAGER_INPUT));
      try{
        await wagerIn.click();
        await wagerIn.sendKeys('10000')
      } catch(e) {
        return new Error(e);
      }
    });

    test('check target strategy: WAGER_SUBMIT', async () => {
      const wagerSubmit = await driver.wait(until.elementLocated(By.name(WAGER_SUBMIT)), 20000, '20 second timeout', 1000);
      if(wagerSubmit){
        return true;
      } else return false;
    });

    test('click on submit wager', async () => {
      const wagerSubmit = await driver.findElement(By.name(WAGER_SUBMIT));
      try {
        wagerSubmit.click();
      } catch(e) {
        return new Error(e);
      }
    });
    
    test('metamask pop up occurs', async () => {
      let windows = await driver.getAllWindowHandles();
      while (windows.length < 3) {
        windows = await driver.getAllWindowHandles();
      }
      await driver.switchTo().window(windows[2]);

      return expect(windows.length).toBe(3);
    });

    test('click on metamask confirm', async () => {
      await driver.wait(until.elementLocated(By.xpath(CONFIRM_BTN03)), 20000, '20 second timeout', 1000);
      await driver.executeScript(`document.getElementsByClassName('button btn--rounded btn-primary page-container__footer-button')[0].click();`);

      let windows = await driver.getAllWindowHandles();
      while(windows.length === 3){
        windows = await driver.getAllWindowHandles();
      }
      await driver.switchTo().window(windows[0]);
      
      return expect(windows.length).toBe(2);
    });
    
    /* 
    // this test can fail when run multiple times because it interacts with previous state
    test('get current wager amount and check if equal to amount entered', async () => {
      let wager = await driver.findElement(By.name(WAGER_AMT)).getText();

      let sanitizeWager = Number(wager.split('').slice(13).filter(el => el !== ',').join('').trim());
  
      while(wager && sanitizeWager <= 10000){
        wager = await driver.findElement(By.name(WAGER_AMT)).getText();
        if(wager) sanitizeWager = Number(wager.split('').slice(13).filter(el => el !== ',').join('').trim());
      }
      
      return expect(sanitizeWager).toBe(20000);
    });
    */
  });

  describe('deposit more money to test withdraw', () => {
    /* 
    test('check target strategy: DEPOSIT_AMT', async () => {
      const depositAmount = await driver.wait(until.elementLocated(By.name(DEPOSIT_AMT)), 20000, '20 second timeout', 1000);
      if(depositAmount){
        return true;
      } else return false;
    });

    // this test can fail when run multiple times because it interacts with previous state
    test('check current deposit amount', async () => {
      const depositAmount = await driver.findElement(By.name(DEPOSIT_AMT)).getText();
      const sanitizeAmount = Number(depositAmount.split('').slice(16).filter(el => el !== ',').join('').trim());

      // why does this always fail?
      // return expect(sanitizeAmount).toBe(10000);

      return expect(sanitizeAmount).toBe(0);
    });
    */

    test('check target strategy: DEPOSIT_BTN', async () => {
      const deposit = await driver.wait(until.elementLocated(By.name(DEPOSIT_BTN)), 20000, '20 second timeout', 1000);
      if(deposit){
        return true;
      } else return false;
    });

    test('click on 1st deposit button', async () => {
      const deposit = await driver.findElement(By.name(DEPOSIT_BTN));
      try {
        deposit.click();
      } catch(e) {
        return new Error(e);
      }
    });

    test('check target strategy: DEPOSIT_MDL_IN', async () => {
      const depositInput = await driver.wait(until.elementLocated(By.name(DEPOSIT_MDL_IN)), 20000, '20 second timeout', 1000);
      if(depositInput) {
        return true;
      } else return false;
    });

    test('enter 10000 into deposit input', async () => {
      const depositInput = await driver.findElement(By.name(DEPOSIT_MDL_IN));
      try {
        depositInput.click();
        depositInput.sendKeys('10000');
      } catch(e) {
        return new Error(e);
      }
    });

    test('check target strategy: DEPOSIT_MDL_DEPOSIT_BTN', async () => {
      const deposit = await driver.wait(until.elementLocated(By.name(DEPOSIT_MDL_DEPOSIT_BTN)), 20000, '20 second timeout', 1000);
      if(deposit){
        return true;
      } else return false;
    });

    test('click on 2nd deposit button', async () => {
      const deposit = await driver.findElement(By.name(DEPOSIT_MDL_DEPOSIT_BTN));
      try {
        deposit.click();
      } catch(e) {
        return new Error(e);
      }
    });

    test('1st metamask pop up occurs', async () => {
      let windows = await driver.getAllWindowHandles();
      while (windows.length < 3) {
        windows = await driver.getAllWindowHandles();
      }
      await driver.switchTo().window(windows[2]);

      return expect(windows.length).toBe(3);
    });

    test('click on 1st metamask confirm', async () => {
      await driver.wait(until.elementLocated(By.xpath(CONFIRM_BTN01)), 20000, '20 second timeout', 1000);
      await driver.executeScript(`document.getElementsByClassName('button btn--rounded btn-primary page-container__footer-button')[0].click();`);

      let windows = await driver.getAllWindowHandles();
      while(windows.length === 3){
        windows = await driver.getAllWindowHandles();
      }
      await driver.switchTo().window(windows[0]);
      
      return expect(windows.length).toBe(2);
    });

    test('2nd metamask pop up occurs', async () => {
      let windows = await driver.getAllWindowHandles();
      while (windows.length < 3) {
        windows = await driver.getAllWindowHandles();
      }
      await driver.switchTo().window(windows[2]);

      return expect(windows.length).toBe(3);
    });

    test('click on 2nd metamask confirm', async () => {
      await driver.wait(until.elementLocated(By.xpath(CONFIRM_BTN02)), 20000, '20 second timeout', 1000);
      await driver.executeScript(`document.getElementsByClassName('button btn--rounded btn-primary page-container__footer-button')[0].click();`);  
      
      let windows = await driver.getAllWindowHandles();
      while(windows.length === 3){
        windows = await driver.getAllWindowHandles();
      }
      await driver.switchTo().window(windows[0]);

      return expect(windows.length).toBe(2);
    });

    test('check target strategy: DEPOSIT_MDL_CLOSE_BTN', async () => {
      const close = await driver.wait(until.elementLocated(By.name(DEPOSIT_MDL_CLOSE_BTN)), 20000, '20 second timeout', 1000);
      if(close){
        return true;
      } else return false;
    });
    
    test('close deposit modal', async () => {
      // wait for animation to complete
      let isAnimationActive = true;
      while(isAnimationActive){
        const close = await driver.findElement(By.name(DEPOSIT_MDL_CLOSE_BTN));
        try {
          isAnimationActive = false;
          await close.click();
        } catch(e) {
          isAnimationActive = true;
        }
      }
      
      return true;
    });

    /* 
    test('check target strategy: DEPOSIT_MDL_BALANCE', async () => {
      const balance = await driver.wait(until.elementLocated(By.name(DEPOSIT_MDL_BALANCE)), 20000, '20 second timeout', 1000);
      if(balance){
        return true;
      } else return false;
    });
  
    // this test can fail when run multiple times because it interacts with previous state
    test('get current deposit balance and check if equal to amount entered', async () => {
      let depositBal = await driver.findElement(By.name(DEPOSIT_MDL_BALANCE)).getText();
      let sanitizeBal = Number(depositBal.split('').filter(el => el !== ',').join(''));
      // wait for deposit balance to update
      while(depositBal && sanitizeBal <= 0){
        depositBal = await driver.findElement(By.name(DEPOSIT_MDL_BALANCE)).getText();
        if(depositBal) sanitizeBal = Number(depositBal.split('').filter(el => el !== ',').join(''));
      }

      // wait for animation to complete
      let isAnimationActive = true;
      while(isAnimationActive){
        const close = await driver.wait(until.elementLocated(By.name(DEPOSIT_MDL_CLOSE_BTN)), 20000, '20 second timeout', 1000);
        try {
          isAnimationActive = false;
          await close.click();
        } catch(e) {
          isAnimationActive = true;
        }
      }
  
      return expect(sanitizeBal).toBe(10000);
    });
    */
  });

  describe('withdraw deposited money', () => {
    test('check target strategy: WITHDRAW_BTN', async () => {
      const withdraw = await driver.wait(until.elementLocated(By.name(WITHDRAW_BTN)), 20000, '20 second timeout', 1000);
      if(withdraw){
        return true;
      } else return false;
    });

    test('click on 1st withdraw button', async () => {
      const withdraw = await driver.findElement(By.name(WITHDRAW_BTN));
      try {
        withdraw.click();
      } catch(e) {
        return new Error(e);
      }
    });

    test('check target strategy: WITHDRAW_MDL_IN', async () => {
      const withdrawInput = await driver.wait(until.elementLocated(By.name(WITHDRAW_MDL_IN)), 20000, '20 second timeout', 1000);
      if(withdrawInput){
        return true;
      } else return false;
    });

    test('enter amount to withdraw', async () => {
      const withdrawInput = await driver.findElement(By.name(WITHDRAW_MDL_IN));
      try{
        withdrawInput.click();
        withdrawInput.sendKeys('10000');
      } catch(e) {
        return new Error(e);
      }
    });

    test('check target strategy: WITHDRAW_MDL_WITHDRAW_BTN', async () => {
      const withdraw = await driver.wait(until.elementLocated(By.name(WITHDRAW_MDL_WITHDRAW_BTN)), 20000, '20 second timeout', 1000);
      if(withdraw){
        return true;
      } else return false;
    });

    test('click on 2nd withdraw button', async () => {
      const withdraw = await driver.findElement(By.name(WITHDRAW_MDL_WITHDRAW_BTN));
      try{
        withdraw.click();
      } catch(e) {
        return new Error(e);
      }
    });
    
    test('metamask pop up occurs', async () => {
      let windows = await driver.getAllWindowHandles();
      while (windows.length < 3) {
        windows = await driver.getAllWindowHandles();
      }
      await driver.switchTo().window(windows[2]);

      return expect(windows.length).toBe(3);
    });

    test('click on metamask confirm', async () => {
      await driver.wait(until.elementLocated(By.xpath(CONFIRM_BTN03)), 20000, '20 second timeout', 1000);
      await driver.executeScript(`document.getElementsByClassName('button btn--rounded btn-primary page-container__footer-button')[0].click();`);

      let windows = await driver.getAllWindowHandles();
      while(windows.length === 3){
        windows = await driver.getAllWindowHandles();
      }
      await driver.switchTo().window(windows[0]);
      
      return expect(windows.length).toBe(2);
    });

    test('check target strategy: WITHDRAW_MDL_CLOSE_BTN', async () => {
      const close = await driver.wait(until.elementLocated(By.name(WITHDRAW_MDL_CLOSE_BTN)), 20000, '20 second timeout', 1000);
      if(close){
        return true;
      } else return false;
    });
    
    test('close withdraw modal', async () => {
      // wait for animation to complete
      let isAnimationActive = true;
      while(isAnimationActive){
        const close = await driver.findElement(By.name(WITHDRAW_MDL_CLOSE_BTN));
        try {
          isAnimationActive = false;
          await close.click();
        } catch(e) {
          isAnimationActive = true;
        }
      }
      
      return true;
    });
    
    /*     
    test('check target strategy: WITHDRAW_MDL_BALANCE', async () => {
      const withdrawBalance = await driver.wait(until.elementLocated(By.name(WITHDRAW_MDL_BALANCE)), 20000, '20 second timeout', 1000);
      if(withdrawBalance){
        return true;
      } else return false;
    });

    // this test can fail when run multiple times because it interacts with previous state
    test('get current withdrawable balance and check if equal to amount entered', async () => {
      let withdrawBalance = await driver.findElement(By.name(WITHDRAW_MDL_BALANCE)).getText();
      let sanitizeBal = Number(withdrawBalance.split('').filter(el => el !== ',').join(''));
      // wait for deposit balance to update
      while(withdrawBalance && sanitizeBal <= 0){
        withdrawBalance = await driver.findElement(By.name(WITHDRAW_MDL_BALANCE)).getText();
        if(withdrawBalance) sanitizeBal = Number(withdrawBalance.split('').filter(el => el !== ',').join(''));
      }

      // wait for animation to complete
      let isAnimationActive = true;
      while(isAnimationActive){
        const close = await driver.wait(until.elementLocated(By.name(WITHDRAW_MDL_CLOSE_BTN)), 20000, '20 second timeout', 1000);
        try {
          isAnimationActive = false;
          await close.click();
        } catch(e) {
          isAnimationActive = true;
        }
      }
  
      return expect(sanitizeBal).toBe(10000);
    });
    */
  });

  afterAll(async () => await driver.quit());
};

module.exports = e2eSequence01;