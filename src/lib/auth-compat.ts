import { auth, currentUser } from '@clerk/nextjs/server';

export const isClerkConfigured: boolean = Boolean(
  process.env.CLERK_SECRET_KEY &&
  process.env.CLERK_SECRET_KEY !== 'sk_test_Y2xlcmtfc2VjcmV0'
);

export interface MockUser {
  id: string;
  firstName: string;
  lastName: string;
  emailAddresses: { emailAddress: string }[];
  publicMetadata: { role: string };
}

export async function getAuthSession() {
  try {
    const session = await auth();
    return { userId: session.userId };
  } catch (e) {
    console.warn('Clerk auth() failed:', e);
    return { userId: null };
  }
}

export async function getAuthUser(): Promise<MockUser | null> {
  try {
    const user = await currentUser();
    if (user) {
      return {
        id: user.id,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        emailAddresses: user.emailAddresses.map(e => ({ emailAddress: e.emailAddress })),
        publicMetadata: { role: (user.publicMetadata?.role as string) || '' }
      };
    }
    return null;
  } catch (e) {
    console.warn('Clerk currentUser() failed:', e);
    return null;
  }
}
