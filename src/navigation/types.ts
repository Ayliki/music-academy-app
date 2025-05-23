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
    TeacherMenu: undefined;
    Schedule: undefined;
    AdminMenu: undefined;
    Users: undefined;
    EnterCode: { email: string };
    Applications: undefined;
};

export type NoParamsRoutes = {
    [K in keyof RootStackParamList]: RootStackParamList[K] extends undefined ? K : never
}[keyof RootStackParamList];


export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;
