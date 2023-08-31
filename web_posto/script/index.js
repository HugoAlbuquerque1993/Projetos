const user = document.querySelector("#user")
const password = document.querySelector("#password")
const entrar = document.querySelector("#entrar")
const visibility_icon = document.querySelector("#visibility_icon")
const nome_frentista = document.querySelector("#nome_frentista")
const add_novo = document.querySelector("#add_novo")
add_novo.addEventListener("click", campo_cadastro)
entrar.addEventListener("click", check_values)

const password_manager = "333"

import { add_user, check_login } from "./database.js"
localStorage.logged = undefined
if (!localStorage.users) {
	var users = []
	add_user("10", "HUGO HENRIQUE", "4563", users)
	localStorage.users = JSON.stringify(users)
} else {
	var users = JSON.parse(localStorage.users)
}

user.addEventListener("input", enable_btn)
password.addEventListener("input", enable_btn)
function enable_btn() {
	if (user.value.length > 0) {
		if (password.value.length > 0) {
			entrar.removeAttribute("disabled", "disabled")
		} else {
			entrar.setAttribute("disabled", "disabled")
		}
	} else {
		entrar.setAttribute("disabled", "disabled")
	}
}

password.addEventListener("keypress", enter_on_password)
function enter_on_password(e) {
	console.log(e)
	if (e.key === "Enter") {
		check_values()
	}
}

function check_values() {
	let uv = Number(user.value)
	let pv = password.value

	if (uv == "" || pv == "") {
		alert("Preencha todos os campos.")
	} else if (uv.length > 2) {
		alert("Usuário só pode ter até 2 números.")
	} else if (pv.length > 4) {
		alert("Senha só pode conter até 4 dígitos.")
	} else {
		check_login(uv, pv, user, password)
	}
}

visibility_icon.addEventListener("click", password_masked)
function password_masked() {
	let x = visibility_icon
	if (x.innerHTML != "visibility") {
		x.innerHTML = "visibility"
		password.style = "-webkit-text-security: none;"
	} else {
		x.innerHTML = "visibility_off"
		password.style = "-webkit-text-security: disc;"
	}
}

function campo_cadastro() {
	const back_div = document.createElement("div")
	back_div.setAttribute("class", "back_div")
	back_div.innerHTML = `
		<div class="div_cadastro"> 
			<div class="novo_frentista"> 
				<label for="novo_ID"> Novo ID: </label> 
				<input type="number" id="novo_ID"> 
				<label for="novo_nome"> Nome: </label> 
				<input type="text" id="novo_nome"> 
				<label for="nova_senha"> Senha: </label> 
				<input type="number" id="nova_senha">
			</div>
			
			<div class="div_concluir"> 
				<label for="gerente"> Senha do Gerente: </label> 
				<input type="password" id="gerente" value="333" disabled> 
				<input type="button" value="Salvar" id="save"> 
				<input type="button" value="Sair" id="sair"> 
			</div> 
		</div>
	`

	document.body.appendChild(back_div)

	const novo_ID = document.querySelector("#novo_ID")
	const novo_nome = document.querySelector("#novo_nome")
	const nova_senha = document.querySelector("#nova_senha")
	const gerente = document.querySelector("#gerente")

	const sair = document.querySelector("#sair")
	sair.addEventListener("click", remover_cadastro)

	function remover_cadastro() {
		let res = true
		if (novo_ID.value != "" || novo_nome.value != "" || nova_senha.value != "") {
			res = confirm("Todos os valores atuais serão perdidos. Tem certeza que deseja sair?")
		}
		if (res == true) {
			document.body.removeChild(back_div)
		}
	}

	const save = document.querySelector("#save")
	save.addEventListener("click", () => {
		if (novo_ID.value == "" || novo_nome.value == "" || nova_senha.value == "" || gerente.value == "") {
			return alert("Preencha todos os campos")
		}
		if (novo_ID.value.length > 2) {
			return alert("ID deve conter até 2 números.")
		}
		if (nova_senha.value.length > 4) {
			return alert("Senha deve conter até 4 números.")
		}
		if (novo_nome.value.length < 3) {
			return alert("Nome deve conter o mínimo de 3 caracteres.")
		}
		if (novo_nome.value.length > 35) {
			return alert("Nome deve conter o máximo de 35 caracteres.")
		}
		let ID_igual = users.filter((el) => {
			if (el.id == novo_ID.value) {
				return el
			}
		})
		if (ID_igual.length > 0) {
			novo_ID.value = ""
			return alert("ID já existe, escolha outro.")
		}
		if (gerente.value != password_manager) {
			return alert("Senha do gerente inválida!")
		}
		add_user(novo_ID.value, novo_nome.value, nova_senha.value, users)

		document.body.removeChild(back_div)
		setTimeout(() => {
			alert("Cadastro realizado com sucesso.")
			location.reload()
		}, 100)
	})
}

window.onload = () => {
	let reload = document.querySelector("#reload")
	let somesale = false
	users.some((el) => {
		if (el.somesale == true) {
			somesale = true
		}
	})
	if (users.length > 1 || somesale) {
		reload.style.display = "flex"
	} else {
		alert(`Clique em "Cadastrar Novo Usuário" e realize um cadastro.`)
		reload.style.display = "none"
	}
	reload.addEventListener("click", () => {
		let res = confirm("Resetar todos os valores do banco de dados?")
		if (!res) {
			return
		} else {
			localStorage.clear()
			location.reload()
		}
	})
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
document.querySelector(".footer").style.boxShadow = ""

if (localStorage.selected_hose) {
	localStorage.removeItem("selected_hose")
}
if (localStorage.selected_value) {
	localStorage.removeItem("selected_value")
}
