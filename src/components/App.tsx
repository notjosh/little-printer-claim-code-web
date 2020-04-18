import { h, Component } from 'preact';
import Claimer from './Claimer';

export default class App extends Component<any, any> {
  render() {
    return (
      <div id="app">
        <Claimer />
      </div>
    );
  }
}
