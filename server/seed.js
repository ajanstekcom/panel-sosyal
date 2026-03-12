import db from './database.js';
import bcrypt from 'bcryptjs';

const seed = async () => {
    const username = 'admin';
    const password = '123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Clear existing users to ensure clean state
    db.run(`DELETE FROM users`, (err) => {
        if (err) console.error(err.message);

        db.run(`INSERT INTO users (username, password, role) VALUES (?, ?, ?)`, [username, hashedPassword, 'admin'], (err) => {
            if (err) {
                console.log('Error creating user:', err.message);
            } else {
                console.log('Default user reset: admin / 123');
            }
            process.exit();
        });
    });
};

seed();
