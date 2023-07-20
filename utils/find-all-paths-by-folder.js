const fs = require('fs');
const path = require('path');

const demosMetaPath = '/Users/blinov.ivan/Desktop/work/devextreme-demos/JSDemos/menuMeta.json';
const rawmeta = fs.readFileSync(demosMetaPath);
const demosMeta = JSON.parse(rawmeta);
const demosPath = '/Users/blinov.ivan/Desktop/work/devextreme-demos/JSDemos/Demos';
const pathToOutput = '/Users/blinov.ivan/Desktop/work/ticket-projects/chatgpt-react/openai-quickstart-node/utils';

function findFolderPaths(meta, folderName) {
    const folderMeta = meta.find(metaElement => metaElement.Name === folderName);
    const reactFoldersByFolderName = [];
    findAllPathForGroup(folderMeta, reactFoldersByFolderName);
    return reactFoldersByFolderName;
}

function findAllPathForGroup(group, reactFoldersByFolderName){
    console.log(group);
    if (group.Groups){
        group.Groups.forEach(subGroup => {
            if (subGroup.Groups){
                subGroup.Groups.forEach(subSubGroup => {
                    findAllPathForGroup(subSubGroup, reactFoldersByFolderName);
                })
            } else {
                findAllDemosByGroup(subGroup, reactFoldersByFolderName);
            }
        })
    } else {
        findAllDemosByGroup(group, reactFoldersByFolderName);
    }
}

function findAllDemosByGroup(group, reactFoldersByFolderName){
    group.Demos.forEach(demo => {
        const { Widget, Name } = demo;
        reactFoldersByFolderName.push(`"${demosPath}/${Widget}/${Name}/React/App.js"`);
    })
}

const reactFilePaths = findFolderPaths(demosMeta, 'Navigation');
const result = `export const reactFilePaths = [${reactFilePaths.join(',\n')}];`;
fs.writeFileSync(path.join(pathToOutput, 'allPaths.js'), result);
