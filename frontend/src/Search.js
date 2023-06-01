import { useState, useRef } from "react";

function Chat(props) {
  return props.data ? (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        {props.data.role} - {props.data.content}
      </div>
    </div>
  ) : null;
}

function Search(props) {
  const ocr_data = props.data ? props.data.text : "";
  const [prompt, setPrompt] = useState("");
  const [chats, setChats] = useState([]);
  const [tempPrompt, setTempPrompt] = useState();
  const textFieldRef = useRef();

  async function submitPromptData() {
    // for local
    const req = await fetch("http://127.0.0.1:5000/search/", {
    // for prod
    // const req = await fetch("/search/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ocr_text: ocr_data,
        context: chats,
        prompt: prompt,
      }),
    });
    const res = await req.json();
    const response = res.choices[0].message.content;
    setTempPrompt("");
    setChats([
      ...chats,
      { role: "user", content: prompt },
      { role: "assistant", content: response },
    ]);
    setPrompt("");
  }

  function onPromptChange(event) {
    setPrompt(event.target.value);
  }

  function clearChats() {
    setTempPrompt("");
    setChats([]);
  }

  async function onSendKeyDown(event) {
    if ((event.keyCode == 10 || event.keyCode == 13) && event.ctrlKey) {
      setTempPrompt({ role: "user", content: event.target.value });
      event.target.value = "";
      submitPromptData();
    }
  }

  async function sendPromptData(event) {
    setTempPrompt({ role: "user", content: event.target.value });
    submitPromptData();
  }

  return !ocr_data ? null : (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Assistant</h3>
          <button
            onClick={clearChats}
            className="ml-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Clear Chat
          </button>
        </div>
        {chats.map((chat, index) => (
          <Chat key={index} data={chat} />
        ))}
        {tempPrompt && <Chat key="input" data={tempPrompt} />}
        <div className="mt-5">
          <div className="flex">
            <input
              ref={textFieldRef}
              value={prompt}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="prompt"
              type="text"
              placeholder="Enter prompt here: (Ctrl+Enter to send)"
              onChange={onPromptChange}
              onKeyDown={onSendKeyDown}
            />
            <button
              onClick={(event) => sendPromptData(event)}
              className="ml-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;