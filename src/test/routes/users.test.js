const request = require('supertest');
const buildApp = require('../../app');
const UserRepo = require('../../repos/user-repo');
const pool = require('../../pool');

const { randomBytes } = require('crypto');
const { default: migrate } = require('node-pg-migrate');
const format = require('pg-format');

beforeAll(() => {
    // Randomly generating a role name to connect to PG as
    const roleName = 'a' + randomBytes(4).toString('hex');

    // Connect to PG as usual

    // Create a new role

    // Create a schema with the same name

    // Disconnect entirely from PG

    // Run our migrations in the new schema

    // Connect to PG as the newly created role

    return pool.connect({
      host: 'localhost',
      port: 5432,
      database: 'socialnetworknew-test',
      user: 'postgres',
      password: 'root'
    });
});

afterAll(() => {
    return pool.close();
});


it('create a user', async () => {
    const startingCount = await UserRepo.count();

    await request(buildApp())
      .post('/users')
      .send({ username: 'testuser', bio: 'test bio'})
      .expect(200);

    const finishCount = await UserRepo.count();
    expect(finishCount - startingCount).toEqual(1);
});