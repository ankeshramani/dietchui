import React, {Component} from 'react'
import './touch.scss'
import {Row, Col, Card, CardBody, CardHeader} from 'reactstrap'
import {Button, Checkbox, DatePicker, Icon} from "antd";
import img from '../../assets/avatars/1.jpg'
import FirstStep from "./Steps/FirstStep";
import SecondStep from "./Steps/SecondStep";
import ThirdStep from "./Steps/ThirdStep";

class Touch extends Component {
  state = {
    isFullScreen: false,
    cardList: [
      {
        id: 1,
        name: 'Breakfast',
        defaultChecked: false,
      },
      {
        id: 2,
        name: 'Lunch',
        defaultChecked: false,
      },
      {
        id: 3,
        name: 'Supper',
        defaultChecked: false,
      },
    ],
    userList: [
      {
        id: 1,
        firstName: 'ACOSTA',
        lastName: 'JAMES',
        date: '1/141F',
        img: img,
        categories: {
          menuCategories: [
            {
              name: "CEREAL",
              color: '#ff0',
              subCategories: [
                {
                  subName: 'Oatmeal',
                  color: '#ff0',
                  value: '6 oz',
                  selected: true,
                }, {
                  subName: 'HOt Tea',
                  color: '#ff0',
                  value: '6 oz',
                  selected: true,
                }
              ]
            },
            {
              name: "TOAST",
              color: '#faa34b',
              subCategories: [
                {
                  subName: 'Oatmeal',
                  color: '#faa34b',
                  value: '6 oz',
                  selected: true,
                }, {
                  subName: 'HOt Tea',
                  color: '#faa34b',
                  value: '6 oz',
                  selected: true,
                }
              ]
            },
            {
              name: "COND-SALT",
              color: '#a3774b',
              subCategories: [
                {
                  subName: 'Oatmeal',
                  color: '#a3774b',
                  value: '6 oz',
                  selected: true,
                }, {
                  subName: 'HOt Tea',
                  color: '#a3774b',
                  value: '6 oz',
                  selected: true,
                }
              ]
            },
            {
              name: "ENTREE",
              color: '#98e3ee',
              subCategories: [
                {
                  subName: 'Oatmeal',
                  value: '6 oz',
                  selected: true,
                  color: '#98e3ee',
                }, {
                  subName: 'HOt Tea',
                  value: '6 oz',
                  selected: true,
                  color: '#98e3ee',
                }
              ]
            },
            {
              name: "COND-PEPPER",
              color: '#c0abda',
              subCategories: [
                {
                  subName: 'Oatmeal',
                  color: '#c0abda',
                  value: '6 oz',
                  selected: true,
                }, {
                  subName: 'HOt Tea',
                  value: '6 oz',
                  selected: true,
                  color: '#c0abda',
                }
              ]
            },
            {
              name: "COND-SUGAR",
              color: '#d3c0a1',
              subCategories: [
                {
                  subName: 'Oatmeal',
                  value: '6 oz',
                  selected: true,
                  color: '#d3c0a1',
                }, {
                  subName: 'HOt Tea',
                  value: '6 oz',
                  selected: true,
                  color: '#d3c0a1',
                }
              ]
            },
            {
              name: "BEVERAGE:(HOT)",
              color: '#cfcfcf',
              subCategories: [
                {
                  subName: 'Oatmeal',
                  color: '#cfcfcf',
                  value: '6 oz',
                  selected: true,
                }, {
                  subName: 'HOt Tea',
                  color: '#cfcfcf',
                  value: '6 oz',
                  selected: true,
                }
              ]
            },
          ],
        },
      },
      {
        id: 2,
        firstName: 'ACOSTA',
        lastName: 'JAMES',
        date: '1/141F',
        img: img,
      },
      {
        id: 3,
        firstName: 'ACOSTA',
        lastName: 'JAMES',
        date: '1/141F',
        img: "",
      },
      {
        id: 4,
        firstName: 'ACOSTA',
        lastName: 'JAMES',
        date: '1/141F',
        img: img,
      },
      {
        id: 5,
        firstName: 'ACOSTA',
        lastName: 'JAMES',
        date: '1/141F',
        img: img,
      },
      {
        id: 6,
        firstName: 'ACOSTA',
        lastName: 'JAMES',
        date: '1/141F',
        img: img,
      },
      {
        id: 7,
        firstName: 'ACOSTA',
        lastName: 'JAMES',
        date: '1/141F',
        img: "",
      },
      {
        id: 8,
        firstName: 'ACOSTA',
        lastName: 'JAMES',
        date: '1/141F',
        img: img,
      },
      {
        id: 9,
        firstName: 'ACOSTA',
        lastName: 'JAMES',
        date: '1/141F',
        img: img,
      },
      {
        id: 10,
        firstName: 'ACOSTA',
        lastName: 'JAMES',
        date: '1/141F',
        img: "",
      },
      {
        id: 11,
        firstName: 'ACOSTA',
        lastName: 'JAMES',
        date: '1/141F',
        img: "",
      },
      {
        id: 12,
        firstName: 'ACOSTA',
        lastName: 'JAMES',
        date: '1/141F',
        img: img,
      },
      {
        id: 13,
        firstName: 'ACOSTA',
        lastName: 'JAMES',
        date: '1/141F',
        img: img,
      },
      {
        id: 14,
        firstName: 'ACOSTA',
        lastName: 'JAMES',
        date: '1/141F',
        img: img,
      },
      {
        id: 15,
        firstName: 'ACOSTA',
        lastName: 'JAMES',
        date: '1/141F',
        img: img,
      },
      {
        id: 16,
        firstName: 'ACOSTA',
        lastName: 'JAMES',
        date: '1/141F',
        img: img,
      },
      {
        id: 17,
        firstName: 'ACOSTA',
        lastName: 'JAMES',
        date: '1/141F',
        img: img,
      },
      {
        id: 18,
        firstName: 'ACOSTA',
        lastName: 'JAMES',
        date: '1/141F',
        img: img,
      },
      {
        id: 19,
        firstName: 'ACOSTA',
        lastName: 'JAMES',
        date: '1/141F',
        img: img,
      },
      {
        id: 20,
        firstName: 'ACOSTA',
        lastName: 'JAMES',
        date: '1/141F',
        img: img,
      },
      {
        id: 21,
        firstName: 'ACOSTA',
        lastName: 'JAMES',
        date: '1/141F',
        img: img,
      },

    ],
    current: 1,
    selectedUser: {},
    isShowCategory: true
  }

  openFullscreen = () => {
    const elem = document.getElementById('touch');
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
      elem.msRequestFullscreen();
    }
  }

  closeFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
      document.msExitFullscreen();
    }
  }

  onCheckBoxChange = (e, selectedRecord) => {
    selectedRecord.defaultChecked = e.target.checked;
    const {cardList} = this.state;
    cardList.forEach((item, index) => {
      if (item.id === selectedRecord.id) {
        cardList[index] = selectedRecord;
      } else {
        if (cardList[index].defaultChecked) {
          cardList[index].defaultChecked = false;
        }
      }
    });
    this.setState({
      cardList
    })
  }

  onConfirm = () => {
    const current = this.state.current + 1;
    this.setState({current});
  }

  onBack = () => {
    const current = this.state.current - 1;
    this.setState({current});
  }

  onShowUserDetails = (selectedUser) => {
    const current = this.state.current + 1;
    this.setState({
      current,
      selectedUser
    });
  }

  onShowCategory = () => {
    this.setState({
      isShowCategory: !this.state.isShowCategory
    })
  }

  render() {
    const {cardList, current, userList, isShowCategory, selectedUser} = this.state;
    return (
      <div className="touch" id={"touch"}>
        <div className="animated fadeIn with-print">
          <div className="custom-header">
            <Row className="mt-10 align-items-center">
              <Col md="11" sm="12" lg="11">
                {current === 2 || current === 3 ?
                  <span className="cursor-pointer" onClick={this.onBack}><Icon type="arrow-left"
                                                                               className="fs-26"/></span> : null}
              </Col>
              <Col md="1" sm="12" lg="1">
                <div>
                <span id={'fullscreen-exit'} className="cursor-pointer pull-right" onClick={this.closeFullscreen}>
                  <Icon type="fullscreen-exit" className="fs-26"/>
                </span>
                  <span id={'fullscreen'} className="cursor-pointer pull-right" onClick={this.openFullscreen}>
                  <Icon type="fullscreen" className="fs-26"/>
                </span>
                </div>
              </Col>
            </Row>
          </div>
          {
            current === 1 &&
            <FirstStep
              cardList={cardList}
              onConfirm={this.onConfirm}
              onCheckBoxChange={this.onCheckBoxChange}
            />
          }
          {
            current === 2 &&
              <SecondStep
                userList={userList}
                onShowUserDetails={this.onShowUserDetails}
              />
          }
          {
            current === 3 &&
             <ThirdStep
               isShowCategory={isShowCategory}
               selectedUser={selectedUser}
               onShowCategory={this.onShowCategory}
             />
          }
        </div>
      </div>
    )
  }

}

export default Touch;
