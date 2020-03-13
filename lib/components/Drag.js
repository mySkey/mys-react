"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Drag = function (_React$Component) {
  _inherits(Drag, _React$Component);

  function Drag(props) {
    _classCallCheck(this, Drag);

    var _this = _possibleConstructorReturn(this, (Drag.__proto__ || Object.getPrototypeOf(Drag)).call(this, props));

    _this.dragContainer = _react2.default.createRef();
    _this.dragIndex = -1;
    _this.currentIndex = -1;
    _this.state = {
      children: []
    };
    return _this;
  }

  _createClass(Drag, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.init();
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.list !== this.props.list) {
        this.init(nextProps);
      }
    }
  }, {
    key: "init",
    value: function init(nextProps) {
      var _this2 = this;

      var _ref = nextProps || this.props,
          children = _ref.children,
          list = _ref.list;

      this.setState({ children: children, list: list }, function () {
        _this2.initItem(_this2.dragContainer);
      });
    }
  }, {
    key: "initItem",
    value: function initItem(dragContainer) {
      var items = Array.prototype.slice.call(dragContainer.children);
      var that = this;
      items.forEach(function (v, k) {
        that.addAttributes(v);
        v.ondragstart = function (e) {
          that.dragIndex = k;
          e.dataTransfer.setData("Text", k);
        };
        v.ondragover = function () {
          that.currentIndex = k;
        };
        v.ondragend = function () {
          var currentIndex = that.currentIndex,
              dragIndex = that.dragIndex;
          var children = that.state.children;

          if (currentIndex === dragIndex) return;
          children = that.getNewList(children);
          that.setState({ children: children }, function () {
            that.updateList();
          });
        };
      });
    }
  }, {
    key: "addAttributes",
    value: function addAttributes(v) {
      var cursor = this.props.cursor;

      v.draggable = true;
      v.style.cursor = cursor || "move";
      v.style.marginBottom = "10px";
    }
  }, {
    key: "updateList",
    value: function updateList() {
      var _this3 = this;

      var list = this.getNewList([].concat(this.props.list || []));
      this.setState({ list: list }, function () {
        _this3.props.onChange && _this3.props.onChange(list);
      });
    }
  }, {
    key: "getNewList",
    value: function getNewList(list) {
      var currentIndex = this.currentIndex,
          dragIndex = this.dragIndex;

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
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      return _react2.default.createElement(
        "div",
        {
          className: this.props.className || "",
          style: this.props.style || {},
          ref: function ref(dragContainer) {
            return _this4.dragContainer = dragContainer;
          }
        },
        this.state.children
      );
    }
  }]);

  return Drag;
}(_react2.default.Component);

exports.default = Drag;