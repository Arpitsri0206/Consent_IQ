import { db } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(
  uid: string,
  email: string,
  name?: string,
  role?: string,
  orgId?: string,
  orgName?: string
) {
  try {
    const result = await db
      .insert(users)
      .values({
        uid,
        email,
        name: name || 'User',
        role: role || 'DATA_PRINCIPAL',
        orgId: orgId || null,
        orgName: orgName || null,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          ...(name ? { name } : {}),
          ...(role ? { role } : {}),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database user query failed:', error);
    throw new Error('Database user query failed. Please try again later.', { cause: error });
  }
}

export async function getUserByUid(uid: string) {
  try {
    const result = await db.select().from(users).where(eq(users.uid, uid));
    return result[0] || null;
  } catch (error) {
    console.error('Database user query failed:', error);
    throw new Error('Database user query failed. Please try again later.', { cause: error });
  }
}
