let productUnitCost = 0;
let productCount = 0;
let productCurrency = "";
let subtotal = 0;
let shippingPercentage = 0.15;
let total = 0;
let paymentTypeSelected = false;
let PESO_SYMBOL = "UYU ";
const CREDIT_CARD_PAYMENT = "Tarjeta de crédito";
const BANKING_PAYMENT = "Transferencia bancaria";
let ERROR_MSG = "Ha habido un error :(, verifica qué pasó.";

//Función que se utiliza para actualizar los costos de publicación
function updateTotalCosts(){

}

function updateSubtotal(){

    productCount =  document.getElementById("articleCountInput").value;
    var subtotal = productUnitCost*productCount;

    document.getElementById("subtotal").innerHTML = subtotal;

}

function showPaymentTypeNotSelected(){

}

function hidePaymentTypeNotSelected(){

}

function showArticles(articles){

        
    let htmlContentToAppend = "";
    for(let i = 0; i < articles.length; i++){
        let article = articles[i];

            htmlContentToAppend += `
            <a>
                <div class="row">
                    <table>
                    <tbody>
                    <tr>
                    <td></td>
                    <th>Nombre</th>
                    <th>Costo</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                  </tr>
                  <tr>
                  <td> <img src="` + article.src + `" alt="` + article.name + `" style="width:50px;height:50px;"></td>
                  <td>` + article.name + `</td>
                  <td>` + article.currency + " " + article.unitCost +`</td>
                  <td><input type="number" class="form-control" id="articleCountInput" onclick="updateSubtotal()" placeholder="" required="" value="` + article.count + `" min="0"></td>
                  <td><strong id="SubtotalText">`+ PESO_SYMBOL + subtotal +`</strong></td>
                  </tr>
                         </tbody>
                    </table>
                </div>
                <hr class="mb-4">
            </a>
            `
        }

        document.getElementById("cart-list-container").innerHTML = htmlContentToAppend;

}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(CART_INFO_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            showArticles(resultObj.data.articles);
        }
    });
});