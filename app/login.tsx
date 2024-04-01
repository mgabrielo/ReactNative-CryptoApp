import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSignIn } from "@clerk/clerk-expo";

enum SignInType {
  Phone,
  Email,
  Google,
  Apple,
}

const LogIn = () => {
  const [countryCode, setCountryCode] = useState("+44");
  const [phoneNumber, setPhoneNumber] = useState("");
  const keyboardVerticalOffset = Platform.OS == "android" ? 80 : 90;
  const router = useRouter();
  const { signIn } = useSignIn();

  const onLogIn = async (type: SignInType) => {
    if (type === SignInType.Phone) {
      const fullPhoneNumber = `${countryCode}${phoneNumber}` as string;
      try {
        const { supportedFirstFactors } = await signIn!.create({
          identifier: fullPhoneNumber,
        });
        const firstPhoneFactor: any = supportedFirstFactors.find(
          (factor: any) => {
            return factor.strategy === "phone_code";
          }
        );
        const { phoneNumberId } = firstPhoneFactor;
        await signIn?.prepareFirstFactor({
          strategy: "phone_code",
          phoneNumberId,
        });
        router.push({
          pathname: "/verify/[phone]",
          params: { phone: fullPhoneNumber, signin: "true" },
        });
      } catch (error) {}
    }
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.header}>Welcome Back</Text>
        <Text style={defaultStyles.descriptionText}>
          Enter Your Phone Number asssociated with your account
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            keyboardType="numeric"
            style={styles.countryCodeInput}
            placeholderTextColor={Colors.gray}
            value={countryCode}
          />
          <TextInput
            placeholder="Phone Number"
            keyboardType="numeric"
            style={styles.input}
            onChangeText={(text) => setPhoneNumber(text)}
            placeholderTextColor={Colors.gray}
            value={phoneNumber}
          />
        </View>
        <Link href={"/signup"} asChild style={{ marginBottom: 15 }}>
          <TouchableOpacity>
            <Text style={defaultStyles.textLink}>
              Don't Have An Account , Sign Up
            </Text>
          </TouchableOpacity>
        </Link>
        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            phoneNumber !== "" ? styles.enabled : styles.disabled,
            { marginBottom: 20 },
          ]}
          onPress={() => onLogIn(SignInType.Phone)}
        >
          <Text style={defaultStyles.buttonText}>Continue</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <View
            style={{ flex: 1, height: 1, backgroundColor: Colors.lightGray }}
          />
          <Text style={{ fontSize: 20 }}>or</Text>
          <View
            style={{ flex: 1, height: 1, backgroundColor: Colors.lightGray }}
          />
        </View>
        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            {
              flexDirection: "row",
              gap: 15,
              marginTop: 20,
              backgroundColor: "#fff",
            },
          ]}
          onPress={() => onLogIn(SignInType.Email)}
        >
          <Ionicons name="mail" size={24} color={"#000"} />
          <Text style={[defaultStyles.buttonText, { color: "#000" }]}>
            Continue With Email
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            {
              flexDirection: "row",
              gap: 15,
              marginTop: 20,
              backgroundColor: "#fff",
            },
          ]}
          onPress={() => onLogIn(SignInType.Google)}
        >
          <Ionicons name="logo-google" size={24} color={"#000"} />
          <Text style={[defaultStyles.buttonText, { color: "#000" }]}>
            Continue With Google
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            {
              flexDirection: "row",
              gap: 15,
              marginTop: 20,
              backgroundColor: "#fff",
            },
          ]}
          onPress={() => onLogIn(SignInType.Apple)}
        >
          <Ionicons name="logo-apple" size={24} color={"#000"} />
          <Text style={[defaultStyles.buttonText, { color: "#000" }]}>
            Continue With Apple
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LogIn;

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 30,
    flexDirection: "row",
    gap: 5,
  },
  countryCodeInput: {
    backgroundColor: Colors.lightGray,
    padding: 20,
    borderRadius: 15,
    fontSize: 20,
  },
  input: {
    backgroundColor: Colors.lightGray,
    padding: 20,
    borderRadius: 15,
    fontSize: 20,
    flex: 1,
  },
  enabled: {
    backgroundColor: Colors.primary,
  },
  disabled: {
    backgroundColor: Colors.primaryMuted,
  },
});
