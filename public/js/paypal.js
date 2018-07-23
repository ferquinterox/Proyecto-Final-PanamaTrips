// Helper functions
    function getElements(el) {
        return Array.prototype.slice.call(document.querySelectorAll(el));
    }

    function hideElement(el) {
        document.body.querySelector(el).style.display = 'none';
    }

    function showElement(el) {
        document.body.querySelector(el).style.display = 'block';
    }

    // Listen for changes to the radio fields

    getElements('input[name=payment-option]').forEach(function(el) {
        el.addEventListener('change', function(event) {

            // If PayPal is selected, show the PayPal button

            if (event.target.value === 'paypal') {
                hideElement('#card-button-container');
                showElement('#paypal-button-container');
            }

            // If Card is selected, show the standard continue button

            if (event.target.value === 'card') {
                showElement('#card-button-container');
                hideElement('#paypal-button-container');
            }
        });
    });

    // Hide Non-PayPal button by default

    hideElement('#card-button-container');

    // Render the PayPal button

    paypal.Button.render({

        env: 'sandbox',

        client: {
            sandbox:    'AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R',
            production: '<insert production client id>'
        },

        style: {
            label: 'pay',
            size:  'small',
            shape: 'pill',
            color: 'gold'
        },

        commit: true,

        payment: function (data, actions) {
            var precio = parseFloat(document.getElementById('precio').innerHTML).toFixed(2);;
            var cantidad = document.getElementById('cantidadper').value;
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
                      name: 'hat',
                      description: 'Brown hat.',
                      quantity: cantidad,
                      price: precio,
                      tax: '0',
                      sku: '1',
                      currency: 'USD'
                    }
                  ]
                }
              }],
              note_to_payer: 'Contactenos en caso de que salga algun inconveniente.'
            });
          },
          

        onAuthorize: function(data, actions) {
            return actions.payment.execute().then(function() {
                window.alert('Pago completado!');
            });
        }

    }, '#paypal-button-container');