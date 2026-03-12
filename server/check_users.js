import db from './database.js';

db.all('SELECT id, username FROM users', [], (err, rows) => {
    if (err) {
        console.error('Error fetching users:', err.message);
    } else {
        console.log('Current users in DB:', rows);
    }
    process.exit();
});
