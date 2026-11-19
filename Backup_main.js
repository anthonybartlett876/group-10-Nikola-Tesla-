import express from "express";
import cors from "cors";
import React from "react";
import { renderToString } from "react-dom/server";

const app = express();

app.use(cors());

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
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        padding: "20px",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-end"
      }
    },
    React.createElement(
      "form",
      {
        style: {
            width: "600px",
            maxWidth: "100%",
            minHeight: "450px",
            backgroundColor: "rgba(16, 30, 61, 0.80)",
            border: "2px solid #00bfff",
            borderRadius: "20px",
            padding: "20px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            gap: "12px"
        }
    },
      React.createElement(
    "div",
    {
        style: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "12px",
            width: "100%"
        }
    },

    React.createElement("input", {
        type: "text",
        placeholder: "Type your message...",
        style: {
            flex: 1,
            minWidth: 0,
            padding: "15px 20px",
            borderRadius: "30px",
            border: "2px solid #4169e1",
            backgroundColor: "#101e3d",
            color: "#ffffff",
            fontSize: "16px",
            outline: "none"
        }
    }),

    React.createElement(
        "button",
        {
            type: "submit",
            "aria-label": "Send message",
            style: {
                width: "55px",
                height: "55px",
                borderRadius: "50%",
                border: "none",
                backgroundColor: "#00bfff",
                color: "#ffffff",
                fontSize: "22px",
                cursor: "pointer",
                flexShrink: 0
            }
        },
        "➤"
    )
)
    )
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



app.listen(3000, () => {
  console.log("Tesla Bot running at http://localhost:3000");
});