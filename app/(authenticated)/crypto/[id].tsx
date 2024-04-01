import {
  Image,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements";
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { CartesianChart, Line, useChartPressState } from "victory-native";
import { Circle, useFont } from "@shopify/react-native-skia";
import { format } from "date-fns";
import * as Haptics from "expo-haptics";
import Animated, {
  SharedValue,
  useAnimatedProps,
} from "react-native-reanimated";
Animated.addWhitelistedNativeProps({ text: true });
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

function ToolTip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
  return <Circle cx={x} cy={y} r={8} color={Colors.primary} />;
}

const Page = () => {
  const headerHeight = useHeaderHeight();
  const { id } = useLocalSearchParams();
  const categories = ["Overview", "News", "Transactions", "Orders"];
  const [activeIndex, setActiveIndex] = useState(0);
  const font = useFont(require("@/assets/fonts/SpaceMono-Regular.ttf"), 12);
  const { state, isActive } = useChartPressState({ x: 0, y: { price: 0 } });

  const { data } = useQuery({
    queryKey: ["info", id],
    queryFn: async () => {
      const info = await fetch(`/api/info?ids=${id}`).then((res) => res.json());
      return info[+id];
    },
  });
  const { data: tickers } = useQuery({
    queryKey: ["ticker", id],
    queryFn: async (): Promise<any[]> =>
      fetch(`/api/ticker`, { method: "GET" }).then((res) => res.json()),
  });

  useEffect(() => {
    console.log(isActive);
    if (isActive) {
      Haptics.selectionAsync();
    }
  }, [isActive]);
  const animatedPriceText = useAnimatedProps(() => {
    return {
      text: `£ ${state.y?.price?.value?.value.toFixed(2)}`,
      defaultValue: "",
    };
  });
  const animatedDateText = useAnimatedProps(() => {
    const date = new Date(state.x.value.value);
    return {
      text: `${date.toLocaleDateString()}`,
      defaultValue: "",
    };
  });
  return (
    <>
      <Stack.Screen options={{ title: data?.name }} />
      <SectionList
        style={{
          paddingTop: headerHeight,
        }}
        keyExtractor={(i) => i.title}
        renderSectionHeader={() => (
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              paddingHorizontal: 15,
              paddingBottom: 8,
              backgroundColor: Colors.background,
              borderBottomColor: Colors.lightGray,
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          >
            {categories.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={
                  activeIndex === index
                    ? styles.categoriesBtnActive
                    : styles.categoriesBtn
                }
                onPress={() => setActiveIndex(index)}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        contentInsetAdjustmentBehavior="automatic"
        ListHeaderComponent={() => (
          <>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginHorizontal: 15,
              }}
            >
              <Text style={styles.subtitle}>{data?.symbol}</Text>
              {data?.logo && (
                <Image
                  source={{ uri: data?.logo }}
                  style={{ width: 40, height: 40, borderRadius: 50 }}
                />
              )}
            </View>
            <View style={{ flexDirection: "row", gap: 10, margin: 12 }}>
              <TouchableOpacity
                style={[
                  defaultStyles.pillButtonSmall,
                  {
                    backgroundColor: Colors.primary,
                    flexDirection: "row",
                    gap: 16,
                  },
                ]}
              >
                <Ionicons name="add" size={24} color={"#fff"} />
                <Text style={[defaultStyles.buttonText, { color: "#fff" }]}>
                  Buy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  defaultStyles.pillButtonSmall,
                  {
                    backgroundColor: Colors.primaryMuted,
                    flexDirection: "row",
                    gap: 16,
                  },
                ]}
              >
                <Ionicons name="arrow-back" size={24} color={Colors.primary} />
                <Text
                  style={[defaultStyles.buttonText, { color: Colors.primary }]}
                >
                  Receive
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        sections={[{ data: [{ title: "Chart" }] }]}
        renderItem={({ item }) => (
          <>
            {/* Chart */}
            <View style={[defaultStyles.block, { height: 500 }]}>
              {tickers && tickers.length > 0 && (
                <>
                  {!isActive && (
                    <View>
                      <Text
                        style={{
                          fontSize: 25,
                          fontWeight: "600",
                          color: Colors.dark,
                        }}
                      >
                        {/* get the last price */}£
                        {tickers[tickers.length - 1]?.price?.toFixed(2)}
                      </Text>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "600",
                          color: Colors.gray,
                        }}
                      >
                        Today
                      </Text>
                    </View>
                  )}
                  {isActive && (
                    <View>
                      <AnimatedTextInput
                        editable={false}
                        underlineColorAndroid={"transparent"}
                        style={{
                          fontSize: 25,
                          fontWeight: "600",
                          color: Colors.dark,
                        }}
                        animatedProps={animatedPriceText}
                      ></AnimatedTextInput>
                      <AnimatedTextInput
                        style={{
                          fontSize: 18,
                          fontWeight: "600",
                          color: Colors.gray,
                        }}
                        animatedProps={animatedDateText}
                      ></AnimatedTextInput>
                    </View>
                  )}
                  <CartesianChart
                    data={tickers}
                    xKey="timestamp"
                    yKeys={["price"]}
                    axisOptions={{
                      font,
                      tickCount: 5,
                      labelOffset: {
                        x: -2,
                        y: 0,
                      },
                      labelColor: "gray",
                      formatYLabel: (v) => `£${v}`,
                      formatXLabel: (ms) =>
                        format(new Date(ms !== undefined && ms), "MM/yy"),
                    }}
                    chartPressState={state}
                  >
                    {({ points }) => (
                      <>
                        <Line
                          points={points?.price}
                          color={Colors.primary}
                          strokeWidth={3}
                        />
                        {isActive && (
                          <ToolTip
                            x={state.x.position}
                            y={state.y?.price?.position}
                          />
                        )}
                      </>
                    )}
                  </CartesianChart>
                </>
              )}
            </View>
            <View style={[defaultStyles.block, { marginTop: 20 }]}>
              <Text style={styles.subtitle}>Overview</Text>
              <Text style={{ color: Colors.gray }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam,Duis aute irure dolor in reprehenderit in
                voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit anim id est laborum quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat.
              </Text>
            </View>
          </>
        )}
      ></SectionList>
    </>
  );
};

export default Page;

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: Colors.gray,
  },
  categoryText: {
    fontSize: 14,
    color: Colors.gray,
  },
  categoryTextActive: {
    fontSize: 14,
    color: "#000",
  },
  categoriesBtn: {
    padding: 10,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  categoriesBtnActive: {
    padding: 10,
    paddingHorizontal: 14,

    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
  },
});
