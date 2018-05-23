import React, { Component, } from 'react'
import {Modal, Button, Input, Form, Select, message, Radio, Upload, Icon } from 'antd'
const { TextArea } = Input;
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux';
import {uploadData} from '../../utils/uploadData'
import appActions from '../app/action'
import marketManageActions from './action'
import './common.less'

const FormItem = Form.Item
const { Option } = Select;
const RadioGroup = Radio.Group;

class ImageCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgUrl: '',
      disabled: false
    }
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.checkPic = this.checkPic.bind(this);
  }

  handleCancel() {
    this.props.modalChange();
    this.props.form.resetFields();
  }

  handleSubmit(e) {
    e.preventDefault();
    const {form, appActions, marketManageActions, pageSize, parentId, pageNum} = this.props;
    form.validateFieldsAndScroll(( err, values ) => {
      if ( !err ) {
        console.log(values);
        this.setState({disabled: true});
        values.imgUrl = this.state.imgUrl;
        values.parentId = parentId;
        appActions.loading(true).then(() => {
          return marketManageActions.addHolidayImage({
            ...values
          })
        }).then(() => {
          return marketManageActions.getHolidayList({
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

  checkPic(rule, value, callback) {
    const { imgUrl } = this.state;
    if (imgUrl === '') {
      callback('请上传轮播图');
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

    return isImage;
  }

  handleChange(info) {

    if (info.file.status !== 'uploading') {
      console.log('uploading');
    }
    if (info.file.status === 'done') {
      console.log(info);
      const url = info.file.response.data.url;
      const name = info.file.response.data.originName;
      this.setState({imgUrl: url});
      message.success(`${info.file.name}上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name}上传失败`);
    }
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
    return (
      <Modal
        title={'新增'}
        visible={this.props.modalVisible}
        onCancel={this.handleCancel}
        className="market-modal"
        footer={null}
      >
        <Form onSubmit={this.handleSubmit} style={{paddingTop: '20px'}}>
          <FormItem
          {...formItemLayout}
          label='节日卡片'
          extra="图片格式为：jpg，png每次仅上传1张图片"
        >
            { getFieldDecorator( 'imgUrl', {
            rules: [{ required: true, validator: this.checkPic }],
          } )(
            <Upload
               className="avatar-uploader"
               name="uploadFiles"
               showUploadList={false}
               action={uploadData.url}
               data={{
                 key: uploadData.key
               }}
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
          label='状态'
        >
            { getFieldDecorator( 'status', {
            initialValue: '1'
          } )(
            <RadioGroup>
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

ImageCard.propTypes = {
  appActions: PropTypes.object,
  marketManageActions: PropTypes.object,
  modalChange: PropTypes.func,
  form: PropTypes.object,
  modalVisible: PropTypes.bool,
  pageSize: PropTypes.number,
  parentId: PropTypes.number,
  pageNum: PropTypes.number
}

const mapStateToProps = ( state, ownProps ) => {

  return {

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    appActions: bindActionCreators(appActions, dispatch),
    marketManageActions: bindActionCreators(marketManageActions, dispatch)
  }
}

export default connect( mapStateToProps, mapDispatchToProps )(Form.create()( ImageCard ))
