import { useState } from "react";
import "../styles/loadingScreen.scss"


const tips = [
  "💡 Explain your thought process before giving the final answer.",
  "💡 Use the STAR method for behavioral questions.",
  "💡 Mention time and space complexity when discussing algorithms.",
  "💡 It's okay to ask clarifying questions before answering.",
  "💡 Think aloud during coding interviews."
];

export const LoadingScreen = () => {

  const [tip] = useState(
    () => tips[Math.floor(Math.random() * tips.length)]
  );

  return (
    <main className="loading-screen">
      <h1>Generating Your Interview Report</h1>

      <div className="spinner" />

      <p>This usually takes 10–20 seconds.</p>

      <p className="loading-tip">{tip}</p>

      <small>
        Please don't close this tab while your report is being generated.
      </small>
    </main>
  );
};