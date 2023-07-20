import { Configuration, OpenAIApi } from "openai";

import fs from 'fs';
import path from "path";
const demosPath = '/Users/blinov.ivan/Desktop/work/devextreme-demos/JSDemos/Demos';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const bestPromptForCallbacks = `wrap all callbacks, that are located at the top scope inside App component, in usecallback  in the following code, if there are not any callbacks return the code itself with no changes. Do not add any extra callbacks:`;
function generatePrompt(filePath) {
const fileContents = fs.readFileSync(filePath, {encoding: 'utf-8'});
return [{ 
  role: "user", 
  content: `convert the following code from class components to functional: ${fileContents}`
}];
}

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const filePath = req.body.filePath;

  if (!filePath){
    res.status(500).json({
      error: {
        message: "Your filePath is not set",
      }
    });
  }

  try {
    const prompt = generatePrompt(req.body.filePath)
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: prompt,
      temperature: 0.5,
    });
    const chatgptAnswer = completion.data.choices[0].message;
    fs.writeFileSync(filePath, chatgptAnswer.content);
    res.status(200).json({ result: `File ${path.relative(demosPath, filePath)} has been handled!` });
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
