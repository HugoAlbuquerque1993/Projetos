const myPath = "./myBdd.json"

const productSelectInput = document.querySelector("#productSelectInput")
productSelectInput.addEventListener("change", selectedProduct)

const categorySelectInput = document.querySelector("#categorySelectInput")
categorySelectInput.addEventListener("change", filterList)

const resultTableBody = document.querySelector("#resultTableBody")
const quantityEntrySpan = document.querySelector("#quantityEntrySpan")
const quantityWarnSpan = document.querySelector("#quantityWarnSpan")
const quantityInputs = [...document.querySelectorAll(".quantityInputs > button")]
quantityInputs.forEach((el) => {
	el.addEventListener("click", quantityManager)
})

let loaded = false
let localBdd = new Array()
let currentCategory = "allCategories"
let currentItem = undefined
let currentQuantity = 0
let itemList = new Array()
let tableRowList = new Array()
let currentDay = undefined
let backgroundImageUrl = true
let = new Array()

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

function firstLoad() {
	fetch(myPath)
		.then((el) => el.json())
		.then((el) => {
			localBdd = el
			selectAnItemOpt(productSelectInput)
			loadList(localBdd, productSelectInput, categorySelectInput)
			dateFormat()
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
				currentCategory = "allCategories"
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
	if (filter == "allCategories") {
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
	if (currentCategory == "allCategories") {
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
				if (result >= currentItem.pack * 11 && result <= currentItem.pack * 12 - 1) {
					alert("Aviso: Quantidade excede padrões de entrada!")
				}
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
		let stateItem = currentItem
		stateItem.quantidadeEnviada = currentQuantity
		stateItem.tdWarn = calcQuantityWarn()

		itemList.push(stateItem)
		itemList = refactorArray(itemList, stateItem)

		displayList(itemList)
		dateFormat()
	} else {
		alert("Selecione um item e a quantidade para enviar.")
	}
}

function createTableRow(item) {
	const tableRow = document.createElement("tr")
	tableRow.dataset.codigo = item.codigo
	appendTableData(tableRow, item.codigo)
	appendTableData(tableRow, item.nome)
	appendTableData(tableRow, item.quantidadeEnviada, item.tdWarn)
	tableRow.addEventListener("click", removeTableRow)

	function removeTableRow() {
		const remove = confirm(`Remover ${item.nome}?`)
		if (remove) {
			removeFromList(item, itemList, tableRow)
			totalCount()
		}
	}

	return tableRow
}

function appendTableData(tableRow, dataText, warn) {
	const tableData = document.createElement("td")
	if (warn == true) tableData.classList.add("tdWarn")
	tableData.innerHTML = dataText
	tableRow.appendChild(tableData)
}

function totalCount(list = itemList) {
	;[...document.querySelectorAll("#resultFooter th")].map((td, ind) => {
		if (ind == 1) td.innerHTML = list.length
		if (ind == 2) {
			let total = 0
			itemList.forEach((item) => {
				total += item.quantidadeEnviada
			})
			td.innerHTML = total
		}
	})
}

function displayList(list = itemList) {
	clearTable()
	totalCount()
	list.forEach((item) => {
		const tableRow = createTableRow(item)
		resultTableBody.appendChild(tableRow)
	})
}

function removeFromList(item, list, tableRow) {
	let index
	list.filter((el, ind) => {
		if (el.codigo === item.codigo) {
			index = ind
		}
	})
	list.splice(index, 1)
	resultTableBody.removeChild(tableRow)
}

function clearTable() {
	const createdTableRows = [...document.querySelectorAll("#resultTableBody tr")]
	createdTableRows.forEach((el, ind) => {
		resultTableBody.removeChild(el)
	})
}

/**
 * @param {object[]} arrayToFilter
 * @param {object} itemToCompare
 * @returns {object[]} Return a refactored array.
 */
function refactorArray(arrayToFilter, itemToCompare) {
	let newArray = new Array()
	let memo = 0
	newArray = arrayToFilter.filter((arrayItem) => {
		if (arrayItem.codigo === itemToCompare.codigo) {
			if (memo === 0) {
				memo = 1
				return itemToCompare
			} else {
				alert(`Quantidade do item '${itemToCompare.nome}' atualizada.`)
			}
		} else {
			return arrayItem
		}
	})

	return newArray.sort((a, b) => {
		return parseInt(a.codigo) - parseInt(b.codigo)
	})
}

function dateFormat() {
	const date = new Date()
	const timeDiv = document.querySelector("[data-displayTime]")
	const options = { dateStyle: "long", timeStyle: "short" }
	currentDay = Intl.DateTimeFormat("pt-br", options).format(date)
	timeDiv.innerHTML = currentDay
}

const inputSection = document.querySelector(".inputSection")
const openCloseBtn = document.querySelector(".openCloseBtn")
openCloseBtn.addEventListener("click", openCloseAction)
function openCloseAction() {
	openCloseBtn.classList.toggle("top")
	inputSection.classList.toggle("hidden")
}

const memoryBtn = document.querySelector("#memoryBtn")
memoryBtn.addEventListener("click", handleMemoryAccess)
function handleMemoryAccess() {
	const modal = createModal(document.body)
	modalSaveBtns(modal)
}

function myButton(parentEl, func, txt, title) {
	let button
	button = document.createElement("button")
	button.innerHTML = txt || "myButton"
	button.title = title
	button.addEventListener("click", func)

	parentEl.appendChild(button)
	return button
}

function createModal(parentEl) {
	const overlay = document.createElement("div")
	overlay.className = "modalOverlay"
	overlay.addEventListener("click", (e) => {
		if (e.target.className == "modalOverlay") {
			closeModal()
		}
	})
	overlay.closeModal = () => {
		closeModal()
	}

	const content = document.createElement("div")
	content.className = "modalContent"

	overlay.content = content
	overlay.appendChild(content)
	parentEl.appendChild(overlay)

	function closeModal() {
		parentEl.removeChild(overlay)
	}

	return overlay
}

function modalSaveBtns(overlay) {
	function handleSave() {
		if (itemList.length > 0) {
			let res = true
			if (localStorage.currentSavedList) {
				res = confirm("Sobrescrever a última lista salva?")
			}
			if (!res) return overlay.closeModal()
			localStorage.currentSavedList = JSON.stringify(itemList)
			console.log(localStorage.currentSavedList)
			alert("Salvo com sucesso.")
		} else {
			alert("Não é necessária salvar listas vazias.")
		}
		overlay.closeModal()
	}

	function handleLoad() {
		if (localStorage.currentSavedList) {
			const res = confirm("Esta ação apagará a lista atual e carregará a lista salva na memória. Prosseguir?")
			if (res) callDisplay()
		} else {
			alert("Nenhuma lista salva na memória.")
		}
		overlay.closeModal()
	}

	function handleTrash() {
		if (localStorage.currentSavedList) {
			const res = confirm("Esta ação apagará a lista da memória. Prosseguir?")
			if (res) localStorage.clear(localStorage.currentSavedList)
		}
		overlay.closeModal()
	}

	let button1 = myButton(overlay.content, handleSave, "Salvar", "Salvar lista atual na memória.")

	let button2 = myButton(overlay.content, handleLoad, "Carregar", "Carregar última lista salva.")

	let button3 = myButton(overlay.content, handleTrash, "Deletar", "Excluir a lista da memória.")

	function callDisplay() {
		let stateArray = JSON.parse(localStorage.currentSavedList)
		itemList = new Array()
		stateArray.forEach((el) => {
			itemList.push(el)
		})
		displayList()
	}
}

const deleteListBtn = document.querySelector("#deleteListBtn")
deleteListBtn.addEventListener("click", handleDeleteList)
function handleDeleteList() {
	if (itemList.length > 0) {
		const res = confirm("Deseja apagar todos os itens enviados?")
		if (res) {
			itemList = new Array()
			clearTable()
			totalCount()
		}
	} else {
		alert("Não há itens a serem excluídos.")
	}
}

const printListBtn = document.querySelector("#printListBtn")
printListBtn.addEventListener("click", handlePrintList)
function handlePrintList() {
	if (itemList.length > 0) {
		dateFormat()
		window.print()
	} else {
		alert("Não há itens a serem impressos.")
	}
}

const backgroundBtn = document.querySelector(".backgroundBtn")
backgroundBtn.addEventListener("click", backgroundToggle)
function backgroundToggle() {
	document.body.classList.toggle("noBg")
}
const totalCheckbox = document.querySelector("#totalCheckbox")
totalCheckbox.addEventListener("change", () => {
	document.querySelector("#resultFooter").classList.toggle("hidden")
})

const toggleWarnCheckbox = document.querySelector("#toggleWarnCheckbox")
toggleWarnCheckbox.addEventListener("click", handleToggleWarn)
function handleToggleWarn() {
	resultTableBody.classList.toggle("hideWarning")
}
