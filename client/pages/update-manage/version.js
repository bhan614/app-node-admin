import React, { Component, } from 'react'
import PropTypes from 'prop-types';
import {Layout, Input, Button, Table, Form, message, Modal, Row, Col, } from 'antd'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Link } from 'react-router';
import { formatDate } from '../../utils/perfect';

import appActions from '../app/action'
import updateManageActions from './action'
import VersionCard from './versionCard'

import './common.less';

const FormItem = Form.Item
const { Content } = Layout;
const confirm = Modal.confirm;

class Version extends Component {
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
      return updateManageActions.getVersionList({
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
          <Button type='primary' size='default' onClick={this.addNewCard} >+ 安装包</Button>
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

  render() {
    const { getFieldDecorator } = this.props.form;
    const { updateManage } = this.props;
    const versionList = updateManage.get('versionList') && updateManage.get('versionList');
    const list = versionList && versionList.get('list') && versionList.get('list');
    const total = versionList && versionList.get('totalCount') && versionList.get('totalCount');
    const current = versionList && versionList.get('currentPage') && versionList.get('currentPage');
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
      title: '适用城市',
      dataIndex: 'cityName',
      key: 'cityName',
      width: 100
    }, {
      title: '版本号',
      dataIndex: 'appVersion',
      key: 'appVersion',
      width: 100
    }, {
      title: '操作系统',
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
      title: '强制更新',
      dataIndex: 'type',
      key: 'type',
      width: 70,
      render: (type) => {
        if (type === 701) {
          return <span style={{ marginLeft: '5px' }}>是</span>
        }
        if (type === 702) {
          return <span style={{ marginLeft: '5px' }}>否</span>
        }
      }
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 70,
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
      title: '操作人',
      dataIndex: 'createUser',
      key: 'createUser',
      width: 100
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
          return updateManageActions.getVersionList({
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
            <VersionCard
              modalVisible={this.state.modalVisible}
              modalChange={this.handleModalChange}
              pageSize={this.state.pageSize}
              pageNum={this.state.pageNum}
              /> : null
        }
      </Layout>
    )
  }
}

Version.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Version))
