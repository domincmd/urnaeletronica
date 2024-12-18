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

function verify(number) {
    if (isNaN(number)) {
        alert("Invalid Number")
        return;
    }
    fetchData('/verify', 'POST', {number: number})
        .then(data => {
            console.log(data)
            if (data.status == false) {
                window.location.href = "/error?error=" + data.error
            }else{
                const code = data.code
                window.location.href = "/vote?key="+code
            }
            
        });
    
}