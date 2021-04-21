let apiKey = "5c51a06114504d42a38134910bd6bd9a";
let googleApi = "AIzaSyClKhFXOi6w6MwKpiSsIlmAEtkTnd9132s";
let userZip;
let theList = document.querySelector("#listRest");
let restaurant;
let restaurantArray = []; // currently not being used
let newArray = []; // currently not being used
let searchButton = document.getElementById("searchButton");

searchButton.addEventListener("click", function(event) {
    event.preventDefault();
    userZip = $("#findlocate").val()
    getRestaurantsNearMe();
    console.log(userZip)

})

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
                getRestaurantsNearMe()
                
                
            })
        }

function getRestaurantsNearMe () {
    let proxy = "https://ben.hutchins.co/proxy/fetch/"
    let restaurantUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restuarants+in+${userZip}&key=${googleApi}&`;



    fetch(`${proxy}${restaurantUrl}`)
        .then(function (response) {
            console.log(response)
            return response.json()
        })
        .then (function (data) {
            console.log(data)
            
            $("#listRest").empty();

            for (let i = 0; i < data.results.length; i++) {

                /* with using the forloop that was already created.   I added the if statement so to 
                account for businesses that were closed.  Reason being is that the openNow variable would
                crash when the business is not operational.  opening_hours.open_now doesnt exist on the close 
                businesses.*/
                if(data.results[i].business_status === "OPERATIONAL") {

                    
                    
                    // this block here creates the li and  attaches to the empty <ul> in the html.
                    let listElement = document.createElement('li');
                    listElement.classList.add("list-group-item")
                    // listElement.classList.add("listElementClass");
                    listElement.id = "list" + i;
                    theList.appendChild(listElement);  

                    
    
                //   this block here is what creates a dynamic ul and attaches it to the dynamic li
                    let newList = document.querySelector("#list" + i);
                    let restaurantList = document.createElement('ul');
                    restaurantList.classList.add("restListClass");
                    restaurantList.id = "restList" + i;
                    newList.append(restaurantList);

                    
                    
                    /* And this  block here is finally where all the list we see is created.
                    This part creates the li elements then attactes the text content pulled from the api 
                    then attacthes all that to the dynamic li element. */
                    let theRestaurant = document.querySelector("#restList" + i);
                    let restName = data.results[i].name;
                    let address = data.results[i].formatted_address;
                    let priceLevel = data.results[i].price_level;
                    let rating = data.results[i].rating; 
                    let openNow = data.results[i].opening_hours.open_now;
                
                 
                    // here is the long and lat elements but havent figured out how to save to array yet
                    let restLat = data.results[i].geometry.location.lat;
                    let restLng = data.results[i].geometry.location.lng; 

                    let listName = document.createElement("h5");
                    let listAddress = document.createElement('li')
                    let listPriceLevel = document.createElement("li");
                    let listRating = document.createElement("li");
                    let listOpenNow = document.createElement("li");

                    listName.textContent = " " + restName;
                    listAddress.textContent = " " + address;
                    listPriceLevel.textContent = "Price Level: " + priceLevel;
                    listRating.textContent = `Rating: ${Math.round(data.results[i].rating)}`
                    if (openNow == true) {
                        listOpenNow.textContent = "Open Now"
                    } else {
                        listOpenNow.textContent = "Closed"
                    }

                    if (priceLevel === undefined) {
                        listPriceLevel.style.display = ("none");
                    }
                    
                    // listOpenNow.textContent = "Open: " + openNow;

                  


                    theRestaurant.appendChild(listName);
                    theRestaurant.appendChild(listAddress);
                    theRestaurant.appendChild(listPriceLevel);
                    theRestaurant.appendChild(listRating);
                    theRestaurant.appendChild(listOpenNow);

                    
                    
               }

            //    if (openNow === true) {
            //        listOpenNow.textContent = "Open Now"
            //    } else {
            //        listOpenNow.textContent = "Closed"
            //    }
               
         }
        

         
           
          })
          
        }

    
        
getUserLocation();


