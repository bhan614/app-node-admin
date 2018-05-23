import React, { Component, } from 'react'
import PropTypes from 'prop-types';
import {Layout, Input, Button, Table, Form, message, Modal, Row, Col, } from 'antd'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Link } from 'react-router';
import { formatDate } from '../../utils/perfect';

import appActions from '../app/action'
import contentManageActions from './action'
import NewsCard from './newsCard'

import './common.less';

const FormItem = Form.Item
const { Content } = Layout;
const confirm = Modal.confirm;

class News extends Component {
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
  }
  componentWillMount() {
    const { pageNum, pageSize } = this.state;
    const { appActions, contentManageActions } = this.props;
    appActions.loading(true).then(() => {
      return contentManageActions.getNewsList({
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
        title: '确定删除该条战报？',
        onOk() {
          appActions.loading(true).then(() => {
            return contentManageActions.deleteNews({
              id
            });
          }).then(() => {
            return contentManageActions.getNewsList({
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

  render() {
    const { getFieldDecorator } = this.props.form;
    const { contentManage } = this.props;
    const newsList = contentManage.get('newsList') && contentManage.get('newsList');
    const list = newsList && newsList.get('list') && newsList.get('list');
    const total = newsList && newsList.get('totalCount') && newsList.get('totalCount');
    const current = newsList && newsList.get('currentPage') && newsList.get('currentPage');
    const editData = newsList && list.find(v => v.id === this.state.editId);
    const { pageSize } = this.state
    const columns = [{
      title: '序号',
      key: 'id',
      width: 80,
      render: (id, data, index) => {
        return <span>{index + (current - 1) * pageSize + 1}</span>
      }
    }, {
      title: '城市',
      dataIndex: 'cityName',
      key: 'cityName',
      width: 100
    }, {
      title: '中心',
      dataIndex: 'orgName',
      key: 'orgName',
      width: 100
    }, {
      title: '经理',
      dataIndex: 'manager',
      key: 'manager',
      width: 100
    }, {
      title: '金融顾问',
      dataIndex: 'adviser',
      key: 'adviser',
      width: 100
    }, {
      title: '产品分类',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => {
        if (type === 1) {
          return <span>装修金融</span>
        }
        if (type === 2) {
          return <span>房产金融</span>
        }
        if (type === 3) {
          return <span>直客</span>
        }
      }
    }, {
      title: '产品名称',
      dataIndex: 'product',
      key: 'product',
      width: 100
    }, {
      title: '签单金额(元)',
      dataIndex: 'amount',
      key: 'amount',
      width: 100
    }, {
      title: '本单业绩(元)',
      dataIndex: 'achieve',
      key: 'achieve',
      width: 100
    }, {
      title: '添加时间',
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
      width: 100
    }, {
      title: '操作',
      key: 'action',
      width: 100,
      render: (action, data, index) => {
        return (<span>
          <a onClick={this.handleEdit(data.id)}>编辑</a>
          <a style={{marginLeft: '5px'}} onClick={this.handleDelete(data.id)}>删除</a>
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
          return contentManageActions.getNewsList({
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
        <NewsCard
          modalVisible={this.state.modalVisible}
          modalChange={this.handleModalChange}
          pageSize={this.state.pageSize}
          pageNum={this.state.pageNum}
          editData={editData}
          />
      </Layout>
    )
  }
}

News.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(News))
