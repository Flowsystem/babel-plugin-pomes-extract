

class Component extends React.Component {
  render() {
    return (
      <div>
        {/* Will raise exception */}
        {this.props.message({
          id: 'foo',
          comment: 'bar',
        })}
      </div>
    )
  }
}
