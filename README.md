# Node with Express server REST API

## Installation

- `git clone https://github.com/ItsVuong/vendtech-be-api.git`
- `cd vendtech-be-api`
- `npm install`
- `npm start`

## Routes
[Postman file](./vendtech.postman_collection.json)
### Category
    - Get category
        - Method: GET
        - /api/category
        - Params: 
            - pageSize: number (Get all category if pageSize = 0)
            - currentPage: number

    - Get category by id
        - Method: GET
        - /api/category/:id

    - Delete category
        - Path: /api/category/:id
        - Method: DELETE
        - header: { authorization: ACCESS_TOKEN }

    - Create category 
        - Path: /api/category
        - Method: POST
        - body: { name: String, description: String, fileName: image file }
        - header: { content-type: multipart/form-data, authorization: ACCESS_TOKEN }

    - Update category
        - Path: /api/category/:id
        - Method: POST
        - body: { name: String, description: String, fileName: image file } (all fields are optional)
        - header: { content-type: multipart/form-data, authorization: ACCESS_TOKEN }

### Product
    - Get product
        - Path: /api/product
        - Method: GET
        - Params: 
            - pageSize: number (Get all product if pageSize = 0)
            - currentPage: number
            - category: String (category id)

    - Delete product
        - Path: /api/product/:id
        - Method: DELETE

    - Create product 
        - Path: /api/product
        - Method: POST
        - headers: { content-type: multipart/form-data, authorization: ACCESS_TOKEN }
        - body: { fileName: files (multiple), mainImage: file (single), name: string, description: string, category: string (optional) }

    - Update product
        - Path: /api/product/:id
        - Method: POST
        - headers: { content-type: multipart/form-data, authorization: ACCESS_TOKEN }
        - body: { fileName: files (multiple), mainImage: file (single), deletedImages: string (image ids), name: string, description: string, category: string }

### Food and drink category
    - Get
        - Method: GET
        - /api/food-drink-category
        - Params: 
            - pageSize: number (Get all category if pageSize = 0)
            - currentPage: number

    - Delete
        - Path: /api/food-drink-category/:id
        - Method: DELETE
        - header: { authorization: ACCESS_TOKEN }

    - Create 
        - Path: /api/food-drink-category
        - Method: POST
        - body: { name: String, description: String, fileName: image file }
        - header: { content-type: multipart/form-data, authorization: ACCESS_TOKEN }

    - Update
        - Path: /api/food-drink-category/:id
        - Method: POST
        - body: { name: String, description: String, fileName: image file } (all fields are optional)
        - header: { content-type: multipart/form-data, authorization: ACCESS_TOKEN }

### Food and drink
    - Get
        - Path: /api/food-drink
        - Method: GET
        - Params: 
            - pageSize: number (Get all items if pageSize = 0)
            - currentPage: number
            - category: String (category id)

    - Delete
        - Path: /api/food-drink/:id
        - Method: DELETE

    - Create product 
        - Path: /api/food-drink
        - Method: POST
        - headers: { content-type: multipart/form-data, authorization: ACCESS_TOKEN }
        - body: { fileName: file, name: string, description: string, category: string (optional) }

    - Update product
        - Path: /api/food-drink/:id
        - Method: POST
        - headers: { content-type: multipart/form-data, authorization: ACCESS_TOKEN }
        - body: { fileName: file, name: string, description: string, category: string }

### Guest information
    - Get 
        - Path: /api/guestInfo
        - Method: GET
        - headers: { authorization: ACCESS_TOKEN }
        - Params: 
            - pageSize: number (Get all guest info if pageSize = 0)
            - currentPage: number

    - Create guest info
        - Path: /api/guestInfo
        - Method: POST
        - body: { firstName, lastName, email, phoneNumber, message }

    - Delete guest info
        - Path: /api/guestInfo/:id
        - Method: DELETE
        - headers: { authorization: ACCESS_TOKEN }

### User
    - Get user by username
        - Path: /api/user/:username
        - Method: GET
        - headers: { authorization }

    - Get user all users
        - Path: /api/user/
        - Method: GET
        - Params: { pageSize, currentPage }
        - headers: { authorization }

    - Create user
        - Path: /api/user
        - Method: POST
        - body: { username, password, email }

    - Update user
        - Path: /api/user/update
        - Method: POST
        - headers: { authorization }
        - body: { confirmPassword (old password), newPassword (optional), newUsername (optional) }

    - Authenticate user
        - Path: /api/user/authenticate
        - Method: POST
        - body: { username, password }

### Reset password
    - Get reset token
        - Path: reset-password/:email
        - Method: GET

    - Reset password
        - Path: reset-password/
        - Method: POST
        - body: { userId, token, password }