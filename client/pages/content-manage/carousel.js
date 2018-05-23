import React, { Component, } from 'react'
import PropTypes from 'prop-types';
import {Layout, Input, Button, Table, Form, message, Modal, Row, Col, } from 'antd'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Link } from 'react-router';
import { formatDate } from '../../utils/perfect';

import appActions from '../app/action'
import contentManageActions from './action'
import CarouselCard from './carouselCard'

import './common.less';

const FormItem = Form.Item
const { Content } = Layout;
const confirm = Modal.confirm;

class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10,
      pageNum: 1,
      modalVisible: false,
      editId: -1
    }
    this.renderTitle = this.renderTitle.bind(this);
    this.addNewCard = this.addNewCard.bind(this);
    this.handleModalChange = this.handleModalChange.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleChangeState = this.handleChangeState.bind(this);
  }
  componentWillMount() {
    const { pageNum, pageSize } = this.state;
    const { appActions, contentManageActions } = this.props;
    appActions.loading(true).then(() => {
      return Promise.all([
        contentManageActions.getCarouselList({
          pageNum,
          pageSize
        }),
        this.props.contentManageActions.getBannerNumber()
      ]).then((data) => {
        this.setState({
          pageNum: data[0].data.currentPage
        })
        appActions.loading(false)
      }).catch(err => {
        appActions.loading(false)
        message.error(err.msg);
      })
    })
  }

  renderTitle(total = '') {
    return () => (
      <Row type="flex" align="middle">
        <Col span={4}>共搜索到{total}条数据</Col>
        <Col span={16}></Col>
        <Col span={4} style={{textAlign: 'right'}}>
          <Button type='primary' size='default' onClick={this.addNewCard} >+ 新增</Button>
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

  handleModalChange() {
    this.setState({modalVisible: false})
  }

  handleEdit(id) {
    return () => {
      this.setState({
        modalVisible: true,
        editId: id
      });
    }
  }

  handleDelete(id) {
    return () => {
      const { appActions, contentManageActions } = this.props;
      const { pageSize } = this.state;
      confirm({
        title: '确定删除该条轮播图？',
        onOk() {
          appActions.loading(true).then(() => {
            return contentManageActions.deleteCarousel({
              id
            });
          }).then(() => {
            return contentManageActions.getCarouselList({
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

  getChangedStatus(status) {
    if (status === 0) {
      return '1';
    }
    return '0';
  }

  handleChangeState(id, status) {
    return () => {
      const { appActions, contentManageActions, contentManage } = this.props;
      const { pageSize, pageNum } = this.state;
      const changedStatus = this.getChangedStatus(status);
      const bannerSort = contentManage && contentManage.get('bannerSort') && contentManage.get('bannerSort');
      confirm({
        title: '确定更改该条轮播图状态？',
        onOk() {
          appActions.loading(true).then(() => {
            return contentManageActions.changeCarouselState({
              id,
              status: changedStatus,
              sort: status === 0 ? bannerSort.get('0') + 1 : null
            });
          }).then(() => {
            return Promise.all([
              contentManageActions.getCarouselList({
                pageNum,
                pageSize
               }),
              contentManageActions.getBannerNumber()
            ])
          }).then(() => {
            message.success('更改成功');
            appActions.loading(false);
          }).catch(() => {
            appActions.loading(false);
            message.error('更改失败');
          })
        }
      });
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { contentManage } = this.props;
    const carouselList = contentManage.get('carouselList') && contentManage.get('carouselList');
    const list = carouselList && carouselList.get('list') && carouselList.get('list');
    const total = carouselList && carouselList.get('totalCount') && carouselList.get('totalCount');
    const current = carouselList && carouselList.get('currentPage') && carouselList.get('currentPage');
    const editData = carouselList && list.find(v => v.id === this.state.editId);
    const { pageSize } = this.state
    const columns = [{
      title: '序号',
      key: 'id',
      width: 80,
      render: (id, data, index) => {
        return <span>{index + (current - 1) * pageSize + 1}</span>
      }
    }, {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 200
    }, {
      title: '图片预览',
      dataIndex: 'imgUrl',
      key: 'imgUrl',
      width: 100,
      render: (url) => {
        return <img src={url} width='100' height='50' />
      }
    }, {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 70,
      render: (sort, data) => {
        if (data.status === 0) {
          return <span style={{marginLeft: '8px'}}>---</span>
        }
        if (sort) {
          return <span style={{marginLeft: '8px'}}>{sort}</span>
        }
      }
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 70,
      render: (status) => {
        if (status === 1) {
          return <span>生效</span>
        }
        if (status === 0) {
          return <span>未生效</span>
        }
      }
    }, {
      title: '生成时间',
      dataIndex: 'time',
      key: 'time',
      width: 100,
      render: (time) => {
        return (
          <span>{formatDate({time, showYear: true, showHms: false})}</span>
        )
      }
    }, {
      title: '操作人',
      dataIndex: 'createUser',
      key: 'createUser',
      width: 80
    }, {
      title: '操作',
      key: 'action',
      width: 120,
      render: (action, data, index) => {
        return (<span>
          <a onClick={this.handleEdit(data.id)}>编辑</a>
          <a style={{marginLeft: '5px'}} onClick={this.handleDelete(data.id)}>删除</a>
          <a style={{marginLeft: '5px'}} onClick={this.handleChangeState(data.id, data.status)}>更改状态</a>
        </span>)
     }
    }];
    const pagination = {
      current,
      total,
      pageSize,
      showSizeChanger: false,
      //showQuickJumper: true,
      onChange: ( page, pageSize ) => {
        const { appActions, contentManageActions } = this.props;
        appActions.loading(true).then(() => {
          return contentManageActions.getCarouselList({
            pageNum: page,
            pageSize
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
    }
    return (
      <Layout className='content-common' >
        <Content className='table-content-wrap' >
          <Table columns={columns} dataSource={list} pagination={pagination} title={this.renderTitle(total)} rowKey={this.renderRowKey} />
        </Content>
        {
          this.state.modalVisible ?
            <CarouselCard
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

Carousel.propTypes = {
  form: PropTypes.object,
  contentManage: PropTypes.object,
  contentManageActions: PropTypes.object,
  appActions: PropTypes.object
}

const mapStateToProps = (state, ownProps) => {
  const contentManage = state.get( 'contentManage' );
  return {
    contentManage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    appActions: bindActionCreators(appActions, dispatch),
    contentManageActions: bindActionCreators(contentManageActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Carousel))
