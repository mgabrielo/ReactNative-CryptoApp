import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import Colors from "@/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Link, Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

const CLERK_PUBLISH_KEY = process.env
  .EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;

const queryClient = new QueryClient();
//cache clerk jwt
const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return await SecureStore.setItemAsync(key, value);
    } catch (error) {
      return;
    }
  },
};

// export const unstable_settings = {
//   // Ensure that reloading on `/modal` keeps a back button present.
//   initialRouteName: "(tabs)",
// };

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  const { isLoaded, isSignedIn } = useAuth();
  const segements = useSegments();
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    console.log({ isSignedIn: isSignedIn });
    if (!isLoaded) {
      return;
    }
    const inAuthGroup = segements[0] === "(authenticated)";
    if (isSignedIn && !inAuthGroup) {
      router.replace("/(authenticated)/(tabs)/home");
    } else if (!isSignedIn) {
      router.replace("/");
    }
  }, [isSignedIn]);
  if (!loaded || !isLoaded) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "800" }}>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="login"
        options={{
          headerShown: true,
          title: "",
          headerRight: () => {
            return (
              <Link asChild href={"/help"}>
                <Pressable>
                  <Ionicons
                    name="help-circle-outline"
                    size={24}
                    color="black"
                  />
                </Pressable>
              </Link>
            );
          },
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          headerShown: true,
          title: "",
          headerShadowVisible: false,
          headerBackVisible: true,
          headerStyle: { backgroundColor: Colors.background },
        }}
      />
      <Stack.Screen
        name="verify/[phone]"
        options={{
          headerShown: true,
          title: "",
          headerShadowVisible: false,
          headerBackVisible: true,
          headerStyle: { backgroundColor: Colors.background },
        }}
      />
      <Stack.Screen
        name="(authenticated)/(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(authenticated)/crypto/[id]"
        options={{
          headerShown: true,
          title: "Crypto Details",
          headerTransparent: true,
          header: () => {
            return (
              <BlurView
                intensity={100}
                tint="systemThickMaterialLight"
                style={{
                  flexDirection: "row",
                  paddingTop: top,
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" color={"#000"} size={30} />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                  }}
                >
                  <TouchableOpacity>
                    <Ionicons
                      name="notifications-outline"
                      color={"#000"}
                      size={30}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Ionicons name="star-outline" color={"#000"} size={30} />
                  </TouchableOpacity>
                </View>
              </BlurView>
            );
          },
        }}
      />
      <Stack.Screen
        name="help"
        options={{ title: "help", presentation: "modal" }}
      />
    </Stack>
  );
};

const RootLayoutNav = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider publishableKey={CLERK_PUBLISH_KEY} tokenCache={tokenCache}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar style="dark" />
          <InitialLayout />
        </GestureHandlerRootView>
      </ClerkProvider>
    </QueryClientProvider>
  );
};

export default RootLayoutNav;
