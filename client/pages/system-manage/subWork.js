import React, { Component, } from 'react'
import PropTypes from 'prop-types';
import {Layout, Input, Button, Table, Form, message, Modal, Row, Col, } from 'antd'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Link } from 'react-router';
import { formatDate } from '../../utils/perfect';

import appActions from '../app/action'
import systemManageActions from './action'
import SubWorkCard from './subWorkCard'

import './common.less';

const FormItem = Form.Item
const { Content } = Layout;
const confirm = Modal.confirm;

class SubWork extends Component {
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
    const id = this.props.location.query.id || '';
    appActions.loading(true).then(() => {
      return Promise.all([
        systemManageActions.getSubWorkList({
          pageNum,
          pageSize,
          id
        }),
        this.props.systemManageActions.getSubSort({
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
          <Button type='primary' size='default' onClick={this.addNewCard} >+ 子入口</Button>
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
      const parentId = this.props.location.query.id || '';
      confirm({
        title: '确定删除该条子入口？',
        onOk() {
          appActions.loading(true).then(() => {
            return systemManageActions.deleteSubWork({
              id
            });
          }).then(() => {
            return Promise.all([
              systemManageActions.getSubWorkList({
                pageNum: 1,
                pageSize,
                id: parentId
              }),
              systemManageActions.getSubSort({
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
      const parentId = this.props.location.query.id || '';
      const subSort = systemManage && systemManage.get('subSort') && systemManage.get('subSort');
      confirm({
        title: '确定更改该条子入口状态？',
        onOk() {
          appActions.loading(true).then(() => {
            return systemManageActions.changeSubWorkState({
              id,
              status: changedStatus,
              parentId,
              sort: status === 0 ? subSort.get('0') + 1 : null
            });
          }).then(() => {
            return Promise.all([
              systemManageActions.getSubWorkList({
                pageNum,
                pageSize,
                id: parentId
              }),
              systemManageActions.getSubSort({
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
        pathname: 'subWork',
        query: {
          id
        }
      })
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { systemManage } = this.props;
    const subWorkList = systemManage.get('subWorkList') && systemManage.get('subWorkList');
    const list = subWorkList && subWorkList.get('list') && subWorkList.get('list');
    const total = subWorkList && subWorkList.get('totalCount') && subWorkList.get('totalCount');
    const current = subWorkList && subWorkList.get('currentPage') && subWorkList.get('currentPage');
    const editData = subWorkList && list.find(v => v.id === this.state.editId);
    const { pageSize } = this.state
    const columns = [{
      title: '序号',
      key: 'index',
      width: 60,
      render: (name, data, index) => {
        return <span>{index + 1}</span>
      }
    }, {
      title: '主入口',
      dataIndex: 'deskName',
      key: 'deskName',
      width: 100
    }, {
      title: '子入口',
      dataIndex: 'name',
      key: 'name',
      width: 100
    }, {
      title: '权限点名称',
      dataIndex: 'authCode',
      key: 'authCode',
      width: 120
    }, {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      width: 130,
      render: (icon) => {
        return <img src={icon} width='100' height='50' />
      }
    }, {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 70,
      render: (sort) => {
        if (sort) {
          return <span style={{ marginLeft: '7px' }}>{sort}</span>
        }
        return <span style={{ marginLeft: '7px' }}>---</span>
      }
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 70,
      render: (state) => {
        if (state === 1) {
          return <span>生效</span>
        }
        if (state === 0) {
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
        const parentId = this.props.location.query.id || '';
        appActions.loading(true).then(() => {
          return Promise.all([
            systemManageActions.getSubWorkList({
              pageNum: page,
              pageSize,
              id: parentId
            }),
            this.props.systemManageActions.getSubSort({
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
            <SubWorkCard
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

SubWork.propTypes = {
  form: PropTypes.object,
  systemManage: PropTypes.object,
  systemManageActions: PropTypes.object,
  appActions: PropTypes.object,
  router: PropTypes.object,
  location: PropTypes.object
}

const mapStateToProps = (state, ownProps) => {
  const systemManage = state.get( 'systemManage' );
  console.log(systemManage.toJS());
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

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(SubWork))
