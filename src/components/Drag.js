import React from "react";

export default class Drag extends React.Component {
  constructor(props) {
    super(props);
    this.dragContainer = React.createRef();
    this.dragIndex = -1;
    this.currentIndex = -1;
    this.state = {
      children: []
    };
  }

  componentDidMount() {
    this.init();
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.list !== this.props.list){
      this.init(nextProps)
    }
  }

  init(nextProps) {
    const { children, list } = nextProps || this.props;
    this.setState({ children, list }, () => {
      this.initItem(this.dragContainer);
    });
  }

  initItem(dragContainer) {
    const items = Array.prototype.slice.call(dragContainer.children);
    const that = this;
    items.forEach((v, k) => {
      that.addAttributes(v);
      v.ondragstart = function(e) {
        that.dragIndex = k;
        e.dataTransfer.setData("Text", k);
      };
      v.ondragover = function() {
        that.currentIndex = k;
      };
      v.ondragend = function() {
        const { currentIndex, dragIndex } = that;
        let { children } = that.state;
        if (currentIndex === dragIndex) return;
        children = that.getNewList(children);
        that.setState({ children }, () => {
          that.updateList();
        });
      };
    });
  }

  addAttributes(v) {
    const { cursor } = this.props;
    v.draggable = true;
    v.style.cursor = cursor || "move";
    v.style.marginBottom = "10px";
  }

  updateList() {
    const list = this.getNewList([].concat(this.props.list || []));
    this.setState({ list }, () => {
      this.props.onChange && this.props.onChange(list);
    });
  }

  getNewList(list) {
    const { currentIndex, dragIndex } = this;
    if (currentIndex === dragIndex) return;
    if (currentIndex < dragIndex) {
      //放在前面
      list.splice(currentIndex, 0, list[dragIndex]);
      list.splice(dragIndex + 1, 1);
    }
    if (currentIndex > dragIndex) {
      //放在后面
      list.splice(currentIndex + 1, 0, list[dragIndex]);
      list.splice(dragIndex, 1);
    }
    return list;
  }

  render() {
    return (
      <div
        className={this.props.className || ""}
        style={this.props.style || {}}
        ref={dragContainer => (this.dragContainer = dragContainer)}
      >
        {this.state.children}
      </div>
    );
  }
}
