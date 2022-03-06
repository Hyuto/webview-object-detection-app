import React from "react";
import { FaGithub } from "react-icons/fa";
import { MdDoubleArrow } from "react-icons/md";
import * as style from "../style/header.module.scss";

const Header = ({ menu, setMenu }) => {
  return (
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
  );
};

export default Header;
