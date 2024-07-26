const {
    preprocessContent,
    analyzeContent,
    getTopWords
} = require('../contentAnalyzers');

jest.mock('../wordProcessors', () => ({
    extractWords: jest.fn((text) => text.split(' '))
}));

describe('preprocessContent', () => {
    test('removes code blocks', () => {
        const content = "Some text\n```\ncode block\n```\nMore text";
        expect(preprocessContent(content, 'test.md')).toBe("Some text\nMore text");
    });

    test('removes inline code', () => {
        const content = "Some `inline code` here";
        expect(preprocessContent(content, 'test.md')).toBe("Some  here");
    });

    test('handles Filters folder content', () => {
        const content = "# Options\n<a>Some link</a>\n[Text](URL)\n_emphasized_\n- word :";
        expect(preprocessContent(content, 'docs/Filters/test.md')).toBe("# Options\n\n\n\n");
    });
});

describe('analyzeContent', () => {
    test('counts words correctly', () => {
        const content = "word1 word2 word1";
        const result = analyzeContent(content, {}, new Set(), new Set());
        expect(result).toEqual({ WORD1: 2, WORD2: 1 });
    });
});

describe('getTopWords', () => {
    test('returns top N words above minimum frequency', () => {
        const wordCounts = { WORD1: 5, WORD2: 3, WORD3: 7, WORD4: 2 };
        const result = getTopWords(wordCounts, 2, 3);
        expect(result).toEqual({ WORD3: 7, WORD1: 5 });
    });
});