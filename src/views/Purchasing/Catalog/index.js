import React, {Component} from "react";
import {Card, CardBody, Col, Row} from "reactstrap";
import {Icon, Menu, message, Modal, Tree} from "antd";
import clonedeep from "lodash.clonedeep";
import {ApiService} from "../../../services/ApiService";
import Loader from "../../Common/Loader";
import AddNewCatalog from "./AddNewCatalog";
import {Column, TreeList} from "devextreme-react/tree-list";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.material.blue.light.compact.css";
const confirm = Modal.confirm;

const { TreeNode } = Tree;

const unflatten = (arr) => {
  let tree = [],
    mappedArr = {},
    arrElem,
    mappedElem;

  // First map the nodes of the array to an object -> create a hash table.
  for (let i = 0, len = arr.length; i < len; i++) {
    arrElem = arr[i];
    mappedArr[arrElem.PKey_OP_Catalog] = arrElem;
    mappedArr[arrElem.PKey_OP_Catalog]['children'] = [];
  }

  for (let id in mappedArr) {
    if (mappedArr.hasOwnProperty(id)) {
      mappedElem = mappedArr[id];
      // If the element is not at the root level, add it to its parent array of children.
      if (mappedElem.FKey_OP_Catalog) {
        if (mappedArr[mappedElem['FKey_OP_Catalog']] && mappedArr[mappedElem['FKey_OP_Catalog']]['children']) {
          mappedArr[mappedElem['FKey_OP_Catalog']]['children'].push(mappedElem);
        }
      }
      // If the element is at the root level, add it to first level elements array.
      else {
        tree.push(mappedElem);
      }
    }
  }
  return tree;
};

class Catalog extends Component {
  _apiService = new ApiService();
  state = {
    name: '',
    loading: false,
    catalog: [],
    catalogList: []
  };

  componentDidMount() {
    this.getCatalog();
  };

  getCatalog = async () =>{
    this.setState({
      loading: true,
    });
    const data = await this._apiService.getCatalog()
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!')
      this.setState({
        loading: false,
      })
    } else {
      data.forEach(x => {
        x.FKey_OP_Catalog = x.FKey_OP_Catalog ? x.FKey_OP_Catalog.toString() : x.FKey_OP_Catalog;
        x.PKey_OP_Catalog = x.PKey_OP_Catalog ? x.PKey_OP_Catalog.toString() : x.PKey_OP_Catalog;
      });
      const catalogList = data;
      this.setState({
        catalog: unflatten(clonedeep(data)),
        loading: false,
        catalogList
      })
    }
  };

  onDrop = info => {
    console.log(info);
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    if (dropKey !== dragKey) {
      const {catalogList} = this.state;
      const item = catalogList.find (x => String(x.PKey_OP_Catalog) === String(dragKey));
      if (item) {
        item.FKey_OP_Catalog = dropPosition === -1 ? null : dropKey;
      }
      this.onUpdateTree(item);
    }

    const loop = (data, key, callback) => {
      data.forEach((item, index, arr) => {
        if (item.PKey_OP_Catalog === key) {
          return callback(item, index, arr);
        }
        if (item.children) {
          return loop(item.children, key, callback);
        }
      });
    };
    const data = [...this.state.catalog];

    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      loop(data, dropKey, item => {
        item.children = item.children || [];
               item.children.push(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 &&
      info.node.props.expanded &&
      dropPosition === 1
    ) {
      loop(data, dropKey, item => {
        item.children = item.children || [];
        item.children.unshift(dragObj);
      });
    } else {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1 && ar) {
        ar.splice(i, 0, dragObj);
      } else {
        if (ar) {
          ar.splice(i + 1, 0, dragObj);
        }
      }
    }
    this.setState({
      catalog: data,
    });
  }

  onSelect = (key) => {
    this.setState({
      selectedKey: key[0]
    })
  };

  ModalToggle = (item, isEdit) => {
    this.setState({
      isModal: !this.state.isModal,
      selectedRecord: item,
      isEdit: isEdit
    });
  };

  onUpdateTree = async  (objData) => {
    this.setState({
      isSaving: true
    });
    const payload = {
      FKey_OP_Catalog: objData.FKey_OP_Catalog,
      Name: objData.Name,
      PKey_OP_Catalog: objData.PKey_OP_Catalog,
    };
    const data =  await this._apiService.updateCatalog(payload)
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!')
      this.setState({
        isSaving: false
      });
    } else {
      message.success('Catalog Updated Successfully');
      const {catalogList} = this.state;
      const itemIndex = catalogList.findIndex(x => x.PKey_OP_Catalog === objData.PKey_OP_Catalog);
      if (itemIndex > -1) {
        catalogList[itemIndex] = objData;
      }
      this.setState({
        selectedKey: null,
        isSaving: false,
        isModal: false,
        catalogList,
        selectedRecord: null,
        catalog: unflatten(clonedeep(catalogList))
      }, () => this.refreshGrid());
    }
  };

  addNewRecord = async (objData) => {
    this.setState({
      isSaving: true
    });
    const payload = {
      ...objData,
    };
    const data =  await this._apiService.updateCatalog(payload)
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!')
      this.setState({
        isSaving: false
      });
    } else {
      payload.PKey_OP_Catalog = data;
      message.success('Catalog Added Successfully');
      const { catalogList } = this.state;
      catalogList.push(payload);
      this.setState({
        selectedKey: null,
        isSaving: false,
        isModal: false,
        catalogList,
        catalog: unflatten(clonedeep(catalogList)),
      }, () => this.refreshGrid()
      );
    }
  };

   showConfirm = (item) => {
    confirm({
      title: 'Are you sure, you want to delete catalog?',
      onOk :() => this.deleteCatalog(item),
      onCancel:() => {},
    });
  }

  deleteCatalog = async  (objData) => {
    this.setState({
      isSaving: true
    });
    const payload = {
      FKey_OP_Catalog: objData.FKey_OP_Catalog,
      Name: objData.Name,
      PKey_OP_Catalog: objData.PKey_OP_Catalog,
    };
    const data =  await this._apiService.deleteCatalog(payload)
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!')
      this.setState({
        isSaving: false
      });
    } else {
      message.success('Catalog Deleted Successfully');
      let {catalogList} = this.state;
      catalogList = catalogList.filter(x => x.PKey_OP_Catalog !== objData.PKey_OP_Catalog);
      this.setState({
        selectedKey: null,
        isSaving: false,
        isModal: false,
        catalogList,
        selectedRecord: null,
        catalog: unflatten(clonedeep(catalogList))
      });
    }
  };

  refreshGrid = () => {
    if (this.dg && this.dg.instance) {
      this.dg.instance.refresh()
    }
  }

  render() {
    const {loading, isSaving, isModal, selectedRecord, isEdit, catalogList} = this.state;
    const getTitle = (item) => {
      return <div className="flex-align-item-center">
        <span>{item.Name}</span>
        <Icon type="edit" theme="twoTone" className="ml-5" onClick={() => this.ModalToggle (item, true)}/>
        <Icon type="delete"  theme="twoTone" className="ml-10" onClick={() => this.showConfirm(item)}/>
      </div>
    };
    // eslint-disable-next-line
    const loop = data =>
      data.map(item => {
        if (item.children && item.children.length) {
          return (
            <TreeNode key={item.PKey_OP_Catalog} title={getTitle(item)}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.PKey_OP_Catalog} title={getTitle(item)} />;
      });

    return (
      <div className="animated fadeIn with-print">
        <div className="print-button">
          <Menu mode="horizontal" selectable={false}>
            <Menu.Item key="Order" onClick={() => this.ModalToggle( "", false)}>
              <Icon type="plus" />
              New
            </Menu.Item>
          </Menu>
        </div>
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card className="no-border">
              <CardBody className="min-height-card">
                {
                  loading ? <Loader className="mt-50"/> :
                    <>
                      <Row>
                        <Col xs="12" sm="12" lg="12">
                          <TreeList
                            ref={(dg) => this.dg = dg}
                            dataSource={catalogList}
                            defaultExpandedRowKeys={[0]}
                            showRowLines={true}
                            showBorders={true}
                            columnAutoWidth={true}
                            keyExpr={'PKey_OP_Catalog'}
                            parentIdExpr={'FKey_OP_Catalog'}
                          >
                            <Column
                              dataField={'Name'}
                              caption={'Name'}
                              sortOrder={'asc'}
                              cellRender={(item) => (<div className="flex-align-item-center">
                                <span>{item.data.Name}</span>
                                <Icon type="edit" theme="twoTone" className="ml-5" onClick={() => this.ModalToggle (item.data, true)}/>
                                <Icon type="delete"  theme="twoTone" className="ml-10" onClick={() => this.showConfirm(item.data)}/>
                              </div>)}
                            />
                          </TreeList>
                          {/*<Tree
                            className="draggable-tree"
                            draggable
                            blockNode
                            multiple={false}
                            onDrop={this.onDrop}
                          >
                            {loop(this.state.catalog || [])}
                          </Tree>*/}
                        </Col>
                      </Row>
                      {
                        isModal && <AddNewCatalog isEdit={isEdit} isSaving={isSaving} onUpdateTree={this.onUpdateTree}
                                                 selectedRecord={selectedRecord}  addNewRecord={this.addNewRecord}
                                                 ModalToggle={this.ModalToggle} isModal={isModal} catalog={this.state.catalog} refreshGrid={this.refreshGrid}/>
                      }
                    </>
                }
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }

}
export default Catalog;
