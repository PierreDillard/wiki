const {
    manageGlossaryTerms,
    cleanGlossaryTerms,
    reviewGlossaryTerms
} = require('../glossaryManager');
const { loadJsonFile, saveJsonFile } = require('../fileHandlers');

jest.mock('../fileHandlers');

describe('manageGlossaryTerms', () => {
    test('adds new term to glossary', () => {
        loadJsonFile.mockReturnValue({});
        manageGlossaryTerms('NEWTERM', {}, 10);
        expect(saveJsonFile).toHaveBeenCalledWith(expect.any(String), { NEWTERM: { count: 1, isReviewed: false } });
    });

    test('updates existing term in glossary', () => {
        loadJsonFile.mockReturnValue({ EXISTINGTERM: { count: 1, isReviewed: false } });
        manageGlossaryTerms('EXISTINGTERM', {}, 10);
        expect(saveJsonFile).toHaveBeenCalledWith(expect.any(String), { EXISTINGTERM: { count: 10, isReviewed: false } });
    });
});

describe('cleanGlossaryTerms', () => {
    test('removes plural forms', () => {
        loadJsonFile.mockReturnValue({ CATS: { count: 1, isReviewed: false } });
        const definitions = { CAT: true };
        const stopWords = new Set();
        const commonEnglishWords = new Set();
        cleanGlossaryTerms(definitions, stopWords, commonEnglishWords);
        expect(saveJsonFile).toHaveBeenCalledWith(expect.any(String), {});
    });
});

