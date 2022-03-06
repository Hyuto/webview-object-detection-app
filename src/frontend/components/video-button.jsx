import React from "react";

const VideoButton = ({ camera, setCamera, imgHandler }) => {
  const { token } = window.SERVER_DATA;

  return (
    <>
      <button
        onClick={async () => {
          await fetch(
            `${window.location.origin}/api/${camera === "open" ? "close" : "open"}-video-stream`,
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
                  imgHandler.current.src = `${window.location.origin}/api/video-stream`;
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
        {camera === "open" ? "Close" : "Open"} Webcam
      </button>
    </>
  );
};

export default VideoButton;
