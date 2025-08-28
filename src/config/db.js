import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is missing in environment variables');
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { dbName: process.env.DB_NAME || 'expense_app' });
  console.log('✅ MongoDB connected');
  return mongoose.connection;
}
