import React from "react";
import * as style from "../style/loading.module.scss";

const Loading = ({ isLoading }) => {
  return (
    <div
      className={style.LdsDualRing}
      style={{ display: isLoading ? "inline-block" : "none" }}
    ></div>
  );
};

export default Loading;
