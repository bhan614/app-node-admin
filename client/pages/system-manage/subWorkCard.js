import React, { Component, } from 'react'
import {Modal, Button, Input, Form, Select, message, Radio, Upload, Icon } from 'antd'
const { TextArea } = Input;
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux';
import {uploadData} from '../../utils/uploadData'
import appActions from '../app/action'
import systemManageActions from './action'
import './work.less'

const FormItem = Form.Item
const { Option } = Select;
const RadioGroup = Radio.Group;

class SubWorkCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgUrl: props.editData && props.editData.icon || '',
      imgWidth: '',
      imgHeight: '',
      disabled: false,
      status: props.editData && props.editData.status.toString() || '1',
    }
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.checkPic = this.checkPic.bind(this);
    this.checkNumber = this.checkNumber.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
  }

  componentDidMount() {
    const {parentId} = this.props;
    this.props.systemManageActions.getSubSort({
      parentId
    });
  }

  handleCancel() {
    this.props.modalChange();
    this.props.form.resetFields();
  }

  handleSubmit(e) {
    e.preventDefault();
    const {form, appActions, systemManageActions, pageSize, editData, parentId, pageNum} = this.props;
    form.validateFieldsAndScroll(( err, values ) => {
      if ( !err ) {
        console.log(editData);
        const id = editData ? editData.id : null;   //id存在更新 不存在新增
        values.icon = this.state.imgUrl;
        values.parentId = parentId;
        this.setState({disabled: true});
        appActions.loading(true).then(() => {
          return systemManageActions.addSubWork({
            id,
            ...values
          })
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
    const subSort = systemManage && systemManage.get('subSort') && systemManage.get('subSort');
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
    if (subSort.indexOf(Number(value)) !== -1 && Number(value) !== isEditNumber) {
      callback('序号重复');
      return;
    }
    callback();
  }


  checkPic(rule, value, callback) {
    const { imgUrl, imgWidth, imgHeight } = this.state;
    if (imgUrl === '') {
      callback('请上传图标');
      return;
    }
    if (imgWidth !== 100 && imgHeight !== 100 && imgWidth !== '' && imgHeight !== '') {
      callback('图标尺寸错误');
      return;
    }
    callback();
  }

  beforeUpload(file) {
    const isJPEG = file.type === 'image/jpeg';
    const isPNG = file.type === 'image/png';
    let isJPG = false;
    const name = file.name;
    const jpgStr = name.slice(file.name.length - 4);
    if (jpgStr === '.jpg') {
      isJPG = true;
    }
    const isImage = isJPG || isPNG;

    if (!isImage) {
      message.error('只能上传jpg，png格式!');
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (isImage && !isLt2M) {
      message.error('图片大小不能超过2MB!');
    }
    return isImage && isLt2M;
  }

  handleChange(info) {

    if (info.file.status !== 'uploading') {
      console.log('uploading');
    }
    if (info.file.status === 'done') {
      console.log(info);
      const url = info.file.response.data.url;
      const name = info.file.response.data.originName;
      const imgWidth = info.file.response.data.width;
      const imgHeight = info.file.response.data.height;
      this.setState({imgUrl: url, imgWidth, imgHeight});
      message.success(`${info.file.name}上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name}上传失败`);
    }
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
        title={editData ? '编辑子入口' : '新增子入口'}
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
            rules: [{ required: true, message: '请输入入口名称' }],
            initialValue: editData ? editData.name : ''
          } )(
            <Input />
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
            <Input placeholder="请输入权限点名称：系统-权限类型-权限名称" />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='上传图标'
          extra="图片尺寸100*100，大小不超过2M，图片格式为：jpg，png每次仅上传1张图片"
        >
            { getFieldDecorator( 'icon', {
            rules: [{ required: true, validator: this.checkPic }]
          } )(
            <Upload
               className="avatar-uploader"
               name="uploadFiles"
               showUploadList={false}
               data={{
                 key: uploadData.key
               }}
               action={uploadData.url}
               beforeUpload={this.beforeUpload}
               onChange={this.handleChange}
             >
              {
                 this.state.imgUrl ?
                   <img src={this.state.imgUrl} alt="" className="avatar" /> :
                   <Icon type="plus" className="avatar-uploader-trigger" />
               }
            </Upload>
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='跳转链接'
        >
            { getFieldDecorator( 'httpUrl', {
            rules: [{ required: true, message: '请输入跳转链接!' }],
            initialValue: editData ? editData.httpUrl : ''
          } )(
            <Input />
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
            <Input placeholder="请输入正整数,数字越小,在前端先展示" disabled={this.state.status === '0'} />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='入口状态'
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

SubWorkCard.propTypes = {
  appActions: PropTypes.object,
  systemManageActions: PropTypes.object,
  systemManage: PropTypes.object,
  modalChange: PropTypes.func,
  form: PropTypes.object,
  modalVisible: PropTypes.bool,
  pageSize: PropTypes.number,
  editData: PropTypes.object,
  parentId: PropTypes.number,
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

export default connect( mapStateToProps, mapDispatchToProps )(Form.create()( SubWorkCard ))
