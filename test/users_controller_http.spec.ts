import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`
let adminUser: any = null

// Test all the endpoints that has no need for authentication
test.group('Unauthenticated Routes', () => {
  test('ensure home page works', async (assert) => {
    const { text } = await supertest(BASE_URL).get('/').expect(200)
    assert.equal(text, '{"hello":"world"}')
  })

  // Test User Registration Route works as expected
  test('POST /api/users', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/api/user/')
      .send({
        email: 'admin@example.com',
        password: '123456',
        username: 'test1234',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)

    assert.equal(response.body.email, 'admin@example.com')
    assert.equal(response.body.username, 'test1234')
    assert.hasAnyKeys(response.body, ['email', 'username', 'id'])
  })

  // Test User Registration Route returns a 400 if email is not supplied
  test('POST /api/users', async (assert) => {
    await supertest(BASE_URL)
      .post('/api/user/')
      .send({
        email: '',
        password: '123456',
        username: 'test1234',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
  })

  // Test User Registration Route returns a 400 if passoword is not supplied
  test('POST /api/users', async (assert) => {
    await supertest(BASE_URL)
      .post('/api/user/')
      .send({
        email: 'admin@example.com',
        username: 'test1234',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
  })

  // Test User Registration Route returns a 400 if username is not supplied
  test('POST /api/users', async (assert) => {
    await supertest(BASE_URL)
      .post('/api/user/')
      .send({
        email: 'admin@example.com',
        password: '123456',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
  })

  // Test User Login Route works as expected
  test('POST /api/login', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/api/login/')
      .send({
        email: 'admin@example.com',
        password: '123456',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)

    assert.equal(response.body.email, 'admin@example.com')
    assert.equal(response.body.username, 'test1234')
    assert.hasAnyKeys(response.body, ['email', 'username', 'id', 'token'])
    adminUser = response.body
  })

  // Test User Login fails if password is incorrect
  test('POST /api/login', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/api/login/')
      .send({
        email: 'admin@example.com',
        password: '1234561',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)

    assert.isObject(response.body)
    assert.hasAnyKeys(response.body, ['Error'])
    assert.equal(response.body.Error, 'Password is incorrect.')
  })

  // Test User Login fails if user does not exists
  test('POST /api/login', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/api/login/')
      .send({
        email: 'admin1@example.com',
        password: '123456',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)

    assert.isObject(response.body)
    assert.hasAnyKeys(response.body, ['Error'])
    assert.equal(response.body.Error, 'User does not exist.')
  })

  // Test User Login Route returns a 400 if email is not supplied
  test('POST /api/login', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/api/login/')
      .send({
        password: '123456',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)

    assert.isObject(response.body)
    assert.hasAnyKeys(response.body, ['errors', 'messages', 'flashToSession'])
  })

  // Test User Login Route returns a 400 if email is not supplied
  test('POST /api/login', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/api/login/')
      .send({
        email: 'admin@example.com',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)

    assert.isObject(response.body)
    assert.hasAnyKeys(response.body, ['errors', 'messages', 'flashToSession'])
  })
})

// Test all the endpoints that needs authentication
test.group('Authenticated Routes', () => {
  // Test ability to get all users fails when Token is not provided
  test('GET /api/user', async (assert) => {
    const response = await supertest(BASE_URL).get('/api/user').expect(400)

    assert.isObject(response.body)
    assert.hasAnyKeys(response.body, ['error'])
    assert.equal(response.body.error, 'Invalid User Authentication details passed.')
  })

  // Test ability to get all users works as expected
  test('GET /api/user', async (assert) => {
    const response = await supertest(BASE_URL)
      .get('/api/user')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect('Content-Type', /json/)
      .expect(200)

    assert.isArray(response.body)
    assert.hasAnyKeys(response.body[0], [
      '_id',
      'email',
      'username',
      'password',
      'created_at',
      'updated_at',
    ])
  })

  // Test ability to get a limited number of users works as expected
  test('GET /api/user', async (assert) => {
    const response = await supertest(BASE_URL)
      .get('/api/user?limit=1')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect('Content-Type', /json/)
      .expect(200)

    assert.isArray(response.body)
    assert.equal(response.body.length, 1)
    assert.hasAnyKeys(response.body[0], [
      '_id',
      'email',
      'username',
      'password',
      'created_at',
      'updated_at',
    ])
  })

  // Test ability to get a specific user works as expected
  test('GET /api/user', async (assert) => {
    const response = await supertest(BASE_URL)
      .get('/api/user/' + adminUser.id)
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect('Content-Type', /json/)
      .expect(200)

    assert.isObject(response.body)
    assert.equal(response.body._id, adminUser.id)
    assert.equal(response.body.email, adminUser.email)
    assert.equal(response.body.username, adminUser.username)
    assert.equal(response.body.updated_at, adminUser.updated_at)
    assert.hasAnyKeys(response.body, [
      '_id',
      'email',
      'username',
      'password',
      'created_at',
      'updated_at',
    ])
  })

  // Test ability to get an invalid user returns a 400
  test('GET /api/user', async (assert) => {
    const response = await supertest(BASE_URL)
      .get('/api/user/fake_' + adminUser.id)
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect('Content-Type', /json/)
      .expect(400)

    assert.isObject(response.body)
    assert.hasAnyKeys(response.body, ['stringValue', 'path', 'reason', 'name', 'message'])
    assert.equal(response.body.name, 'CastError')
  })

  // Test ability to get a specific user requires a valid Token
  test('GET /api/user', async (assert) => {
    const response = await supertest(BASE_URL)
      .get('/api/user/' + adminUser.id)
      .set('Authorization', `Bearer fake_${adminUser.token}`)
      .expect('Content-Type', /json/)
      .expect(400)

    assert.isObject(response.body)
    assert.hasAnyKeys(response.body, ['error'])
    assert.equal(response.body.error, 'Access Denied.')
  })

  // Test Ability to update a specific user details
  test('PUT /api/user', async (assert) => {
    const response = await supertest(BASE_URL)
      .put('/api/user/' + adminUser.id)
      .send({
        email: 'new_admin@example.com',
        username: 'test12345',
        password: '123456',
      })
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect('Content-Type', /json/)
      .expect(200)

    assert.isObject(response.body)
    assert.equal(response.body._id, adminUser.id)
    assert.notEqual(response.body.email, adminUser.email)
    assert.equal(response.body.email, 'new_admin@example.com')
    assert.equal(response.body.username, 'test12345')
    assert.notEqual(response.body.username, adminUser.username)
    assert.notEqual(response.body.updated_at, adminUser.updated_at)
    assert.hasAnyKeys(response.body, [
      '_id',
      'email',
      'username',
      'password',
      'created_at',
      'updated_at',
    ])

    adminUser = response.body
  })

  // Test Ability to update a specific user details fails when email is missing
  test('PUT /api/user', async (assert) => {
    const response = await supertest(BASE_URL)
      .put('/api/user/' + adminUser.id)
      .send({
        username: 'test12345',
        password: '123456',
      })
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect('Content-Type', /json/)
      .expect(400)

    assert.isObject(response.body)
    assert.hasAnyKeys(response.body, ['error'])
    assert.equal(response.body.error, 'Access Denied.')
  })

  // Test Ability to update a specific user details fails when username is missing
  test('PUT /api/user', async (assert) => {
    const response = await supertest(BASE_URL)
      .put('/api/user/' + adminUser.id)
      .send({
        email: 'new_admin@example.com',
        password: '123456',
      })
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect('Content-Type', /json/)
      .expect(400)

    assert.isObject(response.body)
    assert.hasAnyKeys(response.body, ['error'])
    assert.equal(response.body.error, 'Access Denied.')
  })

  // Test Ability to update a specific user details fails when password is missing
  test('PUT /api/user', async (assert) => {
    const response = await supertest(BASE_URL)
      .put('/api/user/' + adminUser.id)
      .send({
        email: 'new_admin@example.com',
        username: 'test12345',
      })
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect('Content-Type', /json/)
      .expect(400)

    assert.isObject(response.body)
    assert.hasAnyKeys(response.body, ['error'])
    assert.equal(response.body.error, 'Access Denied.')
  })

  // Access Denied when updating a user with an invalid token
  test('PUT /api/user', async (assert) => {
    const response = await supertest(BASE_URL)
      .put('/api/user/' + adminUser.id)
      .send({
        email: 'new_admin@example.com',
        username: 'test12345',
      })
      .set('Authorization', `Bearer fake_${adminUser.token}`)
      .expect('Content-Type', /json/)
      .expect(400)

    assert.isObject(response.body)
    assert.hasAnyKeys(response.body, ['error'])
    assert.equal(response.body.error, 'Access Denied.')
  })

  // Access Denied when updating a user when Token is not supplied
  test('PUT /api/user', async (assert) => {
    const response = await supertest(BASE_URL)
      .put('/api/user/' + adminUser.id)
      .send({
        email: 'new_admin@example.com',
        username: 'test12345',
      })
      .expect('Content-Type', /json/)
      .expect(400)

    assert.isObject(response.body)
    assert.hasAnyKeys(response.body, ['error'])
    assert.equal(response.body.error, 'Invalid User Authentication details passed.')
  })

  // Return 404 when updating a user that does not exist
  test('PUT /api/user', async (assert) => {
    const response = await supertest(BASE_URL)
      .put('/api/user/')
      .send({
        email: 'new_admin@example.com',
        username: 'test12345',
        password: '123456',
      })
      .set('Authorization', `Bearer fake_${adminUser.token}`)
      .expect('Content-Type', /json/)
      .expect(404)

    assert.isObject(response.body)
    assert.hasAnyKeys(response.body, ['message', 'stack', 'code'])
    assert.equal(response.body.message, 'E_ROUTE_NOT_FOUND: Cannot PUT:/api/user/')
  })

  // Access Denied when deleting a user when Token is not supplied
  test('DELETE /api/user', async (assert) => {
    const response = await supertest(BASE_URL)
      .delete('/api/user/' + adminUser.id)
      .expect('Content-Type', /json/)
      .expect(400)

    assert.isObject(response.body)
    assert.hasAnyKeys(response.body, ['error'])
    assert.equal(response.body.error, 'Invalid User Authentication details passed.')
  })

  // Access Denied when deleting a user with an invalid token
  test('DELETE /api/user', async (assert) => {
    const response = await supertest(BASE_URL)
      .delete('/api/user/' + adminUser.id)
      .set('Authorization', `Bearer fake_${adminUser.token}`)
      .expect('Content-Type', /json/)
      .expect(400)

    assert.isObject(response.body)
    assert.hasAnyKeys(response.body, ['error'])
    assert.equal(response.body.error, 'Access Denied.')
  })

  // Return 404 when deleting a user that does not exist
  test('DELETE /api/user', async (assert) => {
    const response = await supertest(BASE_URL)
      .delete('/api/user')
      .set('Authorization', `Bearer fake_${adminUser.token}`)
      .expect('Content-Type', /json/)
      .expect(404)

    assert.isObject(response.body)
    assert.hasAnyKeys(response.body, ['message', 'stack', 'code'])
    assert.equal(response.body.message, 'E_ROUTE_NOT_FOUND: Cannot DELETE:/api/user')
  })

  // Return 204 when deleting a user {Cannot delete actively logged in user}
  test('DELETE /api/user', async (assert) => {
    const response = await supertest(BASE_URL)
      .delete('/api/user/' + adminUser._id)
      .set('Authorization', `Bearer _${adminUser.token}`)
      .expect('Content-Type', /json/)
      .expect(400)

    assert.isObject(response.body)
    assert.hasAnyKeys(response.body, ['error'])
    assert.equal(response.body.error, 'Access Denied.')
  })
})
