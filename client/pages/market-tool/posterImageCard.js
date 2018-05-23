import React, { Component, } from 'react'
import {Modal, Button, Input, Form, Select, message, Radio, Upload, Icon } from 'antd'
const { TextArea } = Input;
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux';
import {uploadData} from '../../utils/uploadData'
import appActions from '../app/action'
import marketManageActions from './action'
import contentManageActions from '../content-manage/action'
import './common.less'

const FormItem = Form.Item
const { Option } = Select;
const RadioGroup = Radio.Group;

class PosterImageCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgUrl: props.editData ? props.editData.imgUrl : '',
      disabled: false
    }
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.checkPic = this.checkPic.bind(this);
  }

  componentWillMount() {
    const { appActions, contentManageActions } = this.props;
    appActions.loading(true).then(() => {
      return contentManageActions.getCityList()
    }).then((data) => {
      appActions.loading(false)
    }).catch(err => {
      appActions.loading(false)
      message.error(err.msg);
    })
  }

  handleCancel() {
    this.props.modalChange();
    this.props.form.resetFields();
  }

  handleSubmit(e) {
    e.preventDefault();
    const {form, appActions, marketManageActions, pageSize, type, editData, pageNum, contentManage} = this.props;
    form.validateFieldsAndScroll(( err, values ) => {
      if ( !err ) {
        console.log(values);
        this.setState({disabled: true});
        values.id = editData ? editData.id : null;
        values.imgUrl = this.state.imgUrl;
        values.type = type;
        const cityArr = values.cityCode;
        const cityNameArr = [];
        const cityList = contentManage.get('cityList') && contentManage.get('cityList') || [];
        cityList.map(v => {
          if (cityArr.includes(v.cityCode)) {
            return cityNameArr.push(v.cityName)
          }
          return '';
        })
        values.cityName = cityNameArr.join(',');
        values.cityCode = values.cityCode.join(',');
        if (values.cityCode.includes('000000')) {
          values.cityCode = '000000'
          values.cityName = '全国'
        }

        appActions.loading(true).then(() => {
          return marketManageActions.addPosterImage({
            ...values
          })
        }).then(() => {
          return marketManageActions.getPosterList({
            pageNum,
            pageSize,
            type
          })
        }).then(() => {
          appActions.loading(false);
          this.setState({disabled: false});
          if (editData) {
            message.success('修改成功');
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

  checkPic(rule, value, callback) {
    const { imgUrl } = this.state;
    if (imgUrl === '') {
      callback('请上传轮播图');
      return;
    }
    callback();
  }

  checkTitle(rule, value, callback) {
    if (value === '') {
      callback('请输入标题');
      return;
    }
    if (value.length > 10) {
      callback('超过10个字');
      return;
    }
    callback();
  }

  checkDes(rule, value, callback) {
    if (value === '') {
      callback('请输入热点描述');
      return;
    }
    if (value.length > 20) {
      callback('超过20个字');
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

  getArea() {
    return () => document.getElementById('poster-area')
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
    const { editData, contentManage } = this.props;
    const cityList = contentManage.get('cityList') && contentManage.get('cityList') || [];
    const cityChildren = [];
    cityList.map((v, k) => {
      return cityChildren.push(<Option key={v.cityCode} value={v.cityCode}>{v.cityName}</Option>)
    })
    cityChildren.push(<Option key={'000000'} value={'000000'}>全国</Option>)
    return (
      <Modal
        title={editData ? '修改' : '新增'}
        visible={this.props.modalVisible}
        onCancel={this.handleCancel}
        className="market-modal"
        footer={null}
      >
        <Form onSubmit={this.handleSubmit} style={{paddingTop: '20px'}} id="poster-area">
          <FormItem
          {...formItemLayout}
          label='产品海报'
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
          label='标题'
        >
            { getFieldDecorator( 'title', {
            rules: [{ required: true, validator: this.checkTitle}],
            initialValue: editData ? editData.title : ''
          } )(
            <Input placeholder="不超过10个字" />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='热点描述'
        >
            { getFieldDecorator( 'description', {
            rules: [{ required: true, validator: this.checkDes }],
            initialValue: editData ? editData.description : ''
          } )(
            <TextArea placeholder="不超过20个字" />
          ) }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='适用城市'
          >
            { getFieldDecorator( 'cityCode', {
              rules: [{ required: true, message: '请选择适用城市' }],
              initialValue: editData && editData.cityCode ? editData.cityCode.split(',') : []
            } )(
              <Select getPopupContainer={this.getArea()} multiple placeholder="请选择适用城市">
                {
                  cityChildren
                }
              </Select>
            ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='状态'
        >
            { getFieldDecorator( 'status', {
            initialValue: editData ? editData.status.toString() : '1'
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

PosterImageCard.propTypes = {
  appActions: PropTypes.object,
  marketManageActions: PropTypes.object,
  contentManageActions: PropTypes.object,
  contentManage: PropTypes.object,
  modalChange: PropTypes.func,
  form: PropTypes.object,
  modalVisible: PropTypes.bool,
  pageSize: PropTypes.number,
  type: PropTypes.number,
  editData: PropTypes.object,
  pageNum: PropTypes.number
}

const mapStateToProps = ( state, ownProps ) => {
  const contentManage = state.get( 'contentManage' );
  return {
    contentManage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    appActions: bindActionCreators(appActions, dispatch),
    marketManageActions: bindActionCreators(marketManageActions, dispatch),
    contentManageActions: bindActionCreators(contentManageActions, dispatch)
  }
}

export default connect( mapStateToProps, mapDispatchToProps )(Form.create()( PosterImageCard ))
