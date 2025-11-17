const bcrypt = require('bcryptjs');

async function generateHash() {
  const hash = await bcrypt.hash('Admin@123', 10);
  console.log('Password hash for Admin@123:');
  console.log(hash);
}

generateHash();
