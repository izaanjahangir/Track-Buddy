import rootReducer from './rootReducers';
import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import { AsyncStorage } from 'react-native'
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    stateReconciler: autoMergeLevel1,
    timeout: null
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export let store = createStore(persistedReducer);

store.subscribe(() =>
    console.log(store.getState())
);

export const persistor = persistStore(store);