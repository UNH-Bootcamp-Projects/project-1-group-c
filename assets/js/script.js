let apiKey = "5c51a06114504d42a38134910bd6bd9a";
let googleApi = "AIzaSyClKhFXOi6w6MwKpiSsIlmAEtkTnd9132s";
let userZip;
let userCuisine;
let theList = document.querySelector("#listRest");
let searchButton = document.getElementById("searchButton");
let modal = document.querySelector("#myModal");
let closeButton = document.querySelector(".close");
let locations = []; //Array to store the longitude and latitude of each restaurant in the list
let restaurantUrl = '';


closeButton.addEventListener("click",function() {

    modal.style.display ="none";         
})

searchButton.addEventListener("click", function (event) {
    event.preventDefault();
    userZip = $("#findlocate").val()
    userCuisine = $("#findtext").val()
    if (userZip < 0 || userZip === "" || userZip.length !== 5) {
        modal.style.display = "block"; 
        return;        
    
    }
    getRestaurantsNearMe();
})
historyButton.addEventListener("click", function (event) {
    event.preventDefault();
    userZip = $("#selectlocate").val()
    userCuisine = $("#selecttext").val()
    console.log(userZip)
    if (userZip < 0 || userZip === "" || userZip === "Select a Zip Code from the list..." || userZip === null) {
        getUserLocation()
        
    }
    getRestaurantsNearMe();
})

function getUserLocation() {
    let abstractUrl = `https://ipgeolocation.abstractapi.com/v1/?api_key=${apiKey}`
    fetch(abstractUrl)
        .then(function (response) {
            console.log(response)
            return response.json()
        })
        .then(function (data) {
            console.log(data)
            userZip = data.postal_code
            getRestaurantsNearMe()
        })
}

function getRestaurantsNearMe() {
    let proxy = "https://ben.hutchins.co/proxy/fetch/"
    if (userCuisine) {
        restaurantUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${userCuisine}+restuarants+in+${userZip}&key=${googleApi}&`;
    }
    else {
        restaurantUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restuarants+in+${userZip}&key=${googleApi}&`;
    }

    fetch(`${proxy}${restaurantUrl}`)
        .then(function (response) {
            console.log(response)
            return response.json()
        })
        .then(function (data) {
            console.log(data)
            $("#listRest").empty();
            locations = [];
            // loop through restaurant data  with if statement to account for closed businesses
            for (let i = 0; i < data.results.length; i++) {

                if (data.results[i].business_status === "OPERATIONAL") {
                    // this block here creates the li and  attaches to the empty <ul> in the html.
                    let listElement = document.createElement('li');
                    listElement.classList.add("list-group-item");
                    listElement.id = "list" + i;
                    theList.appendChild(listElement);

                    //   this block here is what creates a dynamic ul and attaches it to the dynamic li
                    let newList = document.querySelector("#list" + i);
                    let restaurantList = document.createElement('ul');
                    restaurantList.classList.add("restListClass");
                    restaurantList.id = "restList" + i;
                    newList.append(restaurantList);

                    // this  block here creates the restaurant list dynamically.
                    let theRestaurant = document.querySelector("#restList" + i);
                    let restName = labels[i] + " - " + data.results[i].name;
                    let address = data.results[i].formatted_address;
                    let priceLevel = data.results[i].price_level;
                    let rating = data.results[i].rating;
                    let openNow;
                    if (data.results[i].opening_hours) {
                        openNow = data.results[i].opening_hours.open_now;
                    }

                    let restLat = data.results[i].geometry.location.lat;
                    let restLng = data.results[i].geometry.location.lng;

                    locations.push({ lat: restLat, lng: restLng })
                    mylat = restLat
                    mylon = restLng

                    let listName = document.createElement("h5");
                    let listAddress = document.createElement('li')
                    let listPriceLevel = document.createElement("li");
                    let listRating = document.createElement("li");
                    let listOpenNow = document.createElement("li");
                    listName.textContent = " " + restName;
                    listAddress.textContent = " " + address;
                    listRating.textContent = `Rating: ${rating}`
                    if (data.results[i].opening_hours) {
                        if (openNow == true) {
                            listOpenNow.textContent = "Open Now"
                        } else {
                            listOpenNow.textContent = "Closed"
                        }
                    }
                    if (priceLevel === undefined) {
                        listPriceLevel.style.display = ("none");
                    }
                    else if (priceLevel == '1') {
                        priceLevel = '$'
                    }
                    else if (priceLevel == '2') {
                        priceLevel = '$$'
                    }
                    else if (priceLevel == '3') {
                        priceLevel = '$$$'
                    }
                    else if (priceLevel == '4') {
                        priceLevel = '$$$$'
                    }
                    else if (priceLevel == '5') {
                        priceLevel = '$$$$$'
                    }

                    listPriceLevel.textContent = "Price Level: " + priceLevel;
                    theRestaurant.appendChild(listName);
                    theRestaurant.appendChild(listAddress);
                    theRestaurant.appendChild(listPriceLevel);
                    theRestaurant.appendChild(listRating);
                    theRestaurant.appendChild(listOpenNow);
                }
            }
            initMap()
            saveZipCodeSearch()
            saveFoodSearch()
        })
}

function saveFoodSearch() {

    let matchFound = false
    foodList = JSON.parse(localStorage.getItem("foodList"));
    if (!foodList) {
        localStorage.setItem("foodList", JSON.stringify(""));
        foodList = []
    }
    if (foodList) {
        for (let i = 0; i <= foodList.length; i++) {
            if (foodList[i] == userCuisine) {
                matchFound = true
                break;
            }
        }
        if (!matchFound) {
            foodList.push(userCuisine)
            localStorage.setItem("foodList", JSON.stringify(foodList));
        }
    }
    loadFoodList()
}


function saveZipCodeSearch() {

    let matchFound = false
    zipCodeList = JSON.parse(localStorage.getItem("zipCodeList"));
    if (!zipCodeList) {
        localStorage.setItem("zipCodeList", JSON.stringify(""));
        zipCodeList = []
    }
    if (zipCodeList) {
        for (let i = 0; i <= zipCodeList.length; i++) {
            if (zipCodeList[i] == userZip) {
                matchFound = true
                break;
            }
        }
        if (!matchFound) {
            zipCodeList.push(userZip)
            localStorage.setItem("zipCodeList", JSON.stringify(zipCodeList));
        }
    }

    loadZipCodeList()
}
//code to load the saved cities from localstorage into the options of the select input
function loadFoodList() {
    $("#selecttext").empty();
    $('#selecttext').append($('<option value="" disabled selected >Select a Cuisine Type from the list...</option>'))
    foodList = JSON.parse(localStorage.getItem("foodList"));
    if (foodList) {
        for (let i = 0; i <= foodList.length; i++) {
            $('#selecttext').append($('<option>', {
                value: foodList[i],
                text: foodList[i]
            }));
        }
    }

};

//code to load the saved cities from localstorage into the options of the select input
function loadZipCodeList() {
    $("#selectlocate").empty();
    $('#selectlocate').append($('<option value="" disabled selected >Select a Zip Code from the list...</option>'))
    zipCodeList = JSON.parse(localStorage.getItem("zipCodeList"));
    if (zipCodeList) {
        for (let i = 0; i <= zipCodeList.length; i++) {
            $('#selectlocate').append($('<option>', {
                value: zipCodeList[i],
                text: zipCodeList[i]
            }));
        }
    }

};
loadZipCodeList();
loadFoodList();
getUserLocation();


