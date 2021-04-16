let apiKey = "5c51a06114504d42a38134910bd6bd9a"

function getUserLocation () {
    let abstractUrl = `https://ipgeolocation.abstractapi.com/v1/?api_key=${apiKey}`
    fetch(abstractUrl)
        .then(function (response) {
            response.json().then(function (data) {
                console.log(data)
            })
        })
}

getUserLocation();