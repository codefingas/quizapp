import test from 'japa'
import Utilities from 'App/Helpers/Utilities'
import Categories from 'App/Models/Mongoose/Categories'
import Difficulty from 'App/Models/Mongoose/Difficulty'
import Types from 'App/Models/Mongoose/Types'
import User from 'App/Models/Mongoose/User'
import Quiz from 'App/Models/Mongoose/Quiz'
import Scoring from 'App/Models/Mongoose/Scoring'
import mongoose from 'mongoose'

// test models to validate the integrity of the data
test.group('Models Integrity', (group) => {
  // Clean up the database after all test
  group.after(async () => {
    const collections = await mongoose.connection.db.collections()

    for (let collection of collections) {
      await collection.deleteMany({})
    }
  })

  // Test Categories Model
  test('ensure valid categories can be created', async (assert) => {
    const category = new Categories()
    category.name = 'Sports'
    category.created_at = new Utilities().currentDate()
    await category.save()

    assert.equal(category.name, 'Sports')
  })

  // Test Difficulty Model
  test('ensure valid difficulty can be created', async (assert) => {
    const difficulty = new Difficulty()
    difficulty.name = 'Easy'
    difficulty.created_at = new Utilities().currentDate()
    await difficulty.save()

    assert.equal(difficulty.name, 'Easy')
  })

  // Test Types Model
  test('ensure valid types can be created', async (assert) => {
    const type = new Types()
    type.name = 'Multiple Choice'
    type.created_at = new Utilities().currentDate()
    await type.save()

    assert.equal(type.name, 'Multiple Choice')
  })

  // Test Users Model
  test('ensure valid users can be created', async (assert) => {
    const user = await createUser()

    assert.equal(user.email, 'sample@email.com')
    assert.equal(user.password, 'sample_password')
    assert.equal(user.username, 'sample_username')
    assert.equal(user.updated_at, null)
    assert.equal(user.deleted_at, null)

    assert.equal(user.toJSON().email, 'sample@email.com')
    assert.equal(user.toJSON().password, 'sample_password')
    assert.equal(user.toJSON().username, 'sample_username')
    assert.equal(user.toJSON().updated_at, null)
    assert.equal(user.toJSON().deleted_at, null)
  })

  // Test User password hashing
  test('ensure user password gets hashed during save', async (assert) => {
    const user = await createUser()

    assert.notEqual(user.password, 'secret')
  })

  // Test Quiz Model
  test('ensure valid quiz can be created', async (assert) => {
    const user = await createUser()

    const quiz = new Quiz()
    quiz.question = 'What is the capital of India?'
    quiz.correct_answer = 'New Delhi'
    quiz.incorrect_answers = ['Mumbai', 'Chennai', 'Kolkata']
    quiz.created_by = user.id
    quiz.created_at = new Utilities().currentDate()
    await quiz.save()

    assert.equal(quiz.question, 'What is the capital of India?')
    assert.equal(quiz.correct_answer, 'New Delhi')
    assert.equal(quiz.incorrect_answers[0], 'Mumbai')
    assert.equal(quiz.incorrect_answers[1], 'Chennai')
    assert.equal(quiz.incorrect_answers[2], 'Kolkata')
    assert.equal(quiz.created_by, user.id)
    assert.equal(quiz.updated_at, null)
    assert.equal(quiz.deleted_at, null)

    assert.equal(quiz.toJSON().question, 'What is the capital of India?')
    assert.equal(quiz.toJSON().correct_answer, 'New Delhi')
    assert.equal(quiz.toJSON().incorrect_answers[0], 'Mumbai')
    assert.equal(quiz.toJSON().incorrect_answers[1], 'Chennai')
    assert.equal(quiz.toJSON().incorrect_answers[2], 'Kolkata')
    assert.equal(quiz.toJSON().created_by, user.id)
    assert.equal(quiz.toJSON().updated_at, null)
    assert.equal(quiz.toJSON().deleted_at, null)
  })

  // Test Scoring Model
  test('ensure valid scoring can be created', async (assert) => {
    const user = await createUser()

    const score = new Scoring()
    score.total = 10
    score.score = 5
    score.details = ['correct', 'incorrect']
    score.created_by = user.id
    score.created_at = new Utilities().currentDate()
    await score.save()

    assert.equal(score.total, 10)
    assert.equal(score.score, 5)
    assert.equal(score.details[0], 'correct')
    assert.equal(score.details[1], 'incorrect')
    assert.equal(score.created_by, user.id)
    assert.equal(score.updated_at, null)
    assert.equal(score.deleted_at, null)

    assert.equal(score.toJSON().total, 10)
    assert.equal(score.toJSON().score, 5)
    assert.equal(score.toJSON().details[0], 'correct')
    assert.equal(score.toJSON().details[1], 'incorrect')
    assert.equal(score.toJSON().created_by, user.id)
    assert.equal(score.toJSON().updated_at, null)
    assert.equal(score.toJSON().deleted_at, null)
  })
})

async function createUser() {
  const user = new User()
  user.email = 'sample@email.com'
  user.password = 'sample_password'
  user.username = 'sample_username'
  user.created_at = new Utilities().currentDate()
  await user.save()
  return user
}
