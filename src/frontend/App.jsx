import React, { useState, useEffect, useRef } from "react";
import Menu from "./Menu";
import Header from "./components/header";
import DynamicImage from "./components/image";
import LocalImageButton from "./components/li-button";
import VideoButton from "./components/video-button";
import * as style from "./style/App.module.scss";

const App = () => {
  const { token } = window.SERVER_DATA;
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [model, setModel] = useState("");
  const [menu, setMenu] = useState("close");
  const inputImage = useRef(null);

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
        setCamera(response.camera);
        setImage(response.image);
        setModel(response.model);
      });
  }, []);

  return (
    <div className={`${style.App} ${menu === "open" ? style.GridApp : null}`}>
      <div className={style.Menu} style={{ display: menu === "open" ? "block" : "none" }}>
        <Menu modelName={model} setModel={setModel} camera={camera} />
      </div>
      <div className={style.MainWindow}>
        <Header menu={menu} setMenu={setMenu} />
        <main className={style.main}>
          <div className={style.title}>
            <h3>Webview Object Detection with YOLOv5</h3>
            <p>
              Using webview to create an object detection application based on YOLOv5 model. <br />
              Used technology : <strong>pywebview</strong>, <strong>flask</strong>,
              <strong>opencv-python</strong>, <strong>onnxruntime</strong>, and{" "}
              <strong>react</strong>
            </p>
          </div>
          <DynamicImage camera={camera} image={image} setImage={setImage} inputImage={inputImage} />
          <div className="buttons">
            <LocalImageButton camera={camera} inputImage={inputImage} setImage={setImage} />
            <VideoButton camera={camera} setCamera={setCamera} />
          </div>
        </main>
        <footer className={style.footer}>
          <strong>© wahyu setianto {new Date().getFullYear()}</strong>, built with {" \u2764"}
        </footer>
      </div>
    </div>
  );
};

export default App;
