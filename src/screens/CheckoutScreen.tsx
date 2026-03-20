import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Modal, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { db } from '../api/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export const CheckoutScreen = () => {
  const { items, total, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');

  const CHAPA_PUBLIC_KEY = 'CHAPUBK_TEST-QmCIBhWYIsdp2tgG0sPr67h5fozBbSz3';

  const handlePayment = async () => {
    if (!address) {
      Alert.alert('Error', 'Please enter delivery address');
      return;
    }

    setLoading(true);
    const tx_ref = `ethioshop-tx-${Date.now()}`;
    
    try {
      const mockCheckoutUrl = `https://checkout.chapa.co/checkout/payment-page?public_key=${CHAPA_PUBLIC_KEY}&tx_ref=${tx_ref}&amount=${total()}&currency=ETB&email=${user?.email}&first_name=${user?.fullName?.split(' ')[0]}&last_name=${user?.fullName?.split(' ')[1] || ''}&title=Order&description=EthioShop%20Order&callback_url=https://ethioshop.vercel.app/callback&return_url=ethioshop://payment-success`;
      
      setPaymentUrl(mockCheckoutUrl);
      setShowPayment(true);
    } catch (error) {
      Alert.alert('Error', 'Payment initialization failed');
    } finally {
      setLoading(false);
    }
  };

  const onNavigationStateChange = async (navState: any) => {
    if (navState.url.includes('payment-success') || navState.url.includes('callback')) {
      setShowPayment(false);
      await createOrder();
    }
  };

  const createOrder = async () => {
    try {
      const orderData = {
        buyerId: user?.uid,
        items: items,
        totalAmount: total(),
        status: 'pending',
        paymentStatus: 'paid',
        address,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'orders'), orderData);
      clearCart();
      Alert.alert('Success', 'Order placed successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Home') }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save order');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.summaryCard}>
          {items.map((item) => (
            <View key={item.id} style={styles.summaryRow}>
              <Text style={styles.itemText}>{item.quantity}x {item.title}</Text>
              <Text style={styles.priceText}>{(item.price * item.quantity).toLocaleString()} ETB</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{total().toLocaleString()} ETB</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Delivery Details</Text>
        <Input
          label="Delivery Address"
          placeholder="Enter your full address in Addis Ababa"
          value={address}
          onChangeText={setAddress}
          multiline
          numberOfLines={3}
        />

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Payments are securely processed via Chapa. Your funds are held in escrow until delivery is confirmed.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={`Pay ${total().toLocaleString()} ETB`}
          onPress={handlePayment}
          loading={loading}
        />
      </View>

      <Modal visible={showPayment} animationType="slide">
        <View style={{ flex: 1 }}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Chapa Payment</Text>
            <TouchableOpacity onPress={() => setShowPayment(false)}>
              <Text style={styles.closeText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <WebView
            source={{ uri: paymentUrl }}
            onNavigationStateChange={onNavigationStateChange}
            startInLoadingState
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    paddingTop: 60,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    marginTop: SPACING.lg,
  },
  summaryCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  itemText: {
    color: COLORS.textSecondary,
    flex: 1,
  },
  priceText: {
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  infoBox: {
    backgroundColor: COLORS.secondary + '10',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.secondary + '30',
  },
  infoText: {
    fontSize: 14,
    color: COLORS.secondary,
    lineHeight: 20,
    textAlign: 'center',
  },
  footer: {
    padding: SPACING.lg,
    paddingBottom: 30,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  modalHeader: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeText: {
    color: COLORS.error,
    fontWeight: '600',
  },
});
