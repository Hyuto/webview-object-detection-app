import React from "react";
import { FaWindowClose } from "react-icons/fa";
import * as style from "../style/image.module.scss";

const DynamicImage = ({ camera, image, setImage, inputImage }) => {
  const { token } = window.SERVER_DATA;
  const urls = {
    video: `${window.location.origin}/api/video-stream`,
    image: `${window.location.origin}/api/image-stream`,
  };

  return (
    <div className={style.image}>
      {image === "open" ? (
        <FaWindowClose
          size={30}
          color="black"
          className={style.close}
          onClick={async () => {
            await fetch(`${window.location.origin}/api/close-image`, {
              method: "POST",
              headers: { "Content-type": "application/json", token: token },
            })
              .then((response) => {
                if (response.ok) return response.json();
                throw response;
              })
              .then((response) => {
                if (response.success) {
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
      {camera === "open" ? (
        <img src={urls.video} />
      ) : image === "open" ? (
        <img src={urls.image} />
      ) : null}
    </div>
  );
};

export default DynamicImage;
