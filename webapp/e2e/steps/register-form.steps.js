// const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
// const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/register-form.feature');

// let page;
// let browser;

defineFeature(feature, test => {

  // beforeAll(async () => {
  //   browser = await puppeteer.launch({ headless: true, slowMo: 50,defaultViewport: {
  //       width: 1024, height: 768,}, });
  //   page = await browser.newPage();
  //   setDefaultOptions({ timeout: 200000 });

  //   await page.goto("http://localhost:3000/login", {
  //     waitUntil: "networkidle0",
  //   }).catch(() => {});
  // }, 300000);

  test('The user is not registered in the site', ({given,when,then}) => {
    
    // let username;
    // let password;

    given('An unregistered user', async () => {
      // username = "abdulla24"
      // password = "abdulla20"
      // await expect(page).toClick("a", { text: "¿No tienes una cuenta? Registrate aquí." });
    });

    when('I fill the data in the form and press submit', async () => {
      // await expect(page).toFill('input[name="username"]', username);
      // await expect(page).toFill('input[name="password"]', password);
      // await expect(page).toClick('button[name="registrarsePage"]');
    });

    then('A confirmation message should be shown in the screen', async () => {
        // await expect(page).toMatchElement('button[name="entrarPage"]');
    });
  },300000);

  // afterAll(async ()=>{
  //   browser.close()
  // })

});