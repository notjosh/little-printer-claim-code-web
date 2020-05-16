import { h, Component } from 'preact';
import Claimer from './Claimer';

declare const BigInt: any;

export default class App extends Component<any, any> {
  render() {
    return (
      <div id="app">
        <Claimer />
      </div>
    );
  }
}
