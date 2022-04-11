# END TO END TESTS FOR FP


## mac resource download

* Download link:

https://mega.nz/file/MjwlXA5L#TxajrGFcAKSH2-riMR_OY2UdvX7JRrXWd2QpDr1t7Qk

* sha512 hash: 

24e48ae2ef8cb30fe6bce247b733e84ef35d8bd789ada3317e77926ab54faf31da85b9111c4e5606ac7e280898b5b602eceed86627ac81ad3bb1ccc9cc03d16c

* Get the downloaded file hash, then compare output with above hash to ensure the same file is downloaded:

`openssl dgst -sha512 /PATH/TO/DOWNLOADED/FILE/googlechrome.dmg`


## How to run tests
  1.  Ensure the dev environment is up and running.
  2.  As of now, tests are in the **selenium-test-0** branch of the **pear-connects-crypto** repo and the **selenium-test-0** branch of the **fareplay-frontend-metaverse** repo. **pear-connects-crypto** contains the tests, while **fareplay-frontend-metaverse** contains the test targets for the tests. Both repositories must be on the **selenium-test-0** branch for tests to work.
  3.  After moving to correct branch:
    *  `cd ~/pear-connects-crypto/tests`
    *  `npm install`
  4.  Create a .env in /tests with the following format:
      ```
      METAMASK_PASSPHRASE01=
      METAMASK_PASSPHRASE02=
      METAMASK_PASSPHRASE03=
      METAMASK_PASSPHRASE04=
      METAMASK_PASSPHRASE05=
      METAMASK_PASSPHRASE06=
      METAMASK_PASSPHRASE07=
      METAMASK_PASSPHRASE08=
      METAMASK_PASSPHRASE09=
      METAMASK_PASSPHRASE10=
      METAMASK_PASSPHRASE11=
      METAMASK_PASSPHRASE12=
      PASSWORD=
      PRIVATE=
      ```
  5.  Then enter your MetaMask testing account information. Your 12 key MetaMask pass phrase keys are entered into indiviual fields (`METAMASK_PASSPHRASE01=`, `METAMASK_PASSPHRASE02=`, ... etc) without any whitespaces. Enter a local password for MetaMask in `PASSWORD`. Finally, enter your MetaMask testing account private key into `PRIVATE=` so that the testing account can be imported by Selenium WebDriver during the e2e tests.
  6.  Move the downloaded Chrome installer file into /tests/mac_chrome, install Chrome to that directory.
  7.  After Chrome has been installed in /tests/mac_chrome, open it at least once and provide it normal system permissions.
  8.  After all dependencies are installed, .env is setup, and Chrome binary is setup, then while in /tests:
    *  `npm test`


## Test file structure
  *  **e2e-sequences.test.js** aka "The Runner File"
    1.  Jest is set to run all tests serailly or in sequence one after another via `jest --runInBand`, which disables Jest's default parallelism. This is to prevent intereference with Selenium WebDriver. Along with the command in package.json, structure tests with a single Jest file that has any Jest naming conventions because all test scripts must be called in that single file for Jest to run tests serially. 
    *  **e2eSequence00.js** aka *The Landing Page* sequence 
      1.  All test targets are at the top of the page stored as globals.
      2.  *The Landing Page* checks all test targets to see if they are functioning, which also provides time for target components to load and for Selenium WebDriver to see them.
      3.  The tests click through all frontend buttons, which relies on Selenium WebDriver to provide errors for when clicks do not work by wrapping all clicks in `try...catch(e)` blocks.
      4.  After button clicks, Jest `expect().toBe()` is used for assertion tests where appropriate. The assertion tests check whether certain components load or whether certain quantifiable references/events occur.
    *  **e2eSequence01.js** aka *The MetaMask* sequence 
      1.  Checks test targets that are relevant to MetaMask integration to see if they are functioning, which also provides time for target components to load and for Selenium WebDriver to see them.
      2.  *The MetaMask* sequence testing patterns follow the same conventions as *The Landing Page* sequence, except that all MetaMask interactions are isolated as standalone tests to ensure that if interaction with MetaMask fails, the test results reflect that failure.


## Known limitations
  1.  The tests only work on macOS as of now, providing support for Windows and Linux is in progress.
  2.  Application state cannot be tested with the current testing tools. Refer to the commented out code in **e2eSequence01.js**, the commented out tests attempt to test deposit, wager, and withdrawal balances but are inconsistent. The likely cause is the resource limitations during FP, Selenium WebDriver, and MetaMask interacting with one another. A fix is in progress.
  3.  Tests will not run reliably in Chrome headless mode. A fix is in progress.


## Errors (in total)
  1.  **Chrome Alert**: Not enough PEAR. Please deposit less than 0
    *  fix: restart dev server because fe and be aren't communicating correctly
    *  throws an error b/c the fe hasn't gotten the amount from be
  2.  **Chrome Alert**: Please enter a deposit amount.
    *  fix: restart tests, caused by MetaMask and fp interaction hang
  3.  **Chrome Alert**: Cannot withdraw that much. Please deposit less than 0.0
    *  fix: restart tests, caused by MetaMask and fp interaction hang
  4.  **FP Warning**: upstream connect error or disconnect/reset before headers. reset reason: connection termination
    *  fix: restart dev server because fe and be aren't communicating correctly
  5.  **FP Alert**: Not enough in deposit balance. Please add more funds
    *  fix: restart tests, caused by MetaMask and fp interaction hang


## Assumptions
  * All the tests are intended to demonstrate a proof of concept and to identify errors.
  * The Jest file naming conventions are to enable tests to run serially. The test suite scripts file naming convention is to preserve test running order, i.e, **e2eSequence00.js** and **e2eSequence01.js**. The running order of testings scripts in the Jest runner file should progress from less intensive to more intensive.
  * *The Landing Page* sequence is a baseline interaction of Selenium WebDriver and FP, since tests run in order from less intensive to more intensive, any complex interaction failures can be isolated by comparing against the baseline of tests. Any interaction sequences like *The MetaMask* should follow *The Landing Page* sequence in order to take advantage of *The Landing Page* as a baseline reference.
