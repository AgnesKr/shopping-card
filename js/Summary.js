function Summary() {

    this.isOpen = false
    this.phoneNumber = ""
    this.zipCode = "__-___"

    this.openWindow = (deliveryDate,transactionDate, products,price) => {
        if(!this.isOpen) {
            let windowDiv = document.querySelector(".window")
            windowDiv.style.visibility = "visible"
            windowDiv.style.left = window.innerWidth / 2 - windowDiv.offsetWidth / 2 +  "px"
            windowDiv.style.top = window.innerHeight / 2 - windowDiv.offsetHeight / 2 - 50 + "px"
            document.querySelector(".dark").style.visibility = "visible"
            document.querySelector(".window h5").innerHTML = "Data dostawy " + deliveryDate
            document.querySelector(".window-close").addEventListener("click",() => {
                this.isOpen = false
                this.phoneNumber = ""
                close()
            })
            document.querySelector(".dark").addEventListener("click", () => {
                this.isOpen = false
                this.phoneNumber = ""
                close()
            })

            document.querySelector(".window-content-zipcode").addEventListener("keydown",(e) => {
                const allowKeys = [48,49,50,51,52,53,54,55,56,57,8,96,97,98,99,100,101,102,103,104,105]
                if(allowKeys.includes(e.keyCode) == false) {
                    return
                }

                if(e.key != "Backspace") {
                    for(let i = 0; i < this.zipCode.length; i++) {
                        if(this.zipCode[i] == "_") {
                            this.zipCode = this.zipCode.replaceAt(i,e.key)
                            console.log(this.zipCode[i])
                            break
                        }
                    }
                } else if(e.key == "Backspace"){
                    for(let i = this.zipCode.length - 1; i >= 0 ; i--) {
                        if(this.zipCode[i] != "_" && this.zipCode[i] != "-") {
                            this.zipCode = this.zipCode.replaceAt(i, "_")
                            break
                        }
                    }
                }
                document.querySelector(".window-content-zipcode").value = this.zipCode
                e.preventDefault()
            })

            document.querySelector(".window-content-phone").addEventListener("keydown",(e) => {
                const allowKeys = [48,49,50,51,52,53,54,55,56,57,8,96,97,98,99,100,101,102,103,104,105]
                if(allowKeys.includes(e.keyCode) == false) {
                    e.preventDefault()
                }

                if(e.key != "Backspace") {
                    this.phoneNumber += e.key
                } else if(e.key == "Backspace"){
                    this.phoneNumber = this.phoneNumber.substr(0,this.phoneNumber.length - 1)
                    console.log(this.phoneNumber)
                }

                if(this.phoneNumber.length > 9) {
                    e.preventDefault()
                    this.phoneNumber = this.phoneNumber.substr(0,this.phoneNumber.length - 1)
                    document.querySelector("#window-error-phone").innerHTML = "Maksymalna liczba znaków to 9"
                } else {
                    document.querySelector("#window-error-phone").innerHTML = ""
                }
            })

            document.querySelector(".submit").addEventListener("click", () => {
                let inputs = document.querySelectorAll(".window input")
                let inputValues = {}
                let errorsP = document.querySelectorAll(".window .error")
                let isError = false
                for(let i = 0 ; i < inputs.length; i++) {
                    if(inputs[i].value.length == 0 || inputs[i].value == "__-___") {
                        for(let k = 0 ; k < errorsP.length; k++) {
                            if(errorsP[k].getAttribute("name") ==  inputs[i].getAttribute("name")) {
                                errorsP[k].innerHTML = "Pole jest wymagane"
                                isError = true
                            }
                        }
                    }
                   inputValues = {
                       ...inputValues,
                       [inputs[i].getAttribute("name")]: inputs[i].value
                   }
                }
                if(!isError) {
                    axios({
                        url: "http://localhost:3000/orders",
                        method: "POST",
                        data: {
                            transactionDate,
                            deliveryDate,
                            products,
                            price,
                            ...inputValues
                        }
                    })
                }
            })

            this.isOpen = true
        }
    }

}

function close() {
    let inputs = document.querySelectorAll(".window input")
    console.log(inputs)
    for(let i = 0; i < inputs.length; i++) {
        inputs[i].value = ""
    }
    document.querySelector(".dark").style.visibility = "hidden"
    document.querySelector(".window").style.visibility = "hidden"
}