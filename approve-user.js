import pg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pg;
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function approveUser() {
  try {
    const users = await pool.query('SELECT id, email, full_name, role, is_approved FROM users ORDER BY created_at DESC');

    console.log('\n=== All Users ===');
    users.rows.forEach((user, i) => {
      console.log(`${i + 1}. ${user.email} - ${user.full_name} (${user.role}) - ${user.is_approved ? 'APPROVED' : 'PENDING'}`);
    });

    if (users.rows.length === 0) {
      console.log('No users found!');
      process.exit(0);
    }

    const pendingUser = users.rows.find(u => !u.is_approved);
    if (pendingUser) {
      await pool.query(
        "UPDATE users SET is_approved = true, is_active = true, role = 'super_admin' WHERE id = $1",
        [pendingUser.id]
      );
      console.log(`\n✅ Approved ${pendingUser.email} as super_admin!`);
    } else {
      console.log('\nNo pending users to approve.');
    }

    pool.end();
  } catch (error) {
    console.error('Error:', error.message);
    pool.end();
  }
}

approveUser();
