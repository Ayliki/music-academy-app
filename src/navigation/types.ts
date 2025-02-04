import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
    Login: undefined;
    SignUp: undefined;
    Home: undefined;
    Profile: undefined;
    Menu: undefined;
    Teachers: undefined;
    Events: undefined;
    Application: undefined;
    Schedule: undefined;
    EnterCode: { email: string };
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;
