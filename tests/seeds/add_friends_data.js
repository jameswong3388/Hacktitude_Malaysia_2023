import FriendshipStatus from "../../src/enums/friendshipStatus.js";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("friends").del();
  await knex("friends").insert([
    { id: 1, sender_id: 1, recipient_id: 2, status: FriendshipStatus.PENDING },
    { id: 2, sender_id: 6, recipient_id: 3, status: FriendshipStatus.ACCEPTED },
    { id: 3, sender_id: 4, recipient_id: 1, status: FriendshipStatus.PENDING },
    { id: 4, sender_id: 5, recipient_id: 6, status: FriendshipStatus.PENDING },
  ]);
}
