import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  Pressable,
  StatusBar,
  TextInput,
} from "react-native";
import {
  ClerkProvider,
  useSignIn,
  useAuth,
  useSession,
} from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";

const tokenCache = {
  getToken(key) {
    return SecureStore.getItemAsync(key);
  },
  saveToken(key, value) {
    return SecureStore.setItemAsync(key, value);
  },
};

function OrdersApp() {
  const [orders, setOrders] = useState([]);
  const [email, setEmail] = React.useState("jrperedo@gmail.com");
  const [pwd, setPwd] = React.useState("retorimac");
  const { session } = useSession();
  const { signOut } = useAuth();
  const { signIn, setSession, isLoaded } = useSignIn();

  if (!isLoaded) {
    return null;
  }

  async function onLogOut() {
    await signOut();
  }

  async function onFetchApi() {
    try {
      const token = await session.getToken();
      const res = await fetch("http://192.168.1.60:3000", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const json = await res.json();
        setOrders(json);
        console.log(json);
      } else {
        console.log("Error", res.statusText);
      }
    } catch (error) {
      console.log("Error", error.message);
    }
  }

  async function onLogin() {
    try {
      if (!session) {
        const completeSignIn = await signIn.create({
          identifier: email,
          password: pwd,
        });
        await setSession(completeSignIn.createdSessionId);
      }
    } catch (err) {
      console.log(err.errors ? err.errors[0].message : err);
    }
  }

  if (session) {
    return (
      <View>
        <Text>Email: {session.user.primaryEmailAddress.emailAddress}</Text>
        <View style={{ flexDirection: "row", marginVertical: 10 }}>
          <Text>Photo:</Text>
          <Image
            source={{
              uri: session.user.profileImageUrl,
              width: 64,
              height: 64,
            }}
          />
        </View>
        <View style={{ marginVertical: 10 }}>
          <Pressable
            style={{ backgroundColor: "blue", padding: 16 }}
            onPress={onFetchApi}
          >
            <Text style={{ color: "#fff" }}>Fetch Data from API</Text>
          </Pressable>
        </View>
        {orders.map((order) => {
          return (
            <View key={order.orderId} style={{ padding: 16 }}>
              <Text>Order #{order.orderId}</Text>
              <Text>Products purchased: {order.totalProducts}</Text>
              <Text>Total: ${order.amount}</Text>
            </View>
          );
        })}
        <View style={{ marginVertical: 10 }}>
          <Pressable
            style={{ backgroundColor: "blue", padding: 16 }}
            onPress={onLogOut}
          >
            <Text style={{ color: "#fff" }}>Log Out</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={{ paddingVertical: 50 }}>
      <View style={{ marginVertical: 10 }}>
        <TextInput
          style={{
            borderWidth: 2,
            borderColor: "gray",
            padding: 16,
          }}
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
        />
      </View>
      <View style={{ marginVertical: 10 }}>
        <TextInput
          style={{
            borderWidth: 2,
            borderColor: "gray",
            padding: 16,
          }}
          placeholder="Password"
          onChangeText={setPwd}
          value={pwd}
          autoComplete="password"
          secureTextEntry
        />
      </View>

      <Pressable
        style={{ backgroundColor: "blue", padding: 16 }}
        onPress={onLogin}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>Login</Text>
      </Pressable>
    </View>
  );
}

export default function App() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey="pk_test_###">
      <SafeAreaView>
        <StatusBar barStyle="light-content" />
        <OrdersApp />
      </SafeAreaView>
    </ClerkProvider>
  );
}
