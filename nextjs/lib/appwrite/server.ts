import { cookies } from "next/headers";
import {
  Account,
  AppwriteException,
  Client,
  Databases,
  Models,
  Query,
  Storage,
  Users,
} from "node-appwrite";

import { DATABASE_ID, USERS_COLLECTION_ID } from "@/lib/env";

const createAdminClient = async () => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);

  return {
    get account() {
      return new Account(client);
    },

    get databases() {
      return new Databases(client);
    },

    get storage() {
      return new Storage(client);
    },

    get users() {
      return new Users(client);
    },
  };
};

const createSessionClient = async () => {
  const session = cookies().get("session");

  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

  if (session) {
    client.setSession(session.value);
  }

  return {
    get account() {
      return new Account(client);
    },

    get databases() {
      return new Databases(client);
    },

    get storage() {
      return new Storage(client);
    },
  };
};

export { createAdminClient, createSessionClient };

export const getUser = async (account: Account) => {
  let user: Models.User<Models.Preferences> | null;
  try {
    user = await account.get();
  } catch {
    user = null;
  }
  return user;
};

export const getUserConversations = async (user_id: string) => {
  try {
    const { databases } = await createSessionClient();

    const { conversations } = await databases.getDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      user_id,
    );

    if (!conversations || conversations.length === 0) {
      return { error: null, conversations: [] };
    }

    const participants: string[] = conversations.flatMap(
      (conv: any) => conv.conversation_info.participants,
    );

    const uniqueParticipants = [...new Set(participants)];

    const uniqueParticipantsIds = uniqueParticipants.filter(
      (participantId) => participantId !== user_id,
    );

    const { documents: participantsData } = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal("user_id", uniqueParticipantsIds)],
    );

    let total_unread_messages = 0;

    const enrichedConversations = conversations.map((conversation: any) => {
      total_unread_messages += conversation.unread_count;

      return {
        ...conversation,
        ...conversation.conversation_info,
        participants: participantsData.filter((participantData) =>
          conversation.conversation_info.participants.includes(
            participantData.user_id,
          ),
        ),
        last_message: conversation.conversation_info.last_message_info.content,
        last_message_timestamp:
          conversation.conversation_info.last_message_info.$createdAt,
      };
    });

    return {
      error: null,
      conversations: enrichedConversations,
      total_unread_messages,
    };
  } catch (e) {
    const err = e as AppwriteException;
    return { error: err.message, conversations: null };
  }
};
