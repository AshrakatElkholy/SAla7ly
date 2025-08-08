import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import CustomHeaderWithLines from "../../../Components/CustomHeaderTemp";
import NewOrders from "./tabs/NewOrdersProvider";
import CurrentOrders from "./tabs/CurrentOrdersProvider";
import PastOrders from "./tabs/PastOrdersProvider";
import ProviderBottomNavigation from "../../../Components/providerBottomNavigation";
import ProviderOrderCard from "../../../Components/ProviderOrderCard";

const ProviderOrdersScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("new");

  const renderContent = () => {
    switch (activeTab) {
      case "new":
        return <NewOrders navigation={navigation} />;
      case "current":
        return <CurrentOrders navigation={navigation} />;
      case "past":
        return <PastOrders navigation={navigation} />;

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeaderWithLines
        title="طلباتي"
        defaultTab="new"
        tabLabels={{
          new: "الجديدة",
          current: "الجارية",
          past: "السابقة",
        }}
        onTabChange={(tab) => setActiveTab(tab)}
        userType="provider"
      />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
        {renderContent()}
      </ScrollView>
      <ProviderBottomNavigation
        navigation={navigation}
        activeTab="providerOrders"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default ProviderOrdersScreen;
