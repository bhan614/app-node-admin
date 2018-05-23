import React, { Component, } from 'react'
import {Modal, Button, Input, Form, Select, message, Radio, Icon, Upload } from 'antd'
const { TextArea } = Input;
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux';

import appActions from '../app/action'
import updateManageActions from './action'
import {uploadData} from '../../utils/uploadData'

const FormItem = Form.Item
const { Option } = Select;
const RadioGroup = Radio.Group;

class PatchCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: props.editData && props.editData.url || '',
      fileName: '',
      disabled: false
    }
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.checkUrl = this.checkUrl.bind(this);
  }

  handleCancel() {
    this.props.modalChange();
    this.props.form.resetFields();
  }

  handleSubmit(e) {
    e.preventDefault();
    const {form, appActions, updateManageActions, pageSize, editData, pageNum} = this.props;
    form.validateFieldsAndScroll(( err, values ) => {
      if ( !err ) {
        const id = editData ? editData.id : null;   //id存在更新 不存在新增
        values.url = this.state.url;
        this.setState({disabled: true});
        appActions.loading(true).then(() => {
          return updateManageActions.addPatch({
            id,
            ...values
          })
        }).then(() => {
          return updateManageActions.getPatchList({
            pageNum,
            pageSize
          })
        }).then(() => {
          appActions.loading(false);
          this.setState({disabled: false});
          message.success('添加成功')
          this.afterSubmit();
        }).catch(() => {
          appActions.loading(false);
          this.setState({disabled: false});
          message.error('添加失败')
        })
      }
    })
  }

  afterSubmit() {
    this.props.modalChange();
    this.props.form.resetFields();
  }

  handleChange(info) {

    if (info.file.status !== 'uploading') {
      console.log('uploading');
    }
    if (info.file.status === 'done') {
      console.log(info);
      const code = info.file.response.code;
      if (code === 200) {
        const url = info.file.response.data.url;
        const name = info.file.response.data.originName;
        this.setState({url, fileName: name});
        message.success(`${info.file.name}上传成功`);
      } else {
        message.error(`${info.file.name}上传失败`);
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name}上传失败`);
    }
  }

  checkUrl(rule, value, callback) {
    if (this.state.url === '') {
      callback('请上传补丁');
      return;
    }
    callback();
  }

  getArea() {
    return () => document.getElementById('versionCard-area')
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
        title={editData ? '编辑补丁' : '上传补丁'}
        visible={this.props.modalVisible}
        onCancel={this.handleCancel}
        footer={null}
      >
        <Form onSubmit={this.handleSubmit} style={{paddingTop: '20px'}} id='versionCard-area'>
          <FormItem
          {...formItemLayout}
          label='项目名称'
        >
            { getFieldDecorator( 'project', {
              rules: [{ required: true, message: '请选择分类' }],
              initialValue: editData && editData.project ? editData.project.toString() : '0'
            } )(
              <Select getPopupContainer={this.getArea()}>
                <Option value="0">雅典娜</Option>
                <Option value="1">阿波罗</Option>
              </Select>
            ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='版本号'
        >
            { getFieldDecorator( 'version', {
            rules: [{ required: true, message: '请输入版本号' }],
            initialValue: editData ? editData.version : ''
          } )(
            <Input />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='补丁描述'
        >
            { getFieldDecorator( 'versionContent', {
            rules: [{ required: true, message: '请输入补丁描述' }],
            initialValue: editData ? editData.versionContent : ''
          } )(
            <TextArea />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='上传补丁'
          extra={this.state.fileName}
        >
            { getFieldDecorator( 'url', {
            rules: [{ required: true, validator: this.checkUrl }]
          } )(
            <Upload
              name="uploadFiles"
              action={uploadData.url}
              showUploadList={false}
              data={{
                key: uploadData.key
              }}
              onChange={this.handleChange}>
              <Button>
                <Icon type="upload" /> 上传
              </Button>
            </Upload>
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='适用平台'
        >
            { getFieldDecorator( 'appSystem', {
            rules: [{ required: true, message: '请选择平台' }],
            initialValue: editData ? editData.appSystem : '200'
          } )(
            <RadioGroup>
              <Radio value="200">iOS</Radio>
              <Radio value="100">Android</Radio>
            </RadioGroup>
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='适用版本'
        >
            { getFieldDecorator( 'appVersion', {
            rules: [{ required: true, message: '请输入适用版本' }],
            initialValue: editData ? editData.appVersion : ''
          } )(
            <Input />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='灰度'
        >
            { getFieldDecorator( 'gray', {
            rules: [{ required: true, message: '请输入灰度' }],
            initialValue: editData ? editData.gray : ''
          } )(
            <Input />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='操作码'
        >
            { getFieldDecorator( 'oper', {
              rules: [{ required: true, message: '请输入操作码' }],
            initialValue: editData ? editData.oper.toString() : '0'
          } )(
            <RadioGroup>
              <Radio value="0">0不需要</Radio>
              <Radio value="1">1需要</Radio>
              <Radio value="2">2删除</Radio>
            </RadioGroup>
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='APK唯一标识符'
        >
            { getFieldDecorator( 'hashcodeValue', {
            rules: [{ required: true, message: '请输入APK唯一标识符' }],
            initialValue: editData ? editData.hashcodeValue : ''
          } )(
            <Input />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='patch唯一标识符'
        >
            { getFieldDecorator( 'md5Value', {
            rules: [{ required: true, message: '请输入patch唯一标识符' }],
            initialValue: editData ? editData.md5Value : ''
          } )(
            <Input />
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

PatchCard.propTypes = {
  appActions: PropTypes.object,
  updateManageActions: PropTypes.object,
  modalChange: PropTypes.func,
  form: PropTypes.object,
  modalVisible: PropTypes.bool,
  pageSize: PropTypes.number,
  editData: PropTypes.object,
  pageNum: PropTypes.number
}

const mapStateToProps = ( state, ownProps ) => {

  return {

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    appActions: bindActionCreators(appActions, dispatch),
    updateManageActions: bindActionCreators(updateManageActions, dispatch)
  }
}

export default connect( mapStateToProps, mapDispatchToProps )(Form.create()( PatchCard ))
