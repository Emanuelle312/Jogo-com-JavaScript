// ===== 5.1 Array de palavras (array de objetos: palavra + dica) =====
const palavras = [
  { palavra: "javascript",  dica: "Linguagem que dá vida às páginas web" },
  { palavra: "html",        dica: "Linguagem de marcação da estrutura da página" },
  { palavra: "css",         dica: "Usado para estilizar a página" },
  { palavra: "internet",    dica: "Rede mundial de computadores" },
  { palavra: "navegador",   dica: "Chrome, Firefox e Edge são exemplos" },
  { palavra: "programacao", dica: "Ato de escrever código" },
  { palavra: "computador",  dica: "Máquina que executa programas" },
  { palavra: "teclado",     dica: "Periférico usado para digitar" },
  { palavra: "servidor",    dica: "Computador que fornece serviços a outros" },
  { palavra: "github",      dica: "Plataforma para hospedar repositórios" },
  { palavra: "variavel",    dica: "Guarda um valor na memória" },
  { palavra: "funcao",      dica: "Bloco de código reutilizável" }
];

// ===== 5.3 Variáveis que representam o estado do jogo =====
let palavraSecreta;
let dicaAtual;
let letrasCorretas = [];
let letrasUsadas = [];
let tentativas = 6;
let jogoEncerrado = false;

// Placar (desafio extra)
let partidas = 0;
let vitorias = 0;
let derrotas = 0;

// ===== 6. DOM =====
const elementoPalavra = document.getElementById("palavra");
const elementoTentativas = document.getElementById("tentativas");
const inputLetra = document.getElementById("letra");
const mensagem = document.getElementById("mensagem");
const elementoLetrasUsadas = document.getElementById("letras-usadas");
const elementoDica = document.getElementById("dica");
const botaoTentar = document.getElementById("btn-tentar");
const botaoReiniciar = document.getElementById("btn-reiniciar");
const elementoPartidas = document.getElementById("partidas");
const elementoVitorias = document.getElementById("vitorias");
const elementoDerrotas = document.getElementById("derrotas");

// ===== 7.1 Mostrar a palavra escondida =====
function atualizarPalavra() {
  let exibicao = "";

  for (let i = 0; i < palavraSecreta.length; i++) {
    const letra = palavraSecreta[i];

    if (letrasCorretas.includes(letra)) {
      exibicao += letra + " ";
    } else {
      exibicao += "_ ";
    }
  }

  elementoPalavra.textContent = exibicao;
}

// Atualiza na tela tudo o que depende do estado do jogo
function atualizarTela() {
  atualizarPalavra();
  elementoTentativas.textContent = tentativas;
  elementoLetrasUsadas.textContent = letrasUsadas.join(", ");
  elementoPartidas.textContent = partidas;
  elementoVitorias.textContent = vitorias;
  elementoDerrotas.textContent = derrotas;
}

// ===== 9. Verificar vitória =====
function venceu() {
  for (let i = 0; i < palavraSecreta.length; i++) {
    const letra = palavraSecreta[i];

    if (!letrasCorretas.includes(letra)) {
      return false;
    }
  }
  return true;
}

// Mostra uma mensagem com uma classe de cor (acerto/erro/venceu/perdeu)
function mostrarMensagem(texto, classe) {
  mensagem.textContent = texto;
  mensagem.className = classe || "";
}

// Bloqueia ou libera o campo e o botão de tentativa
function bloquearEntrada(bloquear) {
  inputLetra.disabled = bloquear;
  botaoTentar.disabled = bloquear;
}

// ===== 8.1 Verificar a letra digitada =====
function verificarLetra() {
  if (jogoEncerrado) {
    return;
  }

  const letra = inputLetra.value.toLowerCase();

  if (letra === "") {
    mostrarMensagem("Digite uma letra.", "erro");
    return;
  }

  // Aceita apenas letras de a a z
  if (!/^[a-z]$/.test(letra)) {
    mostrarMensagem("Digite apenas letras (de a a z).", "erro");
    inputLetra.value = "";
    return;
  }

  if (letrasUsadas.includes(letra)) {
    mostrarMensagem("Letra já utilizada.", "erro");
    inputLetra.value = "";
    inputLetra.focus();
    return;
  }

  letrasUsadas.push(letra);

  if (palavraSecreta.includes(letra)) {
    letrasCorretas.push(letra);
    mostrarMensagem("Você acertou!", "acerto");
  } else {
    tentativas--;
    mostrarMensagem("Você errou!", "erro");

    // Animação simples de erro (desafio extra)
    elementoPalavra.classList.remove("tremer");
    void elementoPalavra.offsetWidth; // reinicia a animação
    elementoPalavra.classList.add("tremer");
  }

  // ----- Fim de jogo -----
  if (venceu()) {
    mostrarMensagem("Parabéns! Você venceu!", "venceu");
    encerrarJogo(true);
  } else if (tentativas === 0) {
    mostrarMensagem("Você perdeu! A palavra era " + palavraSecreta, "perdeu");
    encerrarJogo(false);
  }

  inputLetra.value = "";
  inputLetra.focus();
  atualizarTela();
}

function encerrarJogo(ganhou) {
  jogoEncerrado = true;
  partidas++;

  if (ganhou) {
    vitorias++;
  } else {
    derrotas++;
  }

  bloquearEntrada(true);
}

// ===== 5.4 Iniciar (ou reiniciar) uma partida =====
function iniciarJogo() {
  const indice = Math.floor(Math.random() * palavras.length);

  palavraSecreta = palavras[indice].palavra;
  dicaAtual = palavras[indice].dica;
  tentativas = 6;
  letrasCorretas = [];
  letrasUsadas = [];
  jogoEncerrado = false;

  elementoDica.textContent = "Dica: " + dicaAtual;
  mostrarMensagem("Bem-vindo ao jogo!", "");
  bloquearEntrada(false);
  inputLetra.value = "";
  inputLetra.focus();
  atualizarTela();
}

// ===== 8. Eventos =====
botaoTentar.addEventListener("click", verificarLetra);
botaoReiniciar.addEventListener("click", iniciarJogo);

// Desafio extra: enviar a letra com Enter
inputLetra.addEventListener("keydown", function (evento) {
  if (evento.key === "Enter") {
    verificarLetra();
  }
});

// ===== 10. Primeira partida ao abrir a página =====
iniciarJogo();
