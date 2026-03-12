import db from './server/database.js';

db.all('SELECT id, username, role, length(password) as pass_len FROM users', (err, rows) => {
    if (err) {
        console.error('Error fetching users:', err);
    } else {
        console.log('Users in database:', rows);
    }
    process.exit();
});
