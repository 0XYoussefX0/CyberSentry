import { Account, Client, Databases, Locale, Models } from "appwrite";

export const createClient = () => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

  return {
    get locale() {
      return new Locale(client);
    },
    get databases() {
      return new Databases(client);
    },
    get account() {
      return new Account(client);
    },
  };
};

export const getUser = async (account: Account) => {
  let user: Models.User<Models.Preferences> | null;
  try {
    user = await account.get();
  } catch {
    user = null;
  }
  return user;
};
