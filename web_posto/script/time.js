export function clock(x) {
	let time = new Date()
	let hour = time.getHours().toString()
	let min = time.getMinutes().toString()
	let sec = time.getSeconds().toString()

	hour < 10 ? (hour = "0" + hour) : hour
	min < 10 ? (min = "0" + min) : min
	sec < 10 ? (sec = "0" + sec) : sec

	let timeString = `${hour}:${min}:${sec}`
	if (x == "clock") {
		return timeString
	}
	return (x.innerHTML = timeString)
}

export function today(x) {
	let time = new Date()
	let day = time.getDate().toString()
	let mon = time.getMonth() + 1
	mon = mon.toString()
	let year = time.getFullYear().toString()

	day < 10 ? (day = "0" + day) : day
	mon < 10 ? (mon = "0" + mon) : mon

	let todayString = `${day}/${mon}/${year}`
	if (x == "today") {
		return todayString
	}
	return x.innerHTML = todayString
}