import 'react';
import 'react-native';

declare module 'react-native' {
  interface TouchableOpacityProps {
    key?: React.Key;
  }
  interface ViewProps {
    key?: React.Key;
  }
  interface TextProps {
    key?: React.Key;
  }
}
