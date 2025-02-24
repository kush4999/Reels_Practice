import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Routes from './src/Routes';
import {NoConnection} from './src/Component';
import CommonStyle from './src//Theme/CommonStyle';
import {AppContextProvider} from './src//Context';

const App = () => {
  const [isConnected, setIsConnected] = useState(true);
  let netInfoSubscription : any = null;

  useEffect(() => {
    manageConnection();
    return () => {
      if (netInfoSubscription) {
        netInfoSubscription();
      }
    };
  }, []);

  const manageConnection = () => {
    retryConnection();
    netInfoSubscription = NetInfo.addEventListener(handleConnectivityChange);
  };

  // Managed internet connection
  const handleConnectivityChange = (info : any) => {
    if (info.type === 'none' || !info.isConnected) {
      setIsConnected(false);
    } else {
      setIsConnected(true);
    }
  };

  // Check network connection
  const retryConnection = () => {
    NetInfo.fetch().then(handleConnectivityChange);
  };

  return (
    <AppContextProvider>
      <View style={CommonStyle.flexContainer}>
        <Routes />
        {(!isConnected && <NoConnection retryConnection={retryConnection} />) ||
          null}
      </View>
    </AppContextProvider>
  );
};

export default App;
