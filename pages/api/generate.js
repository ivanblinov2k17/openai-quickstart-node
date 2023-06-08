import { Configuration, OpenAIApi } from "openai";
import js_beautify from "js-beautify";

// import {code} from '../../assets/code';
import fs from 'fs';
import path from "path";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const pathToCode = '/Users/blinov.ivan/Desktop/work/ticket-projects/chatgpt-react/openai-quickstart-node/assets/';
export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  
  fs.writeFileSync(path.join(pathToCode, 'code2.js'), data);
  res.status(200).json({result: {content: js_beautify(data, { indent_size: 2, space_in_empty_paren: true })}});

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: generatePrompt(),
      temperature: 1,
    });
    res.status(200).json({ result: completion.data.choices[0].message });
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

function generatePrompt(fileName = 'code.js') {
  const data = fs.readFileSync(path.join(pathToCode, fileName), {encoding: 'utf-8'});
  return [{ 
    role: "user", 
    content: `convert the following code from class components to functional: ${data}`
  }];
}
