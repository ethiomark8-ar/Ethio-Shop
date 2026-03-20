import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { auth, db } from '../api/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { UserRole } from '../types';

export const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState<UserRole>('buyer');

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        if (!fullName || !phoneNumber) {
          Alert.alert('Error', 'Please fill all fields');
          setLoading(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const { user } = userCredential;

        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email,
          fullName,
          phoneNumber,
          role,
          createdAt: serverTimestamp(),
          isVerified: false,
        });
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>
          <Text style={styles.subtitle}>{isLogin ? 'Sign in to continue' : 'Join EthioShop today'}</Text>
        </View>

        {!isLogin && (
          <>
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={fullName}
              onChangeText={setFullName}
            />
            <Input
              label="Phone Number"
              placeholder="+251 900 000 000"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
            <View style={styles.roleContainer}>
              <Text style={styles.roleLabel}>I am a:</Text>
              <View style={styles.roleButtons}>
                <TouchableOpacity
                  style={[styles.roleButton, role === 'buyer' && styles.roleButtonActive]}
                  onPress={() => setRole('buyer')}
                >
                  <Text style={[styles.roleButtonText, role === 'buyer' && styles.roleButtonTextActive]}>Buyer</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.roleButton, role === 'seller' && styles.roleButtonActive]}
                  onPress={() => setRole('seller')}
                >
                  <Text style={[styles.roleButtonText, role === 'seller' && styles.roleButtonTextActive]}>Seller</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        <Input
          label="Email"
          placeholder="email@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          label="Password"
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Button
          title={isLogin ? 'Login' : 'Sign Up'}
          onPress={handleAuth}
          loading={loading}
          style={styles.submitButton}
        />

        <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switchButton}>
          <Text style={styles.switchText}>
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.xl,
    paddingTop: 100,
  },
  header: {
    marginBottom: SPACING.xxl,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  submitButton: {
    marginTop: SPACING.lg,
  },
  switchButton: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  switchText: {
    color: COLORS.secondary,
    fontWeight: '600',
  },
  roleContainer: {
    marginBottom: SPACING.md,
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  roleButton: {
    flex: 1,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.card,
  },
  roleButtonActive: {
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.secondary + '10',
  },
  roleButtonText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  roleButtonTextActive: {
    color: COLORS.secondary,
  },
});
