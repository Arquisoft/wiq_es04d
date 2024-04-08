const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/history-form.feature');

let page;
let browser;

defineFeature(feature, test => {

  let username = "yago20"
  let password = "yago1"

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

  test('The user is not loged in the site', ({given,when,then}) => {

    given('A not loged user', async () => {

    });

    when('Press history', async () => {
      await page.goto("http://localhost:3000/historial", {
        waitUntil: "networkidle0",
      }).catch(() => {});
    });

    then('Redirected to login', async () => {
      await expect(page).toMatchElement('button[name="entrarPage"]');
    });
  },300000);

  test('The user is loged in the site so he can see history', ({given,when,then}) => {

    given('A registered user, i fill the login', async () => {
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toClick('button[name="entrarPage"]');

    });

    when('I press history', async () => {
      await page.waitForSelector('a[data-testid="historial-link"]', {
        visible: true,
      });
      await page.click('a[data-testid="historial-link"]');
    });

    then('I see my history', async () => {
      await expect(page).toMatchElement('h1', { text: 'HISTORIAL' });
      await expect(page).toMatchElement('p', { text: 'Número de Partidas:' });
      await expect(page).toMatchElement('p', { text: 'Número de Preguntas Jugadas:' });
      await expect(page).toMatchElement('p', { text: 'Número de acertadas:' });
      await expect(page).toMatchElement('p', { text: 'Número de falladas:' });
    });
  },300000);

  afterAll(async ()=>{
    browser.close()
  })

});