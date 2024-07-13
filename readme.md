# Office Meal Management System

Live URL: [https://office-meal-management.web.app](https://office-meal-management.web.app)

Github Client URL: [Github Client](https://github.com/Nurmurad32/office-meal-management-client)
Github Server URL: [Github Sever](https://office-meal-management.web.app)

## Frontend Technology:
- React
- Redux
- Axios
- TanStack Query
- Tailwind CSS
- Daisy UI
- React Icon

## Backend Technology:
- Node
- Express
- MongoDB
- Mongoose
- JWT-based Authentication (stored in cookie)

## Features:
1. **Authentication**
   - Sign-In Page (email and password)
   - JWT-based Authentication
   - Banned Users cannot log in and will see a prompt indicating they are banned.
   
2. **User Management Page (Admins Only)**
   - Add Users
   - Data Table with Filters (Search, Pagination)
   - Roles: Admin and General Users
   - Admins can update and ban users.
   - Banned users cannot log in to the system.
   
3. **Item Management Page (Admins Only)**
   - Add and Delete Items
   - Items include food categories like:
     - Chicken Curry (Protein)
     - Rice (Starch)
     - Fish Curry (Protein)
     - Egg Curry (Protein)
     - Egg Bhorta
     - Potato Bhorta (Veg)
     - Daal
     - Begun Bhaji (Veg)
     
4. **Meal Management Page (Admins Only)**
   - Set Meals for 5 days a week.
   - Each Meal will have a set number of items.
   - Meal Constraints:
     1. A meal must have a rice item to be complete.
     2. A meal must have at least 3 items to be complete.
     3. A meal cannot have two protein sources at a time.
   - Schedule meals for specific days (e.g., a meal with rice, chicken curry, and daal available only on Sundays).
   - The same meal can only be repeated a maximum of two days in a week.
   
5. **Meal Order Page (General Users)**
   - View weekly meal schedules.
   - Select and update meal choices for each day.
   - Cannot modify meals for previous days (e.g., on Tuesday, cannot change meals for Sunday and Monday).
   - Schedule meals for an entire month.
   - Option to select "No Meal" for any day.
   
6. **Meal Schedule Page (Admins Only)**
   - View meal choices for every user.
   - General users cannot access this page.

## Project Installation:
1. Clone the project:
    ```bash
    git clone https://github.com/yourusername/your-repo-name.git
    ```
2. Navigate to the project directory:
    ```bash
    cd your-repo-name
    ```
3. Install dependencies:
    ```bash
    npm install
    ```

## ER Diagram:

### Entity Descriptions

**User**
- `name`: String
- `email`: String (unique, required)
- `contact`: String
- `role`: String (required) (e.g., Admin, General User)
- `status`: String (required) (e.g., Active, Banned)
- `password`: String (required)

**Item**
- `email`: String (required)
- `itemName`: String (required)
- `itemContain`: String (required) (e.g., Protein, Starch, Veg)

**SetMeal**
- `date`: Date (required)
- `riceItem`: String (required)
- `items`: Array of Strings (required)
- `email`: String (required)

**SetMyMeal**
- `mealStatus`: String (required) (e.g., Yes, No)
- `date`: Date (required)
- `riceItem`: String
- `items`: Array of Strings
- `email`: String (required)

### Relationships
- Admin User can manage Users (Admins only).
- Admin User can manage Items (Admins only).
- Admin User can set SetMeal (Admins only).
- General User can set their own meals in SetMyMeal.


