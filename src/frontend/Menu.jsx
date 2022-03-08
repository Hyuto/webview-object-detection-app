import React from "react";
import Profiler from "./components/profiler";
import * as style from "./style/Menu.module.scss";

const Menu = ({ modelName, find, setFind, labels, setModel, camera }) => {
  const { token } = window.SERVER_DATA;

  return (
    <div className={style.Menu}>
      <p>
        Model :{" "}
        <select
          name="models"
          value={modelName}
          disabled={camera === "open"}
          onChange={async (e) => {
            await fetch(`${window.location.origin}/api/change-model`, {
              method: "POST",
              headers: { "Content-type": "application/json", token: token },
              body: JSON.stringify({ model: e.target.value }),
            })
              .then((response) => {
                if (response.ok) return response.json();
                throw response;
              })
              .then((response) => {
                if (response.success) setModel(response.model);
                else alert(response.message);
              });
          }}
        >
          <option value="yolov5s">yolov5s</option>
          <option value="yolov5n">yolov5n - lighter</option>
        </select>
      </p>
      <p>
        Find :{" "}
        <select
          name="labels"
          value={find}
          disabled={camera === "open"}
          onChange={async (e) => {
            await fetch(`${window.location.origin}/api/change-find`, {
              method: "POST",
              headers: { "Content-type": "application/json", token: token },
              body: JSON.stringify({ find: e.target.value }),
            })
              .then((response) => {
                if (response.ok) return response.json();
                throw response;
              })
              .then((response) => {
                if (response.success) setFind(response.find);
                else alert(response.message);
              });
          }}
        >
          {labels.map((element, index) => {
            return (
              <option key={index} value={element}>
                {element}
              </option>
            );
          })}
        </select>
      </p>
      <Profiler />
    </div>
  );
};

export default Menu;
