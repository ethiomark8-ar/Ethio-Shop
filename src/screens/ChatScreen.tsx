import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { db, auth } from '../api/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, where, or } from 'firebase/firestore';
import { Send, Image as ImageIcon } from 'lucide-react-native';
import { useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../api/firebase';

export const ChatScreen = () => {
  const route = useRoute<any>();
  const { sellerId, sellerName } = route.params;
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const chatId = [auth.currentUser?.uid, sellerId].sort().join('_');
    const q = query(
      collection(db, 'chats'),
      where('chatId', '==', chatId),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      setTimeout(() => flatListRef.current?.scrollToEnd(), 200);
    });

    return () => unsubscribe();
  }, [sellerId]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText('');
    
    await addDoc(collection(db, 'chats'), {
      chatId: [auth.currentUser?.uid, sellerId].sort().join('_'),
      senderId: auth.currentUser?.uid,
      receiverId: sellerId,
      text,
      createdAt: serverTimestamp(),
      read: false,
    });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!result.canceled) {
      const response = await fetch(result.assets[0].uri);
      const blob = await response.blob();
      const filename = `chats/${Date.now()}.jpg`;
      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, blob);
      const imageUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'chats'), {
        chatId: [auth.currentUser?.uid, sellerId].sort().join('_'),
        senderId: auth.currentUser?.uid,
        receiverId: sellerId,
        image: imageUrl,
        createdAt: serverTimestamp(),
        read: false,
      });
    }
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isMe = item.senderId === auth.currentUser?.uid;
    return (
      <View style={[styles.messageWrapper, isMe ? styles.myMessage : styles.theirMessage]}>
        <View style={[styles.messageBubble, isMe ? styles.myBubble : styles.theirBubble]}>
          {item.image && <Image source={{ uri: item.image }} style={styles.messageImage} />}
          {item.text && <Text style={[styles.messageText, isMe ? styles.myText : styles.theirText]}>{item.text}</Text>}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{sellerName}</Text>
        <Text style={styles.headerStatus}>Online</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.inputArea}>
        <TouchableOpacity onPress={pickImage} style={styles.iconBtn}>
          <ImageIcon size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
          <Send size={20} color={COLORS.textLight} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  headerStatus: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: '600',
  },
  listContent: {
    padding: SPACING.md,
  },
  messageWrapper: {
    marginBottom: SPACING.sm,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
  },
  theirMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  myBubble: {
    backgroundColor: COLORS.secondary,
    borderBottomRightRadius: 2,
  },
  theirBubble: {
    backgroundColor: COLORS.card,
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  messageText: {
    fontSize: 16,
  },
  myText: {
    color: COLORS.textLight,
  },
  theirText: {
    color: COLORS.textPrimary,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: 4,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: Platform.OS === 'ios' ? 30 : SPACING.sm,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    marginHorizontal: SPACING.sm,
    maxHeight: 100,
  },
  iconBtn: {
    padding: SPACING.xs,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
