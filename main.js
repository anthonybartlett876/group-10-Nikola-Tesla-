// node --watch main.js
import express from "express";
import cors from "cors";
import fs from "fs";
import React from "react";
import { renderToString } from "react-dom/server";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("."));
// Serve files in the repo folder so /background.png loads in the browser
app.use(express.static("."));


// sets background image 
function TextBoxPage() {
  return React.createElement(
    "div",
    {
      style: {
        backgroundImage: "url('/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "left bottom",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        margin: 0,
        padding: "20px",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center"
      }
    },
    React.createElement(
      "div",
      {
        style: {
          width: "50%",
          maxWidth: "780px",
          minWidth: "240px",
          height: "66vh",
          minHeight: "420px",
          padding: "20px",
          backgroundColor: "rgba(10, 28, 58, 0.65)",
          border: "2px solid #29b6f6",
          borderRadius: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }
      },
      React.createElement("div", {
        id: "chat-history",
        style: {
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          paddingRight: "6px"
        }
      }),
      React.createElement(
        "form",
        {
          id: "chat-form",
          style: {
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }
        },
        React.createElement("input", {
          id: "user-input",
          type: "text",
          placeholder: "Type your message...",
          autoComplete: "off",
          style: {
            flex: 1,
            minWidth: 0,
            height: "48px",
            padding: "0 18px",
            fontSize: "15px",
            color: "#ffffff",
            backgroundColor: "rgba(10, 28, 58, 0.65)",
            border: "2px solid #29b6f6",
            borderRadius: "20px",
            outline: "none"
          }
        }),
        React.createElement(
          "button",
          {
            type: "submit",
            "aria-label": "Send message",
            style: {
              height: "48px",
              padding: "0 16px",
              fontSize: "15px",
              cursor: "pointer",
              color: "#fafafa",
              backgroundColor: "rgba(24, 168, 197, 0.72)",
              border: "2px solid #29b6f6",
              borderRadius: "22px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }
          },
          "➤"
        )
      )
    ),
    React.createElement("script", {
      dangerouslySetInnerHTML: {
        __html: `
          const form = document.getElementById('chat-form');
          const input = document.getElementById('user-input');
          const historyBox = document.getElementById('chat-history');

          function showMessage(text) {
            const msg = document.createElement('div');
            msg.textContent = text;
            msg.style.alignSelf = 'flex-end';
            msg.style.maxWidth = '80%';
            msg.style.padding = '10px 14px';
            msg.style.borderRadius = '14px';
            msg.style.fontSize = '14px';
            msg.style.fontFamily = 'sans-serif';
            msg.style.color = '#ffffff';
            msg.style.backgroundColor = 'rgba(24, 168, 197, 0.85)';
            msg.style.wordWrap = 'break-word';

            historyBox.appendChild(msg);
            historyBox.scrollTop = historyBox.scrollHeight;
          }

          fetch('/api/history')
            .then((res) => res.json())
            .then((messages) => {
              messages.forEach((m) => showMessage(m.text));
            });

          form.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = input.value.trim();
            if (!text) return;

            showMessage(text);
            input.value = '';

            fetch('/api/history', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text })
            });
          });
        `
      }
    })
  );
}
//gets the text box
app.get("/", (req, res) => {
  res.send(renderToString(React.createElement(TextBoxPage)));
});


//creates the text box
app.get("/chat", (req, res) => {
  res.send(renderToString(React.createElement(TextBoxPage)));
});

//gets the chat history
app.get("/api/history", (req, res) => {
  const messages = JSON.parse(fs.readFileSync("./chat_history.json", "utf-8"));
  res.json(messages);
});

app.post("/api/history", (req, res) => {
  const messages = JSON.parse(fs.readFileSync("./chat_history.json", "utf-8"));
  messages.push({ text: req.body.text });
  fs.writeFileSync("./chat_history.json", JSON.stringify(messages, null, 2));
  res.status(201).json({ ok: true });
});


app.listen(3000, () => {
  console.log("Tesla Bot running at http://localhost:3000");
});
