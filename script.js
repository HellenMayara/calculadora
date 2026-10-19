const visorOperacao = document.getElementById("operacao"); // visor da operação
const visorResultado = document.getElementById("resultado"); // visor do resultado
const tecla = document.querySelectorAll(".tecla"); // seleciona todas as teclas

let numeroAtual = "0"; // número atual que está sendo digitado
let numeroAnterior = ""; // número anterior que foi digitado
let operadorAtual = ""; // operador atual que está sendo usado
let acabouDeCalcular = false; // flag para indicar se acabou de calcular

function formatarNumero(texto) { // função para formatar o número exibido no visor
    if (texto === "Erro") { // verifica se o texto é "Erro"
        return texto; // se o texto for "Erro", retorna "Erro"
    }

    const partes = texto.split(","); // divide o texto em partes usando a vírgula como separador
    const inteira = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, "."); // formata a parte inteira com pontos a cada 3 dígitos

    if (partes.length > 1) { // verifica se há parte decimal
        return inteira + "," + partes[1]; // se houver parte decimal, retorna a parte inteira formatada + vírgula + parte decimal
    }
    return inteira; // se não houver parte decimal, retorna apenas a parte inteira formatada
}

function atualizarVisor() { // função para atualizar o visor da calculadora
    visorResultado.textContent = formatarNumero(numeroAtual); // atualiza o visor do resultado com o número atual formatado
    visorOperacao.textContent = formatarNumero(numeroAnterior) + " " + operadorAtual; // atualiza o visor da operação com o número anterior e o operador atual

    const quantidade = numeroAtual.length; // obtém a quantidade de caracteres do número atual

    if (quantidade > 10) {
        visorResultado.style.fontSize = "22px"; // se a quantidade de caracteres for maior que 10, diminui o tamanho da fonte do visor do resultado
    } else if (quantidade > 8) {
        visorResultado.style.fontSize = "28px"; // se a quantidade de caracteres for maior que 8, diminui o tamanho da fonte do visor do resultado
    } else if (quantidade > 6) {
        visorResultado.style.fontSize = "34px"; // se a quantidade de caracteres for maior que 6, diminui o tamanho da fonte do visor do resultado
    } else {
        visorResultado.style.fontSize = "40px"; // se a quantidade de caracteres for menor ou igual a 6, mantém o tamanho da fonte do visor do resultado
    }
}

function digitarNumero(numero) { // função para digitar um número
    if (acabouDeCalcular) {
        numeroAtual = "0"; // se acabou de calcular, reseta o número atual para 0
        acabouDeCalcular = false; // reseta a flag acabouDeCalcular para false
    }

    if (numeroAtual.replace(",", "").replace("-", "").length >= 12) { // verifica se o número atual já possui 12 dígitos (desconsiderando vírgula e sinal negativo)
        return; // não permite digitar mais de 12 dígitos
    }

    if (numero === "," && numeroAtual.includes(",")) { // verifica se o número digitado é uma vírgula e se o número atual já contém uma vírgula
        return; // não permite digitar mais de uma vírgula
    }

    if (numeroAtual === "0" && numero !== ",") { // verifica se o número atual é 0 e se o número digitado não é uma vírgula
        numeroAtual = numero; // substitui o 0 pelo número digitado
    } else {
        numeroAtual = numeroAtual + numero; // adiciona o número digitado ao final do número atual
    }

    atualizarVisor(); // atualiza o visor da calculadora
}

tecla.forEach(function (tecla) { // percorre todas as teclas da calculadora
    tecla.addEventListener("click", function () { // adiciona um evento de clique para cada tecla
        if (tecla.dataset.numero) { // verifica se a tecla possui um número associado
            digitarNumero(tecla.dataset.numero); // chama a função digitarNumero passando o número digitado
        } else if (tecla.dataset.operador) { // verifica se a tecla possui um operador associado
            escolherOperador(tecla.dataset.operador); // chama a função escolherOperador passando o operador digitado
        } else if (tecla.dataset.acao === "igual") { // verifica se a tecla é a tecla "="
            calcular(); // chama a função calcular quando a tecla "=" for pressionada
        } else if (tecla.dataset.acao === "limpar") { // verifica se a tecla é a tecla "C"
            limpar(); // chama a função limpar quando a tecla "C" for pressionada
        } else if (tecla.dataset.acao === "apagar") { // verifica se a tecla é a tecla "⌫"
            apagar(); // chama a função apagar quando a tecla "⌫" for pressionada
        } else if (tecla.dataset.acao === "porcentagem") { // verifica se a tecla é a tecla "%"
            porcentagem(); // chama a função porcentagem quando a tecla "%" for pressionada
        }
    });
});

function escolherOperador(operador) { // função para escolher um operador

    if (operadorAtual && numeroAnterior) { // verifica se já existe um operador e um número anterior
        calcular(); // se já houver um operador e um número anterior, realiza o cálculo
    }

    operadorAtual = operador; // atualiza o operador atual com o operador escolhido
    numeroAnterior = numeroAtual; // atualiza o número anterior com o número atual
    numeroAtual = "0"; // reseta o número atual para 0
    acabouDeCalcular = false; // reseta a flag acabouDeCalcular para false
    atualizarVisor(); // atualiza o visor da calculadora
}

function calcular() {
    const anterior = parseFloat(numeroAnterior.replace(",", ".")); // converte o número anterior para float, substituindo a vírgula por ponto
    const atual = parseFloat(numeroAtual.replace(",", ".")); // converte o número atual para float, substituindo a vírgula por ponto

    if (isNaN(anterior) || isNaN(atual)) {
        return; // se algum dos números não for um número válido, retorna sem fazer nada
    }

    let resultado; // variável para armazenar o resultado do cálculo

    if (operadorAtual === "+") { // verifica se o operador atual é uma soma
        resultado = anterior + atual; // realiza a soma
    } else if (operadorAtual === "-") {
        resultado = anterior - atual; // realiza a subtração
    } else if (operadorAtual === "*") {
        resultado = anterior * atual; // realiza a multiplicação
    } else if (operadorAtual === "/") {
        if (atual === 0) { // verifica se o divisor é 0
            numeroAtual = "Erro"; // se o divisor for 0, exibe "Erro"
            numeroAnterior = ""; // reseta o número anterior
            operadorAtual = ""; // reseta o operador atual
            acabouDeCalcular = true; // seta a flag acabouDeCalcular para true
            atualizarVisor();
            return; // retorna sem fazer nada
        }
        resultado = anterior / atual; // realiza a divisão
    }

    resultado = Math.round(resultado * 100000000) / 100000000; // arredonda o resultado para 8 casas decimais

    numeroAtual = String(resultado).replace(".", ","); // atualiza o número atual com o resultado, substituindo o ponto por vírgula
    numeroAnterior = ""; // reseta o número anterior
    operadorAtual = ""; // reseta o operador atual
    acabouDeCalcular = true; // seta a flag acabouDeCalcular para true
    atualizarVisor(); // atualiza o visor da calculadora
}

function limpar() { // função para limpar a calculadora
    numeroAtual = "0"; // reseta o número atual para 0
    numeroAnterior = ""; // reseta o número anterior
    operadorAtual = ""; // reseta o operador atual
    acabouDeCalcular = false; // reseta a flag acabouDeCalcular para false
    atualizarVisor(); // atualiza o visor da calculadora
}

function apagar() { // função para apagar o último dígito digitado
    numeroAtual = numeroAtual.slice(0, -1); // remove o último caractere do número atual
    
    if (numeroAtual === "" || numeroAtual === "Erro") { // verifica se o número atual ficou vazio ou se é "Erro"
        numeroAtual = "0"; // se o número atual ficar vazio ou for "Erro", reseta para 0
    }
    atualizarVisor(); // atualiza o visor da calculadora
}

function porcentagem() {
    const atual = parseFloat(numeroAtual.replace(",", ".")); // converte o número atual para float, substituindo a vírgula por ponto
    numeroAtual =String(atual / 100).replace(".", ","); // divide o número atual por 100 e atualiza o número atual, substituindo o ponto por vírgula
    acabouDeCalcular = false; // seta a flag acabouDeCalcular para false
    atualizarVisor(); // atualiza o visor da calculadora
}

document.addEventListener("keydown", function (evento) { // adiciona um evento de teclado para a página
    const tecla = evento.key; // obtém a tecla pressionada
    const botao = document.querySelector (
        `[data-numero="${tecla}"], [data-operador="${tecla}"]`
    );

    if (botao) { // verifica se existe um botão correspondente à tecla pressionada
        botao.classList.add("pressionada"); // adiciona a classe "pressionada" ao botão correspondente
        setTimeout(function () { // adiciona um timeout para remover a classe "pressionada" após 100ms
            botao.classList.remove("pressionada"); // remove a classe "pressionada" do botão correspondente
            }, 100);
    }

    
    if (tecla >= "0" && tecla <= "9") { // verifica se a tecla pressionada é um número
        digitarNumero(tecla); // chama a função digitarNumero passando o número digitado
    } else if (tecla === "," || tecla === ".") { // verifica se a tecla pressionada é uma vírgula ou ponto
        digitarNumero(","); // chama a função digitarNumero passando a vírgula
    } else if (tecla === "+" || tecla === "-" || tecla === "*" || tecla === "/") { // verifica se a tecla pressionada é um operador
        escolherOperador(tecla); // chama a função escolherOperador passando o operador digitado
    } else if (tecla === "Enter" || tecla === "=") { // verifica se a tecla pressionada é Enter ou igual
        calcular(); // chama a função calcular
    } else if (tecla === "Backspace") { // verifica se a tecla pressionada é Backspace
        apagar(); // chama a função apagar
    } else if (tecla === "Escape" || tecla === "c" || tecla === "C") { // verifica se a tecla pressionada é Escape ou C
        limpar(); // chama a função limpar
    } else if (tecla === "%") { // verifica se a tecla pressionada é %
        porcentagem(); // chama a função porcentagem
    }
});