class CheckoutSystem {
  constructor(marketplace) {
      this.marketplace = marketplace;
      this.initializeCheckoutModal();
  }

  initializeCheckoutModal() {
      const checkoutModal = this.createCheckoutModal();
      document.body.appendChild(checkoutModal);
      this.attachCheckoutEventListeners(checkoutModal);
  }

  createCheckoutModal() {
      const modal = document.createElement('div');
      modal.id = 'advanced-checkout-modal';
      modal.className = 'fixed inset-0 bg-black bg-opacity-70 z-[200] hidden flex items-center justify-center';
      modal.innerHTML = `
          <div class="bg-[#0f1923] rounded-xl p-8 w-full max-w-md mx-4 border-2 border-red-500">
              <h2 class="text-3xl font-bold mb-6 text-center text-red-500">Secure Checkout</h2>
              
              <form id="checkout-form" class="space-y-4">
                  <div class="grid grid-cols-2 gap-4">
                      <input type="text" name="firstName" placeholder="First Name" required 
                          class="w-full p-3 bg-[#1f2933] text-white rounded focus:outline-none focus:ring-2 focus:ring-red-500">
                      <input type="text" name="lastName" placeholder="Last Name" required 
                          class="w-full p-3 bg-[#1f2933] text-white rounded focus:outline-none focus:ring-2 focus:ring-red-500">
                  </div>
                  
                  <input type="email" name="email" placeholder="Email Address" required 
                      class="w-full p-3 bg-[#1f2933] text-white rounded focus:outline-none focus:ring-2 focus:ring-red-500">
                  
                  <input type="tel" name="phone" placeholder="Phone Number" required 
                      class="w-full p-3 bg-[#1f2933] text-white rounded focus:outline-none focus:ring-2 focus:ring-red-500">
                  
                  <div class="bg-[#1f2933] p-4 rounded">
                      <h3 class="text-xl mb-4 text-red-400">Payment Method</h3>
                      <div class="space-y-2">
                          <label class="flex items-center">
                              <input type="radio" name="paymentMethod" value="credit" required 
                                  class="mr-2 text-red-500 focus:ring-red-500">
                              Credit Card
                          </label>
                          <label class="flex items-center">
                              <input type="radio" name="paymentMethod" value="paypal" 
                                  class="mr-2 text-red-500 focus:ring-red-500">
                              PayPal
                          </label>
                          <label class="flex items-center">
                              <input type="radio" name="paymentMethod" value="crypto" 
                                  class="mr-2 text-red-500 focus:ring-red-500">
                              Cryptocurrency
                          </label>
                      </div>
                  </div>
                  
                  <div id="order-summary" class="bg-[#1f2933] p-4 rounded">
                      <h3 class="text-xl mb-4 text-red-400">Order Summary</h3>
                      <div id="checkout-cart-items"></div>
                      <div class="mt-4 font-bold text-right">
                          Total: <span id="checkout-total">$0</span>
                      </div>
                  </div>
                  
                  <div class="flex items-center">
                      <input type="checkbox" id="terms" required 
                          class="mr-2 text-red-500 focus:ring-red-500">
                      <label for="terms" class="text-sm">I agree to the terms and conditions</label>
                  </div>
                  
                  <button type="submit" class="w-full bg-red-500 text-white p-3 rounded hover:bg-red-600 transition-colors">
                      Complete Purchase
                  </button>
              </form>
          </div>
      `;
      return modal;
  }

  attachCheckoutEventListeners(modal) {
      const checkoutBtn = document.getElementById('checkout-btn');
      const form = modal.querySelector('#checkout-form');

      // Open checkout modal
      checkoutBtn.addEventListener('click', () => {
          this.updateOrderSummary();
          modal.classList.remove('hidden');
      });

      // Close modal when clicking outside
      modal.addEventListener('click', (e) => {
          if (e.target === modal) {
              modal.classList.add('hidden');
          }
      });

      // Form submission
      form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.processOrder(new FormData(form));
      });
  }

  updateOrderSummary() {
      const cartItems = document.getElementById('checkout-cart-items');
      const checkoutTotal = document.getElementById('checkout-total');

      // Clear previous items
      cartItems.innerHTML = '';

      // Add current cart items
      this.marketplace.cart.forEach(account => {
          const itemDiv = document.createElement('div');
          itemDiv.className = 'flex justify-between mb-2';
          itemDiv.innerHTML = `
              <span>${account.name}</span>
              <span>$${account.price}</span>
          `;
          cartItems.appendChild(itemDiv);
      });

      // Update total
      const total = this.marketplace.cart.reduce((sum, account) => sum + account.price, 0);
      checkoutTotal.textContent = `$${total}`;
  }

  processOrder(formData) {
      // Simulate order processing
      const orderDetails = {
          firstName: formData.get('firstName'),
          lastName: formData.get('lastName'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          paymentMethod: formData.get('paymentMethod'),
          accounts: this.marketplace.cart,
          total: this.marketplace.cart.reduce((sum, account) => sum + account.price, 0)
      };

      // In a real-world scenario, you'd send this to a backend API
      console.log('Processing Order:', orderDetails);

      // Simulate successful order
      this.showOrderConfirmation(orderDetails);
  }

  showOrderConfirmation(orderDetails) {
      // Create a modal for order confirmation
      const confirmationModal = document.createElement('div');
      confirmationModal.className = 'fixed inset-0 bg-black bg-opacity-70 z-[300] flex items-center justify-center';
      confirmationModal.innerHTML = `
          <div class="bg-[#0f1923] rounded-xl p-8 w-full max-w-md mx-4 border-2 border-green-500 text-center">
              <h2 class="text-3xl font-bold mb-4 text-green-500">Order Confirmed!</h2>
              <p class="mb-4">Thank you, ${orderDetails.firstName} ${orderDetails.lastName}!</p>
              <p class="mb-4">Your Valorant accounts will be delivered to ${orderDetails.email}</p>
              <p class="font-bold text-red-400">Total Paid: $${orderDetails.total}</p>
              <button id="close-confirmation" class="mt-4 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
                  Close
              </button>
          </div>
      `;

      document.body.appendChild(confirmationModal);

      // Close button
      confirmationModal.querySelector('#close-confirmation').addEventListener('click', () => {
          // Reset marketplace
          this.marketplace.cart = [];
          this.marketplace.updateCart();
          
          // Remove modals
          document.getElementById('advanced-checkout-modal').classList.add('hidden');
          document.body.removeChild(confirmationModal);
      });
  }
}

// Extend the existing ValorantMarketplace class to include checkout
ValorantMarketplace.prototype.initializeCheckout = function() {
  this.checkoutSystem = new CheckoutSystem(this);
};

// Initialize the marketplace with checkout
const marketplace = new ValorantMarketplace();
marketplace.initializeCheckout();