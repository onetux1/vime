import { createStore } from '@stencil/store';
import { MediaProvider } from './MediaProvider';

const store = createStore({
  paused: true,
  playing: false,
  duration: -1,
});

const readonly: Record<string, boolean> = {
  playing: true,
  duration: true,
};

export type StoreDisconnect = () => void;
export type StoreSync = (propName: string, val: any) => boolean;

export interface ConnectProviderToStore {
  disconnect: StoreDisconnect,
  sync: StoreSync
}

/**
 * Creates a two-way binding between the media store and the given media provider component. This
 * may make debugging hell, in that case it'll be revised.
 */
export function connectProviderToStore(provider: MediaProvider): ConnectProviderToStore {
  // Initialize default values on the provider.
  Object.keys(store.state).forEach((state) => {
    // @ts-ignore
    // eslint-disable-next-line no-param-reassign
    provider[state] = store.state[state];
  });

  const disconnect = () => {
    // Update values on the provider as the store state changes.
    const off = store.on('set', (prop, val) => {
      // @ts-ignore
      // eslint-disable-next-line no-param-reassign
      provider[prop] = val;
    });

    off();
    store.dispose();
  };

  const sync = (propName: string, val: any) => {
    // Check if a readonly property was changed.
    if (readonly[propName] && store.get(propName as any) !== val) {
      // eslint-disable-next-line no-console
      console.warn(`${provider.constructor.name}.${propName} is readonly.`);
      // eslint-disable-next-line no-param-reassign
      provider[propName] = store.get(propName as any);
      return false;
    }

    // @ts-ignore
    if (store.state[propName]) { store.set(propName, val); }

    return true;
  };

  return { sync, disconnect };
}

export default store;
