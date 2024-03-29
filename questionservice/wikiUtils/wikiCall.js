const fetch = require('node-fetch');

const ENDPOINT_URL = 'https://query.wikidata.org/sparql';

async function wikiCall(sparqlQuery) {
    const url = ENDPOINT_URL + '?query=' + encodeURIComponent(sparqlQuery);
    const headers = { 'Accept': 'application/sparql-results+json' };

    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.results.bindings;
    } catch (error) {
        console.error(`Could not fetch data from Wikidata: ${error}`);
        return [];
    }
}

module.exports = wikiCall;
