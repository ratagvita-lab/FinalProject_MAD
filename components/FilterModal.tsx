import React, { useState } from 'react';
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
  const facilities = initialFilters.facilities;
  const type = initialFilters.type;
  const maxPrice = initialFilters.maxPrice;

  const toggleFacility = (facility: string) => {
    const newFacilities = facilities.includes(facility)
      ? facilities.filter(f => f !== facility)
      : [...facilities, facility];
    onApply({ facilities: newFacilities, type, maxPrice });
  };

  const handleType = (newType: string | null) => {
    onApply({ facilities, type: newType, maxPrice });
  };

  const handlePrice = (newPrice: number) => {
    onApply({ facilities, type, maxPrice: newPrice });
  };

  const handleReset = () => {
    onApply({ facilities: [], type: null, maxPrice: 5000000 });
  };

  const formatPrice = (price: number) => {
    return 'Rp ' + price.toLocaleString('id-ID');
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
              <Ionicons name="close" size={24} color="#2A2D34" />
            </Pressable>
          </View>

          <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            {/* Tipe Kos */}
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
                      {price >= 5000000 ? '> Rp 3 Jt' : `< ${formatPrice(price)}`}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Fasilitas */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Fasilitas</Text>
              <View style={styles.optionsRow}>
                {FACILITIES_LIST.map((f) => (
                  <Pressable
                    key={f}
                    style={[styles.chip, facilities.includes(f) && styles.chipActive]}
                    onPress={() => toggleFacility(f)}
                  >
                    <Text style={[styles.chipText, facilities.includes(f) && styles.chipTextActive]}>{f}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
            
            <View style={{height: 40}} />
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
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1D23',
    letterSpacing: -0.5,
  },
  closeButton: {
    padding: 4,
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1D23',
    marginBottom: 14,
    letterSpacing: 0.5,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
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
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dfe4ea',
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#1A1D23',
    fontSize: 16,
    fontWeight: '700',
  },
  applyButton: {
    flex: 2,
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 4,
  },
  applyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
