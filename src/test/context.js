

class Context {
    static async build() {
        
    // Randomly generating a role name to connect to PG as
    const roleName = 'a' + randomBytes(4).toString('hex');

    // Connect to PG as usual
    await pool.connect({
        host: 'localhost',
        port: 5432,
        database: 'socialnetworknew-test',
        user: 'postgres',
        password: 'root'
      });

    // Create a new role
    await pool.query(format(
        `CREATE ROLE %I WITH LOGIN PASSWORD %L`, roleName, roleName
        ));

    // Create a schema with the same name
    await pool.query(format(
        `CREATE SCHEMA %I AUTHORIZATION %I;`, roleName, roleName
        ));

    // Disconnect entirely from PG
    await pool.close();

    // Run our migrations in the new schema
    await migrate({
        schema: roleName,
        direction: 'up',
        log: () => {},
        noLock: true,
        dir: 'migrations',
        databaseUrl: {
            host: 'localhost',
            port: 5432,
            database: 'socialnetworknew-test',
            user: roleName,
            password: roleName
        }
    });

    // Connect to PG as the newly created role
    await pool.connect({
        host: 'localhost',
        port: 5432,
        database: 'socialnetworknew-test',
        user: roleName,
        password: roleName
    });
    }
}

module.exports = Context;