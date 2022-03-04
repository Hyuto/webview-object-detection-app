import React, { useState, useEffect, useRef } from "react";
import { FaWindowClose, FaGithub } from "react-icons/fa";
import { MdDoubleArrow } from "react-icons/md";
import Menu from "./Menu";
import * as style from "./style/App.module.scss";

const App = () => {
  const { token } = window.SERVER_DATA;
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [model, setModel] = useState("");
  const [menu, setMenu] = useState("close");
  const imgHandler = useRef(null);
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
        if (response.camera === "open") {
          imgHandler.current.src = `${window.location.origin}/video-stream`;
          imgHandler.current.style.display = "block";
        } else if (response.image === "open") {
          imgHandler.current.src = `${window.location.origin}/image-stream`;
          imgHandler.current.style.display = "block";
        }
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
        <header className={style.header}>
          <div className={style.title}>
            <a
              href="https://github.com/Hyuto/webview-object-detection-app"
              className={style.home}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub size={30} />
            </a>
            <div
              className={style.opener}
              onClick={() => {
                setMenu(menu === "open" ? "close" : "open");
              }}
            >
              <MdDoubleArrow
                size={30}
                className={`${style.icon} ${menu === "open" ? style.close : null}`}
              />
            </div>
          </div>
        </header>
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
          <div className={style.image}>
            {image === "open" ? (
              <FaWindowClose
                size={30}
                color="black"
                className={style.close}
                onClick={async () => {
                  await fetch(`${window.location.origin}/close-image`, {
                    method: "POST",
                    headers: { "Content-type": "application/json", token: token },
                  })
                    .then((response) => {
                      if (response.ok) return response.json();
                      throw response;
                    })
                    .then((response) => {
                      if (response.success) {
                        imgHandler.current.src = null;
                        imgHandler.current.style.display = "none";
                        inputImage.current.value = "";
                        setImage("close");
                      } else alert(response.message);
                    });
                }}
              />
            ) : null}
            <div
              className={style.LdsDualRing}
              style={{ display: image === "loading" ? "inline-block" : "none" }}
            ></div>
            <img ref={imgHandler} style={{ display: "none" }} />
          </div>
          <input
            type="file"
            ref={inputImage}
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              // Set Loading
              imgHandler.current.style.display = "none";
              setImage("loading");

              // Get image as binary string
              let file = e.target.files[0];
              const reader = new FileReader();
              reader.readAsBinaryString(file);
              reader.onload = async (e) => {
                // Send image to server
                await fetch(`${window.location.origin}/open-image`, {
                  method: "POST",
                  headers: { "Content-type": "application/json", token: token },
                  body: JSON.stringify({ image: btoa(e.target.result) }),
                })
                  .then((response) => {
                    if (response.ok) return response.json();
                    throw response;
                  })
                  .then((response) => {
                    if (response.success) {
                      // Display image
                      imgHandler.current.src = `${window.location.origin}/image-stream`;
                      imgHandler.current.style.display = "block";
                      setImage("open");
                    } else {
                      alert(response.message);
                      setImage("close"); // close loading when fail
                    }
                  });
              };
            }}
          />
          <div className="buttons">
            <button
              onClick={() => {
                if (camera !== "open") inputImage.current.click();
                else alert("Please close camera first!");
              }}
            >
              Open local image
            </button>

            <button
              onClick={async () => {
                await fetch(
                  `${window.location.origin}/${camera === "open" ? "close" : "open"}-video-stream`,
                  {
                    method: "POST",
                    headers: { "Content-type": "application/json", token: token },
                  }
                )
                  .then((response) => {
                    if (response.ok) return response.json();
                    throw response;
                  })
                  .then((response) => {
                    if (response.success) {
                      const action = camera === "open" ? "close" : "open";
                      if (action === "open") {
                        imgHandler.current.src = `${window.location.origin}/video-stream`;
                        imgHandler.current.style.display = "block";
                      } else {
                        imgHandler.current.src = null;
                        imgHandler.current.style.display = "none";
                      }
                      setCamera(action);
                    } else alert(response.message);
                  });
              }}
            >
              {camera === "open" ? "Close" : "Open"} camera
            </button>
          </div>
        </main>
        <footer className={style.footer}>
          <strong>© wahyu setianto {new Date().getFullYear()}</strong>, built with
          {" \u2764"}
        </footer>
      </div>
    </div>
  );
};

export default App;
