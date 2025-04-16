const { QuickDB } = require('quick.db');
const db = new QuickDB();

// database
const DB = require('./db');

const fixMemberCreateAt = async () => {
  const members = await db.get('members');

  for (const [key, member] of Object.entries(members)) {
    const { userId, serverId, id, ...rest } = member;

    await DB.set.member(userId, serverId, {
      createdAt: rest.joinedAt || 0,
    });
  }

  console.log('member 修正完成');
};

const main = async () => {
  await fixMemberCreateAt();
  console.log('所有資料修正完成');
};

main();
