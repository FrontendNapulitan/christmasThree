const width = document.getElementById("larghezza");
const height = document.getElementById("altezza");
const audio = document.getElementById("sound");
const share = document.getElementById("share");
const paragrafoCustom = document.getElementById("customParagraph");
const paragrafoCustomPlaceholder = document.getElementById("customParagraphPlaceholder");
paragrafoCustomPlaceholder.style.top = (paragrafoCustom.clientHeight+10)+'px';
window.addEventListener('resize', function(event) {
  paragrafoCustomPlaceholder.style.top = (paragrafoCustom.clientHeight+10)+'px';
}, true);
paragrafoCustom.addEventListener('input', (event) => {
  if(event.target.innerHTML.length > 0){
    share.classList.remove('disabled');
    paragrafoCustomPlaceholder.style.display = 'none';
  }else{
    share.classList.add('disabled');
    paragrafoCustomPlaceholder.style.display = 'block';
  }
})
const root = document.documentElement;
const ballColors = [
  "yellow",
  "red",
  "purple",
  "lightblue",
  "blue",
  "white",
  "#e480cb",
];
share.addEventListener("click", () => {
  takeshot();
});
const christmasContainer = document.getElementById("christmasTree");
width.addEventListener("input", (event) => {
  updateChristmasTree(event.target.value, height.value);
});
height.addEventListener("input", (event) => {
  updateChristmasTree(width.value, event.target.value);
});

const updateChristmasTree = (width = width.value, height = height.value) => {
  christmasContainer.style.animation = "none";
  christmasContainer.style.gridTemplateColumns =
    "repeat(" + parseInt(width) + ", minmax(20px, 1fr))";
  christmasContainer.style.gridTemplateRows =
    "repeat(" + parseInt(height) + ", minmax(20px, 1fr))";
  christmasContainer.innerHTML = "";
  let arr = new Array(parseInt(height, 10)).fill("");
  let palle = new Array(arr.length / 2);
  for (let i = 1; i <= arr.length; i++) {
    let div = document.createElement("div");
    let shadow = document.createElement("div");
    shadow.id = "shadow";
    div.classList.add("christmasBlock");
    let index = i > 0 ? i : 1;
    div.style.visibility = "hidden";
    div.style.gridArea =
      "" +
      index +
      " / " +
      (!isChunk(index, width)
        ? Math.round(parseInt(width) / 2) - (index - 1)
        : Math.round(parseInt(width) / 2)) +
      " / " +
      index +
      " / " +
      (!isChunk(index, width)
        ? Math.round(parseInt(width) / 2) + index
        : Math.round(parseInt(width) / 2) + 1);
    if (isChunk(index, width)) {
      div.style.background = "#5f1010";
    }
    christmasContainer.appendChild(div);
    christmasContainer.appendChild(shadow);
    for (let o = 0; o < palle.length; o++) {
      let palla = document.createElement("div");
      palla.classList.add("christmasBall");
      let randomColor =
        ballColors[randomNumberBetweenRange(0, ballColors.length - 1)];
      palla.style.background = randomColor;
      palla.style.boxShadow = "0px 0px 30px 5px " + randomColor;
      palla.style.top =
        "" + randomNumberBetweenRange(0, div.clientHeight) + "px";
      palla.style.left =
        "" + randomNumberBetweenRange(0, div.clientWidth) + "px";
      if (i == arr.length) {
        div.style.zIndex = "10";
      }
      if (!isChunk(index, width)) {
        div.appendChild(palla);
      }
    }
    div.style.visibility = "visible";
  }
  setTimeout(() => {
    christmasContainer.style.animation = "steady .2s linear forwards";
    audio.pause();
    audio.currentTime = 0;
    audio.play();
  }, 10);
};
const randomNumberBetweenRange = (min, max) => {
  return Math.floor(Math.random() * max) + min;
};
const isChunk = (index, width) => {
  return Math.round(parseInt(width) / 2) - (index - 1) <= 0;
};

setTimeout(() => {
  updateChristmasTree(width.value, height.value);
}, 100);
const takeshot = async () => {
  
  const canvas = await html2canvas(document.body, {
   
    onclone: () => {
      christmasContainer.style.margin = "0px auto auto auto";
      document.getElementById('rangeContainer').style.display = 'none';
      document.getElementById('share').style.visibility = 'hidden';
      document.getElementById('foglie').style.visibility = 'hidden';
      document.getElementById('customParagraphPlaceholder').style.visibility = 'hidden';
      document.getElementById('tronco').style.visibility = 'hidden';
      document.getElementById('socialButtons').style.visibility = 'hidden';
    },
    height: (document.body.clientHeight-150),
    width: document.body.clientWidth,
    allowTaint: true,
    ignoreElements: (element) => {
      if ( element.id == 'tronco' 
      || element.id == 'foglie' 
      ) {
        return true;
      }
      return false
    },
    scale:2,
    useCORS: true,
  });
  
  const blob = await fetch(canvas.toDataURL('image/png')).then(res => res.blob());
  await shareOrDownload(blob, "immagine.png", "prova", "guardaqua");
  setTimeout(() => {
    christmasContainer.style.margin = "auto auto 20px auto";
    document.getElementById('rangeContainer').style.display = 'flex';
    document.getElementById('foglie').style.visibility = 'visible';
    document.getElementById('customParagraphPlaceholder').style.visibility = 'visible';
    document.getElementById('tronco').style.visibility = 'visible';
    document.getElementById('share').style.visibility = 'visible';
    document.getElementById('socialButtons').style.visibility = 'visible';

   }, 1000);
};

const shareOrDownload = async (blob, fileName, title, text) => {
  // Using the Web Share API.
  const webShareSupported = "canShare" in navigator;
  var ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf("safari") != -1) {
    if (ua.indexOf("chrome") > -1) {
      if (webShareSupported) {
        //siamo su chrome
        const data = {
          files: [
            new File([blob], fileName, {
              type: "image/png",
            }),
          ],
          title,
          text,
        };
        if (navigator.canShare(data)) {
          try {
            await navigator.share(data);
          } catch (err) {
            if (err.name !== "AbortError") {
              console.error(err.name, err.message);
            }
          } finally {
            return;
          }
        }
      }
    } else {
      //siamo su safari

      const a = document.createElement("a");
      a.download = fileName;
      a.style.display = "none";
      a.href = (window.URL ? URL : webkitURL).createObjectURL(blob);
      a.addEventListener("click", () => {
        setTimeout(() => {
          (window.URL ? URL : webkitURL).revokeObjectURL(a.href);
          a.remove();
        }, 1000);
      });
      document.body.append(a);
      a.click(); // Safari
    }
  }
};
