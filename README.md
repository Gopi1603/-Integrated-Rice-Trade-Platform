# **Rice Trade Platform – Assignment 2: Full Stack Development**

## **Overview**
This assignment involves developing a multi-role mobile application that connects **verified rice millers (sellers)** with **bulk buyers**, and integrates **lorry logistics** for order fulfillment. The app should demonstrate clear communication between the **seller**, **buyer**, and **logistics**.

## **Objective:**
- **API development & integration** (for Full Stack roles)
- **Clear communication between apps** (seller → buyer → logistics)

## **Tech Stack:**
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL
- **API testing**: Postman (API collection link shared below)

## **App Modules to Build:**
### **1. Seller App (Rice Mill)**:
- **Login/Register**: Basic details + Rice Mill Name, City, Location (GPS)
- **Add Product**: Product type, quantity in tons, price/ton
- **Edit Product**: Option to update stock or pricing
- **Mark Available**: When ready to sell
- **Dashboard**: Show current stock & order status

### **2. Buyer App**:
- **Login**: Name, phone
- **Search**: Product type & quantity
- **Show Rice Mills Nearby**: Display price, commission, and transport cost
- **Display Rice Mill as Anonymous**: Show rice mills as `[District Name] Rice Mill #N`
- **Bid Option**: Buyer can enter bid price
- **Bid Notification to Sellers**: Notify sellers whose price range matches
- **Auto Acceptance**: If price meets seller’s minimum price, system auto-accepts
- **Proceed to Payment**: Mock payment
- **Order Summary Page**

### **3. Lorry (Logistics) Integration Simulation**:
- **Notify Logistic Partner**: Notify nearby lorry agencies integrated in the system
- **Driver Accepts Job**: Logistics agency receives order and confirms
- **Enter Lorry Number & GPS**: Lorry updates vehicle number and GPS tracking
- **Seller OTP Verification**: Before pickup, seller gives OTP to confirm identity of lorry driver
- **Buyer Confirms Delivery**: Once delivered, buyer confirms via app

## **API Endpoints Completed**:
### **Auth Module**:
1. **Auth – Register**: `/auth/register`  
   Method: POST  
   Route: `src/routes/auth.js → src/controllers/authController.js`

2. **Auth – Login**: `/auth/login`  
   Method: POST  
   Route: `src/routes/auth.js → src/controllers/authController.js`

3. **Auth – Me**: `/auth/me`  
   Method: GET  
   Route: `src/routes/auth.js → src/controllers/authController.js`

### **Seller Module**:
1. **Seller – Create Profile**: `/sellers/profile`  
   Method: POST  
   Route: `src/routes/sellers.js → src/controllers/sellersController.js`

2. **Seller – Get My Profile**: `/sellers/profile`  
   Method: GET  
   Route: `src/routes/sellers.js → src/controllers/sellersController.js`

3. **Seller – Add Product**: `/sellers/{sellerId}/products`  
   Method: POST  
   Route: `src/routes/sellers.js → src/controllers/sellersController.js`

4. **Seller – List Products**: `/sellers/{sellerId}/products`  
   Method: GET  
   Route: `src/routes/sellers.js → src/controllers/sellersController.js`

5. **Seller – Update Product**: `/sellers/{sellerId}/products/{productId}`  
   Method: PATCH  
   Route: `src/routes/sellers.js → src/controllers/sellersController.js`

### **Buyer Module**:
1. **Buyer – Register**: `/auth/register`  
   Method: POST  
   Route: `src/routes/auth.js → src/controllers/authController.js`

2. **Buyer – Login**: `/auth/login`  
   Method: POST  
   Route: `src/routes/auth.js → src/controllers/authController.js`

3. **Buyer – Search Products**: `/products/search?type=&qty=&lat=&lng=`  
   Method: GET  
   Route: `src/routes/products.js → src/controllers/productController.js`

4. **Buyer – Place Bid**: `/bids`  
   Method: POST  
   Route: `src/routes/bids.js → src/controllers/bidController.js`

5. **Buyer – Get Orders**: `/buyers/{buyerId}/orders`  
   Method: GET  
   Route: `src/routes/buyers.js → src/controllers/orderController.js`

6. **Buyer – Mock Payment**: `/orders/{orderId}/pay`  
   Method: POST  
   Route: `src/routes/orders.js → src/controllers/orderController.js`

### **Logistics Module**:
1. **Logistics – Get Nearby Partners**: `/logistics/nearby?lat=&lng=`  
   Method: GET  
   Route: `src/routes/logistics.js → src/controllers/logisticsController.js`

2. **Logistics – Assign Partner**: `/logistics/{partnerId}/assign`  
   Method: POST  
   Route: `src/routes/logistics.js → src/controllers/logisticsController.js`

3. **Logistics – Partner Accepts Assignment**: `/logistics/assignments/{assignmentId}/accept`  
   Method: POST  
   Route: `src/routes/logistics.js → src/controllers/logisticsController.js`

4. **Logistics – Update Assignment**: `/logistics/assignments/{assignmentId}`  
   Method: PATCH  
   Route: `src/routes/logistics.js → src/controllers/logisticsController.js`

5. **Logistics – Confirm Delivery**: `/logistics/{orderId}/confirm`  
   Method: POST  
   Route: `src/routes/logistics.js → src/controllers/logisticsController.js`

## **File Structure**:

- **`/src`**: Contains all source files (controllers, routes, middleware)
  - **`/controllers`**: Business logic for all modules (auth, sellers, buyers, products, bids, logistics)
  - **`/routes`**: Defines API routes (auth.js, sellers.js, products.js, etc.)
  - **`/middleware`**: Authentication and token verification middleware
  - **`/config`**: Database configuration (e.g., `db.js`)

- **`/node_modules`**: Dependencies (automatically created by `npm install`)

- **`/package.json`**: Project dependencies and scripts

## **How to Run the API Locally**:

1. Clone the repository and navigate to the project folder:
   ```bash
   npm install
   npm run dev
    ```

## Postman Collection Link:
You can access the Postman collection for testing the API here:
[Rice Trade Platform Postman Collection](https://www.postman.com/testers-4133/workspace/rice/collection/35025804-5b28a759-1ae1-4dba-bad9-dadf8320cccb?action=share&creator=35025804)

