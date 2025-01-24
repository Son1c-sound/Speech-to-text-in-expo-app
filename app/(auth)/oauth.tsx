import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useOAuth } from '@clerk/clerk-expo';
import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet, View } from 'react-native';

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

const SignInWithOAuth = () => {
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  useWarmUpBrowser();

  const oAuthSignIn = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/', { scheme: 'myapp' }),
      });
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, [startOAuthFlow]);

  return (
    <TouchableOpacity style={styles.button} onPress={oAuthSignIn}>
      <View style={styles.buttonContent}>
        <Image 
          source={{ uri: 'https://imgs.search.brave.com/lBtw7l3MhojeV-JYt7sjdC3YR7IeRPqIBsZV4cpJMiM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9mcmVl/bG9nb3BuZy5jb20v/aW1hZ2VzL2FsbF9p/bWcvMTY1Nzk1MjQ0/MGdvb2dsZS1sb2dv/LXBuZy10cmFuc3Bh/cmVudC5wbmc' }}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.buttonText}>Continue with Google</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#dadce0',
    alignSelf: 'stretch'
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  buttonText: {
    color: '#3c4043',
    fontSize: 16,
    fontWeight: '500',
  }
});

export default SignInWithOAuth;