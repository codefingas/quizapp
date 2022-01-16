import test from 'japa'
import supertest from 'supertest'
import Utilities from 'App/Helpers/Utilities'
import Categories from 'App/Models/Mongoose/Categories'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Example', () => {
  test('assert sum', (assert) => {
    assert.equal(2 + 2, 4)
  })
})

test.group('Welcome', () => {
  test('ensure home page works', async (assert) => {
    /**
     * Make request
     */
    const { text } = await supertest(BASE_URL).get('/').expect(200)
    assert.equal(text, '{"hello":"world"}')
  })
})

test('ensure default categories are created', async (assert) => {
  const category = new Categories()
  category.name = 'Sports'
  category.created_at = new Utilities().currentDate()
  await category.save()

  assert.equal(category.name, 'Sports')
})
