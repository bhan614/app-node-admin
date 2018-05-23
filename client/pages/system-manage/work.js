import React, { Component, } from 'react'
import PropTypes from 'prop-types';
import {Layout, Input, Button, Table, Form, message, Modal, Row, Col, } from 'antd'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Link } from 'react-router';
import { formatDate } from '../../utils/perfect';

import appActions from '../app/action'
import systemManageActions from './action'
import WorkCard from './workCard'

import './common.less';

const FormItem = Form.Item
const { Content } = Layout;
const confirm = Modal.confirm;

class Work extends Component {
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
    const { appActions, systemManageActions } = this.props;
    appActions.loading(true).then(() => {
      return Promise.all([
        systemManageActions.getWorkList({
          pageNum,
          pageSize
        }),
        systemManageActions.getWorkSort()
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
          <Button type='primary' size='default' onClick={this.addNewCard} >+ 主入口</Button>
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
      const { appActions, systemManageActions } = this.props;
      const { pageSize } = this.state;
      confirm({
        title: '确定删除该条主入口？',
        onOk() {
          appActions.loading(true).then(() => {
            return systemManageActions.deleteWork({
              id
            });
          }).then(() => {
            return Promise.all([
              systemManageActions.getWorkList({
                pageNum: 1,
                pageSize
              }),
              systemManageActions.getWorkSort()
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

  getChangedStatus(status) {
    if (status === 0) {
      return '1';
    }
    return '0';
  }

  handleChangeState(id, status) {
    return () => {
      const { appActions, systemManageActions, systemManage } = this.props;
      const { pageSize, pageNum } = this.state;
      const changedStatus = this.getChangedStatus(status);
      const workSort = systemManage && systemManage.get('workSort') && systemManage.get('workSort');
      confirm({
        title: '确定更改该条主入口状态？',
        onOk() {
          appActions.loading(true).then(() => {
            return systemManageActions.changeWorkState({
              id,
              status: changedStatus,
              sort: status === 0 ? workSort.get('0') + 1 : null
            });
          }).then(() => {
            return Promise.all([
              systemManageActions.getWorkList({
                pageNum,
                pageSize
              }),
              systemManageActions.getWorkSort()
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
        pathname: 'Base/subWork',
        query: {
          id
        }
      })
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { systemManage } = this.props;
    const workList = systemManage.get('workList') && systemManage.get('workList');
    const list = workList && workList.get('list') && workList.get('list');
    const total = workList && workList.get('totalCount') && workList.get('totalCount');
    const current = workList && workList.get('currentPage') && workList.get('currentPage');
    const editData = workList && list.find(v => v.id === this.state.editId);
    const { pageSize } = this.state
    const columns = [{
      title: '序号',
      key: 'index',
      width: 60,
      render: (id, data, index) => {
        return <span>{index + (current - 1) * pageSize + 1}</span>
      }
    }, {
      title: '主入口',
      dataIndex: 'name',
      key: 'name',
      width: 100
    }, {
      title: '权限点名称',
      dataIndex: 'authCode',
      key: 'authCode',
      width: 100
    }, {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 70,
      render: (sort) => {
        if (sort) {
          return <span style={{ marginLeft: '5px' }}>{sort}</span>
        }
        return <span style={{ marginLeft: '5px' }}>---</span>
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
      width: 100
    }, {
      title: '操作',
      key: 'action',
      width: 160,
      render: (action, data, index) => {
        return (<span>
          <a onClick={this.handleEdit(data.id)}>编辑</a>
          <a style={{marginLeft: '8px'}} onClick={this.handleDelete(data.id)}>删除</a>
          <a style={{marginLeft: '8px'}} onClick={this.handleChangeState(data.id, data.status)}>更改状态</a>
          <a style={{marginLeft: '8px'}} onClick={this.goToSubEntry(data.id)}>子入口</a>
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
        const { appActions, systemManageActions } = this.props;
        appActions.loading(true).then(() => {
          return Promise.all([
            systemManageActions.getWorkList({
              pageNum: page,
              pageSize
            }),
            systemManageActions.getWorkSort()
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
            <WorkCard
              modalVisible={this.state.modalVisible}
              modalChange={this.handleModalChange}
              pageSize={this.state.pageSize}
              editData={editData}
              pageNum={this.state.pageNum}
              /> : null
        }
      </Layout>
    )
  }
}

Work.propTypes = {
  form: PropTypes.object,
  systemManage: PropTypes.object,
  systemManageActions: PropTypes.object,
  appActions: PropTypes.object,
  router: PropTypes.object
}

const mapStateToProps = (state, ownProps) => {
  const systemManage = state.get( 'systemManage' );
  return {
    systemManage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    appActions: bindActionCreators(appActions, dispatch),
    systemManageActions: bindActionCreators(systemManageActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Work))
