const mach1Speed = 343 // Mach 1 (the speed of sound) in meters per second
const goalSpeed = 299792458 // speed of light in meters per second
const goalName = "lightspeed"
const powerUpgradeMult = 2

var gameData = {
  v: 0,
  vPC: 0.001,
  vPCB: 0.001,
  vPCX: 1,
  vPC$: 0.01,
  nudgePow$: 8,
  nudgePowCount: 0,
  tickspeedX: 1,

  p1: 0, p1$: 0.1, p1Pow: 0.03, p1Pow$: 1,
  p2: 0, p2$: 2, p2Pow: 0.4, p2Pow$: 2,
  p3: 0, p3$: 15, p3Pow: 1, p3Pow$: 3,
  p4: 0, p4$: 140, p4Pow: 8, p4Pow$: 4,
  p5: 0, p5$: 970, p5Pow: 25, p5Pow$: 5,
  p6: 0, p6$: 8200, p6Pow: 160, p6Pow$: 36,
  p7: 0, p7$: 74000, p7Pow: 950, p7Pow$: 140,
  p8: 0, p8$: 1000000, p8Pow: 25000, p8Pow$: 9000,
  p9: 0, p9$: 77777777, p9Pow: 1000000, p9Pow$: 77777,

  p2Unlocked: false,
  p3Unlocked: false,
  p4Unlocked: false,
  p5Unlocked: false,
  p6Unlocked: false,
  p7Unlocked: false,
  p8Unlocked: false,
  p9Unlocked: false,

  SP: 0,
  sonicBooms: 0,
  vPS: 0, // passive speed gain per second from upgrades
}

upd()

function save() {
  localStorage.setItem("INCperSecondSave", JSON.stringify(gameData))
}

setInterval(save, 10000)

const saveData = JSON.parse(localStorage.getItem("INCperSecondSave"))

function init() {
  gameData = saveData
}

function nuke() {
  localStorage.removeItem("INCperSecondSave")
  document.getElementById("nuke").innerHTML = "Save nuked. Refresh page, or save to redeem yourself."
  upd()
}

if (saveData !== null && saveData !== undefined) {
  init()
}
upd()

var nominal = {
  v: 0,
  vPC: 0.001,
  vPCB: 0.001,
  vPC$: 0.01,
  p1: 0, p2: 0, p3: 0, p4: 0, p5: 0, p6: 0, p7: 0, p8: 0, p9: 0,
  p1$: 0.1, p2$: 2, p3$: 15, p4$: 140, p5$: 970, p6$: 8200, p7$: 74000, p8$: 1000000, p9$: 77777777,
  SP: 0,
  vPS: 0,
}

function getGenerationMultiplier() {
  const s = gameData.v / goalSpeed
  if (s <= 0.3) return 1
  const minMult = 0.001
  if (s >= 1) return minMult
  const t = (s - 0.3) / 0.7
  const steepness = 4.5
  return Math.pow(1 - t, steepness) * (1 - minMult) + minMult
}

function nudgeBall() {
  const mult = getGenerationMultiplier()
  gameData.v += gameData.vPC * mult
  upd()
}

function buyNudgeBoost() {
  if (gameData.v >= gameData.vPC$) {
    gameData.v -= gameData.vPC$
    gameData.vPCB += 0.001
    gameData.vPC = gameData.vPCB * gameData.vPCX
    gameData.vPC$ = roundTo(gameData.vPC$ * (1.6 ** 1.1), 3)
    upd()
  }
}

function buyNudgePower() {
  if (gameData.nudgePowCount >= 3) return
  if (gameData.SP >= gameData.nudgePow$) {
    gameData.SP -= gameData.nudgePow$
    gameData.vPCX *= 10
    gameData.vPC = gameData.vPCB * gameData.vPCX
    gameData.nudgePow$ *= 8
    gameData.nudgePowCount += 1
    upd()
  }
}

function getNudgeName(offset = 0) {
  const names = ["Nudge", "Push", "Punch", "Kick", "Shove", "Haymaker", "Dropkick", "Flying Knee", "Football Tackle", "Falcon Punch"]
  const prefixes = ["", "Super", "Ultra", "Hyper", "Mega", "Giga", "Supreme", "Insane", "Legendary", "Ultimate"]
  const suffixes = ["", "X", "Deluxe", "Special Edition", "5: Now It's Personal", "of Death", "ft. Weird Al", "and Knuckles", "of the Gods", "Prime"]
  const tier = gameData.nudgePowCount + 1 + offset
  const index = tier - 1
  const cycle = index % names.length
  const wrap = Math.floor(index / names.length)
  const baseName = names[cycle]
  let result = baseName
  if (wrap > 0) {
    const prefix = prefixes[(wrap) % prefixes.length].trim()
    if (prefix !== "") {
      result = prefix + " " + result
    }
  }
  if (tier > 100) {
    const suffixBase = tier <= 1000 ? tier - 91 : tier - 1091
    const suffixIndex = Math.floor(suffixBase / 100) % suffixes.length
    const suffix = suffixes[suffixIndex].trim()
    if (suffix !== "") {
      result += " " + suffix
    }
  }
  if (tier >= 1001) {
    result += " " + Math.floor((tier - 1) / 1000) + "K"
  }
  return result
}

function updatePassivePower() {
  gameData.vPS =
    gameData.p1 * gameData.p1Pow +
    gameData.p2 * gameData.p2Pow +
    gameData.p3 * gameData.p3Pow +
    gameData.p4 * gameData.p4Pow +
    gameData.p5 * gameData.p5Pow +
    gameData.p6 * gameData.p6Pow +
    gameData.p7 * gameData.p7Pow +
    gameData.p8 * gameData.p8Pow +
    gameData.p9 * gameData.p9Pow
}

function getSonicBoomSP() {
  if (gameData.v < mach1Speed) return 0
  return Math.max(1, Math.floor(((gameData.v - mach1Speed) / mach1Speed)*1.8) + 1)
}

function roundTo(num, digits) {
  const factor = 10 ** digits
  return Math.round(num * factor) / factor
}

function scalePropPrice(price) {
  return roundTo(price * (1.4 ** 1.1), 3)
}

function scaleUpgradePrice(price) {
  return roundTo(price * (2 ** 1.05), 0)
}

function buyP1() {
  if (gameData.v >= gameData.p1$) {
    gameData.v -= gameData.p1$
    gameData.p1 += 1
    gameData.p2Unlocked = true
    gameData.p1$ = scalePropPrice(gameData.p1$)
    updatePassivePower()
    upd()
  }
}

function buyP2() {
  if (gameData.v >= gameData.p2$) {
    gameData.v -= gameData.p2$
    gameData.p2 += 1
    gameData.p3Unlocked = true
    gameData.p2$ = scalePropPrice(gameData.p2$)
    updatePassivePower()
    upd()
  }
}

function buyP3() {
  if (gameData.v >= gameData.p3$) {
    gameData.v -= gameData.p3$
    gameData.p3 += 1
    gameData.p4Unlocked = true
    gameData.p3$ = scalePropPrice(gameData.p3$)
    updatePassivePower()
    upd()
  }
}

function buyP4() {
  if (gameData.v >= gameData.p4$) {
    gameData.v -= gameData.p4$
    gameData.p4 += 1
    gameData.p5Unlocked = true
    gameData.p4$ = scalePropPrice(gameData.p4$)
    updatePassivePower()
    upd()
  }
}

function buyP5() {
  if (gameData.v >= gameData.p5$) {
    gameData.v -= gameData.p5$
    gameData.p5 += 1
    gameData.p6Unlocked = true
    gameData.p5$ = scalePropPrice(gameData.p5$)
    updatePassivePower()
    upd()
  }
}

function buyP6() {
  if (gameData.v >= gameData.p6$) {
    gameData.v -= gameData.p6$
    gameData.p6 += 1
    gameData.p7Unlocked = true
    gameData.p6$ = scalePropPrice(gameData.p6$)
    updatePassivePower()
    upd()
  }
}

function buyP7() {
  if (gameData.v >= gameData.p7$) {
    gameData.v -= gameData.p7$
    gameData.p7 += 1
    gameData.p8Unlocked = true
    gameData.p7$ = scalePropPrice(gameData.p7$)
    updatePassivePower()
    upd()
  }
}

function buyP8() {
  if (gameData.v >= gameData.p8$) {
    gameData.v -= gameData.p8$
    gameData.p8 += 1
    gameData.p9Unlocked = true
    gameData.p8$ = scalePropPrice(gameData.p8$)
    updatePassivePower()
    upd()
  }
}

function buyP9() {
  if (gameData.v >= gameData.p9$) {
    gameData.v -= gameData.p9$
    gameData.p9 += 1
    gameData.p9$ = scalePropPrice(gameData.p9$)
    updatePassivePower()
    upd()
  }
}

function buyP1Power() {
  if (gameData.SP >= gameData.p1Pow$) {
    gameData.SP -= gameData.p1Pow$
    gameData.p1Pow *= powerUpgradeMult
    gameData.p1Pow$ = scaleUpgradePrice(gameData.p1Pow$)
    updatePassivePower()
    upd()
  }
}

function buyP2Power() {
  if (gameData.SP >= gameData.p2Pow$) {
    gameData.SP -= gameData.p2Pow$
    gameData.p2Pow *= powerUpgradeMult
    gameData.p2Pow$ = scaleUpgradePrice(gameData.p2Pow$)
    updatePassivePower()
    upd()
  }
}

function buyP3Power() {
  if (gameData.SP >= gameData.p3Pow$) {
    gameData.SP -= gameData.p3Pow$
    gameData.p3Pow *= powerUpgradeMult
    gameData.p3Pow$ = scaleUpgradePrice(gameData.p3Pow$)
    updatePassivePower()
    upd()
  }
}

function buyP4Power() {
  if (gameData.SP >= gameData.p4Pow$) {
    gameData.SP -= gameData.p4Pow$
    gameData.p4Pow *= powerUpgradeMult
    gameData.p4Pow$ = scaleUpgradePrice(gameData.p4Pow$)
    updatePassivePower()
    upd()
  }
}

function buyP5Power() {
  if (gameData.SP >= gameData.p5Pow$) {
    gameData.SP -= gameData.p5Pow$
    gameData.p5Pow *= powerUpgradeMult
    gameData.p5Pow$ = scaleUpgradePrice(gameData.p5Pow$)
    updatePassivePower()
    upd()
  }
}

function buyP6Power() {
  if (gameData.SP >= gameData.p6Pow$) {
    gameData.SP -= gameData.p6Pow$
    gameData.p6Pow *= powerUpgradeMult
    gameData.p6Pow$ = scaleUpgradePrice(gameData.p6Pow$)
    updatePassivePower()
    upd()
  }
}

function buyP7Power() {
  if (gameData.SP >= gameData.p7Pow$) {
    gameData.SP -= gameData.p7Pow$
    gameData.p7Pow *= powerUpgradeMult
    gameData.p7Pow$ = scaleUpgradePrice(gameData.p7Pow$)
    updatePassivePower()
    upd()
  }
}

function buyP8Power() {
  if (gameData.SP >= gameData.p8Pow$) {
    gameData.SP -= gameData.p8Pow$
    gameData.p8Pow *= powerUpgradeMult
    gameData.p8Pow$ = scaleUpgradePrice(gameData.p8Pow$)
    updatePassivePower()
    upd()
  }
}

function buyP9Power() {
  if (gameData.SP >= gameData.p9Pow$) {
    gameData.SP -= gameData.p9Pow$
    gameData.p9Pow *= powerUpgradeMult
    gameData.p9Pow$ = scaleUpgradePrice(gameData.p9Pow$)
    updatePassivePower()
    upd()
  }
}


function tick() {
  const mult = getGenerationMultiplier()
  gameData.v += ((gameData.vPS * mult) / 100) * gameData.tickspeedX
  upd()
}

setInterval(tick, 10)

function sonicBoom() {
  if (gameData.v >= mach1Speed) {
    gameData.SP += getSonicBoomSP()
    gameData.sonicBooms += 1
    gameData.v = nominal.v
    gameData.vPCB = nominal.vPCB
    gameData.vPC = nominal.vPCB * gameData.vPCX
    gameData.vPC$ = nominal.vPC$
    gameData.vPS = nominal.vPS

    gameData.p1 = nominal.p1
    gameData.p2 = nominal.p2
    gameData.p3 = nominal.p3
    gameData.p4 = nominal.p4
    gameData.p5 = nominal.p5
    gameData.p6 = nominal.p6
    gameData.p7 = nominal.p7
    gameData.p8 = nominal.p8
    gameData.p9 = nominal.p9
    gameData.p1$ = nominal.p1$
    gameData.p2$ = nominal.p2$
    gameData.p3$ = nominal.p3$
    gameData.p4$ = nominal.p4$
    gameData.p5$ = nominal.p5$
    gameData.p6$ = nominal.p6$
    gameData.p7$ = nominal.p7$
    gameData.p8$ = nominal.p8$
    gameData.p9$ = nominal.p9$

    updatePassivePower()
    upd()
  }
}

function setVisible(id, visible) {
  const el = document.getElementById(id)
  if (!el) return
  el.style.display = visible ? "" : "none"
}

function setButtonDisabled(id, disabled) {
  const btn = document.getElementById(id)
  if (!btn) return
  btn.disabled = disabled
}

function upd() {
    const nudgeName = getNudgeName()
    document.getElementById("perClickUpgrade").innerHTML = "Strengthen " + nudgeName + ": " + format(gameData.vPC$) + " m/s"
    document.getElementById("nudgePower").innerHTML = "Learn to " + getNudgeName(1) + " for X10 total strength: " + formatW(gameData.nudgePow$) + " SP"
    document.getElementById("nudgeLvl").innerHTML = nudgeName + " (Power: " + format(gameData.vPC) + ")"
    const mach1Progress = (gameData.v / mach1Speed) * 100
    if (mach1Progress < 100) {
        document.getElementById("toMach1").innerHTML = "You are " + format2(mach1Progress) + "% of the way to Mach 1!"
    } else {
        document.getElementById("toMach1").innerHTML = "You are " + format2((gameData.v / goalSpeed) * 100) + "% of the way to " + goalName + "!"
    }
    const machRatio = gameData.v / mach1Speed
    document.getElementById("speed").innerHTML = "Your ball is rolling at a speed of " + format(gameData.v) + " m/s" + (machRatio >= 1 ? " (Mach " + format3(machRatio) + ")" : "") + "."
    document.getElementById("boomSP").innerHTML = "Sonic Boom for +" + getSonicBoomSP() + " SP"
    document.getElementById("heldSP").innerHTML = "You have " + formatW(gameData.SP) + " SP. Use it to double the power of your propellants!"
    const genMult = getGenerationMultiplier()
    const genMultFixed = genMult.toFixed(3)
    const genEl = document.getElementById("genMult")
    if (genEl) {
      if (genMult < 1) {
        genEl.style.display = ""
        genEl.innerHTML = "Relativity (Speed past 0.3c) divides production: 1 / " + genMultFixed
      } else {
        genEl.style.display = "none"
      }
    }
    const showBoomButton = gameData.v >= mach1Speed
    const showSPInfo = gameData.sonicBooms > 0
    setVisible("boomSP", showBoomButton)
    setVisible("boomText", showBoomButton)
    setVisible("heldSP", showSPInfo)
    setButtonDisabled("perClickUpgrade", gameData.v < gameData.vPC$)
    setButtonDisabled("nudgePower", gameData.SP < gameData.nudgePow$ || gameData.nudgePowCount >= 3)
    setButtonDisabled("p1", gameData.v < gameData.p1$)
    setButtonDisabled("p2", gameData.v < gameData.p2$)
    setButtonDisabled("p3", gameData.v < gameData.p3$)
    setButtonDisabled("p4", gameData.v < gameData.p4$)
    setButtonDisabled("p5", gameData.v < gameData.p5$)
    setButtonDisabled("p6", gameData.v < gameData.p6$)
    setButtonDisabled("p7", gameData.v < gameData.p7$)
    setButtonDisabled("p1Power", gameData.SP < gameData.p1Pow$)
    setButtonDisabled("p2Power", gameData.SP < gameData.p2Pow$)
    setButtonDisabled("p3Power", gameData.SP < gameData.p3Pow$)
    setButtonDisabled("p4Power", gameData.SP < gameData.p4Pow$)
    setButtonDisabled("p5Power", gameData.SP < gameData.p5Pow$)
    setButtonDisabled("p6Power", gameData.SP < gameData.p6Pow$)
    setButtonDisabled("p7Power", gameData.SP < gameData.p7Pow$)
    setButtonDisabled("p8", gameData.v < gameData.p8$)
    setButtonDisabled("p9", gameData.v < gameData.p9$)
    setButtonDisabled("p8Power", gameData.SP < gameData.p8Pow$)
    setButtonDisabled("p9Power", gameData.SP < gameData.p9Pow$)
    document.getElementById("p1Total").innerHTML = formatW(gameData.p1) + " portable fan(s) contributing " + format(gameData.p1 * gameData.p1Pow) + " m/s per second."
    document.getElementById("p2Total").innerHTML = formatW(gameData.p2) + " RC car(s) contributing " + format(gameData.p2 * gameData.p2Pow) + " m/s per second."
    document.getElementById("p3Total").innerHTML = formatW(gameData.p3) + " angry chihuahua(s) contributing " + format(gameData.p3 * gameData.p3Pow) + " m/s per second."
    document.getElementById("p4Total").innerHTML = formatW(gameData.p4) + " pickup truck(s) contributing " + format(gameData.p4 * gameData.p4Pow) + " m/s per second."
    document.getElementById("p5Total").innerHTML = formatW(gameData.p5) + " trebuchet(s) contributing " + format(gameData.p5 * gameData.p5Pow) + " m/s per second."
    document.getElementById("p6Total").innerHTML = formatW(gameData.p6) + " jet engine(s) contributing " + format(gameData.p6 * gameData.p6Pow) + " m/s per second."
    document.getElementById("p7Total").innerHTML = formatW(gameData.p7) + " antimatter drive(s) contributing " + format(gameData.p7 * gameData.p7Pow) + " m/s per second."
    document.getElementById("p1").innerHTML = "Portable Fan: " + format(gameData.p1$) + " m/s"
    document.getElementById("p1Income").innerHTML = "(Gives +" + format(gameData.p1Pow) + " m/s per second)"
    document.getElementById("p1Power").innerHTML = "Add another fan blade: " + formatW(gameData.p1Pow$) + " SP"
    document.getElementById("p2").innerHTML = "RC Car: " + format(gameData.p2$) + " m/s"
    document.getElementById("p2Income").innerHTML = "(Gives +" + format(gameData.p2Pow) + " m/s per second)"
    document.getElementById("p2Power").innerHTML = "Apply more voltage: " + formatW(gameData.p2Pow$) + " SP"
    document.getElementById("p3").innerHTML = "Angry Chihuahua: " + format(gameData.p3$) + " m/s"
    document.getElementById("p3Income").innerHTML = "(Gives +" + format(gameData.p3Pow) + " m/s per second)"
    document.getElementById("p3Power").innerHTML = "Make chihuahuas angrier: " + formatW(gameData.p3Pow$) + " SP"
    document.getElementById("p4").innerHTML = "Pickup Truck: " + format(gameData.p4$) + " m/s"
    document.getElementById("p4Income").innerHTML = "(Gives +" + format(gameData.p4Pow) + " m/s per second)"
    document.getElementById("p4Power").innerHTML = "Decrease fuel prices: " + formatW(gameData.p4Pow$) + " SP"
    document.getElementById("p5").innerHTML = "Trebuchet: " + format(gameData.p5$) + " m/s"
    document.getElementById("p5Income").innerHTML = "(Gives +" + format(gameData.p5Pow) + " m/s per second)"
    document.getElementById("p5Power").innerHTML = "Add more counterweights: " + formatW(gameData.p5Pow$) + " SP"
    document.getElementById("p6").innerHTML = "Jet Engine: " + format(gameData.p6$) + " m/s"
    document.getElementById("p6Income").innerHTML = "(Gives +" + format(gameData.p6Pow) + " m/s per second)"
    document.getElementById("p6Power").innerHTML = "Make jet engine louder: " + formatW(gameData.p6Pow$) + " SP"
    document.getElementById("p7").innerHTML = "Antimatter Drive: " + format(gameData.p7$) + " m/s"
    document.getElementById("p7Income").innerHTML = "(Gives +" + format(gameData.p7Pow) + " m/s per second)"
    document.getElementById("p7Power").innerHTML = "Supply more positrons: " + formatW(gameData.p7Pow$) + " SP"
    document.getElementById("p8Total").innerHTML = formatW(gameData.p8) + " gravity assist(s) contributing " + format(gameData.p8 * gameData.p8Pow) + " m/s per second."
    document.getElementById("p8").innerHTML = "Gravity Assist: " + format(gameData.p8$) + " m/s"
    document.getElementById("p8Income").innerHTML = "(Gives +" + format(gameData.p8Pow) + " m/s per second)"
    document.getElementById("p8Power").innerHTML = "Redefine law of energy conservation: " + formatW(gameData.p8Pow$) + " SP"
    document.getElementById("p9Total").innerHTML = formatW(gameData.p9) + " divine wind(s) contributing " + format(gameData.p9 * gameData.p9Pow) + " m/s per second."
    document.getElementById("p9").innerHTML = "Divine Wind: " + format(gameData.p9$) + " m/s"
    document.getElementById("p9Income").innerHTML = "(Gives +" + format(gameData.p9Pow) + " m/s per second)"
    document.getElementById("p9Power").innerHTML = "Recite holy scriptures: " + formatW(gameData.p9Pow$) + " SP"

    const showSPUpgrades = gameData.sonicBooms > 0
    setVisible("nudgePower", showSPUpgrades && gameData.nudgePowCount < 3)
    setVisible("nudgePowerLabel", showSPUpgrades && gameData.nudgePowCount >= 3)
    if (gameData.nudgePowCount >= 3) {
        document.getElementById("nudgePowerLabel").innerHTML = "You do not yet know anything better than a " + getNudgeName()
    }
    setVisible("p1Power", showSPUpgrades)
    setVisible("p2Row", gameData.p2Unlocked)
    setVisible("p2", gameData.p2Unlocked)
    setVisible("p2Total", gameData.p2Unlocked)
    setVisible("p2Power", gameData.p2Unlocked && showSPUpgrades)
    setVisible("p2Text", gameData.p2Unlocked)
    setVisible("p3Row", gameData.p3Unlocked)
    setVisible("p3", gameData.p3Unlocked)
    setVisible("p3Total", gameData.p3Unlocked)
    setVisible("p3Power", gameData.p3Unlocked && showSPUpgrades)
    setVisible("p3Text", gameData.p3Unlocked)
    setVisible("p4Row", gameData.p4Unlocked)
    setVisible("p4", gameData.p4Unlocked)
    setVisible("p4Total", gameData.p4Unlocked)
    setVisible("p4Power", gameData.p4Unlocked && showSPUpgrades)
    setVisible("p4Text", gameData.p4Unlocked)
    setVisible("p5Row", gameData.p5Unlocked)
    setVisible("p5", gameData.p5Unlocked)
    setVisible("p5Total", gameData.p5Unlocked)
    setVisible("p5Power", gameData.p5Unlocked && showSPUpgrades)
    setVisible("p5Text", gameData.p5Unlocked)
    setVisible("p6Row", gameData.p6Unlocked)
    setVisible("p6", gameData.p6Unlocked)
    setVisible("p6Total", gameData.p6Unlocked)
    setVisible("p6Power", gameData.p6Unlocked && showSPUpgrades)
    setVisible("p6Text", gameData.p6Unlocked)
    setVisible("p7Row", gameData.p7Unlocked)
    setVisible("p7", gameData.p7Unlocked)
    setVisible("p7Total", gameData.p7Unlocked)
    setVisible("p7Power", gameData.p7Unlocked && showSPUpgrades)
    setVisible("p7Text", gameData.p7Unlocked)
    setVisible("p8Row", gameData.p8Unlocked)
    setVisible("p8", gameData.p8Unlocked)
    setVisible("p8Total", gameData.p8Unlocked)
    setVisible("p8Power", gameData.p8Unlocked && showSPUpgrades)
    setVisible("p8Text", gameData.p8Unlocked)
    setVisible("p9Row", gameData.p9Unlocked)
    setVisible("p9", gameData.p9Unlocked)
    setVisible("p9Total", gameData.p9Unlocked)
    setVisible("p9Power", gameData.p9Unlocked && showSPUpgrades)
    setVisible("p9Text", gameData.p9Unlocked)
}

//ugly formatting functions to make numbers look nice in the UI fdshafkj;dsafghbkjwl;as
function formatNumber(num, digits) {
  if (num === 0) return "0"
  const absNum = Math.abs(num)
  if (absNum >= 1e9) {
    return num.toExponential(digits)
  }
  return num.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}

function format(num) {
  return formatNumber(num, 3)
}

function format1(num) {
  return formatNumber(num, 1)
}

function format2(num) {
  return formatNumber(num, 6)
}

function format3(num) {
  return formatNumber(num, 2)
}

function formatW(num) {
  if (num === 0) return "0"
  const absNum = Math.abs(num)
  if (absNum >= 1e6) {
    return num.toExponential(0)
  }
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}