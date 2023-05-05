import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { elementType } from "prop-types";
import { useState } from "react";

function Chat(props) {
  return props.data ? (
    <>
      <Card>
        <CardContent>
          {props.data.role} - {props.data.content}
        </CardContent>
      </Card>
    </>
  ) : (
    <></>
  );
}

function Search(props) {
  const ocr_data = props.data ? props.data.text : "";
  const [prompt, setPrompt] = useState("");
  const [chats, setChats] = useState([]);
  const [tempPrompt, setTempPrompt] = useState();

  async function submitPromptData() {
    // for local
    // const req = await fetch("http://127.0.0.1:5000/search/", {
    // for prod
    const req = await fetch("/search/", {
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
    setPrompt();
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

  return !ocr_data ? (
    <></>
  ) : (
    <Card sx={{ overflow: "auto" }}>
      <CardContent>
        <Stack direction="row">
          <Typography variant="h5">Assistant</Typography>
          <Button onClick={clearChats}>Clear Chat</Button>
        </Stack>
        {chats.map((chat) => {
          return (
            <>
              <Chat data={chat} />
            </>
          );
        })}
        {tempPrompt && (
          <>
            <Chat data={tempPrompt} />
          </>
        )}
        {/* {chatResponse.map((text, index) => {
          return ( */}
        <>{/* <Chat data={chatResponse} /> */}</>
        {/* );
        })} */}
        <Box sx={{ width: "100%" }}>
          <Stack direction="row">
            <TextField
              sx={{ width: "100%" }}
              id="outlined-multiline-flexible"
              onChange={onPromptChange}
              onKeyDown={onSendKeyDown}
              label="Enter prompt here: (Ctrl+Enter to send)"
              multiline
            />
            {/* <Button
              onClick={onSendClick}
              variant="contained"
            >
              Send
            </Button> */}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

export default Search;
