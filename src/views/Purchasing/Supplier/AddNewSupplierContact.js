import React, {Component} from "react";
import {ApiService} from "../../../services/ApiService";
import {Checkbox, Form, Input, message, Modal, Spin} from "antd";
import CustomGrid from "../../../components/CustomGrid";
import {Column, Paging, Scrolling, Selection} from "devextreme-react/data-grid";
import {DropDownBox} from "devextreme-react";

const newRecord = {key: -1, text: 'Add New Contact'};
class AddNewSupplierContact extends Component {
  _apiService = new ApiService();
  constructor(props) {
    super(props);
    this.widgetRef = React.createRef();
    this.state = {
      dataSource: [newRecord],
      dataSourceBack: [newRecord],
      selectedContactId: '',
      searchValue: '',
      isContactModal: false
    }
  }

  componentDidMount() {
    this.setContacts(this.props.contactManager);
  }

  componentDidUpdate(prevProps) {
    if ((prevProps.contactManager || []).length !== (this.props.contactManager || []).length) {
      this.setContacts(this.props.contactManager);
    }
  }

  setContacts = (contacts = []) => {
    const dataSource = contacts.map(x => ({key: x.PKey_OP_Contact, text: `${x.FirstName} ${x.LastName}`}));
    dataSource.push(newRecord);
    this.setState({
      dataSource,
      dataSourceBack: dataSource,
    })
  }

  onAddNewRecord = (objData) => {
    const {selectedSupplier} = this.props
    const data = {
      ...objData,
      FKey_OP_Supplier: selectedSupplier.PKey_OP_Supplier,
    }
    this.props.addNewRecord(data)
  }

  addNewContact = e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (err) {
        return;
      }
      const {selectedSupplier, contactManager} = this.props;
      this.setState({
        isSaving: true,
      });
      const payload = {
        ...values,
        PKey_OP_Contact: -1,
        FKey_OP_Supplier: selectedSupplier.PKey_OP_Supplier,
      };
      const data = await this._apiService.updateContact(payload)
      if (!data || data.error){
        message.error('Something Wrong. Please Try again!');
        this.setState({
          isSaving: false,
          isContactModal: false
        });
      } else {
        message.success('Contact Added Successfully');
        payload.PKey_OP_Contact = data;
        contactManager.push(payload);
        this.props.updateContactManager(contactManager);
        this.setState({
          isSaving: false,
          isContactModal: false
        })
      }
      this.refreshGrid();
    });
  }

  addNewSupplierContact = e => {
    e.preventDefault();
    const {selectedContactId, ToBeEmailed} = this.state;
    const {selectedSupplier} = this.props
    if (selectedContactId && Number(selectedContactId) > -1) {
      const contact = (this.props.contactManager || []).find(x => x.PKey_OP_Contact === Number(selectedContactId));
      const data = {
        ...contact,
        FKey_OP_Supplier: selectedSupplier.PKey_OP_Supplier,
        ToBeEmailed
      }
      this.props.addNewRecord(data)
    } else {
      message.error('Please Select Contact.')
    }
  };


  onSelect = (id) => {
    this.setState({
      selectedContactId: id
    });
  }

  onSelectionChanged = (record) => {
    this.setState({
      selectedContactId: Number(record.selectedRowKeys[0].PKey_OP_Contact),
      FirstName: record.selectedRowKeys[0].FirstName,
      LastName: record.selectedRowKeys[0].LastName
    })
    this.widgetRef.current.instance.close();
  }

  onChange = (e) => {
    this.setState({
      ToBeEmailed: e.target.checked,
    })
  }

  isModalOpen = () => {
    this.setState({
      isContactModal: !this.state.isContactModal
    })
  }

  refreshGrid = () => {
    if (this.dg && this.dg.instance) {
      this.dg.instance.refresh()
    }
  }

  render() {
    const {isSaving, isModal, isModalOpen, contactManager} = this.props;
    const { getFieldDecorator } = this.props.form;
    const { isContactModal, FirstName, ToBeEmailed, LastName } = this.state;
    const data = `${LastName}${","} ${FirstName}`
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
      labelAlign: 'right'
    };
    return(
      <Modal
        visible={isModal}
        title="Create a New Contact"
        okText={isSaving ? <Spin className="white" size={"small"}/>  : 'Save'}
        onCancel={isModalOpen}
        onOk={this.addNewSupplierContact}
        cancelButtonProps={{className: 'pull-right ml-10'}}
      >
        <div className="pt-19">
          {
            !isContactModal && <DropDownBox
              ref={this.widgetRef}
            value={FirstName && LastName && data}
            valueExpr={'PKey_OP_Contact'}
            deferRendering={false}
            displayExpr={(item) => item && `${item.FirstName} ${item.LastName}`}
            placeholder={'Select a value...'}
            dataSource={contactManager}
            contentRender={(record) => {
              return (
                <CustomGrid
                  refCallback={(dg) => this.dg = dg}
                  dataSource={contactManager}
                  hoverStateEnabled={true}
                  onSelectionChanged={(record) => this.onSelectionChanged(record)}
                  height={'100%'}>
                  <Selection mode={'single'}/>
                  <Scrolling mode={'infinite'}/>
                  <Paging enabled={true} pageSize={10}/>
                  <Column sortOrder={'asc'} caption={'First Name'} dataField={'FirstName'}/>
                  <Column caption={'Last Name'} dataField={'LastName'}/>
                  <Column caption={'Email'} dataField={'Email'}/>
                  <Column alignment="left" width={"15%"}
                          headerCellRender={() => <span className="mr-10 text-primary cursor-pointer"
                                                        onClick={this.isModalOpen}>New</span>}/>
                </CustomGrid>
              )
            }}
          />
          }
          <div className="mt-5">
            <Checkbox checked={ToBeEmailed} onChange={this.onChange}>To Be Emailed ? </Checkbox>
          </div>
        </div>

        <Modal
          visible={isContactModal}
          title="Create a New Contact"
          okText={isSaving ? <Spin className="white" size={"small"}/>  : 'Save'}
          onCancel={this.isModalOpen}
          onOk={this.addNewContact}
          cancelButtonProps={{className: 'pull-right ml-10'}}
        >
          <Form {...formItemLayout}>
            <Form.Item label="First Name">
              {getFieldDecorator('FirstName', {
                rules: [{ required: true, message: 'Please input First Name!' }],
              })(
                <Input autoFocus={true}/>
              )}
            </Form.Item>
            <Form.Item label="Last Name">
              {getFieldDecorator('LastName', {
                rules: [{ required: true, message: 'Please input Last Name!' }],
              })(
                <Input/>
              )}
            </Form.Item>
            <Form.Item label="Email">
              {getFieldDecorator('Email', {
                rules: [{ required: true, message: 'Please input Email!' }],
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item label="Ext">
              {getFieldDecorator('PhoneExt', {
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item label="Phone">
              {getFieldDecorator('Phone', {
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('PrimaryContact', {
                valuePropName: 'checked',
              })(
                <Checkbox>Primary Contact</Checkbox>
              )}
            </Form.Item>
          </Form>

        </Modal>
      </Modal>
    )
  }
}
const AddNewSupplierContactForm = Form.create()(AddNewSupplierContact)
export default AddNewSupplierContactForm
