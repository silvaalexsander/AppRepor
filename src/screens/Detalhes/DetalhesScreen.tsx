import React, { useMemo } from 'react';
import { View, StyleSheet, Text, SafeAreaView, ScrollView } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useStore } from '../../store';
import { colors, spacing } from '../../theme';

const CHART_COLORS = [
  '#4F46E5', // Indigo
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#F97316', // Orange
];

interface CategoryData {
  category: string;
  total: number;
  percentage: number;
  color: string;
}

export const DetalhesScreen = () => {
  const items = useStore((state) => state.items);

  const categoryData: CategoryData[] = useMemo(() => {
    const categoryMap: Record<string, number> = {};

    items.forEach(item => {
      if (item.lastUnitPrice && item.lastUnitPrice > 0) {
        const value = item.lastUnitPrice;
        if (categoryMap[item.category]) {
          categoryMap[item.category] += value;
        } else {
          categoryMap[item.category] = value;
        }
      }
    });

    const entries = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
    const grandTotal = entries.reduce((sum, [, val]) => sum + val, 0);

    if (grandTotal === 0) return [];

    return entries.map(([cat, total], index) => ({
      category: cat,
      total,
      percentage: (total / grandTotal) * 100,
      color: CHART_COLORS[index % CHART_COLORS.length],
    }));
  }, [items]);

  const grandTotal = categoryData.reduce((sum, d) => sum + d.total, 0);

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  // Pie chart logic using SVG arcs
  const size = 220;
  const radius = 90;
  const center = size / 2;

  const renderPieChart = () => {
    if (categoryData.length === 0) return null;

    let cumulativeAngle = -90; // Start from top
    const slices: React.ReactElement[] = [];

    categoryData.forEach((data, index) => {
      const angle = (data.percentage / 100) * 360;
      const startAngle = cumulativeAngle;
      const endAngle = cumulativeAngle + angle;

      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = center + radius * Math.cos(startRad);
      const y1 = center + radius * Math.sin(startRad);
      const x2 = center + radius * Math.cos(endRad);
      const y2 = center + radius * Math.sin(endRad);

      const largeArcFlag = angle > 180 ? 1 : 0;

      // If there's only one category, draw a full circle
      if (categoryData.length === 1) {
        slices.push(
          <Circle
            key={index}
            cx={center}
            cy={center}
            r={radius}
            fill={data.color}
          />
        );
      } else {
        const pathData = [
          `M ${center} ${center}`,
          `L ${x1} ${y1}`,
          `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
          'Z',
        ].join(' ');

        slices.push(
          <Path key={index} d={pathData} fill={data.color} />
        );
      }

      cumulativeAngle = endAngle;
    });

    return (
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {slices}
        {/* Inner circle for donut effect */}
        <Circle cx={center} cy={center} r={55} fill={colors.surface} />
      </Svg>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Detalhes</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {categoryData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Sem dados de preço ainda.</Text>
            <Text style={styles.emptySubText}>
              Cadastre itens com preço para ver o gráfico de gastos por categoria.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Gastos por Categoria</Text>
              <Text style={styles.chartSubtitle}>Baseado no último preço pago por item</Text>

              <View style={styles.chartContainer}>
                {renderPieChart()}
                <View style={styles.chartCenter}>
                  <Text style={styles.chartCenterLabel}>Total</Text>
                  <Text style={styles.chartCenterValue}>{formatCurrency(grandTotal)}</Text>
                </View>
              </View>
            </View>

            <View style={styles.legendCard}>
              {categoryData.map((data) => (
                <View key={data.category} style={styles.legendRow}>
                  <View style={styles.legendLeft}>
                    <View style={[styles.legendDot, { backgroundColor: data.color }]} />
                    <Text style={styles.legendCategory}>{data.category}</Text>
                  </View>
                  <View style={styles.legendRight}>
                    <Text style={styles.legendValue}>{formatCurrency(data.total)}</Text>
                    <Text style={styles.legendPercent}>{data.percentage.toFixed(1).replace('.', ',')}%</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.md,
    paddingTop: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  content: {
    padding: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptySubText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  chartSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    alignSelf: 'flex-start',
  },
  chartContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartCenterLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  chartCenterValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  legendCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: spacing.sm,
  },
  legendCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  legendRight: {
    alignItems: 'flex-end',
  },
  legendValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  legendPercent: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
