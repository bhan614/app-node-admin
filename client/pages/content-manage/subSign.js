import React, { Component, } from 'react'
import PropTypes from 'prop-types';
import {Layout, Input, Button, Table, Form, message, Modal, Row, Col, } from 'antd'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Link } from 'react-router';
import { formatDate } from '../../utils/perfect';

import appActions from '../app/action'
import contentManageActions from './action'
import SubSignCard from './subSignCard'

import './common.less';

const FormItem = Form.Item
const { Content } = Layout;
const confirm = Modal.confirm;

class SubSign extends Component {
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
    const id = this.props.location.query.id || '';
    appActions.loading(true).then(() => {
      return Promise.all([
        contentManageActions.getSubSignList({
          pageNum,
          pageSize,
          parentId: id
        }),
        this.props.contentManageActions.getSubSignSort({
          parentId: id
        })
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

  renderTitle(total = '') {
    return () => (
      <Row type="flex" align="middle">
        <Col span={4}>共搜索到{total}条数据</Col>
        <Col span={16}></Col>
        <Col span={4} style={{textAlign: 'right'}}>
          <Button type='primary' size='default' onClick={this.addNewCard} >+ 子标签</Button>
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
      const parentId = this.props.location.query.id || '';
      confirm({
        title: '确定删除该条子标签？',
        onOk() {
          appActions.loading(true).then(() => {
            return contentManageActions.deleteSubSign({
              id,
              parentId
            });
          }).then(() => {
            return Promise.all([
              contentManageActions.getSubSignList({
                pageNum: 1,
                pageSize,
                parentId
              }),
              contentManageActions.getSubSignSort({
                parentId
              })
            ])
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

  getChangedStatus(flag) {
    if (flag === 0) {
      return '1';
    }
    return '0';
  }

  handleChangeState(id, flag) {
    return () => {
      const { appActions, contentManageActions, contentManage } = this.props;
      const { pageSize, pageNum } = this.state;
      const changedStatus = this.getChangedStatus(flag);
      const parentId = this.props.location.query.id || '';
      const subSort = contentManage && contentManage.get('subSignSort') && contentManage.get('subSignSort');
      confirm({
        title: '确定更改该条子标签状态？',
        onOk() {
          appActions.loading(true).then(() => {
            return contentManageActions.changeSubSignState({
              id,
              flag: changedStatus,
              parentId,
              weight: flag === 0 ? subSort.get('0') + 1 : null
            });
          }).then(() => {
            return Promise.all([
              contentManageActions.getSubSignList({
                pageNum,
                pageSize,
                parentId
              }),
              contentManageActions.getSubSignSort({
                parentId
              })
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

  goToSubEntry(id) {
    return () => {
      this.props.router.push({
        pathname: 'SubSign',
        query: {
          id
        }
      })
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { contentManage } = this.props;
    const subSignList = contentManage.get('subSignList') && contentManage.get('subSignList');
    const list = subSignList && subSignList.get('list') && subSignList.get('list');
    const total = subSignList && subSignList.get('totalCount') && subSignList.get('totalCount');
    const current = subSignList && subSignList.get('currentPage') && subSignList.get('currentPage');
    const editData = subSignList && list.find(v => v.id === this.state.editId);
    const { pageSize } = this.state
    const columns = [{
      title: '序号',
      key: 'index',
      width: 60,
      render: (name, data, index) => {
        return <span>{index + 1}</span>
      }
    }, {
      title: '一级标签名称',
      dataIndex: 'name',
      key: 'name',
      width: 100
    }, {
      title: '子标签',
      dataIndex: 'subName',
      key: 'subName',
      width: 100
    }, {
      title: '必关联',
      dataIndex: 'relevantCustomer',
      key: 'relevantCustomer',
      width: 80,
      render: (relevantCustomer) => {
        if (relevantCustomer === 2) {
          return <span>是</span>
        }
        if (relevantCustomer === 1) {
          return <span>否</span>
        }
      }
    }, {
      title: '排序',
      dataIndex: 'weight',
      key: 'weight',
      width: 70,
      render: (weight) => {
        if (weight) {
          return <span style={{ marginLeft: '7px' }}>{weight}</span>
        }
        return <span style={{ marginLeft: '7px' }}>---</span>
      }
    }, {
      title: '状态',
      dataIndex: 'flag',
      key: 'flag',
      width: 70,
      render: (flag) => {
        if (flag === 1) {
          return <span>生效</span>
        }
        if (flag === 0) {
          return <span>未生效</span>
        }
      }
    }, {
      title: '生成时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 100,
      render: (createTime) => {
        return (
          <span>{formatDate({createTime, showYear: true, showHms: false})}</span>
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
      width: 160,
      render: (action, data, index) => {
        return (<span>
          <a onClick={this.handleEdit(data.id)}>编辑</a>
          <a style={{marginLeft: '8px'}} onClick={this.handleDelete(data.id)}>删除</a>
          <a style={{marginLeft: '8px'}} onClick={this.handleChangeState(data.id, data.flag)}>更改状态</a>
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
        const parentId = this.props.location.query.id || '';
        appActions.loading(true).then(() => {
          return Promise.all([
            contentManageActions.getSubSignList({
              pageNum: page,
              pageSize,
              parentId
            }),
            this.props.contentManageActions.getSubSignSort({
              parentId
            })
          ])
        }).then((data) => {
          this.setState({
            pageNum: data[0].data.currentPage,
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
            <SubSignCard
              modalVisible={this.state.modalVisible}
              modalChange={this.handleModalChange}
              pageSize={this.state.pageSize}
              pageNum={this.state.pageNum}
              editData={editData}
              parentId={Number(this.props.location.query.id)}
              /> : null
        }
      </Layout>
    )
  }
}

SubSign.propTypes = {
  form: PropTypes.object,
  contentManage: PropTypes.object,
  contentManageActions: PropTypes.object,
  appActions: PropTypes.object,
  router: PropTypes.object,
  location: PropTypes.object
}

const mapStateToProps = (state, ownProps) => {
  const contentManage = state.get( 'contentManage' );
  console.log(contentManage.toJS());
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

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(SubSign))
