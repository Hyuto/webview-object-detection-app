import React from "react";

const LocalImageButton = ({ camera, setImage, inputImage }) => {
  const { token } = window.SERVER_DATA;

  return (
    <>
      <input
        type="file"
        ref={inputImage}
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          // Set Loading
          setImage("loading");

          // Get image as binary string
          let file = e.target.files[0];
          const reader = new FileReader();
          reader.readAsBinaryString(file);
          reader.onload = async (e) => {
            // Send image to server
            await fetch(`${window.location.origin}/api/open-image`, {
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
                  setImage("open");
                } else {
                  alert(response.message);
                  setImage("close"); // close loading when fail
                }
              });
          };
        }}
      />
      <button
        onClick={() => {
          if (camera !== "open") inputImage.current.click();
          else alert("Please close camera first!");
        }}
      >
        Open local image
      </button>
    </>
  );
};

export default LocalImageButton;
