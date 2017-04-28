import React, {Component} from 'react';


export default class Loader extends Component {
  state = {
    module: null
  };

  componentWillMount() {
    this.load(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.load !== this.props.load) {
      this.load(nextProps)
    }
  }

  load(props) {
    this.setState({
        module: null
      },
      () => props.load((module) => {
        this.setState({
          module: module.default ? module.default : module
        })
      })
    );
  }

  renderSpinner() {
    return <div>Loading...</div>
  }

  render() {
    return this.props.children(this.state.module) || this.renderSpinner();
  }
}
