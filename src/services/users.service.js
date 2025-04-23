import { db } from '../db.js';

function getAllActive() {
  return db.user.findMany({
    where: { activationToken: null },
  });
}

function getActiveUser(email) {
  return db.user.findUnique({
    where: {
      email,
      activationToken: null,
    },
  });
}

export const usersService = {
  getAllActive,
  getActiveUser,
};
