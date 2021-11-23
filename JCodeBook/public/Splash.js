function Splash({
                  text = 'Loading ...'
                }) {
	const logo = 'data:image/png;base64,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'
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
      width: 50px;
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
        <h2 id="product" class="text">J Code Block</h2>
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
