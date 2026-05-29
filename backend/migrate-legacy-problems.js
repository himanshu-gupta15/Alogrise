import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Problem from './src/models/problem.js';

dotenv.config();

const migrateProblems = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('🔄 Starting migration of legacy problems...');

    // Update all problems without a status field to 'approved'
    const result = await Problem.updateMany(
      { $or: [{ status: { $exists: false } }, { status: null }] },
      { $set: { status: 'approved' } }
    );

    console.log(`✅ Migration complete!`);
    console.log(`📊 Updated ${result.modifiedCount} problems to approved status`);
    console.log(`📊 Matched ${result.matchedCount} problems total`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
};

migrateProblems();
