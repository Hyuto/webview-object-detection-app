import React from "react";
import { FaWindowClose } from "react-icons/fa";
import * as style from "../style/image.module.scss";

const DynamicImage = ({ image, setImage, imgHandler, inputImage }) => {
  const { token } = window.SERVER_DATA;

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
  );
};

export default DynamicImage;
