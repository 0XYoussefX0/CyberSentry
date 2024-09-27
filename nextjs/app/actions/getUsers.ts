"use server";

import { redirect } from "next/navigation";
import { AppwriteException, Query } from "node-appwrite";

import {
  createAdminClient,
  createSessionClient,
  getUser,
} from "@/lib/appwrite/server";
import { DATABASE_ID, USERS_COLLECTION_ID } from "@/lib/env";

export default async function getUsers(
  query: string,
  selectedUsersIds: string[],
) {
  const { account } = await createSessionClient();
  const user = await getUser(account);

  if (!user) redirect("/login");

  if (typeof query !== "string") return;

  const { users, databases } = await createAdminClient();

  const queries = [
    Query.contains("name", query),
    Query.limit(5),
    Query.notEqual("$id", user.$id),
  ];

  if (selectedUsersIds.length > 0) {
    selectedUsersIds.map((id) => queries.push(Query.notEqual("$id", id)));
  }

  try {
    const result = await users.list(queries);

    const usersIds = result.users.map((user) => user.$id);

    if (result.total === 0) return [];
    const usersInfo = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal("user_id", usersIds)],
    );

    const suggestions = result.users.map((user) => {
      return {
        avatar_image: usersInfo.documents.find(
          (doc) => doc.user_id === user.$id,
        )?.avatar_image,
        name: user.name,
        user_id: user.$id,
      };
    });

    return suggestions;
  } catch (e) {
    const err = e as AppwriteException;
    return { status: "server_error", error: err.message };
  }
}
