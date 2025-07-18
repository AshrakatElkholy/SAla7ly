import React from 'react';
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
    I18nManager,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';


// Enable RTL for Arabic
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const HomeScreen = () => {
    const serviceCategories = [
        { id: 1, name: 'نقاشة', icon: 'paint-brush' },
        { id: 2, name: 'تجارة', icon: 'shopping-cart' },
        { id: 3, name: 'سباكة', icon: 'wrench' },
        { id: 4, name: 'كهرباء', icon: 'bolt' },
    ];

    const services = [
        {
            id: 1,
            title: 'صيانة مكيفات',
            provider: 'احمد محمد',
            price: '250ج.م',
            rating: '4.5',
            reviews: '(51)',
            image: require('../assets/service1.png'),
        },
        {
            id: 2,
            title: 'صيانة مكيفات',
            provider: 'احمد محمد',
            price: '250ج.م',
            rating: '4.5',
            reviews: '(51)',
            image: require('../assets/service1.png'),
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity style={styles.notificationButton}>
                        <Icon name="notifications" size={24} color="#333" />
                    </TouchableOpacity>
                    <View style={styles.userInfo}>
                        <Text style={styles.welcomeText}>أهلا أحمد علي</Text>
                        <View style={styles.subTextContainer}>
                            <Text style={styles.subText}>مرحباً بك في التطبيق</Text>
                            <Icon name="location-on" size={16} color="#666" style={styles.locationIcon} />
                        </View>
                    </View>
                </View>
            </View>


            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        {/* Left image icon */}
                        <View style={styles.searchImageIcon}>
                            <Image
                                source={require('../assets/filter-square.png')}
                                style={styles.searchImage}
                            />
                        </View>

                        {/* Input and search icon */}
                        <View style={styles.searchInputWrapper}>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="بحث"
                                placeholderTextColor="#999"
                                textAlign="right"
                            />
                            <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
                        </View>
                    </View>

                </View>

                {/* Featured Banner */}
                <View style={styles.bannerContainer}>
                    <View style={styles.banner}>
                        <Image
                            source={require('../assets/banner.png')}
                            style={styles.bannerImage}
                        />
                    </View>
                </View>

                {/* Services Categories */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <TouchableOpacity style={styles.moreButton}>
                            <Text style={styles.moreButtonText}>المزيد</Text>
                        </TouchableOpacity>
                        <Text style={styles.sectionTitle}>الخدمات</Text>
                    </View>
                    <View style={styles.categoriesContainer}>
                        {serviceCategories.map((category) => (
                            <TouchableOpacity key={category.id} style={styles.categoryItem}>
                                <View style={styles.categoryIcon}>
                                    <FontAwesome5 name={category.icon} size={24} color="#2196F3" />
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
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.servicesScrollView}>
                        <View style={styles.servicesContainer}>
                            {services.map((service) => (
                                <View key={service.id} style={styles.serviceCard}>
                                    <View style={styles.serviceImageContainer}>
                                        <Image source={service.image} style={styles.serviceImage} />

                                        {/* Favorite Icon - Top Left */}
                                        <View style={styles.favoriteBadge}>
                                            <FontAwesome name="bookmark" size={14} color="white" />
                                        </View>

                                        {/* Rating - Top Right */}
                                        <View style={styles.ratingBadge}>
                                            <FontAwesome name="star" size={12} color="#FFD700" />
                                            <Text style={styles.ratingText}>{service.rating}</Text>
                                            <Text style={styles.reviewsText}>{service.reviews}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.serviceInfo}>
                                        <View style={styles.serviceTitleRow}>
                                            <Text style={styles.servicePrice}>{service.price}</Text>
                                            <Text style={styles.serviceTitle}>{service.title}</Text>
                                        </View>
                                        <Text style={styles.serviceProvider}>{service.provider}</Text>
                                        <TouchableOpacity style={styles.bookButton}>
                                            <Text style={styles.bookButtonText}>احجز الان</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem}>
                    <Icon name="person" size={24} color="#999" />
                    <Text style={styles.navText}>الملف الشخصي</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <FontAwesome name="bookmark" size={24} color="#999" />
                    <Text style={styles.navText}>المفضلة</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Icon name="message" size={24} color="#999" />
                    <Text style={styles.navText}>الرسائل</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Icon name="grid-view" size={24} color="#999" />
                    <Text style={styles.navText}>الخدمات</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
                    <Icon name="home" size={24} color="#2196F3" />
                    <Text style={[styles.navText, styles.activeNavText]}>الرئيسية</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: 'transparent',
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userInfo: {
        flex: 1,
        alignItems: 'flex-end',
    },
    welcomeText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'right',
    },
    subTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    subText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'right',
    },
    locationIcon: {
        marginLeft: 5,
    },
    notificationButton: {
        padding: 5,
    },
    content: {
        flex: 1,
    },
    searchContainer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 45,
    },

    searchImageIcon: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 4,
        marginRight: 8,
    },

    searchImage: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },

    searchInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'flex-end',
    },

    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        paddingHorizontal: 8,
    },

    searchIcon: {
        marginLeft: 8,
    },

    bannerContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    banner: {
        height: 160,
        borderRadius: 15,
        overflow: 'hidden',
        position: 'relative',
    },
    bannerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    bannerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    bannerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 8,
    },
    bannerSubtitle: {
        fontSize: 14,
        color: '#ffffff',
        textAlign: 'center',
        lineHeight: 20,
    },
    sectionContainer: {
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'right',
    },
    moreButton: {
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    moreButtonText: {
        fontSize: 14,
        color: '#',
        textAlign: 'left',
    },
    categoriesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    categoryItem: {
        alignItems: 'center',
        flex: 1,
    },
    categoryIcon: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#f0f8ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    categoryText: {
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
    },
    servicesScrollView: {
        flexGrow: 0,
    },
    servicesContainer: {
        flexDirection: 'row',
    },
    serviceCard: {
        width: 300,
        marginRight: 10,
        backgroundColor: '#ffffff',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    serviceImageContainer: {
        position: 'relative',
    },
    serviceImage: {
        width: '100%',
        height: 120,
        resizeMode: 'cover',
    },
    ratingBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 15,
        paddingHorizontal: 8,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    favoriteBadge: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: 'rgba(153, 146, 146, 0.9)',
        borderRadius: 15,
        padding: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ratingText: {
        fontSize: 12,
        color: '#333',
        marginHorizontal: 3,
    },
    reviewsText: {
        fontSize: 10,
        color: '#666',
    },
    serviceInfo: {
        padding: 12,
    },
    serviceTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    serviceTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'right',
        flex: 1,
    },
    serviceProvider: {
        fontSize: 12,
        color: '#666',
        marginBottom: 12,
        textAlign: 'right',
    },
    servicePrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'left',
    },
    bookButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#2196F3',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    bookButtonText: {
        color: '#2196F3',
        fontSize: 14,
        fontWeight: 'bold',
    },
    bottomNav: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 5,
    },
    activeNavItem: {
        // Active state styling
    },
    navText: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
    activeNavText: {
        color: '#2196F3',
    },
});

export default HomeScreen;