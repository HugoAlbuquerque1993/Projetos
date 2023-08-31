import { GoTo_logginDiv } from "./add_content.js"
if (localStorage.logged == "undefined") {
	GoTo_logginDiv(document.body)
}

document.querySelector("#icon_back").addEventListener("click",() => {
	window.location.href = "02.html"
})

import { render_value } from "./add_content.js"
render_value(document.querySelector(".div_bot"), document.querySelector("#page_hose"))

if (localStorage.selected_value) {
	localStorage.removeItem("selected_value")
}