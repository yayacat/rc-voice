const { QuickDB } = require('quick.db');
const db = new QuickDB();

// database
const DB = require('./db');

const fixMemberCreateAt = async () => {
  const members = await db.get('members');

  for (const [key, member] of Object.entries(members)) {
    const { userId, serverId, id, ...rest } = member;

    console.log(parseInt(rest.createdAt));

    await DB.set.member(userId, serverId, {
      createdAt: parseInt(rest.createdAt),
    });

    console.log('GET: ', await getMemberCreateAt(userId, serverId));
  }

  console.log('member 修正完成');
};

const getMemberCreateAt = async (userId, serverId) => {
  const member = await DB.get.member(userId, serverId);
  return member.createdAt;
};

const main = async () => {
  await fixMemberCreateAt();
  console.log('所有資料修正完成');
};

main();
