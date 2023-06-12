const fs = require('fs');
const path = require('path');

const demosPath = '/Users/blinov.ivan/Desktop/work/devextreme-demos/JSDemos/Demos';
const pathToOutput = '/Users/blinov.ivan/Desktop/work/ticket-projects/chatgpt-react/openai-quickstart-node/utils';

function findReactFolders(directory) {
    const folders = fs.readdirSync(directory);

    const reactFolders = [];

    folders.forEach((folder) => {
        const folderPath = path.join(directory, folder);
        const stats = fs.statSync(folderPath);
        
        if (stats.isDirectory()) {
        if (/react/i.test(folder)) {
            reactFolders.push(folderPath);
        }

        const nestedReactFolders = findReactFolders(folderPath);
        reactFolders.push(...nestedReactFolders);
        }
    });

    return reactFolders;
}

const reactFilePaths = findReactFolders(demosPath)
    .map(folder => path.join(folder, 'App.js'))
    .map(folder => `"${folder}"`);
const result = `export const reactFilePaths = [${reactFilePaths.join(',\n')}];`
fs.writeFileSync(path.join(pathToOutput, 'allPaths.js'), result);
