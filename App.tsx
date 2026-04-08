import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation';
import { useStore } from './src/store';
import { colors } from './src/theme';

export default function App() {
  const hydrate = useStore((state) => state.hydrate);
  const isHydrated = useStore((state) => state.isHydrated);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!isHydrated) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
