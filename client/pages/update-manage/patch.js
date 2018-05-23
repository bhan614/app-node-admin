import React, { Component, } from 'react'
import PropTypes from 'prop-types';
import {Layout, Input, Button, Table, Form, message, Modal, Row, Col, } from 'antd'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Link } from 'react-router';
import { formatDate } from '../../utils/perfect';

import appActions from '../app/action'
import updateManageActions from './action'
import PatchCard from './patchCard'

import './common.less';

const FormItem = Form.Item
const { Content } = Layout;
const confirm = Modal.confirm;

class Patch extends Component {
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
  }
  componentWillMount() {
    const { pageNum, pageSize } = this.state;
    const { appActions, updateManageActions } = this.props;
    appActions.loading(true).then(() => {
      return updateManageActions.getPatchList({
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
          <Button type='primary' size='default' onClick={this.addNewCard} >+ 补丁</Button>
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
      const { appActions, updateManageActions } = this.props;
      const { pageSize } = this.state;
      confirm({
        title: '确定删除该条补丁？',
        onOk() {
          appActions.loading(true).then(() => {
            return updateManageActions.deletePatch({
              id
            });
          }).then(() => {
            return updateManageActions.getPatchList({
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
    const { updateManage } = this.props;
    const patchList = updateManage.get('patchList') && updateManage.get('patchList');
    const list = patchList && patchList.get('list') && patchList.get('list');
    const total = patchList && patchList.get('totalCount') && patchList.get('totalCount');
    const current = patchList && patchList.get('currentPage') && patchList.get('currentPage');
    const editData = patchList && list.find(v => v.id === this.state.editId);
    const { pageSize } = this.state
    const columns = [{
      title: '序号',
      key: 'index',
      width: 60,
      render: (id, data, index) => {
        return <span>{index + (current - 1) * pageSize + 1}</span>
      }
    }, {
      title: '项目名称',
      dataIndex: 'project',
      key: 'project',
      width: 100,
      render: (project) => {
        if (project === 0) {
          return <span style={{ marginLeft: '5px' }}>雅典娜</span>
        } else if (project === 1) {
          return <span style={{ marginLeft: '5px' }}>阿波罗</span>
        }
      }
    }, {
      title: '补丁版本号',
      dataIndex: 'version',
      key: 'version',
      width: 100
    }, {
      title: '适用平台',
      dataIndex: 'appSystem',
      key: 'appSystem',
      width: 100,
      render: (appSystem) => {
        if (appSystem === '200') {
          return <span style={{ marginLeft: '5px' }}>iOS</span>
        }
        if (appSystem === '100') {
          return <span style={{ marginLeft: '5px' }}>Android</span>
        }
      }
    }, {
      title: '适用版本',
      dataIndex: 'appVersion',
      key: 'appVersion',
      width: 100
    }, {
      title: '操作码',
      dataIndex: 'oper',
      key: 'oper',
      width: 100,
      render: (oper) => {
        if (oper === 0) {
          return <span style={{ marginLeft: '5px' }}>0不需要</span>
        }
        if (oper === 1) {
          return <span style={{ marginLeft: '5px' }}>1需要</span>
        }
        if (oper === 2) {
          return <span style={{ marginLeft: '5px' }}>2删除</span>
        }
      }
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        if (status === 1) {
          return <span>已发布</span>
        }
        if (status === 0) {
          return <span>未发布</span>
        }
        return <span>已发布</span>
      }
    }, {
      title: '灰度',
      dataIndex: 'gray',
      key: 'gray',
      width: 70
    }, {
      title: '上传时间',
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
      width: 160,
      render: (action, data, index) => {
        return (<span>
          <a onClick={this.handleEdit(data.id)}>编辑</a>
          <a style={{marginLeft: '8px'}} onClick={this.handleDelete(data.id)}>删除</a>
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
        const { appActions, updateManageActions } = this.props;
        appActions.loading(true).then(() => {
          return updateManageActions.getPatchList({
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
            <PatchCard
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

Patch.propTypes = {
  form: PropTypes.object,
  updateManage: PropTypes.object,
  updateManageActions: PropTypes.object,
  appActions: PropTypes.object,
}

const mapStateToProps = (state, ownProps) => {
  const updateManage = state.get( 'updateManage' );
  return {
    updateManage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    appActions: bindActionCreators(appActions, dispatch),
    updateManageActions: bindActionCreators(updateManageActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Patch))
