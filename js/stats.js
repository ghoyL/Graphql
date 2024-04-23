// --Username--
export function username(data) {
  let header = document.querySelector(".header");
  let usernameP = document.createElement("p");
  usernameP.textContent = data.data.user[0].login;
  usernameP.classList.add('username')
  header.appendChild(usernameP);
}

// --Audit ratio aaaa--
export function audit(data) {
  let dataCommand = data.data.user[0];
  let auditDiv = document.querySelector(".auditRatio");
  let totalDiv = document.querySelector(".total");
  let downDiv = document.querySelector(".down");
  let totalUp = makeP(convertToFormattedSize(roundUp(dataCommand.totalUp)), "totalUp", "Done↑");
  let totalDown = makeP(convertToFormattedSize(roundUp(dataCommand.totalDown)), "totalDown","Received↓");
  let auditRatio = makeP(decimal(dataCommand.auditRatio), "auditRatioNum");
  totalDiv.appendChild(totalUp);
  downDiv.appendChild(totalDown);
  auditDiv.appendChild(auditRatio);

  // graph bar
  const totalValue = dataCommand.totalUp;
  const downValue = dataCommand.totalDown;
  const maxValue = Math.max(totalValue, downValue);

  //convert to %
  const doneWidth = (totalValue / maxValue) * 100;
  const receivedWidth = (downValue / maxValue) * 100;

  document.querySelector(".totalBar").setAttribute("width", `${doneWidth}%`); 
  document.querySelector(".downBar").setAttribute("width", `${receivedWidth}%`);
}

function roundUp(number) {
  return Math.round(number / 1000) * 1000;
}

function decimal(number) {
  return parseFloat(number.toFixed(1));
}

function makeP(txtContent, userClass, str) {
  let p = document.createElement("p");
  if (str) {
    p.textContent = str + txtContent;
  } else {
    p.textContent = txtContent;
  }
  p.setAttribute("class", userClass);
  return p;
}

let xpCounter = 0;
// --User completed projects and XP--
export function completedProjects(data) {
  let projectDiv = document.querySelector(".Projects");
  let xpDiv = document.querySelector(".Xp");
  for (let i = 0; i < 4; i++) {
    let xp = data.data.transaction[i].amount;
    xp = convertToFormattedSize(xp);
    let project = makeP("Project — " + data.data.transaction[i].object.name + " " + xp, "tere");
    projectDiv.appendChild(project);
  }

  for (let i = 0; i < data.data.transaction.length; i++) {
    xpCounter += data.data.transaction[i].amount;
  }
  let xpCounterNode = document.createTextNode(
    convertToFormattedSize(xpCounter)
  );
  xpDiv.appendChild(xpCounterNode);
}

// 10 highest xp projects (finished by user)
// --XP earned by project graph--
export function xpEarned(data) {
  let y = 0;
  let svg = document.querySelector(".svg");
  let g = document.querySelector(".bars");
  let maxXpText = document.querySelector(".maxXpText");
  let maxXp = convertToFormattedSize(data.data.transaction[0].amount);
  maxXpText.innerHTML = maxXp;
  let highestWidth = data.data.transaction[0].amount;

  data.data.transaction.forEach((project) => {
    // calcualting bar width
    let projectWidth = project.amount;
    const barWidth = (projectWidth / highestWidth) * 400;
    y += 38; // project name height and bar
    
    // text
    let text = makeSvg('text', '4', y, 'black', project.object.name)
    svg.appendChild(text);

    //bar
    let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", "230");
    rect.setAttribute("y", y - 9);
    rect.setAttribute("width", barWidth);
    rect.setAttribute("height", "12");
    rect.setAttribute("fill", "blue");
    g.appendChild(rect);

    let textInBar = makeSvg('text', barWidth + 236, y+1, 'black', convertToFormattedSize(project.amount))
    svg.appendChild(textInBar);

  });
}

// --Xp progress--
export function XpProgressGraph(data) {
  const XpProgressText = document.querySelector(".XpProgressNumber");
  XpProgressText.textContent = convertToFormattedSize(xpCounter);
  const svg = document.querySelector('.svgProgress');
  const xpLine = svg.querySelector(".xpLine");
  const xpPointsGroup = svg.querySelector(".xpPointsGroup");
  let totalXp = 0;
  let maxXp = 0;

  data.data.transaction.forEach(transaction => {
    totalXp += transaction.amount;
    maxXp = Math.max(maxXp, totalXp);
  });

  // reset totalXp to 0 for the running total
  totalXp = 0;

  const minDate = new Date(data.data.transaction[0].createdAt);
  const maxDate = new Date(data.data.transaction[data.data.transaction.length - 1].createdAt);

  // calculate the total duration of the transactions in milliseconds
  const totalDuration = maxDate - minDate;

  // generate points string based on XP data
  const points = data.data.transaction.map((transaction, index) => {

    totalXp += transaction.amount;

    //  x-coordinate based on date
    const date = new Date(transaction.createdAt);
    const duration = date - minDate;
    const x = 22 + ((duration / totalDuration) * 500);

    // y-coordinate based in total xp
    const y = 422 - ((400 * totalXp) / maxXp);

    // add a circle point at each data point
    const point = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    point.setAttribute("cx", x);
    point.setAttribute("cy", y);
    point.setAttribute("r", 3); 
    point.setAttribute("fill", "black"); 

    // hover text
    const pointText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    pointText.setAttribute("x", 240)
    pointText.setAttribute("y", 110)
    pointText.textContent = convertToFormattedSize(transaction.amount)
    
    // hover date
    let correctDate =  new Date(transaction.createdAt).toString().slice(4, 15)
    let tspan = makeSvg('tspan', 215, 140, "black", correctDate)
    pointText.appendChild(tspan)
    pointText.classList.add("pointText")

    xpPointsGroup.appendChild(point); 
    xpPointsGroup.appendChild(pointText); 

    return `${x},${y}`;
  }).join(' ');

  const circles = document.querySelectorAll('.xpPointsGroup circle');

circles.forEach(circle => {
  circle.addEventListener('mouseenter', () => {
    circle.nextElementSibling.style.display = 'block';
  });

  circle.addEventListener('mouseleave', () => {
    circle.nextElementSibling.style.display = 'none';
  });
});

  xpLine.setAttribute('points', points); 
}

// mb and kb converter
function convertToFormattedSize(size) {
  if (size >= 1000000) {
    var sizeInMB = size / 1000000; // convert to MB

    var formattedSize = sizeInMB.toFixed(2);
    return formattedSize + " MB";
  } else {
    // if the size is less than 100000 kB, keep it in kB
    var formattedSize = (size / 1000).toFixed(0);
    return formattedSize + " KB";
  }
}


function makeSvg(type, x , y, color, text){
  let svg = document.createElementNS("http://www.w3.org/2000/svg", type)
  svg.setAttribute("x",x)
  svg.setAttribute("y",y)
  svg.setAttribute("fill",color)
  svg.textContent = text
  return svg
}