
    function getElements(el) {
        return Array.prototype.slice.call(document.querySelectorAll(el));
    }

    function hideElement(el) {
        document.body.querySelector(el).style.display = 'none';
    }

    function showElement(el) {
        document.body.querySelector(el).style.display = 'block';
    }

    // Busca cambios en los radio button

    getElements('input[name=payment-option]').forEach(function(el) {
        el.addEventListener('change', function(event) {

            // Si escoge paypal muestra paypal

            if (event.target.value === 'paypal') {
                hideElement('#card-button-container');
                showElement('#paypal-button-container');
            }

            // Si escoge tarjeta sale tarjeta

            if (event.target.value === 'card') {
                showElement('#card-button-container');
                hideElement('#paypal-button-container');
            }
        });
    });

    // Esconde el boton por tarjetas por default

    hideElement('#card-button-container');

    // Renderizado del boton de paypal

    paypal.Button.render({

        env: 'sandbox',
        //Cuentas de prueba y Produccion de Paypal
        client: {
            sandbox:    'AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R',
            production: '<insert production client id>'
        },
        //Estilo del boton
        style: {
            label: 'pay',
            size:  'small',
            shape: 'pill',
            color: 'gold'
        },

        commit: true,

        //Configuracion de lo que se va a comprar
        payment: function (data, actions) {
            var nombre_act = $('#nombre').val();
            var descripcion = $('#descripcion').val();
            var precio = parseFloat(document.getElementById('precio').innerHTML).toFixed(2);;
            var cantidad =$('#cantidadper').val();
            console.log("precio: " + precio + "cantidad: " + cantidad);
            var impuesto = (precio * cantidad) * 0.07;
            impuesto = +impuesto.toFixed(2);
            var total_price = (precio * cantidad) + impuesto;
            total_price = +total_price.toFixed(2);
            console.log("impuesto: " + impuesto + "Precio total: " + total_price);
            return actions.payment.create({
              transactions: [{
                amount: {
                  total: total_price,
                  currency: 'USD',
                  details: {
                    subtotal: precio*cantidad,
                    tax: impuesto
                  }
                },
                description: 'Reservación para la actividad u oferta',
                //invoice_number: '12345', Insert a unique invoice number
                payment_options: {
                  allowed_payment_method: 'INSTANT_FUNDING_SOURCE'
                },
                item_list: {
                  items: [
                    {
                      name: nombre_act,
                      description: descripcion,
                      quantity: cantidad,
                      price: precio,
                      tax: '0',
                      currency: 'USD'
                    }
                  ]
                }
              }],
              note_to_payer: 'Contactenos en caso de que salga algun inconveniente.'
            });
          },
          
        //Lo que retorna al comprar la oferta
        onAuthorize: function(data, actions) {
            return actions.payment.execute().then(function() {
                window.alert('Pago completado!');
            });
        }

    }, '#paypal-button-container');