
function Splash({
                  text = 'Loading ...'
                }) {
	const logo = "data:image/png;base64,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"
	return `
<!DOCTYPE html>
<meta charset="utf-8">
<html>
<head>
  <style>
    body,
    html {
      margin: 0;
      overflow: hidden;
    }
    #box {
      position: absolute;
      user-select: none;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      margin: auto;
    }
    #logo {
      height: 50px;
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      top: 25px;
      left: 25px;
    }
    #logo img {
      width: 50px;
      -webkit-filter: grayscale(100%) brightness(5);
      filter: grayscale(100%) brightness(5);
    }
    #logo h6 {
      color: white;
      font-size: 16px;
      font-weight: 200;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
      letter-spacing: 0px;
      margin-left: 5px;
    }
    #box h1 {
      color: white;
      display: inline-block;
      font-size: 65px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-120%);
    }
    #box .text {
      color: white;
      font-weight: 400;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    }
    #box h4 {
      font-size: 12px;
      font-weight: 400;
      opacity: 50%;
    }
    #starting-txt {
      position: absolute;
      left: 25px;
      bottom: 13px;
    }
    #author-txt {
      position: absolute;
      right: 25px;
      bottom: 13px;
    }
    #author-txt a {
      color: inherit;
      text-decoration: none;
    }
    .text img {
      width: 15px;
    }
    .dot {
      width: 4px;
      height: 4px;
      top: 50%;
      left: -20%;
      transform: translateY(40px);
      position: absolute;
      margin: auto;
      border-radius: 5px;
      background: white;
    }
    #dot1 {
      animation: dotslide 2.8s infinite cubic-bezier(0.2, .8, .8, 0.2);
    }
    #dot2 {
      animation: dotslide 2.8s .2s infinite cubic-bezier(0.2, .8, .8, 0.2);
    }
    #dot3 {
      animation: dotslide 2.8s .4s infinite cubic-bezier(0.2, .8, .8, 0.2);
    }
    #dot4 {
      animation: dotslide 2.8s .6s infinite cubic-bezier(0.2, .8, .8, 0.2);
    }
    #dot5 {
      animation: dotslide 2.8s .8s infinite cubic-bezier(0.2, .8, .8, 0.2);
    }
    @keyframes dotslide {
      0% {
        left: -20%;
      }
      100% {
        left: 120%;
      }
    }

    .main-title {
      line-height: 160px;
      text-align: center;
    }
  </style>
</head>
<body style="background-color: #1A2036;">
  <div id="box" style="background-color:#1A2036">
    <span id="logo">
      <img id="logo-img" src="${logo}" />
    </span>
    <div class="main-title">
        <h2 id="product" class="text">J Time Tracker</h2>
    </div>
    <div class="dot" id="dot1"></div>
    <div class="dot" id="dot2"></div>
    <div class="dot" id="dot3"></div>
    <div class="dot" id="dot4"></div>
    <div class="dot" id="dot5"></div>
    <h4 class="text" id="starting-txt">${text}</h4>
    <h4 class="text" id="author-txt"></h4>
  </div>
</body>
</html>
`;
}

module.exports = Splash;
