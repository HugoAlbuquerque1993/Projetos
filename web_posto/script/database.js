export function add_user(id, name, password, users) {

    var amount_hoses = 16

    class user {
        constructor(id, name, password, amount_hoses){
            this.id = id
            this.name = name.toUpperCase()
            this.password = password
            this.sales = new Array
            for (let i = 1; i <= amount_hoses; i++){
                this.sales.push({hose: i, data: []})
            }
            this.somesale = false
        }
    }

    users.push(new user(id, name, password, amount_hoses))
    users.sort((a, b) => {return a.id - b.id})

    localStorage.users = JSON.stringify(users)
}

export function check_login(uv, pv, user, pass) {
    var users = JSON.parse(localStorage.users)
    let res = users.filter((el, i) => {
        if (el.id == uv) {
            return el
        }
    })
    if (!res[0]) {
        alert(`Usuário de número "${uv}" não registrado.`)
        user.focus()
    } else {
        if (res[0].password != pv) {
            pass.value = ""
            alert("Senha inválida.")
            pass.focus()
        } else {
            log_into(res[0])
        }
    }
}

export function log_into(logged) {
    window.location.href = "./pages/01.html"
	localStorage.logged = JSON.stringify(logged)
}
