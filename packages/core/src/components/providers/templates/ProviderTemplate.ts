import { Prop } from '@stencil/core';
import { connectProviderToStore, StoreDisconnect, StoreSync } from '../mediaStore';
import { MediaProvider } from '../MediaProvider';

/**
 * Copy paste this template when starting a new provider. Refer to existing providers for a better
 * idea on implementation details.
 *
 * 1. Create a new directory `providers/:providerName` for your provider.
 *
 * 2. Create a file in the new directory called `:providerName.tsx`.
 *
 * 3. Copy paste this template into the file.
 *
 * 4. Replace this comment with:
 *
 * @Component({
 *  tag: 'vime-:providerName'
 * })
 *
 * 5. Replace `:providerName` in the tag name, and add a comment to describe the component
 * above @Component.
 *
 * 6. When the provider is ready, add it to `tests/testHarness`  and run `test` to see if
 * it's valid.
 */
export class ProviderName implements MediaProvider {
  private disconnectFromStore?: StoreDisconnect;

  private storeSync?: StoreSync;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true }) paused!: boolean;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true }) playing!: boolean;

  /**
   * @inheritDoc
   */
  @Prop({ mutable: true }) duration!: number;

  connectedCallback() {
    ({
      disconnect: this.disconnectFromStore,
      sync: this.storeSync,
    } = connectProviderToStore(this));
  }

  // eslint-disable-next-line @stencil/own-methods-must-be-private
  componentShouldUpdate(newVal: any, _: any, propName: string) {
    return this.storeSync!(propName, newVal);
  }

  disconnectedCallback() {
    this.disconnectFromStore!();
    this.disconnectFromStore = undefined;
    this.storeSync = undefined;
  }

  render() {
    // ...
  }
}
