import { loadStripe } from '@stripe/stripe-js';
import { placeOrder } from './apiService';
import { CardWidget } from './CardWidget';

export async function initStripe() {
    try {
        const stripe = await loadStripe('pk_test_51Oac5DSF6QlI3fJFiBUzY1ZPdgaIvXCOXXHdBTfFk2fOKloJ5NfJBfzWXFbMLMCluG3Fo60echSiAgTGeoTqFMcm00Tkstsg40');
        const elements = stripe.elements();
        let card = elements.create('card');

        const paymentType = document.querySelector('#paymentType');
        if (!paymentType) {
            return;
        }

        function mountCard() {
            card.mount('#card-element');
        }

        paymentType.addEventListener('change', (e) => {
            if (e.target.value === 'card') {
                // Display Widget
                card = new CardWidget(stripe);
                card.mount('#card-element');
            } else {
                card.destroy();
            }
        });

        // Ajax call
        const paymentForm = document.querySelector('#payment-form');
        if (paymentForm) {
            paymentForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                if (!card || !card.mounted) {
                    // Handle the situation where the card is not available or not mounted
                    let formData = new FormData(paymentForm);
                    let formObject = {};
                    for (let [key, value] of formData.entries()) {
                        formObject[key] = value;
                    }
                    placeOrder(formObject);
                    return;
                }

                try {
                    const result = await stripe.createPaymentMethod({
                        type: 'card',
                        card: card,
                    });
                    
                    if (result.error) {
                        console.error("Error creating PaymentMethod:", result.error);
                        // Handle the error more gracefully, e.g., display an error message to the user
                    } else {
                        formObject.paymentMethodId = result.paymentMethod.id;
                        placeOrder(formObject);
                    }
                    placeOrder(formObject);
                } catch (error) {
                    console.error("Error creating Stripe token:", error);
                    // Handle the error more gracefully, e.g., display an error message to the user
                }
            });
        }
    } catch (error) {
        console.error("Error in Stripe initialization:", error);
        // Handle the error or throw it again based on your requirement.
    }
}
