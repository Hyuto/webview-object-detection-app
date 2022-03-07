import React from "react";

const VideoButton = ({ camera, setCamera }) => {
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
