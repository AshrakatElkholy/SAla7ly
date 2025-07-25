import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialIcons';


const providerServiceCard = ({
    title,
    category,
    rating,
    reviews,
    image,
    description,
    provider,
    providerBrief,
    avatar,
    cardStyle = 'horizontal',
    onPress,
}) => {
    const isHorizontal = cardStyle === 'horizontal';

    return (
        <TouchableOpacity activeOpacity={0.9} style={[styles.serviceCard, isHorizontal ? styles.horizontalCard : styles.verticalCard]} onPress={onPress}>
            <View style={styles.serviceImageContainer}>
                <Image source={image} style={styles.serviceImage} />

                <View style={styles.ratingBadge}>
                    <FontAwesome name="star" size={12} color="#FFC107" />
                    <Text style={styles.ratingText}>{rating}</Text>
                    <Text style={styles.reviewsText}>({reviews})</Text>
                </View>
            </View>

            <View style={styles.serviceInfo}>
                <View style={styles.infoRow}>
                    <View style={styles.serviceInfoText}>
                        {/* Provider Name & Avatar */}
                        <View style={styles.serviceTitleRow}>
                            <View style={styles.providerRow}>
                                <Image source={avatar} style={styles.avatar} />
                                <Text style={styles.serviceProvider}>{provider}</Text>
                            </View>
                            <Text style={styles.serviceCategory}>{category}</Text>
                        </View>

                        {/* Title with Notification Icon */}
                        <View style={styles.titleWithIcon}>
                            <Icon name="location-on" size={16} color="#666" style={styles.locationIcon} />

                            <Text style={styles.serviceTitle}>{title}</Text>

                        </View>
                    </View>
                </View>

                <Text style={styles.providerBrief}>{providerBrief}</Text>

                <TouchableOpacity style={styles.bookButton} onPress={onPress}>
                    <Text style={styles.bookButtonText}>تفاصيل طلب</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    serviceCard: {
        backgroundColor: '#ffffff',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
        marginBottom: 15,
    },
    horizontalCard: { width: 340, marginEnd: 10 },
    verticalCard: { width: '100%' },

    serviceImageContainer: {
        position: 'relative',
        height: 120,
        overflow: 'hidden',
    },
    serviceImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        alignSelf: 'center',
    },
    ratingBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 15,
        paddingHorizontal: 8,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        opacity: 0.6,
    },
    ratingText: {
        fontSize: 12,
        color: '#000',
        marginHorizontal: 3,
        fontWeight: '600',
    },
    reviewsText: {
        fontSize: 10,
        color: '#000',
        fontWeight: '600',
    },
    serviceInfo: {
        padding: 12,
    },
    infoRow: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        marginBottom: 8,
    },
    avatar: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginLeft: 5,
    },
    serviceInfoText: {
        flex: 1,
    },
    serviceTitleRow: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    providerRow: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 6,
    },
    serviceTitle: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
        textAlign: 'right',
    },
    titleWithIcon: {
        flexDirection: 'row-reverse',
        alignItems: 'right',
        textAlign : 'right',
        marginTop: 4,
    },
    serviceProvider: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'right',
    },
    serviceCategory: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'left',
    },
    providerBrief: {
        fontSize: 12,
        color: '#444',
        marginBottom: 12,
        textAlign: 'right',
    },
    bookButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#004AAD',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    bookButtonText: {
        color: '#004AAD',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default providerServiceCard;
