import React, { Component, } from 'react'
import PropTypes from 'prop-types';
import {Layout, Input, Button, Table, message, Modal, Row, Col, Tabs, Card, Menu, Dropdown, Icon, Pagination, Select } from 'antd'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Link } from 'react-router';
import { formatDate } from '../../utils/perfect';
const { Option } = Select;

import appActions from '../app/action'
import marketManageActions from './action'
import contentManageActions from '../content-manage/action'
import HolidayCard from './holidayCard'
import PosterImageCard from './posterImageCard'

import './common.less';
import './poster.less';

const { Content } = Layout;
const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;
const Search = Input.Search;

const tabData = [
  {
    name: '住贝',
    type: 1
  },
  {
    name: '装贝',
    type: 2
  },
  {
    name: '租贝',
    type: 3
  },
  {
    name: '贝壳图说',
    type: 4
  }
]

class Poster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 8,
      pageNum: 1,
      imageModalVisible: false,
      editId: -1,
      imageParentId: -1,
      currenTab: 1,
      searchValue: '',
      searchCity: ''
    }
    this.renderTitle = this.renderTitle.bind(this);
    this.addImageCard = this.addImageCard.bind(this);
    this.handleImageModalChange = this.handleImageModalChange.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handlePaginationChange = this.handlePaginationChange.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleImageDelete = this.handleImageDelete.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleCitySelect = this.handleCitySelect.bind(this);
  }
  componentWillMount() {
    const { pageNum, pageSize } = this.state;
    const { appActions, marketManageActions, contentManageActions } = this.props;
    appActions.loading(true).then(() => {
      return Promise.all([
        marketManageActions.getPosterList({
          pageNum,
          pageSize,
          type: 1
        }),
        contentManageActions.getCityList()
      ])

    }).then((data) => {
      this.setState({
        pageNum: data[0].data.currentPage
      })
      appActions.loading(false)
    }).catch(err => {
      appActions.loading(false)
      message.error(err.msg);
    })
  }

  handleSearch(value) {
    const { pageNum, pageSize, currenTab, searchCity } = this.state;
    const { appActions, marketManageActions } = this.props;
    this.setState({searchValue: value});
    appActions.loading(true).then(() => {
      return marketManageActions.getPosterList({
        pageNum: 1,
        pageSize,
        type: currenTab,
        description: value,
        cityCode: searchCity
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
    const { contentManage } = this.props;
    const cityList = contentManage.get('cityList') && contentManage.get('cityList') || [];
    return (
      <Row type="flex" align="middle" className='holiday-title'>
        <Col span={4} className='title'>产品海报</Col>
        <Col span={11}></Col>
        <Col span={5} style={{textAlign: 'right', marginRight: '10px'}}>
          <Search
            placeholder="请输入关键词"
            style={{ width: 200 }}
            onSearch={this.handleSearch}
            onChange={this.handleSearchChange}
            value={this.state.searchValue}
            />
        </Col>
        <Col span={2}>
          <Select onChange={this.handleCitySelect} style={{ width: '100%' }} value={this.state.searchCity}>
            <Option key='全部' value=''>全部</Option>
            {
              cityList.map((v, k) => (
                <Option key={v.cityCode} value={v.cityCode}>{v.cityName}</Option>
              ))
            }
            <Option key='全国' value='000000'>全国</Option>
          </Select>
        </Col>
      </Row>
    )
  }

  handleCitySelect(v) {
    const { pageNum, pageSize, currenTab, description } = this.state;
    const { appActions, marketManageActions } = this.props;
    this.setState({searchCity: v});
    appActions.loading(true).then(() => {
      return marketManageActions.getPosterList({
        pageNum: 1,
        pageSize,
        type: currenTab,
        cityCode: v,
        description
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

  handleSearchChange(e) {
    this.setState({searchValue: e.target.value})
  }

  renderRowKey(data) {
    return data.id;
  }

  addImageCard(id) {
    return () => {
      this.setState({imageModalVisible: true, imageParentId: id, editId: -1});
    }
  }

  handleImageModalChange() {
    this.setState({imageModalVisible: false})
  }

  handleEdit(id) {
    return (e) => {
      e.stopPropagation()
      this.setState({
        imageModalVisible: true,
        editId: id
      });
    }
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
      const { pageNum, pageSize, currenTab } = this.state;
      const statusValue = this.getStatusValue(status);
      confirm({
        title: `确定更改该条信息的状态为${statusValue}?`,
        onOk() {
          appActions.loading(true).then(() => {
            return marketManageActions.addPosterImage({
              id,
              status,
              type: currenTab
            });
          }).then(() => {
            return marketManageActions.getPosterList({
              pageNum,
              pageSize,
              type: currenTab
            })
          }).then(() => {
            message.success('修改成功');
            appActions.loading(false);
          }).catch(() => {
            appActions.loading(false);
            message.error('修改失败');
          });
        }
      });
    }
  }

  handlePaginationChange(page, pageSize) {
    const { appActions, marketManageActions } = this.props;
    const { searchValue } = this.state;
    appActions.loading(true).then(() => {
      return marketManageActions.getPosterList({
        pageNum: page,
        pageSize,
        type: this.state.currenTab,
        description: searchValue
      })
    }).then((data) => {
      this.setState({
        pageNum: data.data.currentPage,
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
      const { pageNum, pageSize, currenTab } = this.state;
      confirm({
        title: '确定删除该条内容？',
        onOk() {
          appActions.loading(true).then(() => {
            return marketManageActions.deletePosterImage({
              id
            })
          }).then(() => {
            return marketManageActions.getPosterList({
              pageNum: 1,
              pageSize,
              type: currenTab
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

  handleTabClick(key) {
    const { pageNum, pageSize } = this.state;
    const { appActions, marketManageActions } = this.props;
    appActions.loading(true).then(() => {
      return marketManageActions.getPosterList({
        pageNum: 1,
        pageSize,
        type: key
      })
    }).then((data) => {
      this.setState({
        pageNum: data.data.currentPage,
        currenTab: key,
        searchValue: '',
        searchCity: ''
      })
      appActions.loading(false)
    }).catch(err => {
      appActions.loading(false)
      message.error(err.msg);
    })
  }

  render() {
    const { marketManage } = this.props;
    const posterList = marketManage.get('posterList') && marketManage.get('posterList');
    const list = posterList && posterList.get('list') && posterList.get('list');
    const total = posterList && posterList.get('totalCount') && posterList.get('totalCount') || 0;
    const current = posterList && posterList.get('currentPage') && posterList.get('currentPage') || 1;
    const editData = posterList && list.find(v => v.id === this.state.editId);
    const { pageSize } = this.state;

    const CardItem = ({ url, time, status, id, parentId, description, cityName, title, ...props }) => (
      <Card style={{ width: 250, display: 'inline-block', verticalAlign: 'middle', margin: '10px'}} bodyStyle={{ padding: '5px' }}>
        <Row type='flex' justify='center' style={{width: 240, height: 165, overflow: 'hidden'}}>
          <Col span={11} style={{height: '100%', textAlign: 'center', overflow: 'hidden'}}>
            <img alt="example" width='auto' height='100%' src={url} />
          </Col>
          <Col span={13} style={{padding: '10px', alignItems: 'flex-start'}}>
            <div style={{ height: '30px' }}>{title}</div>
            <div style={{ height: '55px'}}>{description}</div>
            <div className="card-city-name">
              {cityName}
            </div>
          </Col>
        </Row>
        <Row style={{padding: '5px 6px 0 6px'}}>
          <Col span={7}>{this.getStatus(status)}</Col>
          <Col span={10}>{formatDate({time, showYear: true, showHms: false})}</Col>
          <Col span={7} style={{textAlign: 'right'}}>
            <Icon type="edit" onClick={this.handleEdit(id)} style={{marginRight: '10px', cursor: 'pointer'}} />
            <Dropdown overlay={this.renderMenu(id, parentId)} placement="bottomCenter">
              <a className="ant-dropdown-link" href="#">
                <Icon type="ellipsis"/>
              </a>
            </Dropdown>
          </Col>
        </Row>
      </Card>
    )
    return (
      <Layout className='content-common' >
        {this.renderTitle()}
        <Tabs defaultActiveKey={'1'} onTabClick={this.handleTabClick}>
          {
            tabData.map((v, k) => (
              <TabPane key={v.type} tab={v.name}>
                <div>
                  <Card
                  style={{ width: 250, height: 200, display: 'inline-block', verticalAlign: 'middle', margin: '10px'}}
                  bodyStyle={{ padding: '5px' }}
                  onClick={this.addImageCard(v.type)}>
                    <div style={{textAlign: 'center', lineHeight: '180px', cursor: 'pointer'}}>
                      <Icon type="plus" style={{fontSize: '28px', color: '#999'}} />
                    </div>
                  </Card>
                  {
                    (list || []).map((imgList, k) => (
                      <CardItem
                      key={imgList.id}
                      url={imgList.imgUrl}
                      time={imgList.createTime}
                      status={imgList.status}
                      id={imgList.id}
                      parentId={v.type}
                      cityName={imgList.cityName}
                      title={imgList.title}
                      description={imgList.description} />
                    ))
                  }
                </div>
                <Row type="flex" align="middle" gutter={10} style={{marginTop: '30px'}}>
                  <Col span={12}></Col>
                  <Col span={10} style={{textAlign: 'right'}}>
                    <Pagination showQuickJumper current={current} total={total} pageSize={this.state.pageSize} onChange={this.handlePaginationChange} />
                  </Col>
                  <Col span={2}>
                    <span>共有{total}条</span>
                  </Col>
                </Row>
              </TabPane>
            ))
          }
        </Tabs>
        {
          this.state.imageModalVisible ?
            <PosterImageCard
              modalVisible={this.state.imageModalVisible}
              modalChange={this.handleImageModalChange}
              pageSize={this.state.pageSize}
              type={this.state.currenTab}
              editData={editData}
              pageNum={this.state.pageNum}
              /> : null
        }
      </Layout>
    )
  }
}

Poster.propTypes = {
  marketManage: PropTypes.object,
  marketManageActions: PropTypes.object,
  appActions: PropTypes.object,
  contentManage: PropTypes.object,
  contentManageActions: PropTypes.object
}

const mapStateToProps = (state, ownProps) => {
  const marketManage = state.get( 'marketManage' );
  const contentManage = state.get('contentManage');
  return {
    marketManage,
    contentManage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    appActions: bindActionCreators(appActions, dispatch),
    marketManageActions: bindActionCreators(marketManageActions, dispatch),
    contentManageActions: bindActionCreators(contentManageActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Poster)
