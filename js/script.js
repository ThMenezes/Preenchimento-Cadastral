const addressForm = document.querySelector("#address-form")
const inputCep = document.querySelector("#cep")
const inputAddress = document.querySelector("#address")
const inputNeighborhood = document.querySelector("#neighborhood")
const inputCity = document.querySelector("#city")
const inputRegion = document.querySelector("#region")
const inputsForm = document.querySelectorAll("[data-input]");

const closeButton = document.querySelector("#close-message");
const fadeElement = document.querySelector("#fade")

/* validação input CEP */

inputCep.addEventListener("keypress",(e) => {
    const onlyNumbers = /[0-9]/;
    const key = String.fromCharCode(e.keyCode);

    /* permitir apenas número */
    if (!onlyNumbers.test(key)) {
        e.preventDefault();
        return;
    }
});

/* obter evento de endereço */
inputCep.addEventListener("keyup", (e) => {
    const inputValue = e.target.value;

    /* verificando comprimento correto de 8 digitos */
    if (inputValue.length === 8) {
        getAddress(inputValue);
    }
});

/* obter endereço do cliente da API */

const getAddress = async (cep) => {
    toggleLoader();

    inputCep.blur();

    const apiUrl = `https://viacep.com.br/ws/${cep}/json/`;

    const response = await fetch(apiUrl);

    const data = await response.json();

    /* mostrar erro e redefinir formulário */
    
    if (data.erro) {
        if (!inputAddress.hasAttribute("disabled")) {
            toggleDisabled();
        }
        
        addressForm.reset();
        toggleLoader();
        toggleMessage("CEP inválido, tente novamente.");
        return;
    }

    if (inputAddress.value === "") {
        toggleDisabled();
    }

    inputAddress.value = data.logradouro;
    inputCity.value = data.localidade;
    inputNeighborhood.value = data.bairro;
    inputRegion.value = data.uf;

    toggleLoader();
};

/* para adicionar ou remover atributo desabilitado */

const toggleDisabled = () => {
    if (inputRegion.hasAttribute("disabled")) {
        inputsForm.forEach((input) => {
            input.removeAttribute("disabled")
        });
    } else {
        inputsForm.forEach((input) => {
            input.setAttribute("disabled", "disabled");
        });
    }
};

/* mostrar e esconder carregamento na tela */

const toggleLoader = () => {
    const loaderElement = document.querySelector("#loader");

    fadeElement.classList.toggle("hide");
    loaderElement.classList.toggle("hide");
};

/* mostrar ou ocultar mensagem */

const toggleMessage = (msg) => {
    const messageElement = document.querySelector("#message");
    
    const messageElementText = document.querySelector("#message p");

    messageElementText.innerText = msg;
    fadeElement.classList.toggle("hide");
    messageElement.classList.toggle("hide");
};

/* fechar mensagem */

closeButton.addEventListener("click", () => toggleMessage());

/* salvar endereço e receber mensagem de sucesso*/
addressForm.addEventListener("submit", (e) => {
    e.preventDefault();
    toggleLoader();

    setTimeout(() => {
        toggleLoader();

        toggleMessage("Endereço salvo com sucesso!");

        addressForm.reset();
        toggleDisabled();
    }, 1500);
});