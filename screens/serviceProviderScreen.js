import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    TextInput,
    ScrollView,
    I18nManager,
    Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, useRoute } from '@react-navigation/native';
import BottomNavigation from '../Components/BottomNavigation';
import ServiceCard from '../Components/ServiceCard';
import HorizontalCategoryList from '../Components/HorizontalCategoryList';



const serviceProviderScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { categoryName, categoryIcon } = route.params;

    const [searchQuery, setSearchQuery] = useState('');
    const [favoriteServices, setFavoriteServices] = useState([]);

    const allCategories = [
        { id: 1, name: 'نقاشة', icon: require('../assets/categoryIcons/brush.png') },
        { id: 2, name: 'حفر', icon: require('../assets/categoryIcons/shovel.png') },
        { id: 3, name: 'سباكة', icon: require('../assets/categoryIcons/pipe-wrench.png') },
        { id: 4, name: 'كهرباء', icon: require('../assets/categoryIcons/flashlight.png') },
        { id: 5, name: 'ميكانيكي', icon: require('../assets/categoryIcons/tool-box.png') },
        { id: 6, name: 'فني الأجهزة الكهربائية', icon: require('../assets/categoryIcons/soldering.png') },
        { id: 7, name: 'كهرباء', icon: require('../assets/categoryIcons/flashlight.png') },
        { id: 8, name: 'نقاشة', icon: require('../assets/categoryIcons/brush.png') },
    ];


    const services = [
        {
            id: 1,
            title: 'صيانة مكيفات',
            provider: 'احمد محمد',
            price: '250ج.م',
            rating: '4.5',
            reviews: '(51)',
            image: require('../assets/service1.jpg'),
            avatar: require('../assets/service1.jpg'),
            category: categoryName,
        },
        {
            id: 2,
            title: 'نقاشة',
            provider: 'احمد محمد',
            price: '250ج.م',
            rating: '4.5',
            reviews: '(51)',
            image: require('../assets/service1.jpg'),
            avatar: require('../assets/service1.jpg'),
            category: categoryName,
        },
        {
            id: 3,
            title: 'صيانة مكيفات',
            provider: 'احمد محمد',
            price: '250ج.م',
            rating: '4.5',
            reviews: '(51)',
            image: require('../assets/service1.jpg'),
            avatar: require('../assets/service1.jpg'),
            category: categoryName,
        },
        {
            id: 4,
            title: 'تركيب مكيفات جديدة',
            provider: 'محمد علي',
            price: '400ج.م',
            rating: '4.8',
            reviews: '(32)',
            image: require('../assets/service1.jpg'),
            avatar: require('../assets/service1.jpg'),
            category: categoryName,
        },
        {
            id: 5,
            title: 'تنظيف مكيفات',
            provider: 'سارة أحمد',
            price: '150ج.م',
            rating: '4.3',
            reviews: '(28)',
            image: require('../assets/service1.jpg'),
            avatar: require('../assets/service1.jpg'),
            category: categoryName,
        },
    ];

    const filteredServices = services.filter(service =>
        service.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleFavorite = (service) => {
        setFavoriteServices(prev => {
            const exists = prev.find(item => item.id === service.id);
            if (exists) {
                return prev.filter(item => item.id !== service.id);
            } else {
                return [...prev, service];
            }
        });
    };

    const isFavorite = (service) => {
        return favoriteServices.some(item => item.id === service.id);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            {searchQuery.length === 0 && (
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Icon name="arrow-forward" size={20} color="#fff" />
                        </TouchableOpacity>

                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.headerTitle}>{categoryName}</Text>
                        </View>

                        <View style={styles.placeholder} />
                    </View>
                </View>
            )}


            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <View style={styles.searchImageIcon}>
                        <Image
                            source={require('../assets/filter-square.png')}
                            style={styles.searchImage}
                        />
                    </View>
                    <View style={styles.searchInputWrapper}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="بحث في الخدمات"
                            placeholderTextColor="#999"
                            textAlign="right"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
                    </View>
                </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {searchQuery.length === 0 && (
                    <HorizontalCategoryList
                        categories={allCategories}
                        onPressCategory={(category) => {
                            navigation.setParams({
                                categoryName: category.name,
                                categoryIcon: category.icon,
                            });
                        }}
                    />
                )}

                <View style={styles.servicesSection}>
                    {filteredServices.map((service) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            onToggleFavorite={toggleFavorite}
                            isFavorite={isFavorite(service)}
                            cardStyle="vertical"
                            navigation={navigation}
                        />
                    ))}

                    {filteredServices.length === 0 && (
                        <View style={styles.noResultsContainer}>
                            <FontAwesome5
                                name="search"
                                size={48}
                                color="#ccc"
                                style={styles.noResultsIcon}
                            />
                            <Text style={styles.noResultsText}>لا توجد خدمات مطابقة لبحثك</Text>
                            <Text style={styles.noResultsSubtext}>جرب كلمات مختلفة أو تصفح الخدمات المتاحة</Text>
                        </View>
                    )}
                </View>
            </ScrollView>



            <BottomNavigation
                navigation={navigation}
                activeTab="services"
                favoriteServices={favoriteServices}
            />
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
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E6EDF7',
        backgroundColor: 'transparent',
    },
    headerContent: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 10,
    },

    backButton: {
        backgroundColor: '#004AAD',
        padding: 8,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
    },

    headerTitleContainer: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 6,
    },

    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'right',
    },
    categoryIconContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#f0f8ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholder: {
        width: 34,
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
    content: {
        flex: 1,
    },
    servicesSection: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        marginTop: 20
    },
    servicesContainer: {},
    noResultsContainer: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    noResultsIcon: {
        marginBottom: 16,
    },
    noResultsText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 8,
    },
    noResultsSubtext: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
});

export default serviceProviderScreen;
