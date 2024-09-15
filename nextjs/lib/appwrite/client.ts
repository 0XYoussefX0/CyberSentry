import { Account, Client, Databases, Locale } from "appwrite";

export const createClient = async () => {
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
