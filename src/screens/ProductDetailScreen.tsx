import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { Button } from '../components/Button';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { Star, MapPin, ShieldCheck, MessageCircle } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export const ProductDetailScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { product } = route.params;
  const addItem = useCartStore((state) => state.addItem);
  const { user } = useAuthStore();

  const handleAddToCart = () => {
    addItem(product);
    Alert.alert('Success', 'Product added to cart');
  };

  const handleChat = () => {
    if (!user) {
      Alert.alert('Auth Required', 'Please login to chat with seller');
      return;
    }
    navigation.navigate('Chat', { sellerId: product.sellerId, sellerName: product.sellerName });
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: product.images[0] }} style={styles.image} />
        
        <View style={styles.content}>
          <View style={styles.header}>
            <View>
              <Text style={styles.category}>{product.category}</Text>
              <Text style={styles.title}>{product.title}</Text>
            </View>
            <Text style={styles.price}>{product.price.toLocaleString()} ETB</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Star size={18} color={COLORS.starActive} fill={COLORS.starActive} />
              <Text style={styles.statText}>{product.rating} ({product.reviewCount} reviews)</Text>
            </View>
            <View style={styles.statItem}>
              <ShieldCheck size={18} color={COLORS.success} />
              <Text style={styles.statText}>Verified Seller</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          <View style={styles.sellerCard}>
            <View style={styles.sellerInfo}>
              <View style={styles.sellerAvatar}>
                <Text style={styles.avatarText}>{product.sellerName[0]}</Text>
              </View>
              <View>
                <Text style={styles.sellerName}>{product.sellerName}</Text>
                <View style={styles.locationRow}>
                  <MapPin size={14} color={COLORS.textSecondary} />
                  <Text style={styles.locationText}>Addis Ababa, Ethiopia</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.chatButton} onPress={handleChat}>
              <MessageCircle size={20} color={COLORS.secondary} />
              <Text style={styles.chatButtonText}>Chat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Add to Cart"
          onPress={handleAddToCart}
          style={styles.buyButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  image: {
    width: width,
    height: width,
    backgroundColor: '#eee',
  },
  content: {
    padding: SPACING.lg,
    backgroundColor: COLORS.card,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    marginTop: -SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  category: {
    fontSize: 12,
    color: COLORS.secondary,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  section: {
    marginTop: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.xl,
    marginBottom: 100,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  sellerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: COLORS.textLight,
    fontWeight: 'bold',
    fontSize: 18,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  chatButtonText: {
    color: COLORS.secondary,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.card,
    padding: SPACING.lg,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  buyButton: {
    width: '100%',
  },
});
