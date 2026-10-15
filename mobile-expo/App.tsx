import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  View,
  Text,
  StatusBar,
  BackHandler,
} from 'react-native';
import { WebView } from 'react-native-webview';

// URL da aplicação publicada ou de desenvolvimento
const APP_URL = 'https://akirarafael19.github.io/trampo-taxa/';

export default function App() {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  // Integração com o botão físico de voltar do Android
  useEffect(() => {
    const onBackPress = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    };

    const backHandlerSubscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );
    return () => backHandlerSubscription.remove();
  }, [canGoBack]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0B0E" />
      <WebView
        ref={webViewRef}
        source={{ uri: APP_URL }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        geolocationEnabled={true}
        onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00E676" />
            <Text style={styles.loadingText}>Carregando TrampoTaxa...</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0B0E',
  },
  webview: {
    flex: 1,
    backgroundColor: '#0A0B0E',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0B0E',
  },
  loadingText: {
    color: '#00E676',
    marginTop: 12,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
