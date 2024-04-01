import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useAssets } from "expo-asset";
import { Link } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";

const Page = () => {
  const [assets] = useAssets([require("../assets/images/Phone.jpg")]);
  return (
    <View style={styles.container}>
      {assets && <Image source={{ uri: assets[0].uri }} style={styles.image} />}
      <View style={{ padding: 15, marginTop: 50 }}>
        <Text style={{ fontSize: 22, color: "#000", textAlign: "right" }}>
          Welcome to the App
        </Text>
      </View>
      <View style={styles.buttons}>
        <Link
          asChild
          href={"/login"}
          style={[
            defaultStyles.pillButton,
            { flex: 1, backgroundColor: Colors.dark },
          ]}
        >
          <TouchableOpacity>
            <Text style={{ color: "#fff", fontSize: 18 }}>Log In </Text>
          </TouchableOpacity>
        </Link>
        <Link
          asChild
          href={"/signup"}
          style={[
            defaultStyles.pillButton,
            { flex: 1, backgroundColor: "#fff" },
          ]}
        >
          <TouchableOpacity>
            <Text style={{ fontSize: 18 }}>Sign Up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 20,
    gap: 20,
    marginBottom: 60,
    paddingHorizontal: 20,
  },
});
