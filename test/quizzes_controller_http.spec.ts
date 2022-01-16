import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`
let guestUser: any = null
let newQuiz: any = null

// Test all the Quiz Endpoints
test.group('Quiz Routes', () => {
  // Test Guest Registration Route works as expected
  test('POST /api/users', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/api/user/')
      .send({
        email: 'guest@example.com',
        password: '123456',
        username: 'test1234',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)

    assert.equal(response.body.email, 'guest@example.com')
    assert.equal(response.body.username, 'test1234')
    assert.hasAnyKeys(response.body, ['email', 'username', 'id'])
  })

  // Test User Login Route works as expected
  test('POST /api/login', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/api/login/')
      .send({
        email: 'guest@example.com',
        password: '123456',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)

    assert.equal(response.body.email, 'guest@example.com')
    assert.equal(response.body.username, 'test1234')
    assert.hasAnyKeys(response.body, ['email', 'username', 'id', 'token'])
    guestUser = response.body
  })

  // Test Quiz creation Route works as expected
  test('POST /api/quiz', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/api/quiz/')
      .send({
        question:
          'Which song by Swedish electronic musician Avicii samples the song &quot;Something&#039;s Got A Hold On Me&quot; by Etta James?',
        correct_answer: 'Levels',
        incorrect_answers: ['Fade Into Darkness', 'Silhouettes', 'Seek Bromance'],
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${guestUser.token}`)
      .expect('Content-Type', /json/)
      .expect(201)

    assert.equal(
      response.body.question,
      'Which song by Swedish electronic musician Avicii samples the song &quot;Something&#039;s Got A Hold On Me&quot; by Etta James?'
    )
    assert.equal(response.body.correct_answer, 'Levels')
    assert.hasAnyKeys(response.body, ['question', 'correct_answer', 'incorrect_answers'])

    newQuiz = response.body
  })

  // Test Quiz Scoring Route works as expected for wrong answers
  test('POST /api/score', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/api/score/')
      .send([
        {
          _id: newQuiz.id,
          supplied_answer: 'Wrong Answer',
        },
      ])
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${guestUser.token}`)
      .expect('Content-Type', /json/)
      .expect(201)

    assert.equal(response.body.score, 0)
    assert.hasAnyKeys(response.body, ['score', 'total', 'attempted_on', 'breakdown'])
  })

  // Test Quiz Scoring Route works as expected for right answers
  test('POST /api/score', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/api/score/')
      .send([
        {
          _id: newQuiz.id,
          supplied_answer: newQuiz.correct_answer,
        },
      ])
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${guestUser.token}`)
      .expect('Content-Type', /json/)
      .expect(201)

    assert.equal(response.body.score, 1)
    assert.hasAnyKeys(response.body, ['score', 'total', 'attempted_on', 'breakdown'])
  })

  // Test user statics route return user score board
  test('GET /api/statistics', async (assert) => {
    const response = await supertest(BASE_URL)
      .get('/api/statistics/')
      .set('Authorization', `Bearer ${guestUser.token}`)
      .expect('Content-Type', /json/)
      .expect(200)

    assert.isArray(response.body)
    assert.hasAnyKeys(response.body[0], ['total', 'score', 'created_at'])
  })

  // Access Denied when Token is not supplied for quiz creation
  test('POST /api/quiz', async (assert) => {
    const response = await supertest(BASE_URL)
      .put('/api/user/' + guestUser.id)
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

  // Access Denied when the wrong Token is supplied for quiz creation
  test('POST /api/quiz', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/api/quiz/')
      .send({
        question:
          'Which song by Swedish electronic musician Avicii samples the song &quot;Something&#039;s Got A Hold On Me&quot; by Etta James?',
        correct_answer: 'Levels',
        incorrect_answers: ['Fade Into Darkness', 'Silhouettes', 'Seek Bromance'],
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer fake_${guestUser.token}`)
      .expect('Content-Type', /json/)
      .expect(400)

    assert.isObject(response.body)
    assert.hasAnyKeys(response.body, ['error'])
    assert.equal(response.body.error, 'Access Denied.')
  })

  // Access Denied when the questions is not supplied for quiz creation
  test('POST /api/quiz', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/api/quiz/')
      .send({
        correct_answer: 'Levels',
        incorrect_answers: ['Fade Into Darkness', 'Silhouettes', 'Seek Bromance'],
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${guestUser.token}`)
      .expect('Content-Type', /json/)
      .expect(400)

    assert.isObject(response.body)
    assert.hasAnyKeys(response.body, ['errors', 'messages', 'flashToSession'])
  })

  // Access Denied when the correct answer is not supplied for quiz creation
  test('POST /api/quiz', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/api/quiz/')
      .send({
        question:
          'Which song by Swedish electronic musician Avicii samples the song &quot;Something&#039;s Got A Hold On Me&quot; by Etta James?',
        incorrect_answers: ['Fade Into Darkness', 'Silhouettes', 'Seek Bromance'],
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${guestUser.token}`)
      .expect('Content-Type', /json/)
      .expect(400)

    assert.isObject(response.body)
    assert.hasAnyKeys(response.body, ['errors', 'messages', 'flashToSession'])
  })

  // Access Denied when the incorrect answers are not supplied for quiz creation
  test('POST /api/quiz', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/api/quiz/')
      .send({
        correct_answer: 'Levels',
        question:
          'Which song by Swedish electronic musician Avicii samples the song &quot;Something&#039;s Got A Hold On Me&quot; by Etta James?',
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${guestUser.token}`)
      .expect('Content-Type', /json/)
      .expect(400)

    assert.isObject(response.body)
    assert.hasAnyKeys(response.body, ['errors', 'messages', 'flashToSession'])
  })

  // Test ability to get all quizzes works as expected
  test('GET /api/quiz', async (assert) => {
    const response = await supertest(BASE_URL)
      .get('/api/quiz/')
      .set('Authorization', `Bearer ${guestUser.token}`)
      .expect('Content-Type', /json/)
      .expect(200)

    assert.isArray(response.body)
    assert.hasAnyKeys(response.body[0], [
      '_id',
      'question',
      'correct_answer',
      'incorrect_answers',
      'created_by',
      'created_at',
      'updated_at',
    ])
  })

  // Test ability to get a limited number of quizzes works as expected
  test('GET /api/quiz', async (assert) => {
    const response = await supertest(BASE_URL)
      .get('/api/quiz?limit=1')
      .set('Authorization', `Bearer ${guestUser.token}`)
      .expect('Content-Type', /json/)
      .expect(200)

    assert.isArray(response.body)
    assert.equal(response.body.length, 1)
    assert.hasAnyKeys(response.body[0], [
      '_id',
      'question',
      'correct_answer',
      'incorrect_answers',
      'created_by',
      'created_at',
      'updated_at',
    ])
  })

  // Access Denied when Token is not supplied during quiz retrieval
  test('GET /api/quiz', async (assert) => {
    const response = await supertest(BASE_URL)
      .get('/api/quiz?limit=1')
      .expect('Content-Type', /json/)
      .expect(400)

    assert.isObject(response.body)
    assert.hasAnyKeys(response.body, ['error'])
    assert.equal(response.body.error, 'Invalid User Authentication details passed.')
  })

  // Access Denied when wrong Token is supplied during quiz retrieval
  test('GET /api/quiz', async (assert) => {
    const response = await supertest(BASE_URL)
      .get('/api/quiz?limit=1')
      .set('Authorization', `Bearer fake_${guestUser.token}`)
      .expect('Content-Type', /json/)
      .expect(400)

    assert.isObject(response.body)
    assert.hasAnyKeys(response.body, ['error'])
    assert.equal(response.body.error, 'Access Denied.')
  })

  // Test ability to get a specific quiz works as expected
  test('GET /api/quiz/:id', async (assert) => {
    const response = await supertest(BASE_URL)
      .get('/api/quiz/' + newQuiz.id)
      .set('Authorization', `Bearer ${guestUser.token}`)
      .expect(200)

    assert.isObject(response.body)
    assert.equal(response.body._id, newQuiz.id)
    assert.equal(response.body.question, newQuiz.question)
    assert.equal(response.body.correct_answer, newQuiz.correct_answer)
    assert.hasAnyKeys(response.body, [
      '_id',
      'question',
      'correct_answer',
      'incorrect_answers',
      'created_by',
      'created_at',
      'updated_at',
    ])
  })

  // Test ability to get a specific quiz requires a valid Token
  test('GET /api/quiz/:id', async (assert) => {
    const response = await supertest(BASE_URL)
      .get('/api/quiz/' + newQuiz.id)
      .expect('Content-Type', /json/)
      .expect(400)

    assert.isObject(response.body)
    assert.hasAnyKeys(response.body, ['error'])
    assert.equal(response.body.error, 'Invalid User Authentication details passed.')
  })

  // Access Denied when getting a specifc quiz with an invalid token
  test('GET /api/quiz/:id', async (assert) => {
    const response = await supertest(BASE_URL)
      .delete('/api/quiz/' + newQuiz.id)
      .set('Authorization', `Bearer fake_${guestUser.token}`)
      .expect('Content-Type', /json/)
      .expect(400)

    assert.isObject(response.body)
    assert.hasAnyKeys(response.body, ['error'])
    assert.equal(response.body.error, 'Access Denied.')
  })

  // Test ability to attempt quiz works as expected
  test('GET /api/play', async (assert) => {
    const response = await supertest(BASE_URL)
      .get('/api/play/')
      .set('Authorization', `Bearer ${guestUser.token}`)
      .expect('Content-Type', /json/)
      .expect(200)

    assert.isArray(response.body)
    assert.hasAnyKeys(response.body[0], [
      '_id',
      'question',
      'correct_answer',
      'incorrect_answers',
      'created_by',
      'created_at',
      'updated_at',
    ])
  })

  // Access Denied when attempting to get quiz questions with Invalid Token
  test('GET /api/play', async (assert) => {
    const response = await supertest(BASE_URL)
      .get('/api/play/')
      .set('Authorization', `Bearer fake_${guestUser.token}`)
      .expect('Content-Type', /json/)
      .expect(400)

    assert.isObject(response.body)
    assert.hasAnyKeys(response.body, ['error'])
    assert.equal(response.body.error, 'Access Denied.')
  })

  // // Test Quiz update Route works as expected
  // test('PUT /api/quiz', async (assert) => {
  //   const response = await supertest(BASE_URL)
  //     .put('/api/quiz/' + newQuiz.id)
  //     .send({
  //       question: 'Which team was the 2015-2016 NBA Champions?',
  //       correct_answer: 'Cleveland Cavaliers',
  //       incorrect_answers: ['Golden State Warriors', 'Toronto Raptors', 'Oklahoma City Thunders'],
  //     })
  //     .set('Accept', 'application/json')
  //     .set('Authorization', `Bearer ${guestUser.token}`)
  //     .expect('Content-Type', /json/)
  //     .expect(200)

  //   // console.log(newQuiz)
  //   console.log(response.body)
  //   // assert.equal(response.body.question, 'Which team was the 2015-2016 NBA Champions?')
  //   // assert.equal(response.body.correct_answer, 'Cleveland Cavaliers')
  //   // assert.hasAnyKeys(response.body, ['question', 'correct_answer', 'incorrect_answers'])
  // })

  // Access Denied when deleting a quiz when Token is not supplied
  test('DELETE /api/quiz', async (assert) => {
    const response = await supertest(BASE_URL)
      .delete('/api/quiz/' + newQuiz.id)
      .expect('Content-Type', /json/)
      .expect(400)

    assert.isObject(response.body)
    assert.hasAnyKeys(response.body, ['error'])
    assert.equal(response.body.error, 'Invalid User Authentication details passed.')
  })

  // Access Denied when deleting a quiz with an invalid token
  test('DELETE /api/quiz', async (assert) => {
    const response = await supertest(BASE_URL)
      .delete('/api/quiz/' + newQuiz.id)
      .set('Authorization', `Bearer fake_${guestUser.token}`)
      .expect('Content-Type', /json/)
      .expect(400)

    assert.isObject(response.body)
    assert.hasAnyKeys(response.body, ['error'])
    assert.equal(response.body.error, 'Access Denied.')
  })

  // Return 400 when deleting a quiz that does not exist
  test('DELETE /api/quiz', async (assert) => {
    const response = await supertest(BASE_URL)
      .delete('/api/quiz/1' + newQuiz._id)
      .set('Authorization', `Bearer ${guestUser.token}`)
      .expect('Content-Type', /json/)
      .expect(400)

    assert.isObject(response.body)
    assert.hasAnyKeys(response.body, ['stringValue', 'path', 'reason', 'name', 'message'])
    assert.equal(response.body.name, 'CastError')
  })

  // Allows for deletion of quiz
  test('DELETE /api/quiz', async (assert) => {
    const response = await supertest(BASE_URL)
      .delete('/api/quiz/' + newQuiz.id)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${guestUser.token}`)
      .expect(204)

    assert.isObject(response.body)
  })

  // Return 400 when deleting a quiz that does not exist
  test('DELETE /api/quiz', async (assert) => {
    const response = await supertest(BASE_URL)
      .delete('/api/quiz/' + newQuiz.id)
      .set('Authorization', `Bearer ${guestUser.token}`)
      .expect(404)

    assert.isObject(response.body)
  })
})
