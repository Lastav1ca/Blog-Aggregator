import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { users } from "../schema.js";

export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
}

export async function getUserByName(userName: string){
  const[result] = 
  await db
  .select()
  .from(users)
  .where(eq(users.name, userName));
  return result;
}

export async function deleteUsers() {
  const [result] =
  await db
  .delete(users);
  return result;
}

export async function getAllUsers() {
  const result = 
  await db
  .select()
  .from(users);

  return result;
}

export async function getUserById(id : string){
  const [result] =
  await db
  .select()
  .from(users)
  .where(eq(users.id, id))

  return result;
}