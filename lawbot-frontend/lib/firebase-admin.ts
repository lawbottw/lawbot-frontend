import * as fbAdmin from 'firebase-admin';
if (!fbAdmin.apps.length) {
  const serviceAccount = {
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  // It's crucial that all parts of the service account are defined for initialization.
  if (serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
    try {
      fbAdmin.initializeApp({
        credential: fbAdmin.credential.cert(serviceAccount),
      });
      console.log("Firebase Admin SDK initialized successfully in lib/firebase-admin.ts.");
    } catch (e: any) {
      console.error("Failed to initialize Firebase Admin SDK in lib/firebase-admin.ts:", e.message);
      // This error will likely prevent the migration script or other admin functionalities from working.
    }
  } else {
    // This warning is for cases where environment variables might be missing.
    // The initializeApp call itself would throw if critical parts of the credential are null/undefined.
    console.warn(
      "Firebase Admin SDK in lib/firebase-admin.ts: One or more crucial environment variables " +
      "(FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY) " +
      "appear to be missing or undefined. SDK Initialization may fail or be incomplete."
    );
    // Attempting to initialize anyway, to let Firebase SDK handle the error reporting if partial.
    // This might be redundant if the above check is sufficient, but ensures an attempt is made.
    try {
        fbAdmin.initializeApp({
            credential: fbAdmin.credential.cert(serviceAccount),
        });
    } catch (e:any) {
        // Error likely already logged by SDK or the first try-catch block.
        // console.error("Secondary attempt to initialize Firebase Admin SDK also failed:", e.message);
    }
  }
}

export const auth = fbAdmin.auth(); // Keep original export for compatibility
export const db = fbAdmin.firestore();   // Add Firestore instance export
export const admin = fbAdmin;        // Export the entire firebase-admin namespace (for Timestamp, etc.)
