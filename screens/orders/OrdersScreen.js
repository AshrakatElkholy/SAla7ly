import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import CurrentOrders from "./CurrentOrders";
import PastOrders from "./PastOrders";
import BottomNavigation from "../../Components/BottomNavigation";
import CustomHeaderWithLines from "../../Components/CustomHeaderTemp";
import { SafeAreaView } from "react-native-safe-area-context";

const OrdersScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("current");

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <CustomHeaderWithLines
        title="طلباتي"
        showTabs={true}
        showIcons={true}
        onTabChange={(tab) => setActiveTab(tab)}
      />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
      >
        {activeTab === "current" ? (
          <CurrentOrders navigation={navigation} />
        ) : (
          <PastOrders navigation={navigation} />
        )}
      </ScrollView>

      <BottomNavigation navigation={navigation} activeTab="orders" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default OrdersScreen;
