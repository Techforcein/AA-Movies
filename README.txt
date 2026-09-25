FIREBASE AUTH EXAMPLE

Firebase project: tic-tac-toe-aura-2acca

SETUP:
1. Firebase Console -> Authentication -> Sign-in method -> enable Email/Password.
2. Firebase Console -> Firestore Database -> Create database.
3. Put the contents of firestore.rules into Firestore Rules and publish.
4. Host these files on a web server (or use a local web server). Do not rely on file:// if modules are blocked.
5. Open signup.html and create an account.
6. Successful signup/login redirects to M2.html.
7. Logout and directly open M2.html: it redirects to login.html.

The Firebase web config is designed to be used in frontend code. Never place service-account private keys or Firebase Admin credentials in these files.

M2.html is still a public static file if your host makes it public. Actual private data must be protected with Firebase Auth plus Firestore/Storage Security Rules.
