import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface FilterOptions {
  facilities: string[];
  type: string | null;
  maxPrice: number;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  initialFilters: FilterOptions;
}

const FACILITIES_LIST = ['WiFi', 'AC', 'Kamar mandi dalam', 'Parkir Luas', 'Dapur Bersama'];
const TYPES_LIST = ['Putra', 'Putri', 'Campur'];
const PRICE_OPTIONS = [500000, 1000000, 1500000, 2000000, 3000000, 5000000];

export default function FilterModal({ visible, onClose, onApply, initialFilters }: FilterModalProps) {
  // Use destructuring to access initialFilters values
  const { facilities, type, maxPrice } = initialFilters;

  const toggleFacility = (facility: string) => {
    const newFacilities = facilities.includes(facility)
      ? facilities.filter(f => f !== facility)
      : [...facilities, facility];
    onApply({ ...initialFilters, facilities: newFacilities });
  };

  const handleType = (newType: string | null) => {
    onApply({ ...initialFilters, type: newType });
  };

  const handlePrice = (newPrice: number) => {
    onApply({ ...initialFilters, maxPrice: newPrice });
  };

  const handleReset = () => {
    onApply({
      facilities: [],
      type: null,
      maxPrice: 5000000,
    });
  };

  const formatPrice = (price: number): string => {
    // Basic formatting without toLocaleString which can sometimes be unstable in RN without Intl polyfill
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Filter Pencarian</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#1A1D23" />
            </Pressable>
          </View>

          <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            {/* Tipe Kost */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tipe Kost</Text>
              <View style={styles.optionsRow}>
                {TYPES_LIST.map((t) => (
                  <Pressable
                    key={t}
                    style={[styles.chip, type === t && styles.chipActive]}
                    onPress={() => handleType(type === t ? null : t)}
                  >
                    <Text style={[styles.chipText, type === t && styles.chipTextActive]}>{t}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Harga Maksimal */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Harga Maksimal (per bulan)</Text>
              <View style={styles.optionsRow}>
                {PRICE_OPTIONS.map((price) => (
                  <Pressable
                    key={price}
                    style={[styles.chip, maxPrice === price && styles.chipActive]}
                    onPress={() => handlePrice(price)}
                  >
                    <Text style={[styles.chipText, maxPrice === price && styles.chipTextActive]}>
                      {price >= 5000000 ? 'Semua Harga' : `< Rp ${formatPrice(price)}`}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Fasilitas */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Fasilitas</Text>
              <View style={styles.optionsRow}>
                {FACILITIES_LIST.map((f) => {
                  const isActive = facilities.includes(f);
                  return (
                    <Pressable
                      key={f}
                      style={[styles.chip, isActive && styles.chipActive]}
                      onPress={() => toggleFacility(f)}
                    >
                      <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{f}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
            
            <View style={{ height: 40 }} />
          </ScrollView>

          <View style={styles.footer}>
            <Pressable style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>Reset Semua</Text>
            </Pressable>
            <Pressable style={styles.applyButton} onPress={onClose}>
              <Text style={styles.applyButtonText}>Tutup Filter</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    height: '80%',
    padding: 24,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1D23',
    letterSpacing: -0.5,
  },
  closeButton: {
    width: 40,
    height: 40,
    backgroundColor: '#F4F9FF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1D23',
    marginBottom: 16,
    letterSpacing: 0.2,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,122,255,0.08)',
    backgroundColor: '#F4F9FF',
  },
  chipActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  chipText: {
    color: '#8A95A5',
    fontSize: 14,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#ffffff',
  },
  footer: {
    flexDirection: 'row',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f2f6',
    gap: 12,
    marginBottom: 8,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E8F4FD',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  resetButtonText: {
    color: '#8A95A5',
    fontSize: 16,
    fontWeight: '700',
  },
  applyButton: {
    flex: 2,
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  applyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
