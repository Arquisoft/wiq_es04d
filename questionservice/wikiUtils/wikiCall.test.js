const wikiCall = require('./wikiCall');
const fetch = require('node-fetch');

// Jest manual mock para node-fetch
jest.mock('node-fetch', () => jest.fn());

describe('wikiCall function', () => {
    it('should fetch and return data from Wikidata for a valid SPARQL query', async () => {
        // Define una consulta SPARQL de ejemplo
        const sparqlQuery = 'SELECT * WHERE { ?s ?p ?o } LIMIT 1';

        // Configura node-fetch para simular una respuesta exitosa
        const mockJsonPromise = Promise.resolve({ results: { bindings: [{}] } }); // Simula datos de respuesta
        const mockFetchPromise = Promise.resolve({ ok: true, json: () => mockJsonPromise }); // Simula una respuesta exitosa
        fetch.mockImplementation(() => mockFetchPromise);

        // Llama a la función con la consulta SPARQL de prueba
        const result = await wikiCall(sparqlQuery);

        // Verifica que la función retorna los resultados esperados
        expect(result).toEqual([{}]);

        // Verifica que node-fetch fue llamado con los argumentos esperados
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining(encodeURIComponent(sparqlQuery)), {
            headers: { 'Accept': 'application/sparql-results+json' },
        });
    });
});
