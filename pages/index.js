import Head from "next/head";
import { useState, useCallback } from "react";
import styles from "./index.module.css";
import {reactFilePaths} from "../utils/allPaths";

export default function Home() {
  const [result, setResult] = useState([]);
  const [generationStarted, setGenerationStarted] = useState(false);

  const onSubmit = useCallback(async () => {
    reactFilePaths.forEach(async (reactFilePath) => {
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ filePath: reactFilePath }),
        });
        console.log('request sent');
        const data = await response.json();
        if (response.status !== 200) {
          throw data.error || new Error(`Request failed with status ${response.status}`);
        }
        console.log('get response', data);
        setResult(result => [...result, data.result]);
      } catch(error) {
        console.error(error);
        alert(error.message);
      }
    });
  }, [result]);

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <button onClick={onSubmit}>Generate</button>
        <div>{generationStarted ? 'Generation has started' : ''}</div>
        <div>{result.length === reactFilePaths.length ? 'Generation finished' : ''}</div>
        <div>{result.length}</div>
        <div className={styles.result}>{result.map((message, index) => <div key={index}>{message}</div>)}</div>

      </main>
    </div>
  );
}
