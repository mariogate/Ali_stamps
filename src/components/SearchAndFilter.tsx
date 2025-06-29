import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Searchbar, Chip, Menu, Button, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

export type SortOption = 'name' | 'recent' | 'stamps' | 'rewards';
export type FilterCategory = 'all' | 'coffee' | 'food' | 'retail' | 'services';

interface Props {
  onSearch: (query: string) => void;
  onSort: (option: SortOption) => void;
  onFilter: (category: FilterCategory) => void;
  placeholder?: string;
  showCategories?: boolean;
  initialSort?: SortOption;
  initialCategory?: FilterCategory;
}

export default function SearchAndFilter({
  onSearch,
  onSort,
  onFilter,
  placeholder = 'Search...',
  showCategories = true,
  initialSort = 'recent',
  initialCategory = 'all',
}: Props) {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>(initialSort);
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>(initialCategory);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    onSearch(query);
  }, [onSearch]);

  const handleSort = useCallback((option: SortOption) => {
    setSelectedSort(option);
    onSort(option);
    setSortMenuVisible(false);
  }, [onSort]);

  const handleFilter = useCallback((category: FilterCategory) => {
    setSelectedCategory(category);
    onFilter(category);
  }, [onFilter]);

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case 'name':
        return 'Name';
      case 'recent':
        return 'Most Recent';
      case 'stamps':
        return 'Most Stamps';
      case 'rewards':
        return 'Most Rewards';
      default:
        return option;
    }
  };

  const categories: { label: string; value: FilterCategory }[] = [
    { label: 'All', value: 'all' },
    { label: 'Coffee', value: 'coffee' },
    { label: 'Food', value: 'food' },
    { label: 'Retail', value: 'retail' },
    { label: 'Services', value: 'services' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder={placeholder}
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
        <Menu
          visible={sortMenuVisible}
          onDismiss={() => setSortMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setSortMenuVisible(true)}
              style={styles.sortButton}
              icon="sort"
            >
              {getSortLabel(selectedSort)}
            </Button>
          }
        >
          <Menu.Item
            onPress={() => handleSort('name')}
            title="Name"
            leadingIcon="sort-alphabetical-ascending"
          />
          <Menu.Item
            onPress={() => handleSort('recent')}
            title="Most Recent"
            leadingIcon="clock-outline"
          />
          <Menu.Item
            onPress={() => handleSort('stamps')}
            title="Most Stamps"
            leadingIcon="ticket-outline"
          />
          <Menu.Item
            onPress={() => handleSort('rewards')}
            title="Most Rewards"
            leadingIcon="gift-outline"
          />
        </Menu>
      </View>

      {showCategories && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map(category => (
            <Chip
              key={category.value}
              selected={selectedCategory === category.value}
              onPress={() => handleFilter(category.value)}
              style={styles.categoryChip}
              showSelectedOverlay
            >
              {category.label}
            </Chip>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    elevation: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  searchBar: {
    flex: 1,
    marginRight: 8,
  },
  sortButton: {
    minWidth: 120,
  },
  categoriesContainer: {
    maxHeight: 48,
  },
  categoriesContent: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    marginRight: 8,
  },
}); 