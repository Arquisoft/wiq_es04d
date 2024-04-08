const puppeteer = require('puppeteer');
const { defineFeature, loadFeature } = require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions;
const feature = loadFeature('./features/jugar-form.feature');

let page;
let browser;

defineFeature(feature, (test) => {
    let username = "zohaib20";
    let password = "zohaib1";

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

    test('User Initiates a Game', ({ given, when, then }) => {

        given('a registered user exists', async () => {
            await expect(page).toMatchElement('button[name="entrarPage"]');
        });

        when('the user enters their details on the login form and submits', async () => {
            await expect(page).toFill('input[name="username"]', username);
            await expect(page).toFill('input[name="password"]', password);
            await expect(page).toClick('button[name="entrarPage"]')
        });

        when('the user clicks the "Play" button on the homepage', async () => {
            await expect(page).toClick('button', { text: 'JUGAR' })
        });

        then('the questions should be displayed', async () => {
            await expect(page).toMatchElement('.quiz-header');

            // Recuperar y verificar el texto de la pregunta actual
            const questionText = await page.$eval('.quiz-header h2', el => el.textContent);
            expect(questionText).toBeTruthy();

            // Opcionalmente, puedes verificar el número de la pregunta actual vs. el total
            const questionIndicatorText = await page.$eval('.quiz-header div', el => el.textContent);
            expect(questionIndicatorText).toMatch(/Pregunta \d+ de \d+/);

            // Verificar que las opciones de respuesta se muestran
            const answersCount = await page.$$eval('.answers-list li', answers => answers.length);
            expect(answersCount).toBe(4);

        });

    },300000);

    afterAll(async () => {
        await browser.close();
    });

});