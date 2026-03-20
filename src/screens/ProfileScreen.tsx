import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { useAuthStore } from '../store/useAuthStore';
import { auth } from '../api/firebase';
import { User, Settings, Package, CreditCard, LogOut, ChevronRight, Shield } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export const ProfileScreen = () => {
  const { user } = useAuthStore();
  const navigation = useNavigation<any>();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => auth.signOut() },
    ]);
  };

  const MenuItem = ({ icon: Icon, title, subtitle, onPress, color = COLORS.textPrimary }: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: color + '10' }]}>
        <Icon size={22} color={color} />
      </View>
      <View style={styles.menuText}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <ChevronRight size={20} color={COLORS.border} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.fullName?.[0] || 'U'}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{user?.fullName}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{user?.role?.toUpperCase()}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Account</Text>
        <MenuItem
          icon={User}
          title="Personal Information"
          subtitle="Name, Email, Phone number"
          onPress={() => {}}
        />
        <MenuItem
          icon={Package}
          title="My Orders"
          subtitle="Track and manage your orders"
          onPress={() => {}}
        />
        {user?.role === 'seller' && (
          <MenuItem
            icon={Shield}
            title="Seller Dashboard"
            subtitle="Manage your products and sales"
            onPress={() => navigation.navigate('SellerDashboard')}
            color={COLORS.secondary}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <MenuItem
          icon={Settings}
          title="App Settings"
          subtitle="Notifications, Theme, Language"
          onPress={() => {}}
        />
        <MenuItem
          icon={CreditCard}
          title="Payment Methods"
          subtitle="Manage your Chapa account"
          onPress={() => {}}
        />
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <LogOut size={20} color={COLORS.error} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.version}>EthioShop v1.0.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: BORDER_RADIUS.xl,
    borderBottomRightRadius: BORDER_RADIUS.xl,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  roleBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  roleText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  section: {
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  menuSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: SPACING.xxl,
    padding: SPACING.md,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.error,
  },
  version: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: SPACING.md,
    marginBottom: 40,
  },
});
