// @flow
import React, {Component} from 'react';


export type ImportedModule = React$Component<*, *, *> | { [mixed]: React$Component<*> } | null;

type LoaderProps = {
  load: (cb: (module: { [mixed]: React$Component<*, *, *> }) => void) => void,
  children: (module: ImportedModule) => React$Element<*>
};

export default class Loader extends Component {
  state = {
    module: null
  };

  state: {
    module: ImportedModule
  };

  props: LoaderProps;

  componentWillMount() {
    this.load(this.props);
  }

  componentWillReceiveProps(nextProps: LoaderProps) {
    if (nextProps.load !== this.props.load) {
      this.load(nextProps);
    }
  }

  load(loaderProps: LoaderProps) {
    this.setState({
        module: null
      },
      () => loaderProps.load((module: { [mixed]: React$Component<*, *, *> }) => {
        this.setState({
          module: module.default ? module.default : module
        })
      })
    );
  }

  renderSpinner() {
    return <div>Loading...</div>
  }

  render(): React$Element<*> {
    return this.props.children(this.state.module) || this.renderSpinner();
  }
}
