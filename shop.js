let productDetails = {};
let searchStr = "";
let basket = {};
//Each product is based on a 'card'; a box that contains information about that product.
//You can change the card template here. The [EVEGPRODUCT#] will always be subsituted for 
//the element in the imagesArr (see fruit.js)
//The classes can be styled using CSS
//The adjustDown and adjustUp buttons have their behaviour specified below, but you can change this if you like
//To change the quantity of a product, change the value of the input (with the class of buyInput), you can then recalculate the basket with refreshBasket()
//Or you can adjust the basket object via javascript and call updateQuantityInputs() and refreshBasket()
var cardTemplate = `<div class="shop-product card" data-num="[EVEGPRODUCT#]">
<div class="shop-product-details shop-product-title card__title" data-field="title" data-num="[EVEGPRODUCT#]"></div>
<div class="card__content" data-num="[EVEGPRODUCT#]">
<div class="shop-product-details shop-product-img" data-field="img" data-num="[EVEGPRODUCT#]"></div>
<div class="shop-product-details shop-product-price" data-field="price" data-num="[EVEGPRODUCT#]"></div>
<div style="clear: both;" class="shop-product-details shop-product-units" data-field="units" data-num="[EVEGPRODUCT#]"></div>
<div class="shop-product-buying" data-num="[EVEGPRODUCT#]">
<div><input class="buyInput" data-num="[EVEGPRODUCT#]" min="0" value="0" type="number" style="height: 30px;width: 60px">
<class="adjustDiv"><button class="btn adjustDown">-</button>
<button class="btn adjustUp">+</button></div></div></div></div></div>`;

  function init(){
    const toggleButton = document.getElementsByClassName('toggle-button')[0];
    const hero = document.getElementsByClassName('hero')[0];
    const navbarLinks = document.getElementsByClassName('navbar-links')[0];

    //When the toggle button is pressed (if visible by the screen size, the menu is shown) dont forget <div class="productBasketDiv"><button class="addToBasket">Add to Basket</button>
    toggleButton.addEventListener('click',()=>{
      navbarLinks.classList.toggle('active');
      hero.classList.toggle('menuactive');
    });

    const searchBar = document.getElementsByClassName('search-bar')[0];
    //Show the search bar when the search link is pressed
    document.getElementById('search-link').addEventListener('click',()=>{
      searchBar.classList.toggle('active');
      document.getElementById('searchbox').focus();
    });

    var modal = document.getElementById("contactmyModal");
    
    // Get the button that opens the modal
    var btn = document.getElementById("contactnav");
    
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("contactclose")[0];

    // When the user clicks the button, open the modal 
    btn.onclick = function() {
      modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      modal.style.display = "none";
    }

    //Close the search bar
    document.getElementById('searchbutton').addEventListener('click', ()=>{
      searchStr = document.getElementById('searchbox').value;
      redraw();
    });

    //Close the search bar
    document.getElementById('closesearchbutton').addEventListener('click', ()=>{
      searchStr = "";
      searchBar.classList.remove('active');
      redraw();
    });

    //Close the cookies message
    document.getElementById('acceptCookies').addEventListener('click', ()=>{
      setCookie('cookieMessageSeen', true);
      document.getElementById('cookieMessage').style.display = 'none';
    });

    if(getCookie("cookieMessageSeen") == "true"){
      document.getElementById('cookieMessage').style.display = 'none';
    }
    initProducts(redraw);
  }


  /*
  * When changing the page, you should make sure that each adjust button has exactly one click event
  * (otherwise it might trigger multiple times)
  * So this function loops through each adjustment button and removes any existing event listeners
  * Then it adds another event listener
  */
  function resetListeners(){
    var elements = document.getElementsByClassName("adjustUp");
    var eIn;
    for(eIn = 0; eIn < elements.length; eIn++){
      elements[eIn].removeEventListener("click",increment);
      elements[eIn].addEventListener("click",increment);
    }
    elements = document.getElementsByClassName("adjustDown");
    for(eIn = 0; eIn < elements.length; eIn++){
      elements[eIn].removeEventListener("click",decrement);
      elements[eIn].addEventListener("click",decrement);
    }
    elements = document.getElementsByClassName("buyInput");
    for(eIn = 0; eIn < elements.length; eIn++){
      elements[eIn].removeEventListener("change",inputchange);
      elements[eIn].addEventListener("change",inputchange);
    }
    elements = document.getElementsByClassName("addToBasket");
    for(eIn = 0; eIn < elements.length; eIn++){
      elements[eIn].removeEventListener("click",increment);
      elements[eIn].addEventListener("click",increment);
    }
  }


  //When the input changes, add a 'bought' class if more than one is added
  function inputchange(ev){
    var thisID = ev.target.parentElement.closest(".card__content").getAttribute("data-num");
    changeQuantity(thisID,ev.target.parentElement.closest(".shop-product-buying").getElementsByTagName("input")[0].value);
  }

  /*
  * Change the quantity of the product with productID
  */
  function changeQuantity(productID, newQuantity){
    basket[productID] = newQuantity;
    if(newQuantity == 0)
      delete basket[productID];
    document.querySelector(".buyInput[data-num='"+productID+"']").value = newQuantity;
    refreshBasket();
  }

  //Add 1 to the quantity
  function increment(ev){
    var thisID = ev.target.parentElement.closest(".card__content").getAttribute("data-num");
    if(basket[thisID] === undefined){
      basket[thisID] = 0;
    }
    changeQuantity(thisID,parseInt(basket[thisID])+1);
  }

  //Subtract 1 from the quantity
  function decrement(ev){
    var thisID = ev.target.parentElement.closest(".card__content").getAttribute("data-num");
    if(basket[thisID] === undefined){
      changeQuantity(thisID,0);
    }else{
      if(basket[thisID] > 0){
        changeQuantity(thisID,parseInt(basket[thisID])-1);
      }
    }
  }



// to be done
  function filterFunction(a){
    /*This demonstrates how to filter based on the search term*/
    // if a.type == 'veg':
    //return a.type == 'veg';
    // elif a.type == 'fruit':
    // return a.type == 'fruit';
    // else:
    //return a.name.toLowerCase().includes(searchStr.toLowerCase());

    // actual code
    if(searchStr.toLowerCase()=="veg")
    {return a.type.toLowerCase().includes(searchStr.toLowerCase());}
    else if (searchStr.toLowerCase()== 'fruit')
    {return a.type.toLowerCase().includes(searchStr.toLowerCase());}
    else{return a.name.toLowerCase().includes(searchStr.toLowerCase());}
    
    //If you wanted to just filter based on fruit/veg you could do something like this:
    // return a.type == 'veg';
    // return a.type == 'fruit';
    // return true;
  }

  function sortFunction(a,b){
    return a.price > b.price;
  }

  //Redraw all products based on the card template
  function redraw(){
    
    //Reset the product list (there are possibly more efficient ways of doing this, but this is simplest)
    document.querySelector('.productList').innerHTML = '';

    var shownProducts = productDetails.filter(filterFunction);

    shownProducts.sort(sortFunction);

    var numProducts = shownProducts.length;
    
    for(var i = 0; i < numProducts; i++){
      var cardHTML = cardTemplate.replaceAll("[EVEGPRODUCT#]",shownProducts[i].productID);
      var thisProduct = document.createElement("div");
      thisProduct.innerHTML = cardHTML;
      document.querySelector('.productList').appendChild(thisProduct.firstChild);
    }

    document.querySelectorAll(".shop-product-details").forEach(function(element){
      var field = element.getAttribute("data-field");
      var num = element.getAttribute("data-num");
      switch(field){
        case "title":
          element.innerText = productDetails[num].name;
          break;
        case "img":
          element.innerHTML = "<span class=\"imgspacer\"></span><img src=\"images/"+productDetails[num].image + "\"></img>";
          break;
        case "price":
          element.innerHTML = "<span>£"+(productDetails[num].price/100).toFixed(2)+"</span>";
          break;
        case "units":
          element.innerHTML = "<span>"+productDetails[num].packsize + " " + productDetails[num].units+"</span>";
          break;
      }

    });
    resetListeners();
    updateQuantityInputs();
  }
  
  window.addEventListener("load", init);

  function updateQuantityInputs(){
    for(let buyInput of document.querySelectorAll(".buyInput")){
      let quantity = basket[buyInput.getAttribute("data-num")];
      if(isNaN(quantity))
        quantity = 0;

      buyInput.value = quantity;
    }
  }

  //Recalculate basket
  function refreshBasket(){
    let total = 0;
    for(const productID in basket){
      let quantity = basket[productID];
      let price = productDetails[productID].price;
      total = total + (price * quantity);
    }
    setCookie('basket', JSON.stringify(basket));
    try{
      document.querySelector("#basketNumTotal").innerHTML = (total / 100).toFixed(2);
    }catch(e){
      
    }
    return total;
  }


  var mybutton = document.getElementById("myBtn");

  // When the user scrolls down 20px from the top of the document, show the button
  window.onscroll = function() {scrollFunction()};
  
  // When the user clicks on the button, scroll to the top of the document
  function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }