# Clerk Expo and Hapijs integration

### Starting the Hapi Server

- Install dependencies

```bash
cd server
npm i
```

- Replace your secret key in the **server.js** file in the **setClerkApiKey** method.

- Start the server

```bash
node ./server.js
```

- You should get the message

```bash
Server running on http://0.0.0.0:3000
```

### Starting the expo app

- Install dependencies

```bash
npm i
```

- Replace your public key in the **App.js** file in the **publishableKey** prop.

- Start the app

```bash
cd myapp
npx expo start
```

- Open your app using [Expo Go](https://docs.expo.dev/get-started/installation/#expo-go-app-for-android-and-ios)
