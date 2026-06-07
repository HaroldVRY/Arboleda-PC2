require('dotenv').config();

const env = {
  port: process.env.PORT || 4000,
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY || '',
  jwtSecret: process.env.JWT_SECRET || '',
};

module.exports = { env };
