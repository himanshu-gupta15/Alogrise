// Inserts the verified problems from seed/problems.generated.json (built by seed/build.js).
//
//   node seed/seed.js --dry-run   show what would be inserted
//   node seed/seed.js             insert (skips titles that already exist)
//   node seed/seed.js --remove    delete exactly the problems a previous run inserted
//
// Inserted problems are owned by the first admin user and published (status: approved).
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import Problem from '../src/models/problem.js';
import User from '../src/models/user.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const dataFile = path.join(here, 'problems.generated.json');
const ledgerFile = path.join(here, '.seeded-ids.json');
const dryRun = process.argv.includes('--dry-run');
const remove = process.argv.includes('--remove');

const readLedger = () => {
  try {
    return JSON.parse(fs.readFileSync(ledgerFile, 'utf8'));
  } catch {
    return [];
  }
};

const main = async () => {
  if (!process.env.DB_CONNECT_STRING) throw new Error('DB_CONNECT_STRING is not set in backend/.env');
  await mongoose.connect(process.env.DB_CONNECT_STRING);

  if (remove) {
    const ids = readLedger();
    if (!ids.length) {
      console.log('Nothing to remove: no seeded problems recorded.');
      return;
    }
    if (dryRun) {
      console.log(`Would delete ${ids.length} seeded problems.`);
      return;
    }
    const { deletedCount } = await Problem.deleteMany({ _id: { $in: ids } });
    fs.rmSync(ledgerFile, { force: true });
    console.log(`Deleted ${deletedCount} seeded problems.`);
    return;
  }

  if (!fs.existsSync(dataFile)) throw new Error('seed/problems.generated.json is missing. Run: node seed/build.js');
  const problems = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

  const admin = await User.findOne({ role: 'admin' }).sort({ createdAt: 1 }).select('_id firstName emailId');
  if (!admin) throw new Error('No admin user found. Seeded problems need an admin as their creator.');

  const existing = new Set((await Problem.find({}, { title: 1 }).lean()).map((p) => p.title.trim().toLowerCase()));
  const toInsert = problems.filter((p) => !existing.has(p.title.trim().toLowerCase()));
  const skipped = problems.length - toInsert.length;

  console.log(`Creator: ${admin.firstName} <${admin.emailId}>`);
  console.log(`${problems.length} problems in the seed, ${skipped} already exist, ${toInsert.length} to insert.`);
  const byDifficulty = toInsert.reduce((acc, p) => ({ ...acc, [p.difficulty]: (acc[p.difficulty] || 0) + 1 }), {});
  console.log('By difficulty:', byDifficulty);

  if (dryRun || !toInsert.length) {
    if (dryRun) console.log('Dry run: nothing written.');
    return;
  }

  const docs = await Problem.insertMany(
    toInsert.map((p) => ({ ...p, problemCreator: admin._id, status: 'approved' })),
    { ordered: true }
  );
  const ledger = [...readLedger(), ...docs.map((d) => String(d._id))];
  fs.writeFileSync(ledgerFile, JSON.stringify(ledger, null, 2));
  console.log(`Inserted ${docs.length} problems. IDs recorded in seed/.seeded-ids.json (used by --remove).`);
};

main()
  .catch((err) => {
    console.error('Seed failed:', err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
