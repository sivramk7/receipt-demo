import { useState, useRef } from "react";

function Chat(props) {
  return props.data ? (
    <div className="tw--bg-white tw--overflow-hidden tw--shadow tw--rounded-lg">
      <div className="tw--px-4 tw--py-5 tw--sm:p-6">
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
    <div className="tw--bg-white tw--overflow-hidden tw--shadow tw--rounded-lg">
      <div className="tw--px-4 tw--py-5 tw--sm:p-6">
        <div className="tw--flex tw--items-center tw--justify-between">
          <h3 className="tw--text-lg tw--leading-6 tw--font-medium tw--text-gray-900">Assistant</h3>
          <button
            onClick={clearChats}
            className="tw--ml-3 tw--bg-blue-500 tw--hover:bg-blue-700 tw--text-white tw--font-bold tw--py-2 tw--px-4 tw--rounded"
          >
            Clear Chat
          </button>
        </div>
        {chats.map((chat, index) => (
          <Chat key={index} data={chat} />
        ))}
        {tempPrompt && <Chat key="input" data={tempPrompt} />}
        <div className="tw--mt-5">
          <div className="tw--flex">
            <input
              ref={textFieldRef}
              value={prompt}
              className="tw--shadow tw--appearance-none tw--border tw--rounded tw--w-full tw--py-2 tw--px-3 tw--text-gray-700 tw--leading-tight tw--focus:outline-none tw--focus:shadow-outline"
              id="prompt"
              type="text"
              placeholder="Enter prompt here: (Ctrl+Enter to send)"
              onChange={onPromptChange}
              onKeyDown={onSendKeyDown}
            />
            <button
              onClick={(event) => sendPromptData(event)}
              className="tw--ml-3 tw--bg-blue-500 tw--hover:bg-blue-700 tw--text-white tw--font-bold tw--py-2 tw--px-4 tw--rounded"
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