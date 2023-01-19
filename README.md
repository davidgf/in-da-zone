# In Da Zone

In Da Zone is a web browser extension that provides a simple pomodoro timer and website blocking capabilities, without asking for permissions to read all your data.

## Install

The extension can be installed on **Firefox** [from the Add-ons page](https://addons.mozilla.org/en-US/firefox/addon/in-da-zone/)

## Build the extension

### Prerequisites

You'll need [Node.js](https://nodejs.org/en/) and **npm**.

### Build

To build the extension, run the following commands in your shell:

```bash
npm install
npm run build
```

The extension will be packaged into a zip file under the `dist/` folder.

## Develop

To develop the extension, run the following commands in your shell:

```bash
npm install
npm run dev
```

This will build the extension, load it into the web browser and watch for changes. It's been tested on **Firefox**.