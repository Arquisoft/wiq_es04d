const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/history-form.feature');

let page;
let browser;

defineFeature(feature, test => {

  let username = "";
  let password = "";

  beforeAll(async () => {

       browser = await puppeteer.launch({ headless: "new", slowMo: 50,defaultViewport: {
           width: 1024, height: 768,}, });
       page = await browser.newPage();
       setDefaultOptions({ timeout: 200000 });

     }, 300000);

    test('The user is not loged in the site', ({given,when,then}) => {

    given('A not loged user', async () => {
        username = "yago";
        password = "Yagooooo1";
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

  test('The user register in the site so he can see history', ({given,when,then}) => {

    given('A unregistered user, fill the register', async () => {
        await page.goto("http://localhost:3000/sign-up", {
            waitUntil: "networkidle0",
        }).catch(() => {});
        //Registrar al user
        await expect(page).toFill('input[name="username"]', username);
        await expect(page).toFill('input[name="password"]', password);
        await expect(page).toClick('button[name="registrarsePage"]');
        await page.waitForNavigation({
            waitUntil: 'networkidle0'
        });
    });

    when('I press history', async () => {
      await page.waitForSelector('[data-testid="historial-button-navbar"]', {
        visible: true,
      });
      await page.click('[data-testid="historial-button-navbar"]');
    });

    then('I see my history', async () => {
      await expect(page).toMatchElement('h1', { text: 'HISTORIAL' });
      await expect(page).toMatchElement('p', { text: 'Número de Partidas: 0' });
      await expect(page).toMatchElement('p', { text: 'Número de Preguntas Jugadas: 0' });
      await expect(page).toMatchElement('p', { text: 'Número de acertadas: 0' });
      await expect(page).toMatchElement('p', { text: 'Número de falladas: 0' });
    });
  },300000);

  afterAll(async ()=>{
    browser.close()
  })

});