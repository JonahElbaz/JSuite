const path = require('path');

const Splash = require('./Splash.js');

const {app, BrowserWindow, screen, Tray} = require('electron');
const isDev = require('electron-is-dev');

let tray = null;

function createWindow() {
  let display = screen.getPrimaryDisplay();
  const {width} = display.bounds;

  // Create the browser window.
  const windowObj = {
    width: 600,
    height: 600,
    x: width - 800,
    y: 0,
    webPreferences: {
      nodeIntegration: true,
    },
    frame: false,
    resizable: false,
    movable: false,
    opacity: 0.95,
    backgroundColor: '#1A2036',
    alwaysOnTop: true,
    darkTheme: true,
    skipTaskbar: true
  }
  const win = new BrowserWindow(windowObj);

  const splashScreen = new BrowserWindow({
    ...windowObj,
    parent: win,
  });

  const url = Splash;
  const args = {};

  if (typeof url === 'function') {
    const file = 'data:text/html;charset=UTF-8,' + encodeURIComponent(url(args));
    splashScreen.loadURL(file);
  } else {
    splashScreen.loadURL(
      url + '#' + Buffer.from(JSON.stringify(args)).toString()
    );
  }
  splashScreen.show();

  tray = new Tray(path.join(__dirname, './icon-desktop.png'))
  tray.setIgnoreDoubleClickEvents(true)
  tray.on('click', function (e) {
    if (win.isVisible()) {
      win.hide()
    } else {
      win.show()
    }
  });

  // and load the index.html of the app.
  // win.loadFile("index.html");
  win.loadURL(
    isDev
      ? 'http://localhost:8889'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );
  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({mode: 'detach'});
  }

  win.once('ready-to-show', () => {
    splashScreen.destroy();
    win.show();
    app.dock.hide();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
