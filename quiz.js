const elementos = {
    telaMenu: document.querySelector('.menu'),
    telaJogo: document.querySelector('.jogo'),

    pergunta: document.querySelector('#pergunta'),
    listaAlternativas: document.querySelector('#alternativas'),
    alternativas: new Array(),

    selectCategoria: document.querySelector('#categoria'),
    categorias: new Array(),
    selectDificuldade: document.querySelector('#dificuldade'),

    textoPontuacao: document.querySelector('#pontuacao'),
    textoTentativasRestantes: document.querySelector('#tentativas-restantes'),
    textoDificuldade: document.querySelector('#texto-dificuldade'),
    textoCategoria: document.querySelector('#texto-categoria'),

    botoes: {
        botaoComecar: document.querySelector('#bt-comecar-jogo'),
        botaoResponder: document.querySelector('#bt-responder'),
        botaoResponderDepois: document.querySelector('#bt-responder-depois'),
        botaoProximaPergunta: document.querySelector('#bt-proxima'),
        botaoPerguntaPendente: document.querySelector('#bt-pergunta-pendente')
    },

    urlBase: 'https://opentdb.com',
};

jogo = {
    dificuldade: undefined,
    acertos: undefined,
    tentativas: 3,
    perguntasRespondidas: 0,
    categoria: undefined,
    idCategoria: undefined,
    responderDepois: new Object(), 
}

axios.get(`${elementos.urlBase}/api_category.php`).then(response => {
    for (const categoria of response.data.trivia_categories){
        const opt = document.createElement('option');
        opt.appendChild(document.createTextNode(categoria.name));
        elementos.selectCategoria.appendChild(opt);
        elementos.categorias.push({nome: categoria.name, id: categoria.id}); 
    }
});

elementos.botoes.botaoComecar.addEventListener('click', () => {iniciarJogo(); });

const novoJogo = () => {

    elementos.botoes.botaoProximaPergunta.style.display = 'none';
    elementos.botoes.botaoPerguntaPendente.style.display = 'none';
}

const iniciarJogo = () => {
    elementos.telaJogo.style.display = 'flex';
    elementos.telaMenu.style.display = 'none';

    selecionarParametros();
    gerarPergunta(jogo.dificuldade, jogo.idCategoria);
    
    console.log(jogo.categoria)
    
    elementos.textoCategoria.textContent = `Categoria: ${jogo.categoria}`;
    elementos.textoDificuldade.textContent = `Dificuldade: ${jogo.dificuldade}`;

}

const selecionarParametros = () => {
    let idCategoria = null;
    let dificuldade = null;

    if(elementos.selectCategoria.value != " "){
        for(const categoria of elementos.categorias){
            if(elementos.categoria.nome == elementos.selectCategoria.value){
                idCategoria = categoria.id;
            };
        };
    };
    
    if(elementos.selectDificuldade.value != " "){
        dificuldade = elementos.selectDificuldade.value;
    };  
}

const gerarPergunta = (dificuldade, idCategoria) => {

    let urlPergunta = `${elementos.urlBase}/api.php?amount=1`;

    let tradDificuldade = '';

    if(dificuldade == 'facil'){
        tradDificuldade = 'easy';
    }else if(dificuldade == 'medio'){
        tradDificuldade = 'medium';
    }else if(dificuldade == 'dificl'){
        tradDificuldade = 'hard';
    };

    if(dificuldade != null){
        urlPergunta = `${urlPergunta}&difficulty=${tradDificuldade}`;
    }
    if(idCategoria != null){
        urlPergunta = `${urlPergunta}&category=${idCategoria}`;
    }
        
    axios.get(urlPergunta).then(response => {

        let cont = 0;

        let aux1 = JSON.stringify(response.data.results);
        aux1 = aux1.replace(/&quot;/g,'"')
        .replace(/&#039;/g,"'")
        .replace(/\\n/g, "\\n")  
        .replace(/\\'/g, "\\'")
        .replace(/\\"/g, '\\"')
        .replace(/\\&/g, "\\&")
        .replace(/\\r/g, "\\r")
        .replace(/\\t/g, "\\t")
        .replace(/\\b/g, "\\b")
        .replace(/\\f/g, "\\f");
        let aux2 = JSON.parse(aux1);
    
        console.log(aux2);

        for (const item of aux2){
            
            elementos.pergunta.textContent = item.question;
            jogo.categoria = item.category;

            for(const alternativa of item.incorrect_answers){
                elementos.alternativas.push({nome: alternativa, certa: false});
            };

            elementos.alternativas.push({nome: item.correct_answer, certa: true});

            elementos.alternativas = elementos.alternativas.sort(() => Math.random() - 0.5);

            console.log(elementos.alternativas);

            for(const item of elementos.alternativas){
                const div = document.createElement('div');

                const opt = document.createElement('input');
                opt.type = 'radio';
                opt.name = 'alternativa';
                opt.id = `alternativa-${cont}`;
                opt.value = `alternativa-${cont}`;
                opt.class = `ml-5`;

                const text = document.createElement('label');
                text.id = `op-${cont}`;
                text.htmlFor = `alternativa-${cont}`;
                text.appendChild(document.createTextNode(` ${elementos.alternativas[cont].nome}`));

                div.appendChild(opt);
                div.appendChild(text);
                
                elementos.listaAlternativas.appendChild(div);

                cont++;
            };
    
        };       
    });

    
    novoJogo();
}