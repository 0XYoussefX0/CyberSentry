"use server";

import { redirect } from "next/navigation";
import {
  AppwriteException,
  ID,
  Models,
  Permission,
  Query,
  Role,
} from "node-appwrite";
import * as v from "valibot";

import {
  createAdminClient,
  createSessionClient,
  getUser,
} from "@/lib/appwrite/server";
import {
  CONVERSATIONS_COLLECTION_ID,
  DATABASE_ID,
  MESSAGES_COLLECTION_ID,
  USER_CONVERSATIONS_COLLECTION_ID,
  USERS_COLLECTION_ID,
} from "@/lib/env";
import { SelectedUsersIdsSchema } from "@/lib/validationSchemas";

export default async function createRoom(
  selectedUsersIds: string[],
  roomName: string | null,
) {
  const { account } = await createSessionClient();
  const user = await getUser(account);

  if (!user) redirect("/login");

  if (selectedUsersIds.length > 1 && !roomName) {
    return {
      status: "Validation Error",
      error: "Room Name is required",
    };
  }

  const result = v.safeParse(SelectedUsersIdsSchema, selectedUsersIds);

  if (!result.success || selectedUsersIds.length === 0) {
    return {
      status: "server_error",
      error: "An Array of user Ids is required.",
    };
  }

  const { users, databases } = await createAdminClient();
  const usersData = await users.list([Query.equal("$id", selectedUsersIds)]);

  if (usersData.total !== selectedUsersIds.length) {
    return {
      status: "server_error",
      error: "Selected Users Don't exist",
    };
  }

  let conversation_id = ID.unique();

  const permissions = [Permission.write(Role.user(user.$id))];

  const participants = [...selectedUsersIds, user.$id];

  participants.forEach((participantId) => {
    permissions.push(Permission.read(Role.user(participantId)));
  });

  try {
    const messageID = ID.unique();

    await databases.createDocument(
      DATABASE_ID,
      CONVERSATIONS_COLLECTION_ID,
      conversation_id,
      {
        conversation_id,
        participants,
        room_name: roomName,
      },
      permissions,
    );

    await databases.createDocument(
      DATABASE_ID,
      MESSAGES_COLLECTION_ID,
      messageID,
      {
        message_id: messageID,
        conversation_id: conversation_id,
        sender_id: user.$id,
        content: "Hi 👋",
        read_by: [],
      },
    );

    await databases.updateDocument(
      DATABASE_ID,
      CONVERSATIONS_COLLECTION_ID,
      conversation_id,
      { last_message_info: messageID },
    );

    const requests: Promise<Models.Document>[] = [];

    participants.forEach(async (participantId) => {
      const documentID = ID.unique();
      requests.push(
        databases.createDocument(
          DATABASE_ID,
          USER_CONVERSATIONS_COLLECTION_ID,
          documentID,
          { conversation_info: conversation_id, user_info: participantId },
        ),
      );
    });

    await Promise.all(requests);
  } catch (e) {
    const err = e as AppwriteException;
    return {
      status: "server_error",
      error: err.message,
    };
  }

  return { status: "success", roomID: conversation_id };
}
