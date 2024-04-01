import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import RoundButton from "@/app/components/RoundButton";
import DropDown from "@/app/components/DropDown";
import { useBalanceStore } from "@/store/balanceStore";
import { defaultStyles } from "@/constants/Styles";
import { Ionicons } from "@expo/vector-icons";
import WidgetList from "@/app/components/sortableList/WidgetList";
import { useHeaderHeight } from "@react-navigation/elements";

const Home = () => {
  const headerHeight = useHeaderHeight();
  const { balance, clearTransactions, transactions, runTransaction } =
    useBalanceStore();
  const onAddMoney = () => {
    console.log("adding money");
    runTransaction({
      id: Math.random().toString(),
      amount: Math.floor(Math.random() * 1000) * (Math.random() > 0.5 ? -1 : 1),
      date: new Date().toLocaleDateString(),
      description: "Add Money",
    });
  };
  return (
    <ScrollView
      style={{ backgroundColor: Colors.background }}
      contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: 200 }}
    >
      <View style={styles.account}>
        <View style={styles.row}>
          <Text style={styles.balance}>{balance()}</Text>
          <Text style={styles.currency}>£</Text>
        </View>
      </View>
      <View style={styles.actionRow}>
        <RoundButton text="Add Money" icon={"add"} onPress={onAddMoney} />
        <RoundButton
          text="Exchange"
          icon={"refresh"}
          onPress={clearTransactions}
        />
        <RoundButton text="Details" icon={"list"} onPress={onAddMoney} />
        <DropDown />
      </View>

      <Text style={defaultStyles.sectionHeader}>Transactions</Text>
      <View style={styles.transactions}>
        {transactions.length === 0 ? (
          <Text>No Transactions yet</Text>
        ) : (
          transactions.length > 0 &&
          transactions.map((transaction) => (
            <View
              key={transaction.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <View style={styles.circle}>
                <Ionicons
                  name={
                    transaction?.amount && transaction?.amount > 0
                      ? "add"
                      : "remove"
                  }
                  size={24}
                  color={Colors.primary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "400", fontSize: 18 }}>
                  {transaction.description}
                </Text>
                {transaction.date !== undefined && (
                  <Text
                    style={{
                      color: Colors.gray,
                      fontSize: 12,
                    }}
                  >
                    {transaction?.date}
                  </Text>
                )}
              </View>
              <Text style={{ fontSize: 17 }}>£{transaction.amount}</Text>
            </View>
          ))
        )}
      </View>
      <Text style={defaultStyles.sectionHeader}>Widgets</Text>
      <WidgetList />
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  account: {
    margin: 80,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 10,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: Colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  balance: {
    fontSize: 50,
    fontWeight: "bold",
  },
  currency: {
    fontSize: 20,
    fontWeight: "500",
  },
  transactions: {
    marginHorizontal: 20,
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 14,
    gap: 16,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
});
