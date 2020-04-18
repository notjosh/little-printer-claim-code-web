import { h, Component } from 'preact';
import Claimer from './Claimer';

declare const BigInt: any;

export default class App extends Component<any, any> {
  render() {
    return (
      <div id="app">
        {typeof BigInt !== 'undefined' ? (
          <Claimer />
        ) : (
          <div>
            <p>
              your browser doesn't support BigInt! this needs BigInt for some
              number crunchin'.
            </p>
            <p>
              (at the time of writing, Safari is the only major _without_
              support.)
            </p>
            <p>
              Firefox and Chrome work though, so maybe give one of them a shot?
            </p>
          </div>
        )}
      </div>
    );
  }
}
