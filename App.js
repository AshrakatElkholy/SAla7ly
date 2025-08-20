import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Font from "expo-font";

// CONTEXT
import UserContextProvider, { UserContext } from './screens/Context/UserContext.js';

// SCREENS
import WelcomeScreen from "./screens/welcom_screen";
import SignupScreen from "./screens/user_screens/signup";
import LoginScreen from "./screens/user_screens/login";
import UserCategoryScreen from "./screens/user_category_screen";
import HomeScreen from "./screens/HomeScreen";
import providerHomeScreen from "./screens/provider_screens/providerHomeScreen";

// (Add other screens as in your original App.js)
import IndustrialSpecialtyScreen from "./screens/industrial_screens/onboarding/IndustrialSpecialtyScreen";
import IndustrialIdentityScreen from "./screens/industrial_screens/onboarding/IndustrialIdentityScreen";
import IndustrialLocationScreen from "./screens/industrial_screens/onboarding/IndustrialLocationScreen";
import Done from "./screens/acception-regection_screens/Done";
import Pending from "./screens/acception-regection_screens/pending";
import Refused from "./screens/acception-regection_screens/refused";
import favoriteProviderScreen from "./screens/favoriteScreens/favoriteProviderScreen.js";
import favoriteServiceScreen from "./screens/favoriteScreens/favoriteServiceScreen.js";
import UserLocationScreen from "./screens/industrial_screens/onboarding/UserLocationScreen";
import OrdersScreen from "./screens/orders/OrdersScreen";
import ServiceDetailsScreen from "./screens/ServiceDetailsScreen";
import ProfileScreen from "./screens/profile/ProfileScreen";
import ProviderProfileScreen from "./screens/ProviderProfileScreen";
import NewCard from "./screens/Payment/NewCard";
import TwoPopups from "./screens/Payment/2popups";
import ProviderOrdersScreen from "./screens/provider_screens/orders/ProviderOrdersScreen";
import ProviderServiceDetailsScreen from "./screens/provider_screens/ProviderServiceDetailsScreen";
import providerServicesScreen from "./screens/provider_screens/providerServicesScreen.js";
import providerAddServiceScreen from "./screens/provider_screens/providerAddServiceScreen.js";
import ProviderSettingsScreen from "./screens/provider_screens/ProviderSettingsScreen.js";
import CategoryScreen from "./screens/categoryScreen";
import serviceProviderScreen from "./screens/serviceProviderScreen";
import appointmentBookingScreen from "./screens/appointmentBookingScreen.js";
import serviceFeedbackScreen from "./screens/serviceFeedbackScreen.js";
import MessagesScreen from "./screens/Chats/message-empty";
import MessagesListScreen from "./screens/Chats/chats";
import ChatScreen from "./screens/Chats/ChatScreen";
import AgreementDetailsScreen from "./screens/Chats/AgreementDetailsScreen";
import ProviderChatsList from "./screens/Chats-Provider/chatsp.js";
import ProviderChats from "./screens/Chats-Provider/chatScreenp.js";
import NewOfferScreen from "./screens/Chats-Provider/AgreementDetailsScreenp.js";

const Stack = createStackNavigator();

// --------- AUTH CHECK COMPONENT ---------
function AuthCheck({ navigation }) {
  const { setToken, setUserInfo, setUserId, setUserRole } = useContext(UserContext);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        const userString = await AsyncStorage.getItem('userInfo');
        const user = userString ? JSON.parse(userString) : null;

        if (token && user) {
          setToken(token);
          setUserInfo(user);
          if (user.id || user._id) setUserId(user.id || user._id);
          if (user.role) setUserRole(user.role);

          if (user.role === 'provider') {
            navigation.replace('ProviderHomeScreen');
          } else {
            navigation.replace('HomeScreen');
          }
        } else {
          navigation.replace('LoginScreen');
        }
      } catch (err) {
        console.log('AuthCheck error:', err);
        navigation.replace('LoginScreen');
      }
    };

    checkAuth();
  }, []);

  return (
    <View style={styles.splashContainer}>
      <StatusBar style="light" backgroundColor="#004AAD" />
      <ActivityIndicator size="large" color="#fff" />
      <Image source={require("./assets/logo.png")} style={styles.splashLogo} resizeMode="contain" />
    </View>
  );
}

// --------- MAIN APP ---------
export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          "Almarai-Light": require("./assets/fonts/Almarai/Almarai-Light.ttf"),
          "Almarai-Regular": require("./assets/fonts/Almarai/Almarai-Regular.ttf"),
          "Almarai-Bold": require("./assets/fonts/Almarai/Almarai-Bold.ttf"),
          "Almarai-ExtraBold": require("./assets/fonts/Almarai/Almarai-ExtraBold.ttf"),
        });
      } catch (error) {
        console.log("Font loading error:", error);
      } finally {
        setFontsLoaded(true);
      }
    };

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.splashContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Image source={require("./assets/logo.png")} style={styles.splashLogo} resizeMode="contain" />
      </View>
    );
  }

  return (
    <UserContextProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* CHECK AUTH */}
          <Stack.Screen name="AuthCheck" component={AuthCheck} />

          {/* AUTHENTICATION SCREENS */}
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="SignupScreen" component={SignupScreen} />
          <Stack.Screen name="UserCategoryScreen" component={UserCategoryScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />

          {/* USER/CLIENT SCREENS */}
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="ServiceDetailsScreen" component={ServiceDetailsScreen} />
          <Stack.Screen name="ServicesCategoryScreen" component={CategoryScreen} options={{ headerShown: false }} />
          <Stack.Screen name="serviceProviderScreen" component={serviceProviderScreen} options={{ headerShown: false }} />
          <Stack.Screen name="appointmentBookingScreen" component={appointmentBookingScreen} />
          <Stack.Screen name="serviceFeedbackScreen" component={serviceFeedbackScreen} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          <Stack.Screen name="OrdersScreen" component={OrdersScreen} />
          
          {/* FAVORITES SCREENS */}
          <Stack.Screen name="favoriteServiceScreen" component={favoriteServiceScreen} options={{ headerShown: false }} />
          <Stack.Screen name="favoriteProviderScreen" component={favoriteProviderScreen} options={{ headerShown: false }} />

          {/* PROVIDER ONBOARDING SCREENS */}
          <Stack.Screen name="IndustrialSpecialtyScreen" component={IndustrialSpecialtyScreen} options={{ title: "التخصصات" }} />
          <Stack.Screen name="IndustrialIdentityScreen" component={IndustrialIdentityScreen} />
          <Stack.Screen name="IndustrialLocationScreen" component={IndustrialLocationScreen} />

          {/* PROVIDER SCREENS */}
          <Stack.Screen name="ProviderHomeScreen" component={providerHomeScreen} />
          <Stack.Screen name="providerServicesScreen" component={providerServicesScreen} />
          <Stack.Screen name="providerAddServiceScreen" component={providerAddServiceScreen} />
          <Stack.Screen name="ProviderOrdersScreen" component={ProviderOrdersScreen} />
          <Stack.Screen name="ProviderServiceDetailsScreen" component={ProviderServiceDetailsScreen} />
          <Stack.Screen name="ProviderSettingsScreen" component={ProviderSettingsScreen} />
          <Stack.Screen name="ProviderProfileScreen" component={ProviderProfileScreen} />

          {/* STATUS SCREENS */}
          <Stack.Screen name="PendingScreen" component={Pending} />
          <Stack.Screen name="DoneScreen" component={Done} />
          <Stack.Screen name="RefusedScreen" component={Refused} />

          {/* LOCATION SCREENS */}
          <Stack.Screen name="UserLocation" component={UserLocationScreen} />

          {/* PAYMENT SCREENS */}
          <Stack.Screen name="NewCardScreen" component={NewCard} />
          <Stack.Screen name="TwoPopups" component={TwoPopups} />

          {/* CHAT SCREENS - USER */}
          <Stack.Screen name="MessagesScreen" component={MessagesScreen} />
          <Stack.Screen name="MessagesListScreen" component={MessagesListScreen} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
          <Stack.Screen name="AgreementDetailsScreen" component={AgreementDetailsScreen} />

          {/* CHAT SCREENS - PROVIDER */}
          <Stack.Screen name="ProviderChatsList" component={ProviderChatsList} />
          <Stack.Screen name="ProviderChatScreen" component={ProviderChats} />
          <Stack.Screen name="AgreementDetails" component={NewOfferScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserContextProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: "#004AAD",
    alignItems: "center",
    justifyContent: "center",
  },
  splashLogo: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
});
