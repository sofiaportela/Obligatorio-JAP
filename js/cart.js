let productUnitCost = 0;
let productCurrency = "";
let subtotal = 0;
let shippingPercentage = 0.15;
let total = 0;
let paymentTypeSelected = false;
let PESO_SYMBOL = "UYU ";
let PERCENTAGE_SYMBOL = '%';
const CREDIT_CARD_PAYMENT = "Tarjeta de crédito";
const BANKING_PAYMENT = "Transferencia bancaria";
let ERROR_MSG = "Ha habido un error :(, verifica qué pasó.";
let PAYMENT_ERROR_MSG = "Por favor, selecciona una forma de pago.";
let BANKING_INCOMPLETE_ERROR_MSG = "Ingresa los datos de tu Transferencia bancaria"
let CREDIT_INCOMPLETE_ERROR_MSG = "Ingresa los datos de tu Tarjeta de crédito"

//Función que se utiliza para actualizar los costos de la compra
function updateTotalCosts(){

    productCount =  document.getElementById("articleCountInput").value;
    var subtotal = productUnitCost*productCount;
    var total = (shippingPercentage*subtotal) + subtotal;
    document.getElementById("totalCostText").innerHTML = PESO_SYMBOL + total;
    document.getElementById("shippingComissionText").innerHTML = PESO_SYMBOL + (Math.round(subtotal*shippingPercentage));

}


function updateSubtotal(){

    productCount =  document.getElementById("articleCountInput").value;
    var subtotal = productUnitCost*productCount;
    document.getElementById("subtotal").innerHTML = PESO_SYMBOL + subtotal;
    document.getElementById("SubtotalText").innerHTML = PESO_SYMBOL + subtotal;

}

function showPaymentTypeNotSelected(){ 
    document.getElementById("payment").innerHTML = paymentTypeSelected;

}

function hidePaymentTypeNotSelected(){
    //Si selecciono Tarjeta de crédito se anula el campo de Transferencia bancaria
    if (document.getElementById("creditCardPaymentRadio").checked === true) {
        document.getElementById("bankAccountNumber").setAttribute("disabled", true);
    }
    else {
        document.getElementById("bankAccountNumber").removeAttribute("disabled");
    }

    //Si selecciono Transferencia bancaria se anulan los campos de Tarjeta de crédito
    if (document.getElementById("bankingRadio").checked === true) {
        document.getElementById("creditCardNumber").setAttribute("disabled", true);
        document.getElementById("creditCardSecurityCode").setAttribute("disabled", true);
        document.getElementById("dueDate").setAttribute("disabled", true);
    }
    else {
        document.getElementById("creditCardNumber").removeAttribute("disabled");
        document.getElementById("creditCardSecurityCode").removeAttribute("disabled");
        document.getElementById("dueDate").removeAttribute("disabled");
    }
}

function showArticles(articles){

        
    let htmlContentToAppend = "";
    for(let i = 0; i < articles.length; i++){
        let article = articles[i];
        productUnitCost = article.unitCost;

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
                  <td><input type="number" class="form-control" id="articleCountInput" placeholder="" required="" value="` + article.count + `" min="0"></td>
                  <td><strong id="subtotal">`+ PESO_SYMBOL + subtotal +`</strong></td>
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
            updateSubtotal();
            updateTotalCosts();
        }

        document.getElementById("articleCountInput").addEventListener("change", function(){
            productCount = this.value;
            updateSubtotal();
            updateTotalCosts();
            
        });

        document.getElementById("premiumradio").addEventListener("change", function(){
            shippingPercentage = 0.15;
            updateTotalCosts();
        });
        
        document.getElementById("expressradio").addEventListener("change", function(){
            shippingPercentage = 0.07;
            updateTotalCosts();
        });
    
        document.getElementById("standardradio").addEventListener("change", function(){
            shippingPercentage = 0.05;
            updateTotalCosts();
        });     
        
        document.getElementById("bankingRadio").addEventListener("change", function(){
            paymentTypeSelected = BANKING_PAYMENT;
            hidePaymentTypeNotSelected();
            showPaymentTypeNotSelected()
        });

        document.getElementById("creditCardPaymentRadio").addEventListener("change", function(){
            paymentTypeSelected = CREDIT_CARD_PAYMENT
            hidePaymentTypeNotSelected();
            showPaymentTypeNotSelected()
        });

    });

    
    //Se obtiene el formulario de publicación de producto
    var cartForm = document.getElementById("cart-info");

    //Se agrega una escucha en el evento 'submit' que será
    //lanzado por el formulario cuando se seleccione 'Finalizar compra'.
    cartForm.addEventListener("submit", function(e){

        let calle = document.getElementById("NombreCalle");
        let esquina = document.getElementById("NombreEquina");
        let numero = document.getElementById("NumeroDePuerta");
        let numdecuenta = document.getElementById("bankAccountNumber");
        let numdetarjeta = document.getElementById("creditCardNumber");
        let codigoseg = document.getElementById("creditCardSecurityCode");
        let vencimiento = document.getElementById("dueDate");
        let infoMissing = false;

        //Quito las clases que marcan como inválidos
        calle.classList.remove('is-invalid');
        esquina.classList.remove('is-invalid');
        numero.classList.remove('is-invalid');
        numdecuenta.classList.remove('is-invalid');
        numdetarjeta.classList.remove('is-invalid');
        codigoseg.classList.remove('is-invalid');
        vencimiento.classList.remove('is-invalid');

        //Se realizan los controles necesarios,
        //En este caso se controla que se haya ingresado la calle, la esquina y el número de puerta
        //Consulto por la calle
        if (calle.value === "")
        {
            calle.classList.add('is-invalid');
            infoMissing = true;
        }
        
        //Consulto por la esquina
        if (esquina.value === "")
        {
            esquina.classList.add('is-invalid');
            infoMissing = true;
        }

        //Consulto por el número de puerta
        if (numero.value <=0)
        {
            numero.classList.add('is-invalid');
            infoMissing = true;
        }



        //Cuando la forma de pago es Transferencia bancaia consulto por número de cuenta
        if (paymentTypeSelected === BANKING_PAYMENT && numdecuenta.value === "")
        {
            numdecuenta.classList.add('is-invalid');
            infoMissing = true;
            window.alert("Completa los datos de tu Transferencia bancaria");
        }

        //Cuando la forma de pago es Tarjeta de crédito consulto por número de tarjeta, código de seguridad y vencimiento
        if (paymentTypeSelected === CREDIT_CARD_PAYMENT && numdetarjeta.value === "")
        {
            numdetarjeta.classList.add('is-invalid');
            infoMissing = true;
        }

        if (paymentTypeSelected === CREDIT_CARD_PAYMENT && codigoseg.value === "")
        {
            codigoseg.classList.add('is-invalid');
            infoMissing = true;
        }

        if (paymentTypeSelected === CREDIT_CARD_PAYMENT && vencimiento.value === "")
        {
            vencimiento.classList.add('is-invalid');
            infoMissing = true;
        }

        if (paymentTypeSelected === CREDIT_CARD_PAYMENT && (vencimiento.value === "" || codigoseg.value === "" || numdetarjeta.value === ""))
        {
            window.alert("Completa los datos de tu Tarjeta de crédito");
        }

        
        if(!infoMissing)
        {
            //Aquí ingresa si pasó los controles, irá a enviar
            //la solicitud para realizar la compra.

            getJSONData(CART_BUY_URL).then(function(resultObj){
                let msgToShowHTML = document.getElementById("resultSpan");
                let msgToShow = "";
    
                //Si la compra fue exitosa, devolverá mensaje de éxito,
                //de lo contrario, devolverá mensaje de error.
                if (resultObj.status === 'ok')
                {
                    msgToShow = resultObj.data.msg;
                }
                else if (resultObj.status === 'error')
                {
                    msgToShow = ERROR_MSG;
                }

                if (paymentTypeSelected === false)
                {
                    msgToShow = PAYMENT_ERROR_MSG;
                }
                else {
                    msgToShow = resultObj.data.msg;
                }

                bootbox.alert(msgToShow, null);
            });
        }

        //Esto se debe realizar para prevenir que el formulario se envíe (comportamiento por defecto del navegador)
        if (e.preventDefault) e.preventDefault();
            return false;
    });
});
