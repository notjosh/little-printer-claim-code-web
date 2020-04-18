import { h, Component } from 'preact';

import { encode } from 'little-printer-claim-code';

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

    const claimCode =
      notices.length == 0
        ? encode(parseInt(address, 16) & 0xffffff, secret)
        : '';

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

  render(props: ClaimerProps, state: ClaimerState) {
    const lines = [
      `     address: ${state.address}`,
      `      secret: ${state.secret}`,
      `  claim code: ${state.claimCode}`,
    ];

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
            <div style="white-space: pre-wrap; font-family: monospace;">
              {lines.join('\n')}
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
