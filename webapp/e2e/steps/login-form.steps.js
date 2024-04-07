const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/register-form.feature');

let page;
let browser;

defineFeature(feature, test => {

    let username = "usuario"
    let password = "contraseña"

  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
        ? await puppeteer.launch()
        : await puppeteer.launch({ headless: false, slowMo: 100 });
    page = await browser.newPage();
    setDefaultOptions({ timeout: 10000 });

    await page.goto("http://localhost:3000/register", {
      waitUntil: "networkidle0",
    }).catch(() => {});

    //Registrar al user

    await expect(page).toFill('input[name="username"]', username);
    await expect(page).toFill('input[name="password"]', password);
    await expect(page).toClick('button', { text: 'Registrarse' })

  }, 60000);

  test('The user is registered in the site', ({given,when,then}) => {
    
    given('A registered user, fill the data', async () => {
        await expect(page).toFill('input[name="username"]', username);
        await expect(page).toFill('input[name="password"]', password);
    });
    
    when('Presses submit', async () => {
        await expect(page).toClick('button', { text: 'Entrar' });
    });


    then('The user is redirected', async () => {
        await expect(page).toMatchElement("div", { text: "Inicio de sesión exitoso" });
    });
  })

  afterAll(async ()=>{
    browser.close()
  })

});