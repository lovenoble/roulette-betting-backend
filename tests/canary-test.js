const {By,Key,Builder} = require("selenium-webdriver");
require("chromedriver");
 
async function example(){
  let driver = await new Builder().forBrowser("chrome").build();
  
  await driver.get("http://localhost:3000");
  
  await driver.getCurrentUrl().then(url => console.log(url));
  
  await driver.quit();
}
 
example()