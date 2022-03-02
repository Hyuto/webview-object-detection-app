import React, { useState, useEffect } from "react";
import Profile from "./components/profile";
import { FaGithub } from "react-icons/fa";
import * as style from "./style/App.module.scss";

const App = () => {
  const { token } = window.SERVER_DATA;
  const [camera, setCamera] = useState(null)

  useEffect(() => {
    fetch(`${window.location.origin}/api`, {
      method: "GET",
      headers: { "Content-type": "application/json", token: token },
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw response;
      })
      .then((response) => {
        setCamera(response.camera)
      });
  }, [camera])

  return (
    <div className={style.App}>
      <header className={style.header}>
        <div className={style.title}>
          <a
            href="https://github.com/Hyuto/webview-object-detection-app"
            className={style.home}
            target="_blank"
            rel="noopener noreferrer">
            <FaGithub size={30} />
          </a>
        </div>
      </header>
      <main className={style.main}>
        <div className={style.title}>
          <h3>Webview Object Detection with YOLOv5</h3>
          <p>
            Using webview to create an object detection application based on YOLOv5 model. <br />
            Used technology : <strong>pywebview</strong>, <strong>flask</strong>,
            <strong>opencv-python</strong>, <strong>onnxruntime</strong>, and <strong>react</strong>
          </p>
        </div>
        {camera === "open" ? <img src={`${window.location.origin}/video-stream`} /> : null}

        <button onClick={async (e) => {
          e.preventDefault();
          await fetch(`${window.location.origin}/${camera === "open" ? "close" : "open"}`, {
            method: "POST",
            headers: { "Content-type": "application/json", token: token },
          })
            .then((response) => {
              if (response.ok) return response.json();
              throw response;
            })
            .then((response) => {
              if (response.success)
                setCamera(camera === "open" ? "close" : "open")
              else
                console.log(response.message)
            });
        }}>{camera === "open" ? "close" : "open"} camera</button>

        {/* 
          To Do: Make slidable menu using "react-flexible-sliding-menu"
          <Profile /> 
        */}
      </main>
      <footer className={style.footer}>
        <strong>© wahyu setianto {new Date().getFullYear()}</strong>, built with
        {" \u2764"}
      </footer>
    </div>
  );
};

export default App;
