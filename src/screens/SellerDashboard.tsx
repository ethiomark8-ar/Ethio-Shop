import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { db, storage, auth } from '../api/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export const SellerDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const navigation = useNavigation<any>();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAddProduct = async () => {
    if (!title || !price || !image || !category) {
      Alert.alert('Error', 'Please fill all required fields and add an image');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const filename = `products/${auth.currentUser?.uid}/${Date.now()}.jpg`;
      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, blob);
      const imageUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'products'), {
        title,
        description,
        price: parseFloat(price),
        category,
        stock: parseInt(stock) || 1,
        images: [imageUrl],
        thumbnails: [imageUrl],
        sellerId: auth.currentUser?.uid,
        sellerName: auth.currentUser?.displayName || 'EthioShop Seller',
        rating: 5.0,
        reviewCount: 0,
        createdAt: serverTimestamp(),
        location: {
          latitude: 9.03,
          longitude: 38.74,
        },
      });

      Alert.alert('Success', 'Product added successfully!');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Add New Product</Text>
      
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.previewImage} />
        ) : (
          <View style={styles.placeholder}>
            <Camera size={40} color={COLORS.textSecondary} />
            <Text style={styles.placeholderText}>Add Product Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <Input
        label="Product Title *"
        placeholder="e.g. Traditional Ethiopian Coffee"
        value={title}
        onChangeText={setTitle}
      />

      <Input
        label="Category *"
        placeholder="e.g. Food, Fashion, Electronics"
        value={category}
        onChangeText={setCategory}
      />

      <View style={styles.row}>
        <Input
          label="Price (ETB) *"
          placeholder="0.00"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
          containerStyle={{ flex: 1 }}
        />
        <View style={{ width: SPACING.md }} />
        <Input
          label="Stock Quantity"
          placeholder="1"
          keyboardType="numeric"
          value={stock}
          onChangeText={setStock}
          containerStyle={{ flex: 1 }}
        />
      </View>

      <Input
        label="Description"
        placeholder="Describe your product..."
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        style={{ height: 100 }}
      />

      <Button
        title="List Product"
        onPress={handleAddProduct}
        loading={loading}
        style={styles.submitBtn}
      />
    </ScrollView>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xl,
  },
  imagePicker: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: SPACING.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
  },
  submitBtn: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.xxl,
  },
});
