const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/login-form.feature');

let page;
let browser;

defineFeature(feature, test => {

    let username = "usuario11"
    let password = "contraseña"

  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
        ? await puppeteer.launch()
        : await puppeteer.launch({ headless: false, slowMo: 100,defaultViewport: {
                width: 1024, // Asegurando que el ancho sea mayor a 960px
                height: 768,
            }, });
    page = await browser.newPage();
    setDefaultOptions({ timeout: 10000 });

    await page.goto("http://localhost:3000/sign-up", {
      waitUntil: "networkidle0",
    }).catch(() => {});


    //Registrar al user

    await expect(page).toFill('input[name="username"]', username);
    await expect(page).toFill('input[name="password"]', password);
    await expect(page).toClick('button[name="registrarsePage"]');

    await page.waitForTimeout(1500);

  }, 60000);

  test('The user is registered in the site', ({given,when,then}) => {
    
    given('A registered user, fill the data', async () => {
        await expect(page).toFill('input[name="username"]', username);
        await expect(page).toFill('input[name="password"]', password);
    });
    
    when('Presses submit', async () => {
        await expect(page).toClick('button[name="entrarPage"]');
        await page.waitForTimeout(1500);
    });


    then('The user is redirected', async () => {
        //No lo encuentra
        await expect(page).toMatchElement("p", { text: "¿A que estás esperando?" });
    });
  })

  afterAll(async ()=>{
    browser.close()
  })

});