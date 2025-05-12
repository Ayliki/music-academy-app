declare module 'firebase/auth/react-native' {
    import { Persistence } from 'firebase/auth';

    /**
     * Returns a Persistence object that uses React Native AsyncStorage
     * for persistence.
     * @param storage The storage object (typically from '@react-native-async-storage/async-storage')
     */
    export function getReactNativePersistence(storage: any): Persistence;
}
