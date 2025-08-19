import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Image,
    ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import BottomNavigation from '../Components/BottomNavigation';
import CustomHeaderWithLines from '../Components/CustomHeaderTemp'; 

const NGROK_URL = "https://422aa57c657c.ngrok-free.app";

const categoryScreen = () => {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favoriteServices, setFavoriteServices] = useState([]);

    const iconImages = {
        'brush': require('../assets/categoryIcons/brush.png'),
        'shovel': require('../assets/categoryIcons/shovel.png'),
        'pipe-wrench': require('../assets/categoryIcons/pipe-wrench.png'),
        'flashlight': require('../assets/categoryIcons/flashlight.png'),
        'tool-box': require('../assets/categoryIcons/tool-box.png'),
        'soldering': require('../assets/categoryIcons/soldering.png'),
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${NGROK_URL}/category`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                timeout: 10000,
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            const categoriesArray = Array.isArray(data) ? data : (data?.categories ? data.categories : []);

            if (categoriesArray.length === 0) {
                setCategories([]);
                return;
            }

            const mappedCategories = categoriesArray.map((cat, index) => ({
                id: cat._id || cat.id || `category-${index}`,
                name: cat.title || 'خدمة',
                title: cat.title || 'خدمة',
                icon: getIconForCategory(cat.title || 'خدمة'),
                iconImage: getIconForCategory(cat.title || 'خدمة'),
                apiIcon: cat.image?.secure_url || null,
                description: cat.description || '',
                providerCount: cat.providerCount || 0,
                servicesCount: cat.servicesCount || 0
            }));

            setCategories(mappedCategories);
        } catch (error) {
            setCategories([
                {
                    id: 'test1',
                    title: 'نقاشه',
                    name: 'نقاشه',
                    icon: 'brush',
                    iconImage: 'brush',
                    apiIcon: null,
                    description: 'test category'
                },
                {
                    id: 'test2',
                    title: 'كهربائي',
                    name: 'كهربائي',
                    icon: 'flashlight',
                    iconImage: 'flashlight',
                    apiIcon: null,
                    description: 'test category 2'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const getIconForCategory = (categoryName) => {
        const name = categoryName.toLowerCase();
        if (name.includes('نقاش') || name.includes('paint')) return 'brush';
        if (name.includes('حفر') || name.includes('dig')) return 'shovel';
        if (name.includes('سباك') || name.includes('plumb')) return 'pipe-wrench';
        if (name.includes('كهرباء') || name.includes('electric') || name.includes('كهربائي')) return 'flashlight';
        if (name.includes('ميكانيك') || name.includes('mechanic')) return 'tool-box';
        if (name.includes('أجهزة') || name.includes('device')) return 'soldering';
        return 'brush';
    };

    const filteredCategories = categories.filter(category =>
        (category.name || category.title).toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCategoryPress = (category) => {
        navigation.navigate('serviceProviderScreen', {
            categoryName: category.name || category.title,
            categoryIcon: category.apiIcon || iconImages[category.icon],
            categoryId: category.id
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <CustomHeaderWithLines 
                title="الخدمات"
                showTabs={false}
                showIcons={true}
            />

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
                <View style={styles.categoriesSection}>
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#007bff" />
                            <Text style={styles.loadingText}>جاري تحميل التصنيفات...</Text>
                        </View>
                    ) : (
                        <View style={styles.categoriesGrid}>
                            {filteredCategories.length === 0 ? (
                                <View style={styles.noResultsContainer}>
                                    <Text style={styles.noResultsText}>
                                        {searchQuery ? 'لا توجد خدمات مطابقة لبحثك' : 'لا توجد تصنيفات متاحة'}
                                    </Text>
                                </View>
                            ) : (
                                filteredCategories.map((category) => (
                                    <View key={category.id} style={styles.categoryWrapper}>
                                        <TouchableOpacity
                                            style={styles.categoryItem}
                                            onPress={() => handleCategoryPress(category)}
                                        >
                                            <View style={styles.categoryIcon}>
                                                {category.apiIcon ? (
                                                    <Image
                                                        source={{ uri: category.apiIcon }}
                                                        style={styles.iconImage}
                                                    />
                                                ) : (
                                                    <Image
                                                        source={iconImages[category.iconImage] || iconImages['brush']}
                                                        style={styles.iconImage}
                                                    />
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                        <Text style={styles.categoryText}>{category.name || category.title}</Text>
                                    </View>
                                ))
                            )}
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
    container: { flex: 1, backgroundColor: '#ffffff' },
    searchContainer: { paddingHorizontal: 20, paddingVertical: 15 },
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
    searchImageIcon: { backgroundColor: '#fff', borderRadius: 10, padding: 4, marginRight: 8 },
    searchImage: { width: 24, height: 24, resizeMode: 'contain' },
    searchInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'flex-end',
    },
    searchInput: { flex: 1, fontSize: 16, color: '#333', paddingHorizontal: 8 },
    searchIcon: { marginLeft: 8 },
    content: { flex: 1 },
    categoriesSection: { paddingHorizontal: 25, paddingVertical: 20 },
    categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    categoryItem: {
        width: '80%',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        padding: 8,
        borderRadius: 10,
        backgroundColor: '#E6EDF7',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    categoryIcon: {
        width: 60,
        height: 60,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 2,
    },
    iconImage: { width: 70, height: 50, resizeMode: 'contain' },
    categoryWrapper: { width: '50%', alignItems: 'center', marginBottom: 20, gap: 2 },
    categoryText: { fontSize: 22, fontWeight: '500', color: '#000', textAlign: 'center' },
    loadingContainer: { alignItems: 'center', paddingVertical: 60 },
    loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
    noResultsContainer: { alignItems: 'center', paddingVertical: 40, width: '100%' },
    noResultsText: { fontSize: 16, color: '#666', textAlign: 'center' },
});

export default categoryScreen;
