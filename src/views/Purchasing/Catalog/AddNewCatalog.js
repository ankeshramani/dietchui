import React, {Component} from "react";
import {ApiService} from "../../../services/ApiService";
import {Checkbox, Form, Input, message, Modal, Spin, Tree} from "antd";

const { TreeNode } = Tree;

class AddNewCatalog extends Component {
  _apiService = new ApiService();

  state = {
    selectedRecord: this.props.selectedRecord,
    selectedKey: (this.props.selectedRecord && this.props.selectedRecord.FKey_OP_Catalog) || '',
    isRoot: this.props.selectedRecord ? !!!this.props.selectedRecord.FKey_OP_Catalog : false,
  }

  componentDidMount() {
    if (this.props.selectedRecord) {
      this.props.form.setFieldsValue({
        ...this.props.selectedRecord
      });
    }
  }

  onSelect = (key) => {
    this.setState({
      selectedKey: key[0]
    })
  };

  onAddNewRecord = (objData) => {
    const {selectedKey, isRoot} = this.state;
    if (!isRoot && !selectedKey) {
      return message.error('Please select parent of catalog')
    }
    const data = {
      ...objData,
      PKey_OP_Catalog: -1,
      FKey_OP_Catalog: selectedKey,
    }
    this.props.addNewRecord(data)
  }

  updateTree = (objData) => {
    const {selectedKey, selectedRecord} = this.state;
    const payload = {
      ...selectedRecord,
      Name: objData.Name,
      FKey_OP_Catalog: selectedKey
    };
    this.props.onUpdateTree(payload)
  }

  handleSubmit = e => {
    const {selectedRecord} = this.state;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      if(selectedRecord){
        this.updateTree(values);
      } else {
        this.onAddNewRecord(values);
      }
    });
  };

  onCheckBoxChange = (event) => {
    this.setState({
      isRoot: event.target.checked,
      selectedKey: event.target.checked ? '' : this.state.selectedKey,
    });
  };

  render() {
    const {isSaving, isModal, ModalToggle, isEdit, catalog, selectedRecord} = this.props;
    const { getFieldDecorator } = this.props.form;
    const { isRoot, selectedKey } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      labelAlign: 'right'
    };
    const loop = (data, isD) =>
      data.map(item => {
        const isDisabled = selectedRecord && selectedRecord.PKey_OP_Catalog === item.PKey_OP_Catalog;
        if (item.children && item.children.length) {
          return (
            <TreeNode disabled={isDisabled || isD || isRoot} key={item.PKey_OP_Catalog} title={item.Name}>
              {loop(item.children, isDisabled)}
            </TreeNode>
          );
        }
        return <TreeNode disabled={isDisabled || isD || isRoot} key={item.PKey_OP_Catalog} title={item.Name} />;
      });
    return(
      <Modal
        visible={isModal}
        title={isEdit ? 'Update a Catalog ' : 'Add a New Catalog'}
        okText={isSaving ? <Spin className="white" size={"small"}/>  : 'Save '}
        onOk={this.handleSubmit}
        onCancel={ModalToggle}
        cancelButtonProps={{className: 'pull-right ml-10'}}
      >

        <Form {...formItemLayout} className="pt-19">
          <Form.Item label="Catalog Name">
            {getFieldDecorator('Name', {
              rules: [{ required: true, message: 'Please input Catalog Name!' }],
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item>
            <Checkbox checked={isRoot} onChange={this.onCheckBoxChange}>Is Root? </Checkbox>
          </Form.Item>
        </Form>
          <Tree
            className="draggable-tree"
            blockNode
            selectedKeys={[selectedKey]}
            multiple={false}
            onSelect={this.onSelect}
            disabled={isRoot}
          >
            {loop(catalog || [])}
          </Tree>
      </Modal>
    )
  }
}
const AddNewCatalogForm = Form.create()(AddNewCatalog)
export default AddNewCatalogForm
