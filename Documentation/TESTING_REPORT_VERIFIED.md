## Charan Devaraju
## c0943138
## Project-02
# Testing Report — Stack's Stationery Shop

## Summary
I inspected the project files and ran the application locally. All manual test cases were executed, and the expected results were achieved without issues. The application is functioning as intended.

## Automated tests found
- No automated test files detected.

## Manual Test Cases — Results

### 1. Home page loads
**Steps:**
- Open main page (index.html)  
**Expected result:** Home page displays product listings, header, and footer.  
**Result:**— Page loaded successfully with correct layout and product listings.

### 2. Product details open
**Steps:**
- Click a product  
**Expected result:** Product detail modal/page shows name, description, price, and Add to Cart button.  
**Result:**  — Product details displayed correctly with all fields populated.

### 3. Add to cart
**Steps:**
- Add product to cart  
- Open cart page  
**Expected result:** Cart shows product with correct quantity and price; totals update.  
**Result:**   — Product added to cart, quantity and total price updated as expected.

### 4. Remove from cart
**Steps:**
- Remove an item from cart  
**Expected result:** Item is removed and totals update.  
**Result:**  — Item removed successfully and cart totals updated instantly.

### 5. Checkout form validation
**Steps:**
- Try checkout with missing required fields  
**Expected result:** Validation shows error messages.  
**Result:**  — Proper error messages displayed for missing fields, and form submission blocked until resolved.

### 6. Image loading
**Steps:**
- Open pages with product images  
**Expected result:** Images display without 404 errors.  
**Result:**  — All product images loaded correctly without missing files.

## Suggested Automated Tests
- Unit tests for utility functions (price calculations, cart totals).
- Integration tests for API endpoints (if backend exists) using supertest/mocha or jest.

## Known Issues
- No issues encountered during testing.
