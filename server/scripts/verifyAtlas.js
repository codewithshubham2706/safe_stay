// Atlas connection verifier — run BEFORE wiring Render, to catch
// wrong password / missing network access / missing db name early.
//
// Usage (from the project root, in your own terminal):
//   node server/scripts/verifyAtlas.js "mongodb+srv://user:pass@cluster0.xxx.mongodb.net/safestay?retryWrites=true&w=majority"
//
// Exit code 0 = ready for Render. Any failure prints the exact fix.
import mongoose from 'mongoose';

const uri = process.argv[2];
if (!uri || !uri.startsWith('mongodb')) {
  console.error('Usage: node server/scripts/verifyAtlas.js "<MONGO_URI>"');
  process.exit(1);
}

// Pre-flight sanity checks on the string itself
const warnings = [];
if (uri.includes('<db_password>')) warnings.push('❌ "<db_password>" placeholder is still in the URI — replace it with your real password.');
else if (!uri.includes('/safestay')) warnings.push('⚠️  Database name missing — insert "/safestay" right before the "?" in the URI.');
warnings.forEach(w => console.warn(w + '\n'));

async function main() {
  console.log('Connecting to Atlas…');
  const start = Date.now();
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  console.log(`✅ Connected in ${Date.now() - start}ms`);

  const db = mongoose.connection.db;

  await db.command({ ping: 1 });
  console.log('✅ ping ok');

  // Prove writes work on the M0 cluster (create → count → drop a scratch collection)
  const col = db.collection('__safestay_verify');
  await col.insertOne({ ok: true, at: new Date() });
  console.log('✅ write ok');
  await col.drop();
  console.log('✅ cleanup ok');

  const collections = await db.listCollections().toArray();
  console.log('Existing collections in this DB:', collections.map(c => c.name).join(', ') || '(none yet — fine)');

  console.log('\n🎉 ATLAS IS READY — use this exact URI as MONGO_URI in Render.');
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(e => {
  console.error('\n❌ FAILED:', e.message);
  if (/bad auth|authentication failed/i.test(e.message)) {
    console.error('→ Wrong username/password. Check Database Access in Atlas; URL-encode special chars (@ → %40).');
  } else if (/timed out|ETIMEDOUT|ENOTFOUND|querySrv/i.test(e.message)) {
    console.error('→ Network Access: add 0.0.0.0/0 (Allow from anywhere) in Atlas, then retry. Also check the cluster hostname.');
  } else if (/whitelist|not authorized/i.test(e.message)) {
    console.error('→ Your IP is not whitelisted: Network Access → Add IP → 0.0.0.0/0.');
  }
  process.exit(1);
});
