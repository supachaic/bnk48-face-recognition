import React, { Component } from 'react';

class ShowDescriptors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      descriptors: null
    };
  }

  componentWillMount() {
    this.update();
  }

  componentWillReceiveProps(newProps) {
    this.update(newProps);
  }

  update = (props = this.props) => {
    let { fullDesc } = props;
    if (!!fullDesc) {
      fullDesc.then(desc => {
        this.setState({ descriptors: desc.map(fd => fd.descriptor) });
      });
    }
  };

  render() {
    const { descriptors } = this.state;

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignContent: 'center',
          alignItems: 'center'
        }}
      >
        <h3>Descriptors</h3>
        {!!descriptors
          ? descriptors.map((descriptor, i) => (
              <p
                key={i}
                style={{
                  padding: 10,
                  margin: 20,
                  wordBreak: 'break-all',
                  borderStyle: 'solid',
                  borderColor: 'blue'
                }}
              >
                {descriptor.toString()}
              </p>
            ))
          : null}
      </div>
    );
  }
}

export default ShowDescriptors;
