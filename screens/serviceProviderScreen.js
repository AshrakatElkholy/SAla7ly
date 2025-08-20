import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Image,
    ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, useRoute } from '@react-navigation/native';
import { UserContext } from '../screens/Context/UserContext';

import BottomNavigation from '../Components/BottomNavigation';
import ServiceCard from '../Components/ServiceCard';
import CustomHeaderWithLines from '../Components/CustomHeaderTemp';

const NGROK_URL = 'https://45df9571624f.ngrok-free.app';

const serviceProviderScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { categoryName, categoryIcon, categoryId } = route.params;

    const [searchQuery, setSearchQuery] = useState('');
    const [favoriteServices, setFavoriteServices] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [servicesLoading, setServicesLoading] = useState(false);

    const iconImages = {
        'brush': require('../assets/categoryIcons/brush.png'),
        'shovel': require('../assets/categoryIcons/shovel.png'),
        'pipe-wrench': require('../assets/categoryIcons/pipe-wrench.png'),
        'flashlight': require('../assets/categoryIcons/flashlight.png'),
        'tool-box': require('../assets/categoryIcons/tool-box.png'),
        'soldering': require('../assets/categoryIcons/soldering.png'),
    };

    // helper function to get token
    const { token } = useContext(UserContext);
    
    const getAuthHeaders = () => {
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `bearer ${token}`, // حروف صغيرة
        };
    };

    useEffect(() => {
        fetchAllCategories();
        fetchServices(categoryName);
    }, [categoryName]);

    const fetchAllCategories = async () => {
        try {
            const headers = await getAuthHeaders();
            const response = await fetch(`${NGROK_URL}/category`, {
                method: 'GET',
                headers,
                timeout: 10000,
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            const categoriesArray = Array.isArray(data) ? data : (data?.categories ? data.categories : []);

            const mappedCategories = categoriesArray.map((cat, index) => ({
                id: cat.id || cat._id || `category-${index}`,
                name: cat.title || cat.name || cat.categoryName || 'خدمة',
                title: cat.title || cat.name || cat.categoryName || 'خدمة',
                icon: getLocalIconPath(cat.title || cat.name || cat.categoryName || 'خدمة'),
                iconImage: getLocalIconPath(cat.title || cat.name || cat.categoryName || 'خدمة'),
                apiIcon: cat.image?.secure_url || null
            }));

            setAllCategories(mappedCategories);
        } catch (error) {
            setAllCategories([
                { id: 'fallback1', name: 'نقاشه', title: 'نقاشه', icon: 'brush', iconImage: 'brush', apiIcon: null },
                { id: 'fallback2', name: 'كهربائي', title: 'كهربائي', icon: 'flashlight', iconImage: 'flashlight', apiIcon: null }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const fetchServices = async (categoryNameParam) => {
        setServicesLoading(true);
        try {
            const headers = await getAuthHeaders();
            const url = `${NGROK_URL}/user/getServiceByName?name=${encodeURIComponent(categoryNameParam)}`;
            const response = await fetch(url, { method: 'GET', headers, timeout: 15000 });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            let servicesArray = [];
            if (data.success && data.services && Array.isArray(data.services)) {
                servicesArray = data.services;
            } else if (data.services && Array.isArray(data.services)) {
                servicesArray = data.services;
            } else if (Array.isArray(data)) {
                servicesArray = data;
            } else if (data.data && Array.isArray(data.data)) {
                servicesArray = data.data;
            }

            const mappedServices = servicesArray.map((service, index) => ({
                id: service.id || service._id || `service-${index}`,
                title: service.title || service.name || service.serviceName || service.description || 'خدمة غير محددة',
                provider: service.description || 'مقدم خدمة',
                price: service.price ? `${service.price}ج.م` :
                    (service.minPrice && service.maxPrice ? `${service.minPrice} - ${service.maxPrice}ج.م` :
                        service.cost ? `${service.cost}ج.م` : 'السعر غير محدد'),
                rating: service.rating || service.averageRating || service.rate || '4.5',
                reviews: service.reviews || service.reviewCount || service.reviewsCount || '(0)',
                image: service.mainImage?.secure_url
                    ? { uri: service.mainImage.secure_url }
                    : service.image?.secure_url
                        ? { uri: service.image.secure_url }
                        : (service.images && service.images.length > 0
                            ? { uri: service.images[0]?.secure_url || service.images[0] }
                            : require('../assets/service1.jpg')),
                avatar: service.mainImage?.secure_url
                    ? { uri: service.mainImage.secure_url }
                    : require('../assets/service1.jpg'),
                category: categoryNameParam,
                categoryIcon: service.categories?.image || service.category?.image || categoryIcon,
                description: service.description || service.details || 'لا يوجد وصف',
                minPrice: service.minPrice || 0,
                maxPrice: service.maxPrice || 0,
                providerId: service.providerId || service.userId || service.user?._id || '',
                categoryId: service.categoryId || service.category?._id || '',
                isConfirmed: service.isConfirmed || false,
                createdAt: service.createdAt || '',
                updatedAt: service.updatedAt || ''
            }));

            setServices(mappedServices);
        } catch (error) {
            setServices([]);
        } finally {
            setServicesLoading(false);
        }
    };

    const getLocalIconPath = (categoryName) => {
        const name = categoryName.toLowerCase();
        if (name.includes('نقاش') || name.includes('paint')) return 'brush';
        if (name.includes('حفر') || name.includes('dig')) return 'shovel';
        if (name.includes('سباك') || name.includes('plumb')) return 'pipe-wrench';
        if (name.includes('كهرباء') || name.includes('electric')) return 'flashlight';
        if (name.includes('ميكانيك') || name.includes('mechanic')) return 'tool-box';
        if (name.includes('أجهزة') || name.includes('device')) return 'soldering';
        return 'brush';
    };

    const filteredServices = services.filter(service =>
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.provider.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleFavorite = (service) => {
        setFavoriteServices(prev => {
            const exists = prev.find(item => item.id === service.id);
            return exists ? prev.filter(item => item.id !== service.id) : [...prev, service];
        });
    };

    const isFavorite = (service) => favoriteServices.some(item => item.id === service.id);

    const handleCategorySelect = (category) => {
        navigation.setParams({
            categoryName: category.name || category.title,
            categoryIcon: category.apiIcon || iconImages[category.icon],
            categoryId: category.id,
        });

        fetchServices(category.name || category.title);
    };

    const HorizontalCategoriesList = () => (
        <View style={styles.horizontalCategoriesContainer}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[styles.horizontalCategoriesContent, { flexDirection: 'row-reverse' }]}
            >
                {allCategories.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={[
                            styles.horizontalCategoryItem,
                            (category.name === categoryName || category.title === categoryName) && styles.selectedCategory
                        ]}
                        onPress={() => handleCategorySelect(category)}
                    >
                        <View style={[
                            styles.horizontalCategoryIcon,
                            (category.name === categoryName || category.title === categoryName) && styles.selectedCategoryIcon
                        ]}>
                            {category.apiIcon ? (
                                <Image
                                    source={{ uri: category.apiIcon }}
                                    style={styles.horizontalIconImage}
                                />
                            ) : (
                                <Image
                                    source={iconImages[category.iconImage] || iconImages['brush']}
                                    style={styles.horizontalIconImage}
                                />
                            )}
                        </View>
                        <Text style={[
                            styles.horizontalCategoryText,
                            (category.name === categoryName || category.title === categoryName) && styles.selectedCategoryText
                        ]}>
                            {category.name || category.title}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {searchQuery.length === 0 && (
                <CustomHeaderWithLines
                    title={categoryName}
                    showTabs={false}
                    showIcons={false}
                />
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
                            placeholder="بحث عن خدمه"
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
                {searchQuery.length === 0 && !loading && <HorizontalCategoriesList />}
                <View style={styles.servicesSection}>
                    {servicesLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#007bff" />
                            <Text style={styles.loadingText}>جاري تحميل الخدمات...</Text>
                        </View>
                    ) : (
                        <>
                            {filteredServices.length > 0 ? (
                                filteredServices.map((service) => (
                                    <ServiceCard
                                        key={service.id}
                                        service={service}
                                        onToggleFavorite={toggleFavorite}
                                        isFavorite={isFavorite(service)}
                                        cardStyle="vertical"
                                        navigation={navigation}
                                    />
                                ))
                            ) : (
                                <View style={styles.noResultsContainer}>
                                    <FontAwesome5 name="search" size={48} color="#ccc" style={styles.noResultsIcon} />
                                    <Text style={styles.noResultsText}>
                                        {searchQuery ? 'لا توجد خدمات مطابقة لبحثك' : 'لا توجد خدمات في هذا التصنيف'}
                                    </Text>
                                    <Text style={styles.noResultsSubtext}>
                                        {searchQuery ? 'جرب كلمات مختلفة أو تصفح الخدمات المتاحة' : 'جرب تصنيف آخر أو تحقق لاحقاً'}
                                    </Text>
                                </View>
                            )}
                        </>
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
    container: { flex: 1, backgroundColor: '#ffffff', paddingVertical: 15 },
    searchContainer: { paddingHorizontal: 20, paddingVertical: 15 },
    searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: 'lightgray', borderRadius: 10, paddingHorizontal: 10, height: 45 },
    searchImageIcon: { backgroundColor: '#fff', borderRadius: 10, padding: 4, marginRight: 8 },
    searchImage: { width: 24, height: 24, resizeMode: 'contain' },
    searchInputWrapper: { flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'flex-end' },
    searchInput: { flex: 1, fontSize: 16, color: '#333', paddingHorizontal: 8 },
    searchIcon: { marginLeft: 8 },
    content: { flex: 1 },
    horizontalCategoriesContainer: { paddingVertical: 15, alignItems: 'flex-start' },
    horizontalCategoriesContent: { paddingLeft: 20, paddingRight: 10 },
    horizontalCategoryItem: { alignItems: 'center', marginRight: 15, width: 80 },
    horizontalCategoryIcon: { width: 60, height: 60, borderRadius: 12, backgroundColor: '#f0f8ff', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    selectedCategory: { transform: [{ scale: 1.05 }] },
    horizontalIconImage: { width: 40, height: 35, resizeMode: 'contain' },
    horizontalCategoryText: { fontSize: 14, color: '#333', textAlign: 'center', fontWeight: '500' },
    selectedCategoryText: { fontWeight: 'bold' },
    servicesSection: { paddingHorizontal: 20, paddingBottom: 20, marginTop: 10 },
    loadingContainer: { alignItems: 'center', paddingVertical: 60 },
    loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
    noResultsContainer: { alignItems: 'center', paddingVertical: 60 },
    noResultsIcon: { marginBottom: 16 },
    noResultsText: { fontSize: 18, fontWeight: '600', color: '#333', textAlign: 'center', marginBottom: 8 },
    noResultsSubtext: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 10 },
});

export default serviceProviderScreen;
