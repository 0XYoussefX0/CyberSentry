import { Account, Models } from "node-appwrite";

export const getUser = async (account: Account) => {
  let user: Models.User<Models.Preferences> | null;
  try {
    user = await account.get();
  } catch {
    user = null;
  }
  return user;
};
