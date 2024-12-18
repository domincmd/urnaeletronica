
# Urna Eletrônica Escola Carlitos

Este é um projeto feito por Felipe Domingueti em NodeJS. Este é um manual que explica em detalhe como a urna funciona e como operá-la.

Este repositório contem somente o código fonte do projeto, que pode ser livremente alterado contanto que o autor original seja creditado. Baixe o arquivo compactado que funciona em qualquer computador sem necessidade de baixar outros programas aqui:

[Clique Aqui](https://drive.google.com/drive/folders/1nO5cC_vJ8ygsHDoZS2apqHFM0Tyzsomk?usp=sharing)

## Arquivos

Após baixar a urna, o sistema de arquivos deve se parecer mais ou menos assim na versão open source. Somente os arquivos que importam serão explicados, não se preocupe com os outros, somente são para o funcionamento correto do aplicativo.

- /files
  - candidates.json
  - numbers.json
  - votes.json

- /html
  - error.html
  - success.html
  - verify.html
  - vote.html
- /js
  - verify.js
  - vote.js

- /node_modules
  - um monte de pasta que não precisa se preocupar
- static
  - styles.css

- app.js
- package.lock.json
- package.json

### Pasta files

Esta é a pasta onde os votos, candidatos e números de acesso são guardados em arquivos JSON.

O arquivo candidates.json guarda os candidatos seguindo a seguinte formatação:

`{
    "NÚMERODOCANDIDATO": "NOMEDOCANDIDATO",
    "NCANDIDATO": "NOMECANDIDATO"
}`

Lembre-se de colocar uma vírgula depois de todos os itens, a não ser que seja o último da lista. Isso vale para todos os arquivos.

O arquivo numbers.json guarda os números de identificação necessários para entrar na tela de voto seguindo a seguinte formatação:

`[
    NUMERO,
    NUMERO,
    NUMERO,
    NUMERO
]`

NOTA: Os números não são atualizados. No começo da execução do programa, este simplesmente lê o arquivo e guarda os números temporáriamente, excluindo os já usados. Apos o fim da execução do programa, os números NÃO são atualizados.

O arquivo votes.json apresenta os votos dos candidatos na seguinte formatação:

`{
  "NOMEDOCANDIDATO": QUANTIDADEDEVOTOS,
  "NOMEDOCANDIDATO": QUANTIDADEDEVOTOS
}`

Note que a quantidade de votos não apresenta vírgulas, pois se trata de um número (um `integer`, para os mais chegados). Não é recomendado colocar vírgulas. Apesar de <b>teoricamente</b> funcionar, não foi testado tão bem.

NOTA: Sempre que o programa conta um voto pela primeira vez, este conta que os votos do candidato são 0, e reescreve os valores do arquivo, então sempre que forem utilizar a urna, tenham cautela em relação a isso. Caso seja necessária uma mudança, contate o programador.

### Arquivo node_modules.zip

Este arquivo contém os módulos do nodejs e PRECISA SER EXTRAIDA PARA O FUNCIONAMENTO DO PROGRAMA.

## Iniciar o programa

### Versão Open-Source

Na versão open-source, ter o NodeJS instalado é necessário para o funcionamento do programa. Se este já estiver em bom funcionamento no computador, tudo o que se precisa fazer é entrar no diretório mãe do programa e entrar no cmd (windows) ou bash, cmd, como for chamado na sua distro (linux).

NOTA: PowerShell Não funciona (pelo menos na máquina do criador) por algum motivo...

Após entrar, digite

`node app.js`

Isso fará o programa funcionar e com sorte uma mensagem assim aparecerá: 

`Listening on port: 5000`

Nesse caso, a porta é 5000, então é necessário entrar no seguinte URL por um browser:

`localhost:5000`

Isso abrirá o programa.

### Versão compactada

TEXTO AQUI

## Funcionamento do Programa

Esta seção detalha o funcionamento do programa, para que os assistentes consigam diagnosticar algum problema mais fácilmente.

### Sistema de números

Assim que o programa começa, ele inicializa de acordo com o arquivo numbers.json números que necessitam de ser colocados para acessar a tela de votação. O sistema funciona assim:

1. O número é colocado pelo usuário
2. O número é checado pelo servidor
3. Em caso de erro, o programa automaticamente redireciona o usuário para uma tela de erro.
3. Em caso de acerto, o programa remove o número de sua lista (mas não da lista real do arquivo)
4. O programa te redireciona para a tela de votos

### Redirecionamento para a tela de votos

Aqui, acontece um sistema de autenticação para que seja impossível (ou bem difícil sob supervisão) votar duas vezes. Esse sistema é deveras complicado, então fique atento.

1. O sistema recebe o pedido de redirecionar para a tela de votos, e adiciona um número aletório de 0 a 255 à uma lista com o nome codes.
2. O sistema redireciona o usuário para a tela de votos utilizando um query key cujo valor é o número adicionado.
3. O sistema, ao receber o pedido, checa se o número realmente está na lista codes, e, se sim, deixa o usuário entrar
3. Caso o número não esteja presente, o usuário é redirecionado à uma tela de erro com o nome de Token Expirado.
4. O código é removido da lista em 60 segundos, tempo que o usuário tem para votar.
5. Assim que o botão de voto é apertado, o sistema verifica se o código ainda está presente na lista e, caso afirmativo, confirma o voto e retira-o da lista.
5. Caso negativo, uma tela de erro com a mesma mensagem aparece.

### Contagem de Votos

ESCREVER ALGUMA COISA AQUI
