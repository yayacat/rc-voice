/* eslint-disable @typescript-eslint/no-require-imports */
// Constants
const { XP_SYSTEM } = require('../constant');
// Utils
const Logger = require('./logger');
const Get = require('./get');
const Set = require('./set');

const xpSystem = {
  timeFlag: new Map(), // socket -> timeFlag
  elapsedTime: new Map(), // userId -> elapsedTime

  create: async (userId) => {
    await xpSystem.refreshUser(userId);
    xpSystem.timeFlag.set(userId, Date.now());
  },

  delete: async (userId) => {
    await xpSystem.refreshUser(userId);
    xpSystem.timeFlag.delete(userId);
  },

  setup: () => {
    try {
      // Set up XP interval
      setInterval(async () => xpSystem.refreshAllUsers(), 600000);

      new Logger('XPSystem').info(`XP system setup complete`);
    } catch (error) {
      new Logger('XPSystem').error(
        `Error setting up XP system: ${error.message}`,
      );
    }
  },

  refreshAllUsers: async () => {
    for (const [userId, timeFlag] of xpSystem.timeFlag.entries()) {
      try {
        const elapsedTime = xpSystem.elapsedTime.get(userId) || 0;
        let newElapsedTime = elapsedTime + Date.now() - timeFlag;
        while (newElapsedTime >= XP_SYSTEM.INTERVAL_MS) {
          await xpSystem.obtainXp(userId);
          newElapsedTime -= XP_SYSTEM.INTERVAL_MS;
        }
        xpSystem.elapsedTime.set(userId, newElapsedTime);
        xpSystem.timeFlag.set(userId, Date.now()); // Reset timeFlag
        new Logger('XPSystem').info(
          `XP interval refreshed for user(${userId})`,
        );
      } catch (error) {
        new Logger('XPSystem').error(
          `Error refreshing XP interval for user(${userId}): ${error.message}`,
        );
      }
    }
    new Logger('XPSystem').info(
      `XP interval refreshed complete, ${xpSystem.timeFlag.size} users updated`,
    );
  },

  refreshUser: async (userId) => {
    try {
      const timeFlag = xpSystem.timeFlag.get(userId);
      if (timeFlag) {
        const elapsedTime = xpSystem.elapsedTime.get(userId) || 0;
        let newElapsedTime = elapsedTime + Date.now() - timeFlag;
        while (newElapsedTime >= XP_SYSTEM.INTERVAL_MS) {
          await xpSystem.obtainXp(userId);
          newElapsedTime -= XP_SYSTEM.INTERVAL_MS;
        }
        xpSystem.elapsedTime.set(userId, newElapsedTime);
      }
      new Logger('XPSystem').info(`XP interval refreshed for user(${userId})`);
    } catch (error) {
      new Logger('XPSystem').error(
        `Error refreshing XP interval for user(${userId}): ${error.message}`,
      );
    }
  },

  getRequiredXP: (level) => {
    return Math.ceil(
      XP_SYSTEM.BASE_REQUIRE_XP * Math.pow(XP_SYSTEM.GROWTH_RATE, level),
    );
  },

  obtainXp: async (userId) => {
    try {
      const user = await Get.user(userId);
      if (!user) {
        new Logger('XPSystem').warn(
          `User(${userId}) not found, cannot obtain XP`,
        );
        return;
      }
      const server = await Get.server(user.currentServerId);
      if (!server) {
        new Logger('XPSystem').warn(
          `Server(${user.currentServerId}) not found, cannot obtain XP`,
        );
        return;
      }
      const member = await Get.member(user.id, server.id);
      if (!member) {
        new Logger('XPSystem').warn(
          `User(${user.id}) not found in server(${server.id}), cannot update contribution`,
        );
        return;
      }
      const vipBoost = user.vip ? 1 + user.vip * 0.2 : 1;

      // Process XP and level
      user.xp += XP_SYSTEM.BASE_XP * vipBoost;

      let requiredXp = 0;
      while (true) {
        requiredXp = xpSystem.getRequiredXP(user.level);
        if (user.xp < requiredXp) break;
        user.level += 1;
        user.xp -= requiredXp;
      }

      // Update user
      const userUpdate = {
        level: user.level,
        xp: user.xp,
        requiredXp: requiredXp,
        progress: user.xp / requiredXp,
      };
      await Set.user(user.id, userUpdate);

      // Update member contribution if in a server
      const memberUpdate = {
        contribution: member.contribution + XP_SYSTEM.BASE_XP,
      };
      await Set.member(member.id, memberUpdate);

      // Update server wealth
      const serverUpdate = {
        wealth: server.wealth + XP_SYSTEM.BASE_XP * vipBoost,
      };
      await Set.server(server.id, serverUpdate);
    } catch (error) {
      new Logger('XPSystem').error(
        `Error obtaining user(${userId}) XP: ${error.message}`,
      );
    }
  },
};

module.exports = { ...xpSystem };
