import { GoTo_logginDiv } from "./add_content.js"
if (localStorage.logged == "undefined") {
	GoTo_logginDiv(document.body)
}

import { footer_div } from "./add_content.js"
import { clock, today } from "./time.js"
footer_div(document.querySelector(".footer"))
function clockOn() {
	clock(document.querySelector("#txt_clock"))
	today(document.querySelector("#txt_today"))
}
clockOn()
setInterval(clockOn, 1000)

document.querySelector("#icon_back").addEventListener("click",() => {
	window.location.href = "01.html"
})

import { random_sales , calculate_hoses } from "./random_sales.js"
const append_div = document.querySelector(".div_bot")
var users = JSON.parse(localStorage.users)
var logged = JSON.parse(localStorage.logged)
if (logged.somesale) {
	calculate_hoses(append_div, logged)
}
const add_circle = document.querySelector("#add_value")
add_circle.addEventListener("click", () => {
	random_sales(append_div, logged)
})

if (localStorage.selected_hose){
	localStorage.removeItem("selected_hose")
}
if (localStorage.selected_value) {
	localStorage.removeItem("selected_value")
}