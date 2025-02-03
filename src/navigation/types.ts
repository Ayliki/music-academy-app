import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
    Login: undefined;
    SignUp: undefined;
    Home: undefined;
    EnterCode: { email: string };
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;
