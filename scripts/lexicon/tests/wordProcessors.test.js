const {
    cleanWord,
    isValidWord,
    extractWords,
    singularizePlurals
} = require('../wordProcessors');

describe('cleanWord', () => {
    test('removes non-alphanumeric characters and converts to uppercase', () => {
        expect(cleanWord('Hello,')).toBe('HELLO');
        expect(cleanWord('test123')).toBe('TEST123');
        expect(cleanWord('hypen-word')).toBe('HYPENWORD');
    });
});

describe('isValidWord', () => {
    const definitions = { VALID: true };
    const stopWords = new Set(['STOP']);
    const commonEnglishWords = new Set(['COMMON']);

    test('returns false for short words', () => {
        expect(isValidWord('A', definitions, null, stopWords, commonEnglishWords)).toBe(false);
    });

    test('returns false for numbers', () => {
        expect(isValidWord('123', definitions, null, stopWords, commonEnglishWords)).toBe(false);
    });

    test('returns false for words in definitions', () => {
        expect(isValidWord('VALID', definitions, null, stopWords, commonEnglishWords)).toBe(false);
    });

    test('returns false for stop words', () => {
        expect(isValidWord('STOP', definitions, null, stopWords, commonEnglishWords)).toBe(false);
    });

    test('returns false for common English words', () => {
        expect(isValidWord('COMMON', definitions, null, stopWords, commonEnglishWords)).toBe(false);
    });

    test('returns true for valid words', () => {
        expect(isValidWord('VALID1', definitions, null, stopWords, commonEnglishWords)).toBe(true);
    });
});

describe('extractWords', () => {
    const definitions = {};
    const stopWords = new Set(['THE']);
    const commonEnglishWords = new Set(['IS']);

    test('extracts and processes words correctly', () => {
        const text = "The quick brown fox is jumping.";
        const result = extractWords(text, definitions, stopWords, commonEnglishWords);
        expect(result).toEqual(['QUICK', 'BROWN', 'FOX', 'JUMPING']);
    });
});


describe('singularizePlurals', () => {
    test('combines singular and plural forms', () => {
        const wordCounts = { 'CAT': 2, 'CATS': 3, 'DOG': 1, 'DOGS': 2 };
        const fileOccurrences = {
            'CAT': new Set(['file1']),
            'CATS': new Set(['file2']),
            'DOG': new Set(['file1']),
            'DOGS': new Set(['file2', 'file3'])
        };
        const result = singularizePlurals(wordCounts, fileOccurrences);
        expect(result.wordCounts).toEqual({ 'CAT': 5, 'DOG': 3 });
        expect(result.fileOccurrences.CAT).toEqual(new Set(['file1', 'file2']));
        expect(result.fileOccurrences.DOG).toEqual(new Set(['file1', 'file2', 'file3']));
    });
});