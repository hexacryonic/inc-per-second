var saveGameLoop = window.setInterval(function() {
  localStorage.setItem("INCperSecondSave", JSON.stringify(gameData))
}, 15000)

var savegame = JSON.parse(localStorage.getItem("INCperSecondSave"))
if (savegame !== null) {
  gameData = savegame
}

var gameData = {
  v: 0,
  vPC: 0.001,
  vPCB: 0.001,
  vPCX: 1,
  vPC$: 0.01,
  nudgePow$: 8,
  p1: 0,
  p2: 0,
  p3: 0,
  p4: 0,
  p5: 0,
  p1$: 0.1,
  p2$: 2,
  p3$: 15,
  p4$: 140,
  p5$: 970,
  p1Pow: 0.03,
  p2Pow: 0.4,
  p3Pow: 1,
  p4Pow: 8,
  p5Pow: 25,
  p1Pow$: 1,
  p2Pow$: 2,
  p3Pow$: 4,
  p4Pow$: 16,
  p5Pow$: 64,
  p6: 0,
  p7: 0,
  p6$: 8200,
  p7$: 100000,
  p6Pow: 160,
  p7Pow: 3100,
  p6Pow$: 256,
  p7Pow$: 1024,
  SP: 0,
  sonicBooms: 0,
  vPS: 0, // passive speed gain per second from upgrades
}

var nominal = {
  v: 0,
  vPC: 0.001,
  vPCB: 0.001,
  vPC$: 0.01,
  p1: 0,
  p2: 0,
  p3: 0,
  p4: 0,
  p5: 0,
  p6: 0,
  p7: 0,
  p1$: 0.1,
  p2$: 2,
  p3$: 15,
  p4$: 120,
  p5$: 970,
  p6$: 8200,
  p7$: 100000,
  SP: 0,
  vPS: 0,
}

const mach1Speed = 343 // Mach 1 (the speed of sound) in meters per second
const goalSpeed = 299792458 // speed of light in meters per second
const goalName = "lightspeed"
const powerUpgradeMult = 2

upd() // initial UI update

function nudgeBall() {
  gameData.v += gameData.vPC
  upd()
}

function buyNudgeBoost() {
  if (gameData.v >= gameData.vPC$) {
    gameData.v -= gameData.vPC$
    gameData.vPCB += 0.001
    gameData.vPC = gameData.vPCB * gameData.vPCX
    gameData.vPC$ *= 2
    upd()
  }
}

function buyNudgePower() {
  if (gameData.SP >= gameData.nudgePow$) {
    gameData.SP -= gameData.nudgePow$
    gameData.vPCX *= 10
    gameData.vPC = gameData.vPCB * gameData.vPCX
    gameData.nudgePow$ *= 3
    upd()
  }
}

function updatePassivePower() {
  gameData.vPS =
    gameData.p1 * gameData.p1Pow +
    gameData.p2 * gameData.p2Pow +
    gameData.p3 * gameData.p3Pow +
    gameData.p4 * gameData.p4Pow +
    gameData.p5 * gameData.p5Pow +
    gameData.p6 * gameData.p6Pow +
    gameData.p7 * gameData.p7Pow
}

function getSonicBoomSP() {
  if (gameData.v < mach1Speed) return 0
  return Math.max(1, Math.floor(((gameData.v - mach1Speed) / mach1Speed)*1.8) + 1)
}

function buyP1() {
  if (gameData.v >= gameData.p1$) {
    gameData.v -= gameData.p1$
    gameData.p1 += 1
    gameData.p1$ *= 2
    updatePassivePower()
    upd()
  }
}

function buyP2() {
  if (gameData.v >= gameData.p2$) {
    gameData.v -= gameData.p2$
    gameData.p2 += 1
    gameData.p2$ *= 2
    updatePassivePower()
    upd()
  }
}

function buyP3() {
  if (gameData.v >= gameData.p3$) {
    gameData.v -= gameData.p3$
    gameData.p3 += 1
    gameData.p3$ *= 2
    updatePassivePower()
    upd()
  }
}

function buyP4() {
  if (gameData.v >= gameData.p4$) {
    gameData.v -= gameData.p4$
    gameData.p4 += 1
    gameData.p4$ *= 2
    updatePassivePower()
    upd()
  }
}

function buyP5() {
  if (gameData.v >= gameData.p5$) {
    gameData.v -= gameData.p5$
    gameData.p5 += 1
    gameData.p5$ *= 2
    updatePassivePower()
    upd()
  }
}

function buyP6() {
  if (gameData.v >= gameData.p6$) {
    gameData.v -= gameData.p6$
    gameData.p6 += 1
    gameData.p6$ *= 2
    updatePassivePower()
    upd()
  }
}

function buyP7() {
  if (gameData.v >= gameData.p7$) {
    gameData.v -= gameData.p7$
    gameData.p7 += 1
    gameData.p7$ *= 2
    updatePassivePower()
    upd()
  }
}

function buyP1Power() {
  if (gameData.SP >= gameData.p1Pow$) {
    gameData.SP -= gameData.p1Pow$
    gameData.p1Pow *= powerUpgradeMult
    gameData.p1Pow$ *= 2
    updatePassivePower()
    upd()
  }
}

function buyP2Power() {
  if (gameData.SP >= gameData.p2Pow$) {
    gameData.SP -= gameData.p2Pow$
    gameData.p2Pow *= powerUpgradeMult
    gameData.p2Pow$ *= 2
    updatePassivePower()
    upd()
  }
}

function buyP3Power() {
  if (gameData.SP >= gameData.p3Pow$) {
    gameData.SP -= gameData.p3Pow$
    gameData.p3Pow *= powerUpgradeMult
    gameData.p3Pow$ *= 2
    updatePassivePower()
    upd()
  }
}

function buyP4Power() {
  if (gameData.SP >= gameData.p4Pow$) {
    gameData.SP -= gameData.p4Pow$
    gameData.p4Pow *= powerUpgradeMult
    gameData.p4Pow$ *= 2
    updatePassivePower()
    upd()
  }
}

function buyP5Power() {
  if (gameData.SP >= gameData.p5Pow$) {
    gameData.SP -= gameData.p5Pow$
    gameData.p5Pow *= powerUpgradeMult
    gameData.p5Pow$ *= 2
    updatePassivePower()
    upd()
  }
}

function buyP6Power() {
  if (gameData.SP >= gameData.p6Pow$) {
    gameData.SP -= gameData.p6Pow$
    gameData.p6Pow *= powerUpgradeMult
    gameData.p6Pow$ *= 2
    updatePassivePower()
    upd()
  }
}

function buyP7Power() {
  if (gameData.SP >= gameData.p7Pow$) {
    gameData.SP -= gameData.p7Pow$
    gameData.p7Pow *= powerUpgradeMult
    gameData.p7Pow$ *= 2
    updatePassivePower()
    upd()
  }
}


function tick() {
  gameData.v += gameData.vPS
  upd()
}

setInterval(tick, 1000)

function sonicBoom() {
  if (gameData.v >= mach1Speed) {
    gameData.SP += getSonicBoomSP()
    gameData.sonicBooms += 1
    gameData.v = nominal.v
    gameData.vPC = nominal.vPC
    gameData.vPCB = nominal.vPCB
    gameData.vPC$ = nominal.vPC$
    gameData.vPS = nominal.vPS

    gameData.p1 = nominal.p1
    gameData.p2 = nominal.p2
    gameData.p3 = nominal.p3
    gameData.p4 = nominal.p4
    gameData.p5 = nominal.p5
    gameData.p6 = nominal.p6
    gameData.p7 = nominal.p7
    gameData.p1$ = nominal.p1$
    gameData.p2$ = nominal.p2$
    gameData.p3$ = nominal.p3$
    gameData.p4$ = nominal.p4$
    gameData.p5$ = nominal.p5$
    gameData.p6$ = nominal.p6$
    gameData.p7$ = nominal.p7$

    updatePassivePower()
    upd()
  }
}

function setVisible(id, visible) {
  const el = document.getElementById(id)
  if (!el) return
  el.style.display = visible ? "" : "none"
}

function upd() {
    document.getElementById("perClickUpgrade").innerHTML = "Strengthen Nudge: " + format3(gameData.vPC$) + " m/s"
    document.getElementById("nudgePower").innerHTML = "X10 Nudge strength: " + formatW(gameData.nudgePow$) + " SP"
    document.getElementById("nudgeLvl").innerHTML = "Nudge (Power: " + format(gameData.vPC) + ")"
    document.getElementById("toGoal").innerHTML = "You are " + format2((gameData.v / goalSpeed) * 100) + "% of the way to " + goalName + "!"
    document.getElementById("toMach1").innerHTML = "You are " + format2((gameData.v / mach1Speed) * 100) + "% of the way to Mach 1!"
    document.getElementById("speed").innerHTML = "Your ball is rolling at a speed of " + format(gameData.v) + " m/s."
    document.getElementById("boomSP").innerHTML = "Sonic Boom for +" + getSonicBoomSP() + " SP"
    document.getElementById("heldSP").innerHTML = "You have " + formatW(gameData.SP) + " SP. Use it to double the power of your propellants!"
    const showBoomButton = gameData.v >= mach1Speed
    const showSPInfo = gameData.sonicBooms > 0
    setVisible("boomSP", showBoomButton)
    setVisible("heldSP", showSPInfo)
    document.getElementById("p1Total").innerHTML = formatW(gameData.p1) + " portable fan(s) contributing " + format(gameData.p1 * gameData.p1Pow) + " m/s per second."
    document.getElementById("p2Total").innerHTML = formatW(gameData.p2) + " RC car(s) contributing " + format(gameData.p2 * gameData.p2Pow) + " m/s per second."
    document.getElementById("p3Total").innerHTML = formatW(gameData.p3) + " angry chihuahua(s) contributing " + format(gameData.p3 * gameData.p3Pow) + " m/s per second."
    document.getElementById("p4Total").innerHTML = formatW(gameData.p4) + " pickup truck(s) contributing " + format(gameData.p4 * gameData.p4Pow) + " m/s per second."
    document.getElementById("p5Total").innerHTML = formatW(gameData.p5) + " trebuchet(s) contributing " + format(gameData.p5 * gameData.p5Pow) + " m/s per second."
    document.getElementById("p6Total").innerHTML = formatW(gameData.p6) + " jet engine(s) contributing " + format(gameData.p6 * gameData.p6Pow) + " m/s per second."
    document.getElementById("p7Total").innerHTML = formatW(gameData.p7) + " antimatter drive(s) contributing " + format(gameData.p7 * gameData.p7Pow) + " m/s per second."
    document.getElementById("p1").innerHTML = "Portable Fan: " + format(gameData.p1$) + " m/s, gives " + format(gameData.p1Pow) + " m/s per second."
    document.getElementById("p1Power").innerHTML = "Add another fan blade: " + formatW(gameData.p1Pow$) + " SP"
    document.getElementById("p2").innerHTML = "RC Car: " + format(gameData.p2$) + " m/s, gives " + format(gameData.p2Pow) + " m/s per second."
    document.getElementById("p2Power").innerHTML = "Apply more voltage: " + formatW(gameData.p2Pow$) + " SP"
    document.getElementById("p3").innerHTML = "Angry Chihuahua: " + format(gameData.p3$) + " m/s, gives " + format(gameData.p3Pow) + " m/s per second."
    document.getElementById("p3Power").innerHTML = "Make chihuahuas angrier: " + formatW(gameData.p3Pow$) + " SP"
    document.getElementById("p4").innerHTML = "Pickup Truck: " + format(gameData.p4$) + " m/s, gives " + format(gameData.p4Pow) + " m/s per second."
    document.getElementById("p4Power").innerHTML = "Decrease fuel prices: " + formatW(gameData.p4Pow$) + " SP"
    document.getElementById("p5").innerHTML = "Trebuchet: " + format(gameData.p5$) + " m/s, gives " + format(gameData.p5Pow) + " m/s per second."
    document.getElementById("p5Power").innerHTML = "Add more counterweights: " + formatW(gameData.p5Pow$) + " SP"
    document.getElementById("p6").innerHTML = "Jet Engine: " + format(gameData.p6$) + " m/s, gives " + format(gameData.p6Pow) + " m/s per second."
    document.getElementById("p6Power").innerHTML = "Make jet engine louder: " + formatW(gameData.p6Pow$) + " SP"
    document.getElementById("p7").innerHTML = "Antimatter Drive: " + format(gameData.p7$) + " m/s, gives " + format(gameData.p7Pow) + " m/s per second."
    document.getElementById("p7Power").innerHTML = "Supply more positrons: " + formatW(gameData.p7Pow$) + " SP"

    const showSPUpgrades = gameData.sonicBooms > 0
    setVisible("nudgePower", showSPUpgrades)
    setVisible("p1Power", showSPUpgrades)
    setVisible("p2", gameData.p1 > 0)
    setVisible("p2Total", gameData.p1 > 0)
    setVisible("p2Power", gameData.p1 > 0 && showSPUpgrades)
    setVisible("p2Text", gameData.p1 > 0)
    setVisible("p3", gameData.p2 > 0)
    setVisible("p3Total", gameData.p2 > 0)
    setVisible("p3Power", gameData.p2 > 0 && showSPUpgrades)
    setVisible("p3Text", gameData.p2 > 0)
    setVisible("p4", gameData.p3 > 0)
    setVisible("p4Total", gameData.p3 > 0)
    setVisible("p4Power", gameData.p3 > 0 && showSPUpgrades)
    setVisible("p4Text", gameData.p3 > 0)
    setVisible("p5", gameData.p4 > 0)
    setVisible("p5Total", gameData.p4 > 0)
    setVisible("p5Power", gameData.p4 > 0 && showSPUpgrades)
    setVisible("p5Text", gameData.p4 > 0)
    setVisible("p6", gameData.p5 > 0)
    setVisible("p6Total", gameData.p5 > 0)
    setVisible("p6Power", gameData.p5 > 0 && showSPUpgrades)
    setVisible("p6Text", gameData.p5 > 0)
    setVisible("p7", gameData.p6 > 0)
    setVisible("p7Total", gameData.p6 > 0)
    setVisible("p7Power", gameData.p6 > 0 && showSPUpgrades)
    setVisible("p7Text", gameData.p6 > 0)
}

//ugly formatting functions to make numbers look nice in the UI fdshafkj;dsafghbkjwl;as
function format(num) {
  if (num >= 1000) return num.toLocaleString("en-US") // (adds commas)
  else return num.toFixed(3)
}

function format1(num) {
  if (num >= 1000) return num.toLocaleString("en-US") // (adds commas)
  else return num.toFixed(1)
}

function format2(num) {
  if (num >= 1000) return num.toLocaleString("en-US") // (adds commas)
  else return num.toFixed(6)
}

function format3(num) {
  if (num >= 1000) return num.toLocaleString("en-US") // (adds commas)
  else return num.toFixed(2)
}

function formatW(num) {
  if (num >= 1000) return num.toLocaleString("en-US") // (adds commas)
  else return num.toFixed(0)
}