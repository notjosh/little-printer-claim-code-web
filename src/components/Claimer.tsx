import { h, Component } from 'preact';
import bigInt from 'big-integer';

import {
  encode,
  hardwareXorFromDeviceAddress,
} from 'little-printer-claim-code';

export default class Claimer extends Component<ClaimerProps, ClaimerState> {
  addressHandler: (event: h.JSX.TargetedEvent<HTMLInputElement, Event>) => void;
  addressRandomHandler: () => void;
  secretHandler: (event: h.JSX.TargetedEvent<HTMLInputElement, Event>) => void;
  secretRandomHandler: () => void;

  state: ClaimerState;

  constructor() {
    super();

    const address = this.randomAddress();
    const secret = this.randomSecret();

    this.state = {
      address,
      secret,
      ...this.generate(address, secret),
    };

    this.addressHandler = (event) => {
      const address = event.currentTarget.value;
      this.setState({ address, ...this.generate(address, this.state.secret) });
    };

    this.secretHandler = (event) => {
      let secret = parseInt(event.currentTarget.value, 10);
      if (isNaN(secret)) {
        secret = 0;
      }

      this.setState({ secret, ...this.generate(this.state.address, secret) });
    };

    this.addressRandomHandler = () => {
      const address = this.randomAddress();
      this.setState({ address, ...this.generate(address, this.state.secret) });
    };

    this.secretRandomHandler = () => {
      const secret = this.randomSecret();
      this.setState({ secret, ...this.generate(this.state.address, secret) });
    };
  }

  generate(
    address: string,
    secret: number
  ): { claimCode: string | null; notices: string[] } {
    const notices = [];

    if (address.length != 16) {
      notices.push('address must be 16 chars');
    }

    if (secret < 0 || secret > 0xffffffffff) {
      notices.push(
        `secret should be 0 - 0xffffffffff (${(0xffffffffff).toString(10)})`
      );
    }

    const xor = hardwareXorFromDeviceAddress(bigInt(address, 16));

    const claimCode = notices.length == 0 ? encode(xor, bigInt(secret)) : '';

    return {
      claimCode,
      notices,
    };
  }

  randomAddress(): string {
    return (
      Math.random().toString(16).substring(2, 10) +
      Math.random().toString(16).substring(2, 10)
    );
  }

  randomSecret(): number {
    return Math.floor(Math.random() * 0xffffffffff);
  }

  copy(): void {
    const container = document.querySelector('#lines') as HTMLTextAreaElement;
    if (container != null) {
      container.select();
      document.execCommand('copy');
    }
  }

  download = (): void => {
    // via: https://blog.logrocket.com/programmatic-file-downloads-in-the-browser-9a5186298d5c/
    const blob = new Blob([this.lines.join('\n')], { type: 'text/plain' });
    const filename = `${this.state.address}.printer`;

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'download';

    const clickHandler = () => {
      setTimeout(() => {
        URL.revokeObjectURL(url);
        a.removeEventListener('click', clickHandler);
      }, 150);
    };

    a.addEventListener('click', clickHandler, false);
    a.click();
  };

  private get lines(): string[] {
    return [
      `     address: ${this.state.address}`,
      `      secret: ${this.state.secret.toString(16)}`,
      `         xor: ${hardwareXorFromDeviceAddress(
        bigInt(this.state.address, 16)
      )}`,
      `  claim code: ${this.state.claimCode}`,
    ];
  }

  render(props: ClaimerProps, state: ClaimerState) {
    return (
      <div>
        <h1>lil printer client codes, here 4 u</h1>
        <div>
          <label for="address">address:</label>
          <input
            id="address"
            type="text"
            value={state.address}
            onInput={this.addressHandler}
          />
          <button id="address-random" onClick={this.addressRandomHandler}>
            random!
          </button>
        </div>
        <div>
          <label for="secret">secret:</label>
          <input
            id="secret"
            type="text"
            value={state.secret}
            onInput={this.secretHandler}
          />
          <button id="address-random" onClick={this.secretRandomHandler}>
            random!
          </button>
        </div>

        {state.notices.length > 0 ? (
          <div>
            {state.notices.map((notice) => (
              <p>{notice}</p>
            ))}
          </div>
        ) : (
          <div>
            <p>client code: {state.claimCode}</p>

            <p>.printer file output:</p>
            <textarea
              id="lines"
              style="white-space: pre-wrap; font-family: monospace;"
              rows={this.lines.length + 1}
              cols={50}
              readOnly
            >
              {this.lines.join('\n')}
            </textarea>
            <div>
              <button onClick={this.copy}>copy</button>
              <button onClick={this.download}>download</button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

/*
     address: 2de25ec61fd4ed8f
      secret: 742805827345
  claim code: djzt-swoe-ew8x-9vh0
*/

export interface ClaimerProps {}

export interface ClaimerState {
  address: string;
  secret: number;
  claimCode: string | null;
  notices: string[];
}
