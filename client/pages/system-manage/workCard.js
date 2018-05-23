import React, { Component, } from 'react'
import {Modal, Button, Input, Form, Select, message, Radio, Icon } from 'antd'
const { TextArea } = Input;
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux';

import appActions from '../app/action'
import systemManageActions from './action'

const FormItem = Form.Item
const { Option } = Select;
const RadioGroup = Radio.Group;

class WorkCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      status: props.editData && props.editData.status.toString() || '1',
    }
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkNumber = this.checkNumber.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
  }

  componentDidMount() {
    this.props.systemManageActions.getWorkSort();
  }

  handleCancel() {
    this.props.modalChange();
    this.props.form.resetFields();
  }

  handleSubmit(e) {
    e.preventDefault();
    const {form, appActions, systemManageActions, pageSize, editData, pageNum} = this.props;
    form.validateFieldsAndScroll(( err, values ) => {
      if ( !err ) {
        const id = editData ? editData.id : null;   //id存在更新 不存在新增
        this.setState({disabled: true})
        appActions.loading(true).then(() => {
          return systemManageActions.addWork({
            id,
            ...values
          })
        }).then(() => {
          return Promise.all([
            systemManageActions.getWorkList({
              pageNum,
              pageSize
            }),
            systemManageActions.getWorkSort()
          ])
        }).then(() => {
          appActions.loading(false);
          this.setState({disabled: false});
          if (editData) {
            message.success('修改成功')
          } else {
            message.success('添加成功')
          }
          this.afterSubmit();
        }).catch(() => {
          appActions.loading(false);
          this.setState({disabled: false});
          if (editData) {
            message.error('修改失败')
          } else {
            message.error('添加失败')
          }
        })
      }
    })
  }

  afterSubmit() {
    this.props.modalChange();
    this.props.form.resetFields();
  }

  checkNumber(rule, value, callback) {
    const { systemManage, editData } = this.props;
    const workSort = systemManage && systemManage.get('workSort') && systemManage.get('workSort');
    const isEditNumber = editData && editData.sort || -1;
    if (this.state.status === '0') {
      callback();
      return;
    }
    if (value === '') {
      callback('请输入序号');
      return;
    }
    if (isNaN(value) || value <= 0) {
      callback('请输入正整数');
      return;
    }
    if (workSort.indexOf(Number(value)) !== -1 && Number(value) !== isEditNumber) {
      callback('序号重复');
      return;
    }
    callback();
  }

  checkTitle(rule, value, callback) {
    if (value === '') {
      callback('请输入入口名称');
      return;
    }
    if (value.length > 10) {
      callback('超过10个字');
      return;
    }
    callback();
  }

  handleStateChange(e) {
    this.setState({ status: e.target.value })
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    }
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    }
    const { getFieldDecorator } = this.props.form;
    const { editData } = this.props;
    return (
      <Modal
        title={editData ? '编辑工作台入口' : '新增工作台入口'}
        visible={this.props.modalVisible}
        onCancel={this.handleCancel}
        footer={null}
      >
        <Form onSubmit={this.handleSubmit} style={{paddingTop: '20px'}}>
          <FormItem
          {...formItemLayout}
          label='入口名称'
        >
            { getFieldDecorator( 'name', {
            rules: [{ required: true, validator: this.checkTitle }],
            initialValue: editData ? editData.name : ''
          } )(
            <Input placeholder="不超过10个字" />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='权限点名称'
        >
            { getFieldDecorator( 'authCode', {
            rules: [{ required: true, message: '请输入权限点名称' }],
            initialValue: editData ? editData.authCode : ''
          } )(
            <Input placeholder="请输入权限点名称: 系统-权限类型-权限名称" />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='排序'
        >
            { getFieldDecorator( 'sort', {
            rules: [{ required: true, validator: this.checkNumber }],
            initialValue: editData ? editData.sort : ''
          } )(
            <Input placeholder="请输入正整数,数字越小,在前端先展示" disabled={this.state.status === '0'}/>
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='入口跳转链接'
        >
            { getFieldDecorator( 'deskUrl', {
          //  rules: [{ required: true, message: '请输入跳转链接!' }],
            initialValue: editData ? editData.deskUrl : ''
          } )(
            <Input placeholder="请输入跳转链接" />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='新增入口状态'
        >
            { getFieldDecorator( 'status', {
            initialValue: editData ? editData.status.toString() : '1'
          } )(
            <RadioGroup onChange={this.handleStateChange}>
              <Radio value="1">生效</Radio>
              <Radio value="0">未生效</Radio>
            </RadioGroup>
          ) }
          </FormItem>
          <FormItem
           {...tailFormItemLayout}
         >
            <Button style={{float: 'right'}} type='primary' size='default' htmlType='submit' disabled={this.state.disabled} >保存</Button>
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

WorkCard.propTypes = {
  appActions: PropTypes.object,
  systemManageActions: PropTypes.object,
  systemManage: PropTypes.object,
  modalChange: PropTypes.func,
  form: PropTypes.object,
  modalVisible: PropTypes.bool,
  pageSize: PropTypes.number,
  editData: PropTypes.object,
  pageNum: PropTypes.number
}

const mapStateToProps = ( state, ownProps ) => {
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

export default connect( mapStateToProps, mapDispatchToProps )(Form.create()( WorkCard ))
