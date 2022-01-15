'use strict'
/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

// Route.resource('quiz', 'QuizzesController.index').middleware('auth')

Route.group(() => {
  Route.get('user', 'UsersController.index')
  Route.post('login', 'UsersController.login')
  Route.post('user', 'UsersController.register')
  Route.put('user/:id', 'UsersController.update')
  Route.get('user/:id', 'UsersController.getByID')
  Route.delete('user/:id', 'UsersController.delete')
}).prefix('/api')

Route.group(() => {
  Route.get('quiz', 'QuizzesController.index')
  Route.post('quiz', 'QuizzesController.create')
  Route.put('quiz/:id', 'QuizzesController.update')
  Route.get('quiz/:id', 'QuizzesController.getByID')
  Route.delete('quiz/:id', 'QuizzesController.delete')
})
  .middleware('auth')
  .prefix('/api')
