# Recipes CRUD API

API REST de recetas con CRUD completo y autenticación JWT

## Características principales
- CRUD completo de recetas
- Autenticación JWT con refresh tokens
- Roles de usuario (user / admin)
- Soft Delete con posibilidad de restauración
- Paginación en listados
- Rate limiting en rutas sensibles
- Limpieza automática de datos demo mediante Cron Jobs

## Tecnologías
- NodeJS
- Express
- MongoDB
- Mongoose
- JWT
- BCrypt
- Cron

## Instalación
```Bash
git clone https://github.com/VeGgExPlay/recipes-api-demo
cd recipes-api-demo
npm install
```

## Ejecutar el proyecto
```Bash
node server.js
```

## Variables de entorno
Crea un archivo llamado ".env" en la raíz del proyecto con las siguientes variables (Nunca subas el archivo `.env` al repositorio):
```
PORT                =   3000
MONGO_URI           =   mongodb://localhost:2701/db
JWT_SECRET          =   supersecret
JWT_REFRESH_SECRET  =   supersecretrefresh
```

## Autenticación
- La API utiliza JWT para la autenticación y el refresco de sesión
- El token de autenticación se crea y envía mediante el body de la respuesta. Este token es enviado por el cliente devuelta al servidor a través de el header de Authorization de la petición como se muestra en el siguiente ejemplo:
```JSON
"Authorization": "Bearer <token>"
```
- El token de refresco se actualiza automáticamente en la Cookie HttpOnly del cliente cuando se necesita refrescar la sesión del mismo. Ejemplo:
```JSON
"Set-Cookie": "refreshToken=<token>; HttpOnly; Max-Age=2592000; SameSite=Lax; Path=/;"
```

## Usuarios demo
La API permite crear usuarios de tipo demo para pruebas públicas.

- Los usuarios demo pueden crear y modificar únicamente recursos demo.
- Los datos demo se eliminan automáticamente mediante un cron job.
- Los administradores pueden visualizar y restaurar recursos eliminados.

## Soft Delete
Los recursos no se eliminan físicamente de la base de datos.
En su lugar, se marcan como eliminados mediante los campos:

- isDeleted
- deletedAt

Esto permite:
- Restaurar recursos
- Auditoría básica
- Diferenciar comportamiento entre usuarios normales y administradores

## Tareas programadas (Cron)
La API utiliza cron jobs para tareas automáticas:

- Eliminación periódica de usuarios demo
- Limpieza de refresh tokens expirados

Estas tareas se ejecutan automáticamente mientras la aplicación está activa.

## Rate Limiting
La API implementa rate limiting para prevenir abuso:

- Rutas de autenticación tienen un límite estricto
- Rutas generales tienen un límite más flexible

## Notas
- Esta API no incluye frontend.
- Está diseñada para ser consumida por aplicaciones cliente.
- El proyecto está orientado a fines educativos y de portafolio.

## Endpoints

### **Ruta Principal:**
/api/v1/

### AUTENTICACIÓN

### Register
- **Ruta:**
[POST] /auth/register
- **Descripción:**
Registra a un nuevo usuario
- **Auth:**
No
- **Headers:**
```JSON
"Content-Type": "application/json"
```
- **Body:**
```JSON
{
    "username": "usuario",
    "password": "contraseña del usuario"
}
```
- **Respuesta:**
[STATUS: 201]
```JSON
{
    "success": true,
    "message": "Registro de usuario exitoso"
}
```

### Login
- **Ruta:**
[POST] /auth/login
- **Descripción:**
Recibe las credenciales del usuario, devuelve un token de autenticación, establece el token de refresco en la cookie y guarda ese mismo token de refresco en la base de datos en la varaible de tipo array del usuario "refreshTokens"
- **Auth:**
No
- **Headers:**
```JSON
"Content-Type": "application/json"
```
- **Body:**
```JSON
{
    "username": "usuario",
    "password": "contraseña del usuario"
}
```
- **Respuesta:**
[STATUS: 200]
```JSON
{
    "success": true,
    "message": "Login exitoso",
    "data": "token"
}
```

### Logout
- **Ruta:**
[POST] /auth/logout
- **Descripción:**
Cierra la sesión del usuario eliminando el token de refresco de la cookie y su referencia en la base de datos del mismo
- **Auth:**
No
- **Headers:**
```JSON
"Cookie": "refreshToken=<token>"
```
- **Body:**
No
- **Respuesta:**
[STATUS: 204]

### Refresh
- **Ruta:**
[POST] /auth/refresh
- **Descripción:**
Actualiza el token de refresco cuando el token de autenticación ha expirado recibiendo la petición de hacerlo desde el frontend, elimina el viejo token de refresco del registro del usuario en la base de datos y añade el nuevo token de refresco a la misma.
- **Auth:**
No
- **Headers:**
```JSON
"Cookie": "refreshToken=<token>"
```
- **Body:**
No
- **Respuesta:**
[STATUS: 200]
```JSON
{
    "success": true,
    "message": "Refresh exitoso",
    "data": "Nuevo token de autenticación"
}
```

### USUARIO

### Perfil
- **Ruta:**
[GET] /user/profile
- **Descripción:**
Devuelve información del usuario junto a la cantidad de recetas creadas
- **Auth:**
Sí
- **Headers:**
```JSON
"Authorization": "Bearer <token>"
```
- **Body:**
No
- **Respuesta:**
[STATUS: 200]
```JSON
{
    "success": true,
    "message": "Perfil consultado con éxito",
    "data": {
        "username": "username",
        "totalRecipes": 0
    }
}
```

### Actualizar perfil
- **Ruta:**
[PATCH] /user/profile
- **Descripción:**
Actualiza el nombre de usuario por otro proporcionado en el body de la petición.
- **Auth:**
Sí
- **Headers:**
```JSON
"Content-Type": "application/json",
"Authorization": "Bearer <token>"
```
- **Body:**
```JSON
{
    "username": "nuevo nombre de usuario"
}
```
- **Respuesta:**
[STATUS: 200]
```JSON
{
    "success": true,
    "message": "Perfil actualizado"
}
```

### Obtener a todos los usuarios (ADMIN)
- **Ruta:**
[GET] /user?page=1&limit=10
- **Descripción:**
Devuelve un array de objetos con los datos de todos los usuarios existentes, que sean demos, incluyendo a los que han sido Soft Deleted.
- **Auth:**
Sí
- **Headers:**
```JSON
"Authorization": "Bearer <token>"
```
- **Body:**
No
- **Respuesta:**
[STATUS: 200]
```JSON
{
    "success": true,
    "message": "Usuarios recuperados con éxito",
    "data": [
        {
            "_id": "00000000000000000000",
            "username": "username",
            "isDemo": true,
            "role": "user",
            "createdAt": "2025-12-21T02:52:25.705Z",
            "updatedAt": "2025-12-24T03:07:33.261Z",
            "__v": 0,
            "isDeleted": true,
            "deletedAt": "2025-12-24T03:04:58.975Z"
        }
    ]
}
```

### Actualizar datos de un usuario (ADMIN)
- **Ruta:**
[PATCH] /user/:id
- **Descripción:**
Actualiza los datos de un usuario cualquiera a los proporcionados en el body de la request. Puede reestablecer a un usuario que haya sido Soft Deleted modificando el valor de la variable "isDeleted"
- **Auth:**
Sí
- **Headers:**
```JSON
"Content-Type": "application/json",
"Authorization": "Bearer <token>"
```
- **Body:**
```JSON
{
    "username": "nuevo nombre de usuario",
    "isDeleted": false
}
```
- **Respuesta:**
[STATUS: 200]
```JSON
{
    "success": true,
    "message": "Usuario actualizado con éxito"
}
```

### Eliminar a un usuario (ADMIN)
- **Ruta:**
[DELETE] /user/:id
- **Descripción:**
Elimina a un usuario aplicando un Soft Delete que puede ser revertido posteriormente en la ruta anteriormente mencionada.
- **Auth:**
Sí
- **Headers:**
```JSON
"Authorization": "Bearer <token>"
```
- **Body:**
No
- **Respuesta:**
[STATUS: 200]
```JSON
{
    "success": true,
    "message": "Usuario eliminado con éxito"
}
```

### RECETAS

### Obtener todas las recetas
- **Ruta:**
[GET] /recipe?page=1&limit=10
- **Descripción:**
Recupera todas las recetas que no estén Soft Deleted de manera resumida. Los admins pueden recuperar todas las recetas incluyendo las Soft Deleted.
- **Auth:**
Opcional
- **Headers:**
```JSON
"Authorization": "Bearer <token>"
```
- **Body:**
No
- **Respuesta:**
[STATUS: 200]
```JSON
{
    "success": true,
    "message": "Recetas recuperadas",
    "data": {
        "recipes": [
        {
            "_id": "0000000000000000",
            "title": "Título de la receta",
            "createdBy": "ID del usuario",
            "createdAt": "2025-12-27T03:10:44.077Z"
        }
        ],
        "pagination": {
            "page": 1,
            "limit": 10,
            "total": 0,
            "totalPages": 1,
            "hasNextPage": false,
            "hasPrevPage": false
        }
    }
}
```

### Obtener una receta
- **Ruta:**
[GET] /recipe/:id
- **Descripción:**
Recupera todos los detalles de una receta que no haya sido Soft Deleted a través de su id. Los admins pueden recuperar recetas Soft Deleted.
- **Auth:**
Opcional
- **Headers:**
```JSON
"Authorization": "Bearer <token>"
```
- **Body:**
No
- **Respuesta:**
[STATUS: 200]
```JSON
{
    "success": true,
    "message": "Receta recuperada con éxito",
    "data": {
        "_id": "0000000000000000000000",
        "title": "Título de la receta",
        "description": "Descripción de la receta",
        "ingredients": [
            {
                "ingredient": "Lechuga",
                "quantity": 14,
                "unitType": "g",
                "_id": "00000000000000000000"
            },
            {
                "ingredient": "Arroz",
                "quantity": 500,
                "unitType": "g",
                "_id": "00000000000000000000"
            },
            {
                "ingredient": "Agua",
                "quantity": 350,
                "unitType": "ml",
                "_id": "00000000000000000000"
            }
        ],
        "cookTimeInSeconds": 60,
        "averageRating": 0,
        "createdBy": "ID del usuario",
        "createdAt": "2025-12-27T03:10:44.077Z",
        "updatedAt": "2025-12-28T04:43:04.824Z",
        "__v": 0
    }
}
```

### Crear una nueva receta
- **Ruta:**
[POST] /recipe
- **Descripción:**
Crea una nueva receta vinculada al usuario actual donde todos los campos del body de la request son obligatorios.
- **Auth:**
Sí
- **Headers:**
```JSON
"Content-Type": "application/json",
"Authorization": "Bearer <token>"
```
- **Body:**
```JSON
{
    "title": "Título de la receta",
    "description": "Descripción de la receta",
    "ingredients": [
        {
            "ingredient": "Ingrediente 1",
            "quantity": 0,
            "unitType": "g / ml / unit"
        },
        {
            "ingredient": "Ingrediente 2",
            "quantity": 0,
            "unitType": "g / ml / unit"
        }
    ],
    "cookTimeInSeconds": 0
}
```
- **Respuesta:**
[STATUS: 201]
```JSON
{
    "success": true,
    "message": "Receta creada con éxito",
    "data": {
        "_id": "0000000000000000000",
        "title": "Título de la receta",
        "createdAt": "2025-12-27T03:10:44.077Z"
    }
}
```

### Actualizar los datos de una receta
- **Ruta:**
[PATCH] /recipe/:id
- **Descripción:**
Actualiza los campos de una receta que no haya sido Soft Deleted por unos nuevos provenientes del body de la request. Todos los campos son opcionales, sin embargo, el campo de "ingredients" debe recibir el array completo con la modificación deseada. Los admins pueden actualizar cualquier receta y restaurar recetas Soft Deleted.
- **Auth:**
Sí
- **Headers:**
```JSON
"Content-Type": "application/json",
"Authorization": "Bearer <token>"
```
- **Body:**
```JSON
{
    "title": "Nuevo título de la receta",
    "description": "Nueva descripción de la receta",
    "ingredients": [
        {
            "ingredient": "Ingrediente 1",
            "quantity": 0,
            "unitType": "g / ml / unit"
        },
        {
            "ingredient": "Ingrediente 2",
            "quantity": 0,
            "unitType": "g / ml / unit"
        }
    ],
    "cookTimeInSeconds": 0,
    "isDeleted": false
}
```
- **Respuesta:**
[STATUS: 200]
```JSON
{
    "success": true,
    "message": "Receta actualizada con éxito"
}
```

### Eliminar receta
- **Ruta:**
[DELETE] /recipe/:id
- **Descripción:**
Elimina la receta del usuario actual aplicando un Soft Delete. Los admins pueden eliminar cualquier receta aplicando un Soft Delete.
- **Auth:**
Sí
- **Headers:**
```JSON
"Authorization": "Bearer <token>"
```
- **Body:**
No
- **Respuesta:**
[STATUS: 200]
```JSON
{
    "success": true,
    "message": "Receta eliminada con éxito"
}
```