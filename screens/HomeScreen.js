import React, { useState, useEffect, useContext } from "react";
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
    ActivityIndicator,
    Alert
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

import BottomNavigation from "../Components/BottomNavigation";
import ServiceCard from "../Components/ServiceCard";
import CustomHeaderWithLines from "../Components/CustomHeaderTemp";
import { UserContext } from "../screens/Context/UserContext";

const NGROK_URL = "https://3c97880a675a.ngrok-free.app"; 

const HomeScreen = () => {
    const navigation = useNavigation();
    const { token, userInfo } = useContext(UserContext); // ⬅️ استخدام التوكن من Context
    const [favoriteServices, setFavoriteServices] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const filteredCategories = categories.filter(category =>
        (category.name || category.title).toLowerCase().includes(searchQuery.toLowerCase())
    );

    const services = [
        { id: 1, title: "صيانة مكيفات", provider: "احمد محمد", price: "250ج.م", rating: "4.5", reviews: "(51)", image: require("../assets/service1.png"), avatar: require("../assets/service1.png") },
        { id: 2, title: "صيانة مكيفات", provider: "احمد محمد", price: "250ج.م", rating: "4.5", reviews: "(51)", image: require("../assets/service1.png"), avatar: require("../assets/service1.png") },
    ];

    // 🔹 Redirect if no token
    useEffect(() => {
        if (!token) {
            Alert.alert("تنبيه", "لم يتم تسجيل الدخول، يرجى تسجيل الدخول أولاً.");
            navigation.replace("LoginScreen");
        } else {
            fetchCategories();
        }
    }, [token]);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${NGROK_URL}/category`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // ⬅️ استخدم التوكن من Context
                },
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            const categoriesArray = Array.isArray(data) ? data : (data?.categories ? data.categories : []);

            const mappedCategories = categoriesArray.map((cat, index) => ({
                id: cat._id || cat.id || `category-${index}`,
                title: cat.title || "خدمة",
                name: cat.title || "خدمة",
                icon: getIconForCategory(cat.title || "خدمة"),
                iconImage: getIconForCategory(cat.title || "خدمة"),
                apiIcon: cat.image?.secure_url || null,
                description: cat.description || ""
            }));

            setCategories(mappedCategories.slice(0, 4));
        } catch (error) {
            console.error("Error fetching categories:", error);
            Alert.alert("خطأ", "حصل خطأ أثناء تحميل التصنيفات");
            setCategories([
                { id: "test1", title: "نقاشه", name: "نقاشه", icon: "brush", iconImage: "brush", apiIcon: null },
                { id: "test2", title: "كهربائي", name: "كهربائي", icon: "flashlight", iconImage: "flashlight", apiIcon: null },
                { id: "test3", title: "سباك", name: "سباك", icon: "pipe-wrench", iconImage: "pipe-wrench", apiIcon: null },
                { id: "test4", title: "ميكانيكي", name: "ميكانيكي", icon: "tool-box", iconImage: "tool-box", apiIcon: null }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const getIconForCategory = (categoryName) => {
        const name = categoryName.toLowerCase();
        if (name.includes("نقاش") || name.includes("paint")) return "brush";
        if (name.includes("حفر") || name.includes("dig")) return "shovel";
        if (name.includes("سباك") || name.includes("plumb")) return "pipe-wrench";
        if (name.includes("كهرباء") || name.includes("electric") || name.includes("كهربائي")) return "flashlight";
        if (name.includes("ميكانيك") || name.includes("mechanic")) return "tool-box";
        if (name.includes("أجهزة") || name.includes("device")) return "soldering";
        return "brush";
    };

    const serviceCategories = {
        brush: require("../assets/categoryIcons/brush.png"),
        shovel: require("../assets/categoryIcons/shovel.png"),
        "pipe-wrench": require("../assets/categoryIcons/pipe-wrench.png"),
        flashlight: require("../assets/categoryIcons/flashlight.png"),
        "tool-box": require("../assets/categoryIcons/tool-box.png"),
        soldering: require("../assets/categoryIcons/soldering.png"),
    };

    const toggleFavorite = (service) => {
        setFavoriteServices((prev) => {
            const exists = prev.find((item) => item.id === service.id);
            return exists ? prev.filter((item) => item.id !== service.id) : [...prev, service];
        });
    };

    const isFavorite = (service) => favoriteServices.some((item) => item.id === service.id);

    const handleCategoryPress = (category) => {
        navigation.navigate("serviceProviderScreen", {
            categoryName: category.title,
            categoryIcon: category.apiIcon || serviceCategories[category.icon],
            categoryId: category.id,
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <CustomHeaderWithLines
                title={userInfo ? `أهلاً، ${userInfo.name || userInfo.email}` : "الرئيسية"}
                showTabs={false}
                showIcons={true}
            />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {/* 🔍 Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <View style={styles.searchImageIcon}>
                            <Image source={require("../assets/filter-square.png")} style={styles.searchImage} />
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
                            <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
                        </View>
                    </View>
                </View>

                {/* 🖼️ Banner */}
                <View style={styles.bannerContainer}>
                    <View style={styles.banner}>
                        <Image source={require("../assets/banner.jpg")} style={styles.bannerImage} />
                        <View style={styles.bannerTextContainer}>
                            <Text style={styles.bannerTextLine1}>خدمة صيانة الأجهزة</Text>
                            <Text style={styles.bannerTextLine2}>دلوقتي تقدر تطلب فني للغسالة، التلاجة أو البوتاجاز.</Text>
                        </View>
                    </View>
                </View>

                {/* 📌 Categories */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <TouchableOpacity style={styles.moreButton} onPress={() => navigation.navigate("ServicesCategoryScreen")}>
                            <Text style={styles.moreButtonText}>المزيد</Text>
                        </TouchableOpacity>
                        <Text style={styles.sectionTitle}>الخدمات</Text>
                    </View>

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#007bff" />
                            <Text style={styles.loadingText}>جاري تحميل الخدمات...</Text>
                        </View>
                    ) : (
                        <View style={styles.categoriesContainer}>
                            {filteredCategories.length === 0 ? (
                                <View style={styles.noCategoriesContainer}>
                                    <Text style={styles.noCategoriesText}>
                                        {searchQuery ? "لا توجد خدمات مطابقة لبحثك" : "لا توجد تصنيفات متاحة"}
                                    </Text>
                                </View>
                            ) : (
                                filteredCategories.map((category) => (
                                    <TouchableOpacity key={category.id} style={styles.categoryItem} onPress={() => handleCategoryPress(category)}>
                                        <View style={styles.categoryIcon}>
                                            {category.apiIcon ? (
                                                <Image source={{ uri: category.apiIcon }} style={styles.iconImage} />
                                            ) : (
                                                <Image source={serviceCategories[category.iconImage] || serviceCategories["brush"]} style={styles.iconImage} />
                                            )}
                                        </View>
                                        <Text style={styles.categoryText}>{category.title}</Text>
                                    </TouchableOpacity>
                                ))
                            )}
                        </View>
                    )}
                </View>

                {/* ⭐ Best Services */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <TouchableOpacity style={styles.moreButton}>
                            <Text style={styles.moreButtonText}>المزيد</Text>
                        </TouchableOpacity>
                        <Text style={styles.sectionTitle}>أفضل خدمات</Text>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.servicesScrollView} contentContainerStyle={styles.servicesContainer}>
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

            <BottomNavigation navigation={navigation} activeTab="home" favoriteServices={favoriteServices} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#ffffff" },
    content: { flex: 1 },
    searchContainer: { paddingHorizontal: 20, paddingVertical: 15 },
    searchBar: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderWidth: 1, borderColor: "lightgray", borderRadius: 10, paddingHorizontal: 10, height: 45 },
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
    categoriesContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-end", paddingHorizontal: 5 },
    categoryItem: { alignItems: "center", width: "22%", marginBottom: 12, marginHorizontal: "1%" },
    categoryIcon: { width: 70, height: 70, borderRadius: 12, backgroundColor: "#f0f8ff", justifyContent: "center", alignItems: "center", marginBottom: 6 },
    iconImage: { width: 50, height: 42, resizeMode: "contain" },
    categoryText: { fontSize: 14, color: "#333", textAlign: "center", fontWeight: "500", paddingHorizontal: 2 },
    bannerTextContainer: { position: "absolute", bottom: 20, left: 20, right: 20, alignItems: "flex-end" },
    bannerTextLine1: { color: "#fff", fontSize: 18, fontWeight: "bold", marginBottom: 5, textAlign: "right" },
    bannerTextLine2: { color: "#fff", fontSize: 16, textAlign: "left" },
    servicesScrollView: { flexGrow: 0 },
    servicesContainer: { flexDirection: "row", paddingRight: 0 },
    loadingContainer: { alignItems: "center", paddingVertical: 40 },
    loadingText: { marginTop: 10, fontSize: 16, color: "#666" },
    noCategoriesContainer: { alignItems: "center", paddingVertical: 40 },
    noCategoriesText: { fontSize: 16, color: "#666", textAlign: "center" },
});

export default HomeScreen;
