# Webview Object Detection Application

![](https://img.shields.io/badge/Made%20with-🧡-white?style=plastic)
![python](https://img.shields.io/badge/python->%203.8-blue?style=plastic&logo=python)
![pywebview](https://img.shields.io/badge/pywebview-3.5-green?style=plastic)
![opencv](https://img.shields.io/badge/OpenCV-4.5.5-purple?style=plastic&logo=opencv)
![React](https://img.shields.io/badge/React-20232A?style=plastic&logo=react&logoColor=61DAFB)
![Flask](https://img.shields.io/badge/Flask-white?style=plastic&logo=Flask&logoColor=black)

Webview object detection application.

**Supported Platforms**

| Platforms              |       Tested       |       Web Engine       |
| :--------------------- | :----------------: | :--------------------: |
| Windows                | :white_check_mark: | Webview2 Edge Chromium |
| Linux [`Debian` based] | :white_check_mark: |           Qt           |

## Setup

Clone this repo and run this commands on your terminal

```bash
yarn run init
```

that will install all dependencies to run the app.

**Note** : Please refer to [installation guide](https://pywebview.flowrl.com/guide/installation.html#dependencies) and make sure all dependencies are set to run `pywebview` application.

## Start the Application

On your terminal run this command

```bash
yarn start
```

**Note** : This template only support hot reload to apply changes in your `frontend` code you need but any changes on `app/backend` code you need to close and run the app again.

## Build the Application

Build the application using this command

```bash
yarn build
```

This will build the application to production on `publish` directory.

**Note** : Please make sure to set

```python
DEBUG = FALSE
```

in `main.py` before deploying the app for production.

## Install Additional Python Dependencies

Run this command install additional python dependencies.

```bash
yarn install-dep <dependency_1> <dependency_2>
```

That command will call `pip` inside `pywebview venv` to install python .
