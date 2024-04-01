import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Currency } from "@/interfaces/crypto";
import { Link } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements";
import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import { Ionicons } from "@expo/vector-icons";

const Crypto = () => {
  const headerHeight = useHeaderHeight();

  const currencies = useQuery({
    queryKey: ["currencies"],
    queryFn: () => fetch(`/api/listings`).then((res) => res.json()),
  });
  const ids =
    currencies?.data &&
    currencies?.data?.map((currency: Currency) => currency.id).join(",");
  console.log(ids);

  const { data, isLoading } = useQuery({
    queryKey: ["info", ids],
    queryFn: () => fetch(`/api/info?ids=${ids}`).then((res) => res.json()),
    enabled: !!ids,
  });

  if (currencies.isLoading || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }
  return (
    <ScrollView
      style={{ backgroundColor: Colors.background }}
      contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: 400 }}
    >
      <Text style={defaultStyles.sectionHeader}>Latest Crypto</Text>
      <View style={defaultStyles.block}>
        {data &&
          currencies?.data?.length > 0 &&
          currencies?.data?.map((currency: Currency) => (
            <Link
              href={`/(authenticated)/crypto/${currency?.id}`}
              key={currency.id}
              asChild
            >
              <Pressable
                style={{ flexDirection: "row", gap: 12, alignItems: "center" }}
              >
                <Image
                  source={{ uri: data?.[currency.id]?.logo }}
                  style={{ width: 40, height: 40, borderRadius: 50 }}
                />
                <View style={{ flex: 1, flexDirection: "column", gap: 5 }}>
                  <Text style={{ fontWeight: "600", fontSize: 18 }}>
                    {currency.name}
                  </Text>
                  <Text style={{ color: Colors.gray, fontSize: 12 }}>
                    {currency.symbol}
                  </Text>
                </View>
                <View style={{ gap: 6, alignItems: "flex-end" }}>
                  <Text>£{currency?.quote?.EUR?.price.toFixed(2)}</Text>
                  <View style={{ flexDirection: "row", gap: 4 }}>
                    <Ionicons
                      name={
                        currency?.quote?.EUR?.percent_change_1h > 0
                          ? "caret-up"
                          : "caret-down"
                      }
                      size={16}
                      color={
                        currency?.quote?.EUR?.percent_change_1h > 0
                          ? "green"
                          : "red"
                      }
                    />
                    <Text
                      style={{
                        color:
                          currency?.quote?.EUR?.percent_change_1h > 0
                            ? "green"
                            : "red",
                      }}
                    >
                      {currency?.quote?.EUR?.percent_change_1h.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </Pressable>
            </Link>
          ))}
      </View>
    </ScrollView>
  );
};

export default Crypto;

const styles = StyleSheet.create({});
