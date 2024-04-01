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
import { useSignUp } from "@clerk/clerk-expo";

const SignUp = () => {
  const [countryCode, setCountryCode] = useState("+44");
  const [phoneNumber, setPhoneNumber] = useState("");
  const keyboardVerticalOffset = Platform.OS == "android" ? 80 : 90;
  const router = useRouter();
  const { signUp } = useSignUp();
  const onSignUp = async () => {
    const fullPhoneNumber = `${countryCode}${phoneNumber}` as string;

    try {
      await signUp?.create({
        phoneNumber: fullPhoneNumber,
      });

      signUp!.preparePhoneNumberVerification();
      router.push({
        pathname: "/verify/[phone]",
        params: { phone: fullPhoneNumber },
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.header}>Lets get Started</Text>
        <Text style={defaultStyles.descriptionText}>
          Enter Your Phone Number, and We will send you a Confirmation Code
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
        <Link href={"/login"} asChild>
          <TouchableOpacity>
            <Text style={defaultStyles.textLink}>
              Already Have An Account , Login
            </Text>
          </TouchableOpacity>
        </Link>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            phoneNumber !== "" ? styles.enabled : styles.disabled,
            { marginBottom: 20 },
          ]}
          onPress={onSignUp}
        >
          <Text style={defaultStyles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignUp;

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
