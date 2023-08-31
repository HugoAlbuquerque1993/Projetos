import { clock, today } from "./time.js"

export function random_sales(append_div, logged) {
	let users = JSON.parse(localStorage.users)

	users.map((el) => {
		if (el.id == logged.id) {
			if (!el.somesale) {
				el.somesale = true
			}
			let res = add_hose_value()
			el.sales.map((sale) => {
				if (sale.hose == res.hose) {
					sale.data.unshift(res)
					localStorage.logged = JSON.stringify(el)
				}
			})
		}
	})

	localStorage.users = JSON.stringify(users)
	calculate_hoses(append_div, logged)
}

export function add_hose_value() {
	let hose = random_hoses()
	let abbr = hose_identify(hose)[0]
	let name = hose_identify(hose)[1]
	let liter_value = liter_value_indentify(abbr).toString()
	let amount_liters = random_liters(abbr)
	let value = multiply_value(liter_value, amount_liters)
	let clock_time = clock("clock")
	let today_time = today("today")

	return { hose, abbr, name, liter_value, value, amount_liters, clock_time, today_time }
}

export function random_hoses() {
	let hose = Math.floor(Math.random() * 16 + 1).toString()
	hose < 10 ? (hose = "0" + hose) : hose
	return hose
}

export function hose_identify(hose) {
	if (hose == 1 || hose == 2 || hose == 15) {
		return ["GAS", "Gasolina"]
	} else if (hose == 4 || hose == 3 || hose == 16) {
		return ["ETA", "Etanol"]
	} else if (hose == 7 || hose == 8) {
		return ["DIS", "Dísel"]
	} else if (hose == 5 || hose == 6) {
		return ["ADT", "Gasolina Aditivada"]
	} else {
		return ["GNV", "Gás Natural Veicular"]
	}
}

export function liter_value_indentify(abbr) {
	if (abbr == "GAS") {
		return 5.48
	} else if (abbr == "ETA") {
		return 4.08
	} else if (abbr == "DIS") {
		return 5.49
	} else if (abbr == "ADT") {
		return 5.78
	} else {
		return 3.89
	}
}

export function random_liters(abbr) {
	let res
	if (abbr == "GNV") {
		res = Math.random() * 21 + 1
	} else {
		res = Math.random() * 43 + 2
	}
	return res.toFixed(3)
}

export function multiply_value(liter, amout) {
	let res = liter * amout
	return res.toFixed(2)
}

import { render_hose } from "./add_content.js"
export function calculate_hoses(append_div, logged) {
	append_div.innerHTML = ""
	let users = JSON.parse(localStorage.users)
	let user = users.filter((el) => {
		if (el.id == logged.id) {
			return el.sales
		}
	})

	let us = user[0].sales
	for (let i = 0; i < us.length; i++) {
		let usd = us[i].data

		let amount = usd.length
		amount < 10 ? (amount = "0" + amount) : amount
		amount.toString()

		usd.filter((sale, ind) => {
			if (ind == 0) {
				render_hose(append_div, sale, amount, usd)
			}
		})
	}
}
