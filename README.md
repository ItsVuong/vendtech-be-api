# Node with Express server REST API

## Installation

- `git clone https://github.com/ItsVuong/vendtech-be-api.git`
- `cd vendtech-be-api`
- `npm install`
- `npm start`
- optional: include _.env_ in your _.gitignore_

## Routes
[a relative link](./vendtech.postman_collection.json)
### Category
    - Get category
        - Method: GET
        - /api/category
        - Params: 
            - pageSize: number (Get all category if pageSize = 0)
            - currentPage: number

    - Delete category
        - Path: /api/category/:id
        - Method: DELETE
        - header: { authorization: ACCESS_TOKEN }

    - Create category 
        - Path: /api/category
        - Method: POST
        - body: { name: String }
        - header: { authorization: ACCESS_TOKEN }

    - Update category
        - Path: /api/category/:id
        - Method: POST
        - body: { name: String }
        - header: { authorization: ACCESS_TOKEN }

### Product
    - Get product
        - Path: /api/product
        - Method: GET
        - Params: 
            - pageSize: number (Get all product if pageSize = 0)
            - currentPage: number

    - Delete product
        - Path: /api/product/:id
        - Method: DELETE

    - Create product 
        - Path: /api/product
        - Method: POST
        - headers: { content-type: multipart/form-data, authorization: ACCESS_TOKEN }
        - body: { fileName: file, name: string, description: string, category: string (optional) }

    - Update product
        - Path: /api/product/:id
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
    - Create user
        - Path: /api/user
        - Method: POST
        - body: { username, password, email }

    - Authenticate user
        - Path: /api/user/authenticate
        - Method: POST
        - body: { username, password }
