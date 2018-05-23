import React, { Component, } from 'react'
import PropTypes from 'prop-types';
import {Layout, Input, Button, Table, Form, message, Modal, Row, Col, Select } from 'antd'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Link } from 'react-router';
import { formatDate } from '../../utils/perfect';

import appActions from '../app/action'
import contentManageActions from './action'
import NoticeCard from './noticeCard'

import './common.less';

const FormItem = Form.Item
const { Content } = Layout;
const confirm = Modal.confirm;
const { Option } = Select;

class Notice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10,
      pageNum: 1,
      modalVisible: false,
      editId: -1,
      cityCode: '',
      title: '',
      status: ''
    }
    this.renderTitle = this.renderTitle.bind(this);
    this.addNewCard = this.addNewCard.bind(this);
    this.handleModalChange = this.handleModalChange.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleChangeState = this.handleChangeState.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChangeTop = this.handleChangeTop.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }
  componentWillMount() {
    const { pageNum, pageSize } = this.state;
    const { appActions, contentManageActions } = this.props;
    appActions.loading(true).then(() => {
      return Promise.all([
        contentManageActions.getNoticeList({
          pageNum,
          pageSize
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

  renderTitle(total = '') {
    return (
      <Row type="flex" align="middle" style={{ padding: '0 15px' }}>
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

  handleReset() {
    this.props.form.resetFields();
  }

  renderTop(isTop, status) {
    if (status === 0) {
      return ''
    }
    if (isTop === 1) {
      return '取消置顶'
    }
    if (isTop === 0) {
      return '置顶'
    }
    return ''
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
      const { pageSize, title, cityCode, status } = this.state;
      confirm({
        title: '确定删除该条公告？',
        onOk() {
          appActions.loading(true).then(() => {
            return contentManageActions.deleteNotice({
              id
            });
          }).then(() => {
            return contentManageActions.getNoticeList({
              pageNum: 1,
              pageSize,
              title,
              cityCode,
              status
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

  getChangedTop(isTop, s) {
    if (s === 1) {
      return '0';
    }
    return isTop;
  }

  handleChangeState(id, s, code, type, isTop) {
    return () => {
      const { appActions, contentManageActions } = this.props;
      const { pageSize, pageNum, title, cityCode, status } = this.state;
      const changedStatus = this.getChangedStatus(s);
      const changedTop = this.getChangedTop(isTop, s);
      confirm({
        title: '确定更改该条公告状态？',
        onOk() {
          appActions.loading(true).then(() => {
            return contentManageActions.changeNoticeState({
              id,
              status: changedStatus,
              cityCode: code,
              type,
              isTop: changedTop
            });
          }).then(() => {
            return contentManageActions.getNoticeList({
              pageNum,
              pageSize,
              title,
              cityCode,
              status
            })
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

  handleChangeTop(id, s, code, type, status) {
    return () => {
      const { appActions, contentManageActions } = this.props;
      const { pageSize, pageNum, title, cityCode, status } = this.state;
      const changedStatus = this.getChangedStatus(s);
      confirm({
        title: s === 0 ?  '确定将该条公告置顶？' : '确定将该条公告取消置顶？',
        onOk() {
          appActions.loading(true).then(() => {
            return contentManageActions.changeNoticeTop({
              id,
              isTop: changedStatus,
              cityCode: code,
              type,
              status
            })
            .then(() => {
              return contentManageActions.getNoticeList({
                pageNum,
                pageSize,
                title,
                cityCode,
                status
              })
            }).then(() => {
              if (status === 1) {
                message.success('取消置顶成功');
              } else {
                message.success('置顶成功');
              }
              appActions.loading(false);
            }).catch(err => {
              message.error(err.msg);
              appActions.loading(false);
            })
          })
        }
      });
    }
  }

  handleSearch(e) {
    e.preventDefault();
    const { pageNum, pageSize } = this.state;
    const { appActions, contentManageActions, form, contentManage } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if ( !err ) {
        const cityList = contentManage.get('cityList') && contentManage.get('cityList') || [];
        if (values.cityName && values.cityName === '') {
          values.cityCode = ''
        } else if (values.cityName && values.cityName === '全国') {
          values.cityCode = '000000'
        } else if (values.cityName) {
          const selectCity = cityList.filter(v => v.cityName === values.cityName).get('0');
          values.cityCode = selectCity.cityCode;
        }
        //分类搜索
        if (values.type !== '1' && values.type !== '') {
          values.serType = values.type;
          values.type = '2';
        }
        appActions.loading(true).then(() => {
          return Promise.all([
            contentManageActions.getNoticeList({
              pageNum: 1,
              pageSize,
              ...values
            }),
            contentManageActions.getCityList()
          ])
        }).then((data) => {
          this.setState({
            pageNum: data[0].data.currentPage,
            cityCode: values.cityCode,
            title: values.title,
            status: values.status,
            type: values.type
          })
          appActions.loading(false)
        }).catch(err => {
          appActions.loading(false)
          message.error(err.msg);
        })
      }
    });
  }

  getArea() {
    return () => document.getElementById('notice-area')
  }

  render() {
    const buttonList = window.INIT_DATA.AUTH_LIST.buttonList;
    const { getFieldDecorator } = this.props.form;
    const { contentManage } = this.props;
    const noticeList = contentManage.get('noticeList') && contentManage.get('noticeList');
    const list = noticeList && noticeList.get('list') && noticeList.get('list');
    const total = noticeList && noticeList.get('totalCount') && noticeList.get('totalCount');
    const current = noticeList && noticeList.get('currentPage') && noticeList.get('currentPage');
    const editData = noticeList && list.find(v => v.id === this.state.editId);
    const { pageSize } = this.state
    const cityList = contentManage.get('cityList') && contentManage.get('cityList') || [];
    let firstCity = '';
    if (cityList && cityList.size > 0) {
      firstCity = cityList.get('0').cityName
    }
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
      title: '分类',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => {
        if (type === 1) {
          return <span>公司新闻</span>
        }
        if (type === 2) {
          return <span>制度专栏</span>
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
      title: '发布部门',
      dataIndex: 'depart',
      key: 'depart',
      width: 120
    }, {
      title: '操作人',
      dataIndex: 'createUser',
      key: 'createUser',
      width: 80
    }, {
      title: '适用城市',
      dataIndex: 'cityName',
      key: 'cityName',
      width: 100
    }, {
      title: '发布时间',
      dataIndex: 'time',
      key: 'time',
      width: 100,
      render: (time) => {
        return (
          <span>{formatDate({time, showYear: true, showHms: false})}</span>
        )
      }
    }, {
      title: '浏览量',
      dataIndex: 'readCount',
      key: 'readCount',
      width: 80,
      render: (count) => {
        return <span style={{marginLeft: '7px'}}>{count}</span>
      }
    }, {
      title: '操作',
      key: 'action',
      width: 120,
      render: (action, data, index) => {
        return (<span>
          <a style={{marginRight: '5px'}} onClick={this.handleEdit(data.id)}>编辑</a>
          <a style={{marginRight: '5px'}} onClick={this.handleDelete(data.id)}>删除</a>
          <a style={{marginRight: '5px'}} onClick={this.handleChangeState(data.id, data.status, data.cityCode, data.type, data.isTop)}>更改状态</a>
          {buttonList && buttonList.includes('bkgj_stage_btn_Top') ? (
            <a style={{marginRight: '5px'}} onClick={this.handleChangeTop(data.id, data.isTop, data.cityCode, data.type, data.status)}>{this.renderTop(data.isTop, data.status)}</a>
          ) : null}
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
        const { title, cityCode, status, type } = this.state;
        appActions.loading(true).then(() => {
          return contentManageActions.getNoticeList({
            pageNum: page,
            pageSize,
            title,
            cityCode,
            status,
            type
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
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    };
    return (
      <Layout className='content-common' id="notice-area">
        {
          this.renderTitle(total)
        }
        <Form
        className="ant-advanced-search-form"
        onSubmit={this.handleSearch}
        >
          <Row gutter={10}>
            <Col span={6}>
              <FormItem {...formItemLayout} label={'标题'}>
                {getFieldDecorator('title')(
                  <Input placeholder="请输标题" />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem {...formItemLayout} label='城市'>
                { getFieldDecorator( 'cityName', {initialValue: ''})(
                  <Select getPopupContainer={this.getArea()}>
                    <Option key='全国' value=''>全部</Option>
                    {
                      cityList.map((v, k) => (
                        <Option key={v.cityCode} value={v.cityName}>{v.cityName}</Option>
                      ))
                    }
                    <Option key='全国' value='全国'>全国</Option>
                  </Select>
                ) }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem {...formItemLayout} label='分类'>
                { getFieldDecorator( 'type', {initialValue: ''})(
                  <Select getPopupContainer={this.getArea()}>
                    <Option value="">全部</Option>
                    <Option value="1">公司新闻</Option>
                    <Option value="3">制度专栏-人事</Option>
                    <Option value="4">制度专栏-财务</Option>
                    <Option value="5">制度专栏-风控</Option>
                    <Option value="6">制度专栏-品控</Option>
                    <Option value="7">制度专栏-客服</Option>
                    <Option value="8">制度专栏-合规</Option>
                    <Option value="9">制度专栏-行政</Option>
                    <Option value="10">制度专栏-其他</Option>
                  </Select>
                ) }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem {...formItemLayout} label='状态'>
                { getFieldDecorator( 'status', {initialValue: ''})(
                  <Select getPopupContainer={this.getArea()}>
                    <Option value="">全部</Option>
                    <Option value="1">生效</Option>
                    <Option value="0">未生效</Option>
                  </Select>
                ) }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                清空
              </Button>
            </Col>
          </Row>
        </Form>
        <Content className='table-content-wrap' >
          <Table columns={columns} dataSource={list} pagination={pagination} rowKey={this.renderRowKey} />
        </Content>
        {
          this.state.modalVisible ?
            <NoticeCard
              modalVisible={this.state.modalVisible}
              modalChange={this.handleModalChange}
              pageSize={this.state.pageSize}
              pageNum={this.state.pageNum}
              editData={editData}
              cityCode={this.state.cityCode}
              title={this.state.title}
              status={this.state.status}
              /> : null
        }
      </Layout>
    )
  }
}

Notice.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Notice))
