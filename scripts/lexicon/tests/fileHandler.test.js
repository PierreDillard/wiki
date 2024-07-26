const fs = require('fs');
const path = require('path');
const {
    loadJsonFile,
    saveJsonFile,
    loadDefinitions,
    loadCommonEnglishWords,
    loadStopWords,
    exploreDirectory
} = require('../fileHandlers');

jest.mock('fs');
jest.mock('path');

describe('loadJsonFile', () => {
    test('loads and parses JSON file correctly', () => {
        const mockData = { key: 'value' };
        fs.readFileSync.mockReturnValue(JSON.stringify(mockData));
        expect(loadJsonFile('test.json')).toEqual(mockData);
    });

    test('handles errors gracefully', () => {
        fs.readFileSync.mockImplementation(() => { throw new Error('Read error'); });
        console.error = jest.fn();
        expect(loadJsonFile('test.json')).toBeNull();
        expect(console.error).toHaveBeenCalled();
    });
});

describe('saveJsonFile', () => {
    test('saves JSON data to file', () => {
        const mockData = { key: 'value' };
        saveJsonFile('test.json', mockData);
        expect(fs.writeFileSync).toHaveBeenCalledWith('test.json', JSON.stringify(mockData, null, 2));
    });
});

// Add similar tests for loadDefinitions, loadCommonEnglishWords, loadStopWords


describe('exploreDirectory', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        fs.readdirSync = jest.fn().mockReturnValue(['file1.md', 'file2.txt', 'subdir']);
        fs.statSync = jest.fn((itemPath) => ({
            isDirectory: () => itemPath.endsWith('subdir'),
            isFile: () => !itemPath.endsWith('subdir')
        }));
        path.extname = jest.fn((item) => item.endsWith('.md') ? '.md' : '');
        fs.readFileSync = jest.fn().mockReturnValue('file content');
    });

    test('explores directory and returns markdown files', () => {
        const result = exploreDirectory('/test', [], []);
        expect(result).toEqual([{ path: '/test/file1.md', content: 'file content' }]);
    });
});