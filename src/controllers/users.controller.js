import { usersService } from '../services/users.service.js';
import { normalize } from '../utils/validate.js';

const getAll = async (req, res) => {
  const users = await usersService.getAllActive();

  if (!users) {
    return res.status(400);
  }

  res.json(users.map(normalize));
};

const getUserByEmail = async (req, res) => {
  const { email } = req.params;
  const user = await usersService.getActiveUser(email);

  if (!user) {
    return res.status(400);
  }

  res.json(user);
};

export const userController = {
  getAll,
  getUserByEmail,
};
