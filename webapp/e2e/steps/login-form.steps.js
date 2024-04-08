const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/login-form.feature');

let page;
let browser;

defineFeature(feature, test => {

    let username = "santiago20"
    let password = "santiago1"

  beforeAll(async () => {
      browser = await puppeteer.launch({ headless: true, slowMo: 50,defaultViewport: {
              width: 1024, height: 768,}, });
      page = await browser.newPage();
      setDefaultOptions({ timeout: 200000 });

    await page.goto("http://localhost:3000/sign-up", {
      waitUntil: "networkidle0",
    }).catch(() => {});


    //Registrar al user

    await expect(page).toFill('input[name="username"]', username);
    await expect(page).toFill('input[name="password"]', password);
    await expect(page).toClick('button[name="registrarsePage"]');


  }, 300000);

  test('The user is registered in the site', ({given,when,then}) => {
    
    given('A registered user, fill the data', async () => {
        await expect(page).toMatchElement('button[name="entrarPage"]');
        await expect(page).toFill('input[name="username"]', username);
        await expect(page).toFill('input[name="password"]', password);
    });
    
    when('Presses submit', async () => {
        await expect(page).toClick('button[name="entrarPage"]');
    });


    then('The user is redirected', async () => {
        await expect(page).toMatchElement("p", { text: "¿A que estás esperando?" });
    });
  },300000);

  afterAll(async ()=>{
    browser.close()
  })

});