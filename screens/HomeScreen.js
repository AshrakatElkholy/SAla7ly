import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import BottomNavigation from "../Components/BottomNavigation";
import ServiceCard from "../Components/ServiceCard";
import CustomHeaderWithLines from "../Components/CustomHeaderTemp";

const HomeScreen = () => {
    const navigation = useNavigation();

    // ====== Data ======
    const serviceCategories = {
        'brush': require('../assets/categoryIcons/brush.png'),
        'shovel': require('../assets/categoryIcons/shovel.png'),
        'pipe-wrench': require('../assets/categoryIcons/pipe-wrench.png'),
        'flashlight': require('../assets/categoryIcons/flashlight.png'),
    };

    const categoriesData = [
        { id: 1, name: 'نقاشة', icon: 'brush', iconImage: 'brush' },
        { id: 2, name: 'حفر', icon: 'shovel', iconImage: 'shovel' },
        { id: 3, name: 'سباكة', icon: 'pipe-wrench', iconImage: 'pipe-wrench' },
        { id: 4, name: 'كهرباء', icon: 'flashlight', iconImage: 'flashlight' },
    ];

    const services = [
        {
            id: 1,
            title: "صيانة مكيفات",
            provider: "احمد محمد",
            price: "250ج.م",
            rating: "4.5",
            reviews: "(51)",
            image: require("../assets/service1.png"),
            avatar: require("../assets/service1.png"),
        },
        {
            id: 2,
            title: "صيانة مكيفات",
            provider: "احمد محمد",
            price: "250ج.م",
            rating: "4.5",
            reviews: "(51)",
            image: require("../assets/service1.png"),
            avatar: require("../assets/service1.png"),
        },
    ];

    // ====== State ======
    const [favoriteServices, setFavoriteServices] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [userName, setUserName] = useState("");

    // ====== Effects ======
    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const storedName = await AsyncStorage.getItem("userName");
                if (storedName) setUserName(storedName);
            } catch (error) {
                console.error("خطأ أثناء تحميل الاسم:", error);
            }
        };
        fetchUserName();
    }, []);

    // ====== Helpers ======
    const toggleFavorite = (service) => {
        setFavoriteServices((prev) => {
            const exists = prev.find((item) => item.id === service.id);
            return exists ? prev.filter((item) => item.id !== service.id) : [...prev, service];
        });
    };

    const isFavorite = (service) => favoriteServices.some((item) => item.id === service.id);

    const filteredCategories = categoriesData.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // ====== Render ======
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            <CustomHeaderWithLines
                title={userName ? `أهلاً، ${userName}` : "الرئيسية"}
                showTabs={false}
                showIcons={true}
            />

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <View style={styles.searchImageIcon}>
                            <Image
                                source={require("../assets/filter-square.png")}
                                style={styles.searchImage}
                            />
                        </View>
                        <View style={styles.searchInputWrapper}>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="بحث"
                                placeholderTextColor="#999"
                                textAlign="right"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                            <Icon
                                name="search"
                                size={20}
                                color="#999"
                                style={styles.searchIcon}
                            />
                        </View>
                    </View>
                </View>

                {/* Featured Banner */}
                <View style={styles.bannerContainer}>
                    <View style={styles.banner}>
                        <Image
                            source={require("../assets/banner.jpg")}
                            style={styles.bannerImage}
                        />
                          <View style={styles.bannerTextContainer}>
                            <Text style={styles.bannerTextLine1}>خدمة صيانة الأجهزة</Text>
                            <Text style={styles.bannerTextLine2}>دلوقتي تقدر تطلب فني للغسالة، التلاجة أو البوتاجاز.</Text>
                        </View>
                    </View>
                    
                </View>

                {/* Services Categories */}
                <View style={styles.sectionContainer}>
                    <View className="sectionHeader" style={styles.sectionHeader}>
                        <TouchableOpacity
                            style={styles.moreButton}
                            onPress={() => navigation.navigate("ServicesCategoryScreen")}
                        >
                            <Text style={styles.moreButtonText}>المزيد</Text>
                        </TouchableOpacity>
                        <Text style={styles.sectionTitle}>الخدمات</Text>
                    </View>

                    <View style={styles.categoriesContainer}>
                        {filteredCategories.map((category) => (
                            <TouchableOpacity
                                key={category.id}
                                style={styles.categoryItem}
                                onPress={() =>
                                    navigation.navigate("serviceProviderScreen", {
                                        categoryName: category.name,
                                        categoryIcon: serviceCategories[category.icon],
                                    })
                                }
                            >
                                <View style={styles.categoryIcon}>
                                    <Image source={serviceCategories[category.iconImage]} style={styles.iconImage} />
                                </View>
                                <Text style={styles.categoryText}>{category.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Best Services */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <TouchableOpacity style={styles.moreButton}>
                            <Text style={styles.moreButtonText}>المزيد</Text>
                        </TouchableOpacity>
                        <Text style={styles.sectionTitle}>أفضل خدمات</Text>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.servicesScrollView}
                        contentContainerStyle={styles.servicesContainer}
                    >
                        {services.map((service) => (
                            <ServiceCard
                                key={service.id}
                                service={service}
                                onToggleFavorite={toggleFavorite}
                                isFavorite={isFavorite(service)}
                                cardStyle="horizontal"
                                navigation={navigation}
                            />
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>

            {/* Bottom Navigation */}
            <BottomNavigation
                navigation={navigation}
                activeTab="home"
                favoriteServices={favoriteServices}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#ffffff" },
    content: { flex: 1 },
    searchContainer: { paddingHorizontal: 20, paddingVertical: 15 },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 45,
    },
    searchImageIcon: { backgroundColor: "#fff", borderRadius: 10, padding: 4, marginRight: 8 },
    searchImage: { width: 24, height: 24, resizeMode: "contain" },
    searchInputWrapper: { flexDirection: "row", alignItems: "center", flex: 1, justifyContent: "flex-end" },
    searchInput: { flex: 1, fontSize: 16, color: "#333", paddingHorizontal: 8 },
    searchIcon: { marginLeft: 8 },

    bannerContainer: { paddingHorizontal: 20, marginBottom: 20 },
    banner: { height: 160, borderRadius: 15, overflow: "hidden", position: "relative" },
    bannerImage: { width: "100%", height: "100%", resizeMode: "cover" },

    sectionContainer: { paddingHorizontal: 15, marginBottom: 20 },
    sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
    sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#333", textAlign: "right" },
    moreButton: { paddingHorizontal: 12, paddingVertical: 4 },
    moreButtonText: { fontSize: 14, color: "#000", textAlign: "left" },

    categoriesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around", 
    },

    categoryItem: {
        alignItems: "center",
        flexBasis: "24%", 
        marginBottom: 16,
    },

    categoryIcon: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: "#f0f8ff",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },
    iconImage: {
        width: 60,
        height: 50,
        resizeMode: 'contain',
    },

    categoryText: {
        fontSize: 16,
        color: "#333",
        textAlign: "center",
        fontWeight: "500",
    },
        bannerTextContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        alignItems: 'flex-end',
    },

    bannerTextLine1: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'right',
    },

    bannerTextLine2: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'left',
    },

    servicesScrollView: { flexGrow: 0 },
    servicesContainer: { flexDirection: "row", paddingRight: 0 },
});

export default HomeScreen;
