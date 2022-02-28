import React, { useState, useEffect } from "react";
import "./App.scss";

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
    <div className="App">
      {camera === "open" ? <img src={`${window.location.origin}/video-stream`} /> : null}

      <button onClick={async () => {
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
    </div>
  );
};

export default App;
