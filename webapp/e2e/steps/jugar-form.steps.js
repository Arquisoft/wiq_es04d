const puppeteer = require('puppeteer');
const { defineFeature, loadFeature } = require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions;
const feature = loadFeature('./features/jugar-form.feature');

let page;
let browser;

defineFeature(feature, (test) => {
    let username = "";
    let password = "";

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: "new",
            slowMo: 50,
            defaultViewport: {
                width: 1024,
                height: 768,
            },
        });
        page = await browser.newPage();
        setDefaultOptions({ timeout: 200000 });
    }, 300000);

    test('User Initiates a Game', ({ given, when,and, then }) => {
        given('An unregistered user exists', async () => {
            // username = "Zohaib";
            // password = "Zohaib11";
        });

        when('the user enters their details on the register form and submits', async () => {
            // await page.goto("http://localhost:3000/sign-up", {
            //     waitUntil: "networkidle0",
            // });
            // await expect(page).toFill('input[name="username"]', username);
            // await expect(page).toFill('input[name="password"]', password);
            // await expect(page).toClick('button[name="registrarsePage"]');
            // await page.waitForNavigation({
            //     waitUntil: 'networkidle0'
            // });
        });

        and('the user is redirected to the homepage and logged in automatically', async () => {
            // // Utiliza data-testid para verificar la presencia de botones o enlaces
            // const isLogoutLinkVisibleMobile = await page.$eval('[data-testid="Salir-button-navbar"]', el => el.textContent.includes('Salir'));
            // const isLogoutButtonVisibleDesktop = await page.$('[data-testid="Salir-button-navbar-large"]') !== null;

            // // Afirmar que el enlace o botón "Salir" debe ser visible en al menos una de las versiones
            // expect(isLogoutLinkVisibleMobile || isLogoutButtonVisibleDesktop).toBeTruthy();
        });

        and('the user clicks the "Play" button on the homepage', async () => {
            // await expect(page).toClick('[data-testid="jugar-button-home"]');
            // await page.waitForNavigation({
            //     waitUntil: 'networkidle0'
            // });
        });

        then('the questions should be displayed', async () => {

            // const questionText = await page.$eval('.quiz-header h2', el => el.textContent);
            // expect(questionText).toBeTruthy();

            // // // Opcionalmente, puedes verificar el número de la pregunta actual vs. el total
            // const questionIndicatorText = await page.$eval('.quiz-header div', el => el.textContent);
            // expect(questionIndicatorText).toMatch(/Pregunta \d+ de \d+/);

            // // // Verificar que las opciones de respuesta se muestran
            // const answersCount = await page.$$eval('.answers-list li', answers => answers.length);
            // expect(answersCount).toBe(4);

        });

    },300000);

    afterAll(async () => {
       await browser.close();
     });

});