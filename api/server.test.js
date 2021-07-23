// Write your tests here
const request = require('supertest')
const db = require('../data/dbConfig')
const server = require('../api/server')
const supertest = require('supertest')

// const user1 = {username:"tommyc", password:"itsasecret"}
// const user2 = {username:"larryt", password:"wowthatis"}

beforeAll(async()=>{
  await db.migrate.rollback()
  await db.migrate.latest()
})

beforeEach(async()=>{
  db('users').truncate()
})

afterAll(async()=>{
  db.destroy()
})

test('sanity', () => {
  expect(true).toBe(true)
})

describe('[POST] /register new users', ()=> {
  it("add new users to db", async()=> {
    const newUser = await supertest(server).post('/api/auth/register').send({username:"tommyc", password:"itsasecret"})
    expect(newUser.body.username).toBe('tommyc')
    expect(newUser.status).toBe(201)
  })
  it("cannot add existing username to db", async()=> {
    const newUser = await supertest(server).post('/api/auth/register').send({username:"tommyc", password:"itsasecret"})
    const newUser2 = await supertest(server).post('/api/auth/register').send({username:"tommyc", password:"itsasecret"})
    expect(newUser2.body).toStrictEqual({"message": "username taken"})
  })
})

  describe('[POST] /login users', ()=> {
    it("users can log in successfully", async()=> {
      const newUser = await supertest(server).post('/api/auth/register').send({username:"larryt", password:"wowthatis"})
      const newUserlogin = await supertest(server).post('/api/auth/login').send({username:"larryt", password:"wowthatis"})
      expect(newUserlogin.status).toBe(200)
      expect(newUserlogin.body.message).toBe('Welcome, larryt')
    })
    it("users can't use an incorrect password to login", async()=> {
      const newUser = await supertest(server).post('/api/auth/register').send({username:"larryt", password:"wowthatis"})
      const newUserlogin = await supertest(server).post('/api/auth/login').send({username:"larryt", password:"wrongpassword"})
      expect(newUserlogin.status).toBe(401)
      expect(newUserlogin.body.message).toBe('invalid credentials')
    })
  })

  describe('[GET] /jokes', ()=> {

    it("users can't access jokes without logging in", async()=> {
      const user = await supertest(server).get('/api/jokes/')
      expect(user.status).toBe(401)
      expect(user.body.message).toBe('token required')
    })

    it("users can use an incorrect password to login", async()=> {

      // const newUser = await supertest(server)
      // .post('/api/auth/register')
      // .send({username:"larryt", password:"wowthatis"})

      // const newUserlogin = await supertest(server)
      // .post('/api/auth/login')
      // .send({username:"larryt", password:"wowthatis"})

      // const token = newUserlogin.body.token

      // const user = await supertest(server)
      // .get('/api/jokes/')
      // .set('Authorization', 'Bearer ' + token)

      // expect(user.status).toBe(200)
    })
  })