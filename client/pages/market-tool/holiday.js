import React, { Component, } from 'react'
import PropTypes from 'prop-types';
import {Layout, Input, Button, Table, message, Modal, Row, Col, Collapse, Card, Menu, Dropdown, Icon, Pagination } from 'antd'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Link } from 'react-router';
import { formatDate } from '../../utils/perfect';

import appActions from '../app/action'
import marketManageActions from './action'
import HolidayCard from './holidayCard'
import ImageCard from './imageCard'

import './common.less';

const { Content } = Layout;
const confirm = Modal.confirm;
const Panel = Collapse.Panel;

class Holiday extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 5,
      pageNum: 1,
      modalVisible: false,
      imageModalVisible: false,
      editId: -1,
      imageParentId: -1,
      activeKey: []
    }
    this.renderTitle = this.renderTitle.bind(this);
    this.addNewCard = this.addNewCard.bind(this);
    this.addImageCard = this.addImageCard.bind(this);
    this.handleModalChange = this.handleModalChange.bind(this);
    this.handleImageModalChange = this.handleImageModalChange.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handlePaginationChange = this.handlePaginationChange.bind(this);
    this.handleCollapseChange = this.handleCollapseChange.bind(this);
  }
  componentWillMount() {
    const { pageNum, pageSize } = this.state;
    const { appActions, marketManageActions } = this.props;
    appActions.loading(true).then(() => {
      return marketManageActions.getHolidayList({
        pageNum,
        pageSize
      })
    }).then((data) => {
      this.setState({
        pageNum: data.data.currentPage
      })
      appActions.loading(false)
    }).catch(err => {
      appActions.loading(false)
      message.error(err.msg);
    })
  }

  renderTitle() {
    return (
      <Row type="flex" align="middle" className='holiday-title'>
        <Col span={4} className='title'>节日管理</Col>
        <Col span={16}></Col>
        <Col span={4} style={{textAlign: 'right'}}>
          <Button type='primary' size='default' onClick={this.addNewCard} >+ 新增节日</Button>
        </Col>
      </Row>
    )
  }

  renderRowKey(data) {
    return data.id;
  }

  addNewCard() {
    this.setState({modalVisible: true, editId: -1});
  }

  addImageCard(id) {
    return () => {
      this.setState({imageModalVisible: true, imageParentId: id});
    }
  }

  handleModalChange() {
    this.setState({modalVisible: false})
  }

  handleImageModalChange() {
    this.setState({imageModalVisible: false})
  }

  handleEdit(id) {
    return (e) => {
      e.stopPropagation()
      this.setState({
        modalVisible: true,
        editId: id
      });
    }
  }

  handleDelete(id) {
    return (e) => {
      const { appActions, marketManageActions } = this.props;
      const { pageSize } = this.state;
      e.stopPropagation()
      confirm({
        title: '确定删除该条节日？',
        onOk() {
          appActions.loading(true).then(() => {
            return marketManageActions.deleteHoliday({
              id
            });
          }).then(() => {
            return marketManageActions.getHolidayList({
              pageNum: 1,
              pageSize
            })
          }).then(() => {
            message.success('删除成功');
            appActions.loading(false);
          }).catch(() => {
            appActions.loading(false);
            message.error('删除失败');
          })
        }
      });
    }
  }

  renderPanelHeader(name, time, id) {
    return (
      <Row type="flex" align="middle">
        <Col span={2}>{name}</Col>
        <Col span={3}>{formatDate({time, showYear: true, showHms: false})}</Col>
        <Col span={15}></Col>
        <Col span={4} style={{textAlign: 'right'}}>
          <a onClick={this.handleEdit(id)} >编辑</a>
          <a onClick={this.handleDelete(id)} style={{marginRight: '8px', marginLeft: '8px'}}>删除</a>
        </Col>
      </Row>
    )
  }

  getStatus(status) {
    if (status === 0) {
      return <span style={{color: 'red'}}>未生效</span>
    }
    if (status === 1) {
      return <span style={{color: 'green'}}>生效</span>
    }
  }

  getStatusValue(status) {
    if (status === '0') {
      return '未生效'
    }
    if (status === '1') {
      return '生效'
    }
  }

  handleStateChange(status, id, parentId) {
    return () => {
      const { appActions, marketManageActions } = this.props;
      const { pageSize, pageNum } = this.state;
      const statusValue = this.getStatusValue(status);
      confirm({
        title: `确定更改该条信息的状态为${statusValue}?`,
        onOk() {
          appActions.loading(true).then(() => {
            return marketManageActions.addHolidayImage({
              id,
              status,
              parentId
            });
          }).then(() => {
            return marketManageActions.getHolidayList({
              pageNum,
              pageSize
            })
          }).then(() => {
            message.success('修改成功');
            appActions.loading(false);
          }).catch(() => {
            appActions.loading(false);
            message.error('修改失败');
          })
        }
      });
    }
  }

  handlePaginationChange(page, pageSize) {
    const { appActions, marketManageActions } = this.props;
    appActions.loading(true).then(() => {
      return marketManageActions.getHolidayList({
        pageNum: page,
        pageSize
      })
    }).then((data) => {
      this.setState({
        pageNum: data.data.currentPage,
        activeKey: []
      })
      appActions.loading(false);
    }).catch(err => {
      appActions.loading(false)
      message.error(err.msg);
    })
  }

  handleImageDelete(id) {
    return () => {
      const { appActions, marketManageActions } = this.props;
      const { pageSize, pageNum } = this.state;
      confirm({
        title: '确定删除该图片？',
        onOk() {
          appActions.loading(true).then(() => {
            return marketManageActions.deleteHolidayImage({
              id
            });
          }).then(() => {
            return marketManageActions.getHolidayList({
              pageNum,
              pageSize
            })
          }).then(() => {
            message.success('删除成功');
            appActions.loading(false);
          }).catch(() => {
            appActions.loading(false);
            message.error('删除失败');
          })
        }
      });
    }
  }

  renderMenu(id, parentId) {
    const menu = (
      <Menu>
        <Menu.Item>
          <span onClick={this.handleStateChange('1', id, parentId)}>生效</span>
        </Menu.Item>
        <Menu.Item>
          <span onClick={this.handleStateChange('0', id, parentId)}>未生效</span>
        </Menu.Item>
        <Menu.Item>
          <span onClick={this.handleImageDelete(id)}>删除</span>
        </Menu.Item>
      </Menu>
    );
    return menu
  }

  handleCollapseChange(key) {
    this.setState({activeKey: key})
  }

  render() {
    const { marketManage } = this.props;
    const holidayList = marketManage.get('holidayList') && marketManage.get('holidayList');
    const list = holidayList && holidayList.get('list') && holidayList.get('list');
    const total = holidayList && holidayList.get('totalCount') && holidayList.get('totalCount') || 0;
    const current = holidayList && holidayList.get('currentPage') && holidayList.get('currentPage') || 1;
    const editData = holidayList && list.find(v => v.id === this.state.editId);
    const { pageSize } = this.state;

    const CardItem = ({ url, time, status, id, parentId, ...props }) => (
      <Card style={{ width: 180, display: 'inline-block', verticalAlign: 'middle', margin: '10px'}} bodyStyle={{ padding: '5px' }}>
        <Row type='flex' align='middle' justify='center' style={{width: 168, height: 200, lineHeight: '200px', overflow: 'hidden'}}>
          <img alt="example" width='100%' height='100%' src={url} />
        </Row>
        <Row style={{padding: '5px 6px 0 6px'}}>
          <Col span={7}>{this.getStatus(status)}</Col>
          <Col span={10}>{formatDate({time, showYear: true, showHms: false})}</Col>
          <Col span={7} style={{textAlign: 'right'}}>
            <Dropdown overlay={this.renderMenu(id, parentId)} placement="bottomCenter">
              <a className="ant-dropdown-link" href="#">
                <Icon type="ellipsis" />
              </a>
            </Dropdown>
          </Col>
        </Row>
      </Card>
    )
    return (
      <Layout className='content-common' >
        {this.renderTitle()}
        <Collapse bordered={false} activeKey={this.state.activeKey} onChange={this.handleCollapseChange}>
          {
            (list || []).map((v, k) => (
              <Panel header={this.renderPanelHeader(v.name, v.time, v.id)} key={v.id} className='customPanelStyle'>
                <div className='panelContent'>
                  <Card
                  style={{ width: 180, height: 235, display: 'inline-block', verticalAlign: 'middle', margin: '10px'}}
                  bodyStyle={{ padding: '5px' }}
                  onClick={this.addImageCard(v.id)}>
                    <div style={{textAlign: 'center', lineHeight: '225px', cursor: 'pointer'}}>
                      <Icon type="plus" style={{fontSize: '28px', color: '#999'}} />
                    </div>
                  </Card>
                  {
                    v.imgList.map((imgList, k) => (
                      <CardItem key={imgList.id} url={imgList.imgUrl} time={imgList.createTime} status={imgList.status} id={imgList.id} parentId={v.id} />
                    ))
                  }
                </div>
              </Panel>
            ))
          }
        </Collapse>
        <Row type="flex" align="middle" gutter={10} style={{marginTop: '30px'}}>
          <Col span={12}></Col>
          <Col span={10} style={{textAlign: 'right'}}>
            <Pagination showQuickJumper current={current} total={total} pageSize={this.state.pageSize} onChange={this.handlePaginationChange} />
          </Col>
          <Col span={2}>
            <span>共有{total}条</span>
          </Col>
        </Row>
        {
          this.state.imageModalVisible ?
            <ImageCard
              modalVisible={this.state.imageModalVisible}
              modalChange={this.handleImageModalChange}
              pageSize={this.state.pageSize}
              pageNum={this.state.pageNum}
              parentId={this.state.imageParentId}
              /> : null
        }
        {
          this.state.modalVisible ?
            <HolidayCard
              modalVisible={this.state.modalVisible}
              modalChange={this.handleModalChange}
              pageSize={this.state.pageSize}
              pageNum={this.state.pageNum}
              editData={editData}
              /> : null
        }
      </Layout>
    )
  }
}

Holiday.propTypes = {
  marketManage: PropTypes.object,
  marketManageActions: PropTypes.object,
  appActions: PropTypes.object
}

const mapStateToProps = (state, ownProps) => {
  const marketManage = state.get( 'marketManage' );
  return {
    marketManage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    appActions: bindActionCreators(appActions, dispatch),
    marketManageActions: bindActionCreators(marketManageActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Holiday)
