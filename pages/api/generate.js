import { Configuration, OpenAIApi } from "openai";
import js_beautify from "js-beautify";

import fs from 'fs';
import path from "path";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const pathToCode = '/Users/blinov.ivan/Desktop/work/ticket-projects/chatgpt-react/openai-quickstart-node/assets/';
const demosPath = '/Users/blinov.ivan/Desktop/work/devextreme-demos/JSDemos/Demos'

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }
  const fs = require('fs');
  const path = require('path');

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

  // Example usage
  const reactFolders = findReactFolders(demosPath);
  console.log(reactFolders);

  try {
    // const prompt = generatePrompt()
    // const completion = await openai.createChatCompletion({
    //   model: "gpt-3.5-turbo",
    //   messages: prompt,
    //   temperature: 1,
    // });
    // const chatgptAnswer = completion.data.choices[0].message;
    // fs.writeFileSync(path.join(pathToCode, 'code2.js'), chatgptAnswer.content);
    // res.status(200).json({ result: chatgptAnswer });
    res.status(200).json({ result: {content: reactFolders}});
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

export function generatePrompt(fileName = 'code.js') {
  const data = fs.readFileSync(path.join(pathToCode, fileName), {encoding: 'utf-8'});
  return [{ 
    role: "user", 
    content: `convert the following code from class components to functional: ${data}`
  }];
}
