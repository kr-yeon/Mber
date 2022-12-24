import {createContext} from 'react';
import {UserData} from './DataTypes';

export interface Context {
  isConnecting: boolean | null;
  userId: string;
  set_show_error_alert: Function;
  set_show_network_alert: Function;
}

export interface BucketContext {
  modalFun: Function;
  modalizeRef: any;
}

export interface LoginContext {
  setUserData: Function;
  userData: UserData;
}

export interface SearchContext {
  set_search_data: Function;
  search_data: UserData;
  userName: string;
}

export const BucketContext = createContext<BucketContext>({
  modalFun: () => {},
  modalizeRef: null,
});

export const CompleteBucketContext = createContext<BucketContext>({
  modalFun: () => {},
  modalizeRef: null,
});

export const LoginContext = createContext<LoginContext>({
  setUserData: () => {},
  userData: {
    nickname: '',
    buckets: [],
    completed_buckets: [],
    stars: [],
  },
});

export const SearchContext = createContext<SearchContext>({
  set_search_data: () => {},
  search_data: {
    nickname: '',
    buckets: [],
    completed_buckets: [],
    stars: [],
  },
  userName: '',
});

export default createContext<Context>({
  isConnecting: null,
  userId: '',
  set_show_error_alert: () => {},
  set_show_network_alert: () => {},
});
