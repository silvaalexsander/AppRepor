import React from 'react';
import { View, StyleSheet, Text, SafeAreaView, Image, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Globe, Mail, Code } from 'lucide-react-native';
import { colors, spacing } from '../../theme';

export const AboutScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.surface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sobre o App</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.iconCircle}>
            <Image
              source={require('../../../assets/icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.appName}>AppRepor</Text>
          <Text style={styles.version}>Versão 1.2.0</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Desenvolvido por</Text>
          <View style={styles.companyCard}>
            <Text style={styles.companyName}>DevAlex</Text>
            <Text style={styles.companyTagline}>Tecnologia e Soluções Inteligentes</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contato & Suporte</Text>
          <View style={styles.linksContainer}>
            <TouchableOpacity style={styles.linkRow}>
              <View style={[styles.linkIcon, { backgroundColor: '#E0F2FE' }]}>
                <Globe size={20} color="#0369A1" />
              </View>
              <Text style={styles.linkText}>www.devalex.com.br</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkRow}>
              <View style={[styles.linkIcon, { backgroundColor: '#F0FDF4' }]}>
                <Mail size={20} color="#15803D" />
              </View>
              <Text style={styles.linkText}>alexsander.silva14@live.com.br</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkRow}>
              <View style={[styles.linkIcon, { backgroundColor: '#F8FAFC' }]}>
                <Code size={20} color="#1E293B" />
              </View>
              <Text style={styles.linkText}>github.com/silvaalexsander</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.copyright}>© 2026 DevAlex. Todos os direitos reservados.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.primary,
    height: 60,
  },
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.surface,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl * 1.5,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 25,
    backgroundColor: colors.surface,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 70,
    height: 70,
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  version: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  section: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  companyCard: {
    width: '100%',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  companyName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
  },
  companyTagline: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  linksContainer: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  linkIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  linkText: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: spacing.lg,
  },
  copyright: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
