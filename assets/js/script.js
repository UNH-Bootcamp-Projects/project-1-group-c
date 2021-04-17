let apiKey = "5c51a06114504d42a38134910bd6bd9a";
let googleApi = "AIzaSyClKhFXOi6w6MwKpiSsIlmAEtkTnd9132s";
let userZip;

let hello = $("#test");
console.log(hello[0].textContent)

function getUserLocation () {
    let abstractUrl = `https://ipgeolocation.abstractapi.com/v1/?api_key=${apiKey}`
    fetch(abstractUrl)
        .then(function (response) {
            console.log(response)
            return response.json()
            
        })
            .then(function (data) {
                console.log(data)
                userZip = data.postal_code
                console.log(userZip)
                displayRestaurantsNearMe()
                
                
            })
        }

function displayRestaurantsNearMe () {
    let proxy = "https://ben.hutchins.co/proxy/fetch/"
    let restaurantUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restuarants+in+${userZip}&key=${googleApi}`;
    fetch(`${proxy}${restaurantUrl}`)
        .then(function (response) {
            console.log(response)
            return response.json()
        })
        .then (function (data) {
            console.log(data)
        })
          
            }

getUserLocation();
