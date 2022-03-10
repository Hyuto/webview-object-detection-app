import React from "react";
import { Multiselect } from "multiselect-react-dropdown";
import Profiler from "./components/profiler";
import * as style from "./style/Menu.module.scss";

const modelOption = [
  { value: "yolov5s", label: "yolov5s" },
  { value: "yolov5n", label: "yolov5n" },
];

const Menu = ({ find, setFind, model, setModel, labels, camera }) => {
  const { token } = window.SERVER_DATA;
  const Handler = (type, data) => {
    return fetch(`${window.location.origin}/api/change-${type}`, {
      method: "POST",
      headers: { "Content-type": "application/json", token: token },
      body: JSON.stringify(data),
    }).then((response) => {
      if (response.ok) return response.json();
      throw response;
    });
  };

  return (
    <div className={style.Menu}>
      <div className={style.title}>Model</div>
      <Multiselect
        customCloseIcon={<></>}
        disable={camera === "open"}
        options={modelOption}
        displayValue="label"
        selectedValues={model}
        onSelect={(_, selectedItem) => {
          Handler("model", { model: selectedItem }).then((response) => {
            if (response.success) setModel([response.model]);
            else alert(response.message);
          });
        }}
        singleSelect
        style={{
          option: {
            margin: "0",
          },
        }}
      />
      <div className={style.title}>Specific Detection</div>
      <Multiselect
        options={labels}
        displayValue="label"
        showArrow={true}
        selectedValues={find}
        selectionLimit={10}
        onSelect={(selectedList) => {
          Handler("find", { find: selectedList }).then((response) => {
            if (response.success) setFind(response.find);
            else alert(response.message);
          });
        }}
        onRemove={(selectedList) => {
          Handler("find", { find: selectedList }).then((response) => {
            if (response.success) setFind(response.find);
            else alert(response.message);
          });
        }}
        style={{
          chips: {
            backgroundColor: "black",
          },
          option: {
            margin: "0",
          },
        }}
      />
      <div className={style.title}>Profiler</div>
      <Profiler />
    </div>
  );
};

export default Menu;
