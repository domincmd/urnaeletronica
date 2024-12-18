const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const { privateDecrypt } = require('crypto');


const app = express();
let codes = [] //security codes
let whiteVotes = 0



const allowedNumbers = JSON.parse(fs.readFileSync(path.join(__dirname, "files/numbers.json"), "utf-8")); // Read all of the file
console.log("Loaded allowed Numbers:" + allowedNumbers);

const candidates = fs.readFileSync(path.join(__dirname, "files/candidates.json"), "utf-8"); //this returns [object Object], and without the JSON.parse, the actual contents of the dict
console.log("Loaded candidates:" + candidates);


let numbersLeft = [...allowedNumbers]; // This array will be modified

// Middleware setup
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use(express.json());

const PORT = 5000;





app.get("/", (req, res) => {
    if (numbersLeft.length == 0) {
        console.log("Fim da execução.")
        res.send("Fim da execução. Não existem mais códigos a serem usados.")
        console.log(global.votes)

        let highestNumberOfVotes = [[], 0]; // [Candidates with highest votes, vote count]

        for (const candidate in global.votes) {
            const numberOfVotes = global.votes[candidate];

            if (numberOfVotes > highestNumberOfVotes[1]) {
                // New highest votes, reset tie tracking
                highestNumberOfVotes = [[candidate], numberOfVotes];
            } else if (numberOfVotes === highestNumberOfVotes[1]) {
                // Add to the tie list
                highestNumberOfVotes[0].push(candidate);
            }
        }

        if (highestNumberOfVotes[0].length > 1) {
            console.log("É um empate entre: " + highestNumberOfVotes[0].join(", "));
        } else {
            const winner = highestNumberOfVotes[0][0];
            global.votes[winner] += whiteVotes; // Add white votes to the winner
            console.log(`O vencedor é: ${winner} com ${global.votes[winner]} votos (incluindo votos em branco)`);
        }

        console.log("Votos finais: ", global.votes);

        return;
    }
    res.sendFile(path.join(__dirname, "html/verify.html"));
});

app.post("/verify", (req, res) => {
    const number = req.body.number;

    if (numbersLeft.includes(number)) {
        numbersLeft.splice(numbersLeft.indexOf(number), 1); // Remove the number
        console.log("Número verificado e removido:", number);

        // Send the vote.html file directly
        const newCode = Math.round(Math.random()*255)
        codes.push(newCode)

        res.json({code: newCode, status: true, error: null})

        setTimeout(() => {
            codes.splice(codes.indexOf(newCode), 1) //remove the code after s1 time
        }, 60000)
    } else {
        console.log("Número já utilizado ou inválido.");
        res.json({status: false, code: null, error: "Número já utilizado ou inválido."})
    }
});

app.get("/vote", (req, res) => {
    const providedCode = req.query.key

    if (codes.includes(parseInt(providedCode))) {
        res.sendFile(path.join(__dirname, "html/vote.html"))
        
    }else{
        console.log("Token não fornecido")
        res.redirect("/error?error=Token não fornecido.")
    }
})

app.post("/vote", (req, res) => {
    const providedVote = req.body.number;
    const providedCode = req.body.code;

    console.log("Código: " + providedCode)

    
    //checkar se o token ta expirado
    if (!codes.includes(parseInt(providedCode))) {
        console.log("Token Expirado")
        res.send({status: false, error: "Token Exspirado."})
        return;
    }

    // parsar direito sapoha
    const cleanCandidates = JSON.parse(candidates.replace(/'/g, '"')); //declaring this here works

     //define global votes before white and null so that even if all votes are white and null it is still defined
    if (!global.votes) {
        global.votes = {}
        Object.entries(cleanCandidates).forEach(([number, candidate]) => {
            global.votes[candidate] = 0
        })
    }

    if (providedVote == "white") { //dar para o vencedor
        whiteVotes += 1
        console.log("Voto branco")
        res.send({status: true, error: null})
        return;
    }else if (providedVote == "null") {
        console.log("Voto nulo") //invalidar
        res.send({status: true, error: null})
        return;
    }

    
    
    
    // Log the cleaned candidates object for debugging
    console.log("Candidatos depois de analisados:", cleanCandidates);
    
    // Log the vote key being looked up
    console.log("Chave a ser procurada:", providedVote.toString());
    
    // Access the value from the candidates object
    const candidate = cleanCandidates[providedVote.toString()];

    

    

    if (candidate == undefined || !candidate in global.votes) { //check if candidates exist
        console.log("Candidato inexistente.")
        res.send({status: false, error: "Candidato inexistente."})
        return;
    } 

    console.log("Candidate found:", candidate);

    
    
    global.votes[candidate] = parseInt(global.votes[candidate])+1

    fs.writeFile(path.join(__dirname, "files/votes.json"), JSON.stringify(global.votes, null, 2), (err) => {
        if (err) {
            console.log("Erro: " + err)
            res.status(403).send({status: false, error: err})
        }else{
            res.send({status: true, error: null})
        }
    });

    console.log(global.votes)

    codes.splice(codes.indexOf(providedCode), 1) //remove this from here...

});

app.get("/success", (req, res) => {
    res.sendFile(path.join(__dirname, "html/success.html"))
})

app.get("/error", (req, res) => {
    res.sendFile(path.join(__dirname, "html/error.html"))
})


// Serve JS files
app.get("/js/verify.js", (req, res) => {
    res.sendFile(path.join(__dirname, "js/verify.js"));
});

app.get("/js/vote.js", (req, res) => {
    res.sendFile(path.join(__dirname, "js/vote.js"));
});

app.get("/static", (req, res) => {
    res.sendFile(path.join(__dirname, "/static/styles.css"))
})

app.listen(PORT, () => {
    console.log("Listening on port: " + PORT);
});

