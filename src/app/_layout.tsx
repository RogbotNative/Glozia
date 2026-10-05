import '@/global.css';

import { CormorantGaramond_300Light } from '@expo-google-fonts/cormorant-garamond/300Light';
import { CormorantGaramond_300Light_Italic } from '@expo-google-fonts/cormorant-garamond/300Light_Italic';
import { CormorantGaramond_400Regular } from '@expo-google-fonts/cormorant-garamond/400Regular';
import { CormorantGaramond_400Regular_Italic } from '@expo-google-fonts/cormorant-garamond/400Regular_Italic';
import { CormorantGaramond_500Medium } from '@expo-google-fonts/cormorant-garamond/500Medium';
import { Jost_300Light } from '@expo-google-fonts/jost/300Light';
import { Jost_400Regular } from '@expo-google-fonts/jost/400Regular';
import { Jost_500Medium } from '@expo-google-fonts/jost/500Medium';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { LayoutProvider } from '@/hooks/use-layout';

if (Platform.OS !== 'web') SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Loaded synchronously so the static web export can inline the @font-face rules.
  const [loaded] = useFonts({
    CormorantGaramond_300Light,
    CormorantGaramond_300Light_Italic,
    CormorantGaramond_400Regular,
    CormorantGaramond_400Regular_Italic,
    CormorantGaramond_500Medium,
    Jost_300Light,
    Jost_400Regular,
    Jost_500Medium,
  });

  useEffect(() => {
    if (loaded && Platform.OS !== 'web') SplashScreen.hideAsync();
  }, [loaded]);

  // On the web the server-rendered HTML must match the first client render, so never gate on fonts there.
  if (!loaded && Platform.OS !== 'web') return null;

  return (
    <LayoutProvider>
      <StatusBar style="dark" />
      <Slot />
    </LayoutProvider>
  );
}
