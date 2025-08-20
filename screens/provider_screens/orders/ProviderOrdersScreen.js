import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import CustomHeaderWithLines from "../../../Components/CustomHeaderTemp";

// import NewOrdersProvider from "./tabs/NewOrdersProvider";
import CurrentOrdersProvider from "./tabs/CurrentOrdersProvider";
import PastOrdersProvider from "./tabs/PastOrdersProvider";
import ProviderBottomNavigation from "../../../Components/providerBottomNavigation";

const ProviderOrdersScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("new");

  const renderContent = () => {
    switch (activeTab) {
      // case "new":
      //   return <NewOrdersProvider navigation={navigation} />;
      case "current":
        return <CurrentOrdersProvider navigation={navigation} />;
      case "past":
        return <PastOrdersProvider navigation={navigation} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeaderWithLines
        title="طلباتي"
        tabLabels={{ new: "الجديدة", current: "الجارية", past: "السابقة" }}
        onTabChange={(tab) => setActiveTab(tab)}
      />

      <View style={{ flex: 1, padding: 16 }}>{renderContent()}</View>

      <ProviderBottomNavigation
        navigation={navigation}
        activeTab="providerOrders"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
});

export default ProviderOrdersScreen;
