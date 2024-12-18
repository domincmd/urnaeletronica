function fetchData(url, method, body = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    return fetch(url, options)
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
        });
}

function vote(number) {
    if (/^\d+$/.test(number) || number == "white" || number == "null") { //that's a valid vote formatting, doesn't mean it's in the list
        const urlParams = new URLSearchParams(window.location.search);
        const providedCode = urlParams.get('key');
        fetchData('/vote', 'POST', {number: number, code: providedCode})
            .then(response => {
                if (response["status"] == true) {
                    window.location.href = "/success"
                }else {
                    if (response["error"] == "Candidato inexistente.") {
                        alert("Candidato Inexistente. Tente novamente.")
                        document.getElementById("number").value = ""
                        return;
                    }
                    window.location.href = "/error?error=" + response["error"]
                }
            })
    }else{
        console.log("invalid vote")
        alert("invalid vote")
    }
}