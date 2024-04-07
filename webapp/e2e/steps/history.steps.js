const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/history-form.feature');

let page;
let browser;

defineFeature(feature, test => {

    let username = "usuario12"
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

    await page.goto("http://localhost:3000/login", {
      waitUntil: "networkidle0",
    }).catch(() => {});

  }, 60000);

  test('The user is not loged in the site', ({given,when,then}) => {
    
    given('A not loged user', async () => {

    });
    
    when('Press history', async () => {
        await page.goto("http://localhost:3000/historial", {
            waitUntil: "networkidle0",
        }).catch(() => {});
    });

    then('Redirected to login', async () => {
        await expect(page).toMatchElement('button',{ text: 'Entrar' });
    });
  })

  test('The user is loged in the site so he can see history', ({given,when,then}) => {
    
    given('A registered user, i fill the login', async () => {
        await page.goto("http://localhost:3000/login", {
            waitUntil: "networkidle0",
        }).catch(() => {});
        await expect(page).toFill('input[name="username"]', username);
        await expect(page).toFill('input[name="password"]', password);
        await expect(page).toClick('button[name="entrarPage"]');
        await page.waitForTimeout(1500);
    });
    
    when('I press history', async () => {
        await expect(page).toClick('a', { text: 'Historial' });
    });

    then('I see my history', async () => {
        await expect(page).toMatchElement('h1', { text: 'HISTORIAL' });
        await expect(page).toMatchElement('p', { text: 'Número de Partidas:' });
        await expect(page).toMatchElement('p', { text: 'Número de Preguntas Jugadas:' });
        await expect(page).toMatchElement('p', { text: 'Número de acertadas:' });
        await expect(page).toMatchElement('p', { text: 'Número de falladas:' });
    });
  })

  afterAll(async ()=>{
    browser.close()
  })

});