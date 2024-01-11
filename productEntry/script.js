const myPath = "./myBdd.json"

const productSelectInput = document.querySelector("#productSelectInput")
productSelectInput.addEventListener("change", selectedProduct)

const categorySelectInput = document.querySelector("#categorySelectInput")
categorySelectInput.addEventListener("change", filterList)

const quantityEntrySpan = document.querySelector("#quantityEntrySpan")
const quantityWarnSpan = document.querySelector("#quantityWarnSpan")

const quantityInputs = [...document.querySelectorAll(".quantityInputs > button")]
quantityInputs.forEach((el) => {
	el.addEventListener("click", quantityManager)
})

let loaded = false
let localBdd = new Array()
let currentCategory = "Todas"
let currentItem = undefined
let currentQuantity = 0
let itemList = new Array()
let tableRowList = new Array()
let currentDay = undefined
let backgroundImageUrl = true

function resetParams() {
	currentItem = undefined
	currentQuantity = 0
	quantityEntrySpan.innerHTML = 0
	isWarnText(calcQuantityWarn())
}

function calcQuantityWarn() {
	if (currentQuantity > 0) {
		if (currentQuantity % currentItem.pack === 0) {
			return false
		} else {
			return true
		}
	} else {
		return false
	}
}

function isWarnText(warn) {
	warn ? (quantityWarnSpan.style.opacity = 1) : (quantityWarnSpan.style.opacity = 0)
}

async function firstLoad() {
	await fetch(myPath)
		.then((res) => res.json())
		.then((res) => {
			localBdd = res
			selectAnItemOpt(productSelectInput)
			loadList(localBdd, productSelectInput, categorySelectInput)
		})
		.catch((err) => {
			console.warn("Não foi possível carregar o Banco de Dados. " + err)
		})
}
firstLoad()

async function loadList(dataArray, optElement, catElement, filter) {
	if (optElement instanceof HTMLElement) {
		let myArray = new Array(dataArray)[0]
		await myArray.forEach((item) => {
			if (filter) {
				if (item.categoria == filter) {
					currentCategory = item.categoria
					selectAnItemOpt(productSelectInput)
					item["itens"].forEach((el) => {
						createOption(el.nome, optElement, el)
					})
				}
			} else {
				currentCategory = "Todas"
				if (item.categoria) {
					createCategory(item, optElement, catElement)
				} else {
					createOption(item.nome, optElement, item)
				}
			}
		})
	}
	if (loaded === false) loaded = true
}

function selectAnItemOpt(optElement) {
	optElement.innerHTML = ""

	const optItem = document.createElement("option")
	optItem.innerHTML = "-- Selecione um Produto --"
	optItem.setAttribute("disabled", "disabled")
	optItem.setAttribute("selected", "selected")
	optElement.appendChild(optItem)
}

function createCategory(item, optElement, catElement) {
	if (loaded === false) {
		createOption(item["categoria"], catElement, item)
	}

	const optGroup = document.createElement("optgroup")
	optGroup.label = item["categoria"]
	loadList(item["itens"], optGroup)
	optElement.appendChild(optGroup)
}

function createOption(name, element, item) {
	const optItem = document.createElement("option")
	optItem.value = name
	optItem.innerHTML = name
	element.appendChild(optItem)
}

function filterList() {
	resetParams()
	const filter = categorySelectInput.value
	if (filter == "Todas") {
		selectAnItemOpt(productSelectInput)
		loadList(localBdd, productSelectInput, categorySelectInput)
	} else {
		loadList(localBdd, productSelectInput, categorySelectInput, filter)
	}
}

function selectedProduct(e) {
	resetParams()
	const item = findItem(e.target.value)
	currentItem = item
	handleQuantity(item.pack)
}

function handleQuantity(quantity) {
	if (quantity < 0) quantity = 0
	quantityEntrySpan.innerHTML = quantity
	currentQuantity = quantity
	isWarnText(calcQuantityWarn())
}

function findItem(name) {
	if (currentCategory == "Todas") {
		localBdd.forEach((category) => {
			category["itens"].filter((item) => {
				if (item.nome == name) {
					returnedItem = item
				}
			})
		})
	} else {
		localBdd.filter((category) => {
			if (category.categoria == currentCategory) {
				category["itens"].filter((item) => {
					if (item.nome == name) {
						returnedItem = item
					}
				})
			}
		})
	}
	return returnedItem
}

function quantityManager(e) {
	if (currentItem) {
		let result = 0
		switch (e.target.innerHTML) {
			case "-":
				result = currentQuantity - 1
				break
			case "--":
				result = currentQuantity - currentItem.pack
				break
			case "++":
				result = currentQuantity + currentItem.pack
				break
			case "+":
				result = currentQuantity + 1
				break
		}
		handleQuantity(result)
	}
}
const sendToListButton = document.querySelector("#sendToListButton")
sendToListButton.addEventListener("click", handleSendToList)
function handleSendToList() {
	if (currentItem != undefined && currentQuantity > 0) {
		createTableRow(currentItem, currentQuantity)
	} else {
		alert("Selecione um item para enviar.")
	}
}

const resultTable = document.querySelector("#resultTable")
async function createTableRow(item, quantity) {
	const tableRow = document.createElement("tr")
	tableRow.dataset.codigo = item.codigo
	appendTableData(tableRow, item.codigo)
	appendTableData(tableRow, item.nome)
	appendTableData(tableRow, quantity)
	tableRow.addEventListener("click", removeTableRow)

	function removeTableRow() {
		const remove = confirm(`Remover ${item.nome}?`)
		if (remove) {
			removeFromList(item, itemList)
		}
	}

	item.tableRow = tableRow
	itemList.push(item)

	itemList = await refactorArray(itemList, item)
	displayList(itemList)
}

function displayList(list) {
	clearTable()
	list.forEach((el) => {
		resultTable.appendChild(el.tableRow)
	})
}

function removeFromList(item, list) {
	let index
	list.filter((el, ind) => {
		if (el.codigo === item.codigo) {
			index = ind
		}
	})
	list.splice(index, 1)
	resultTable.removeChild(item.tableRow)
}

function clearTable() {
	const createdTableRows = [...document.querySelectorAll("#resultTable tr")]
	createdTableRows.forEach((el, ind) => {
		if (ind > 0) {
			resultTable.removeChild(el)
		}
	})
}

async function refactorArray(filterArray, item) {
	let newArray = new Array()
	let memo = 0
	newArray = filterArray.filter((el, ind) => {
		console.log(filterArray)
		if (el.codigo === item.codigo) {
			if (memo === 0) {
				memo = item
				return item
			} else {
				alert(`Quantidade do item '${item.nome}' atualizada.`)
			}
		} else {
			return el
		}
	})
	function compareByCode(a, b) {
		return parseInt(a.codigo) - parseInt(b.codigo)
	}
	newArray.sort(compareByCode)
	return newArray
}

function appendTableData(tableRow, dataText) {
	const tableData = document.createElement("td")
	tableData.innerHTML = dataText
	tableRow.appendChild(tableData)
}

function dateFormat() {
	const timeDiv = document.querySelector("[data-displayTime]")
	const options = { dateStyle: "long", timeStyle: "short" }
	const date = new Date()
	currentDay = Intl.DateTimeFormat("pt-br", options).format(date)
	timeDiv.innerHTML = currentDay
}
dateFormat()

const inputSection = document.querySelector(".inputSection")
const openCloseBtn = document.querySelector(".openCloseBtn")
openCloseBtn.addEventListener("click", openCloseAction)
function openCloseAction() {
	openCloseBtn.classList.toggle("top")
	inputSection.classList.toggle("hidden")
}

const saveListBtn = document.querySelector("#saveListBtn")
saveListBtn.addEventListener("click", handleSaveList)
function handleSaveList() {
	alert("<SaveList/> Funcionalidade ainda não implementada (em desenvolvimento).")
}

const deleteListBtn = document.querySelector("#deleteListBtn")
deleteListBtn.addEventListener("click", handleDeleteList)
function handleDeleteList() {
	if (itemList.length > 0) {
		const res = confirm("Deseja apagar todos os itens enviados?")
		if (res) {
			itemList = new Array()
			clearTable()
		}
	} else {
		alert("Não há itens a serem excluídos.")
	}
}

const printListBtn = document.querySelector("#printListBtn")
printListBtn.addEventListener("click", handlePrintList)
function handlePrintList() {
	itemList.length > 0 ? window.print() : alert("Não há itens para serem impressos.")
}

const backgroundBtn = document.querySelector(".backgroundBtn")
backgroundBtn.addEventListener("click", backgroundToggle)
function backgroundToggle() {
	if (backgroundImageUrl == true) {
		document.body.style.backgroundImage = "var(--gradient)"
		backgroundImageUrl = false
	} else {
		document.body.style.backgroundImage = "var(--imageUrl)"
		backgroundImageUrl = true
	}
}
