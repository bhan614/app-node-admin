import React, { Component, } from 'react'
import {Modal, Button, Input, Form, Select, message, Radio, Upload, Icon } from 'antd'
const { TextArea } = Input;
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux';
import {uploadData} from '../../utils/uploadData'
import appActions from '../app/action'
import contentManageActions from './action'
import _ from 'lodash';
import './carousel.less'

const FormItem = Form.Item
const { Option } = Select;
const RadioGroup = Radio.Group;

// const typeData = [
//   {
//     firstName: '北京',
//     firstSort: 1,
//     list: [
//       {
//         secondSort: 11,
//         secondName: '朝阳'
//       },
//       {
//         secondSort: 12,
//         secondName: '海淀'
//       }
//     ]
//   },
//   {
//     firstName: '广西',
//     firstSort: 2,
//     list: [
//       {
//         secondSort: 21,
//         secondName: '桂林'
//       },
//       {
//         secondSort: 22,
//         secondName: '北海'
//       }
//     ]
//   }
// ]

class VideoCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      iconUrl: props.editData && props.editData.iconUrl || '',
      videoUrl: props.editData && props.editData.videoUrl || '',
      videoName: props.editData && props.editData.videoUrl || '',
      imgWidth: '',
      imgHeight: '',
      flag: props.editData && props.editData.flag.toString() || '1',
      disabled: false,
      secondType: [],
      secondValue: '',
      firstValue: '',
      typeData: []
    }
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.checkPic = this.checkPic.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.checkNumber = this.checkNumber.bind(this);
    this.checkSubTitle = this.checkSubTitle.bind(this);
    this.checkVideoUrl = this.checkVideoUrl.bind(this);
    this.handleVideoChange = this.handleVideoChange.bind(this);
    this.handleFirstTypeChange = this.handleFirstTypeChange.bind(this);
    this.handleSecondTypeChange = this.handleSecondTypeChange.bind(this);
  }

  componentWillMount() {
    const { contentManageActions, editData, appActions } = this.props;
    appActions.loading(true).then(() => {
      return Promise.all([
        contentManageActions.getTypeSelectList(),
        contentManageActions.getVideoNumber(),
        contentManageActions.getCityList()
      ]).then((data) => {
        const typeData = data[0].data;
        this.setState({
          typeData,
          firstValue: editData ? editData.firstSort : typeData[0].firstSort,
          secondType: editData ? typeData[editData.firstSort - 1].list : typeData[0].list,
          secondValue: editData ? editData.secondSort : typeData[0].list[0].secondSort
        })
        appActions.loading(false)
      }).catch(err => {
        appActions.loading(false)
        message.error(err.msg);
      })
    })
  }

  handleCancel() {
    this.props.modalChange();
    this.props.form.resetFields();
  }

  handleSubmit(e) {
    e.preventDefault();
    const {form, appActions, contentManageActions, pageSize, editData, contentManage, pageNum} = this.props;
    form.validateFieldsAndScroll(( err, values ) => {
      if ( !err ) {
        const id = editData ? editData.id : null;   //id存在更新 不存在新增
        const cityArr = values.cityCode;
        const cityNameArr = [];
        const cityList = contentManage.get('cityList') && contentManage.get('cityList') || [];
        this.setState({disabled: true});
        values.iconUrl = this.state.iconUrl;
        values.videoUrl = this.state.videoUrl;
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

        values.firstSort = this.state.firstValue;
        values.secondSort = this.state.secondValue;
        appActions.loading(true).then(() => {
          return contentManageActions.addVideo({
            id,
            ...values
          })
        }).then(() => {
          return Promise.all([
            contentManageActions.getVideoList({
              pageNum,
              pageSize
            }),
            contentManageActions.getVideoNumber()
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
        }).catch(err => {
          appActions.loading(false);
          this.setState({disabled: false});
          message.error(err.msg)
        })
      }
    })
  }

  afterSubmit() {
    this.props.modalChange();
    this.props.form.resetFields();
  }

  checkNumber(rule, value, callback) {
    const { contentManage, editData } = this.props;
    const videoSort = contentManage && contentManage.get('videoSort') && contentManage.get('videoSort');
    const isEditNumber = editData && editData.weight || -1;
    if (this.state.flag === '0') {
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
    if (videoSort.indexOf(Number(value)) !== -1 && Number(value) !== isEditNumber) {
      callback('序号重复');
      return;
    }
    callback();
  }

  checkTitle(rule, value, callback) {
    if (value === '') {
      callback('请输入视频标题');
      return;
    }
    if (value.length > 12) {
      callback('超过12个字');
      return;
    }
    callback();
  }

  checkSubTitle(rule, value, callback) {
    if (value === '') {
      callback('请输入视频简介');
      return;
    }
    if (value.length < 30) {
      callback('不少于30个字');
      return;
    }
    callback();
  }

  checkPic(rule, value, callback) {
    const { editData } = this.props;
    const { iconUrl, imgWidth, imgHeight } = this.state;
    if (iconUrl === '') {
      callback('请上传缩略图');
      return;
    }

    if ((imgWidth !== 330 || imgHeight !== 214) && (imgWidth !== '' && imgHeight !== '')) {
      callback('缩略图尺寸错误');
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

    const isLt500 = file.size / 1024 / 500 < 1;
    if (isImage && !isLt500) {
      message.error('图片大小不能超过500K!');
    }

    return isImage && isLt500;
  }

  handleChange(info) {

    if (info.file.status !== 'uploading') {
      console.log('uploading');
      this.setState({disabled: true});
    }
    if (info.file.status === 'done') {
      console.log(info);
      this.setState({disabled: false});
      const url = info.file.response.data.url;
      const name = info.file.response.data.originName;
      const imgWidth = info.file.response.data.width;
      const imgHeight = info.file.response.data.height;
      this.setState({iconUrl: url, imgWidth, imgHeight});
      message.success(`${info.file.name}上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name}上传失败`);
    }
  }

  handleStateChange(e) {
    this.setState({ flag: e.target.value })
  }

  checkVideoUrl(rule, value, callback) {
    const { editData } = this.props;
    const { videoUrl } = this.state;
    if (videoUrl === '') {
      callback('请上传视频');
      return;
    }
    callback();
  }

  beforeVideoUpload(file) {
    const isMp4 = file.type === 'video/mp4';

    if (!isMp4) {
      message.error('只能上传MP4格式!');
    }

    return true;
  }

  handleVideoChange(info) {
    if (info.file.status !== 'uploading') {
      console.log('uploading');
    }
    if (info.file.status === 'done') {
      console.log(info);
      const md5 = info.file.response.data.md5;
      const url = `${uploadData.continueUrl}${md5}`
      const name = info.file.response.data.originName;
      this.setState({videoUrl: url, videoName: name});
      message.success(`${info.file.name}上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name}上传失败`);
    }
  }

  getArea() {
    return () => document.getElementById('videoCard-area')
  }

  handleFirstTypeChange(value) {
    const { typeData } = this.state;
    const selectData = typeData.find(v => v.firstSort === Number(value))
    this.setState({
      firstValue: selectData.firstSort,
      secondType: selectData.list,
      secondValue: selectData.list[0].secondSort
    });
  }
  handleSecondTypeChange(value) {
    const selectData = this.state.secondType.find(v => {
      return v.secondSort === Number(value);
    })
    this.setState({
      secondValue: selectData.secondSort
    })
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
    const { typeData } = this.state;
    const cityList = contentManage.get('cityList') && contentManage.get('cityList') || [];
    const cityChildren = [];
    cityList.map((v, k) => {
      return cityChildren.push(<Option key={v.cityCode} value={v.cityCode}>{v.cityName}</Option>)
    })
    cityChildren.push(<Option key={'000000'} value={'000000'}>全国</Option>)
    const firstTypeChildren = typeData.map(v => <Option key={v.firstSort} value={v.firstSort}>{v.firstName}</Option>);
    const secondTypeChildren = this.state.secondType.map(v => <Option key={v.secondSort} value={v.secondSort}>{v.secondName}</Option>);
    const firstDefaultValue = typeData[0] && typeData[0].firstName;
    return (
      <Modal
        title={editData ? '编辑培训视频' : '新增培训视频'}
        visible={this.props.modalVisible}
        onCancel={this.handleCancel}
        className="banner-card"
        footer={null}
      >
        <Form onSubmit={this.handleSubmit} style={{paddingTop: '20px'}} id="videoCard-area">
          <FormItem
            {...formItemLayout}
            label='分类'
          >
            { getFieldDecorator( 'type', {
            } )(
              <div>
                <Select value={this.state.firstValue} getPopupContainer={this.getArea()} style={{ width: 90 }} onChange={this.handleFirstTypeChange}>
                  {
                    firstTypeChildren
                  }
                </Select>
                <Select value={this.state.secondValue} getPopupContainer={this.getArea()} style={{ width: 90, marginLeft: '10px' }} onChange={this.handleSecondTypeChange}>
                  {
                    secondTypeChildren
                  }
                </Select>
              </div>
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
          label='视频标题'
        >
            { getFieldDecorator( 'title', {
            rules: [{ required: true, validator: this.checkTitle }],
            initialValue: editData ? editData.title : ''
          } )(
            <Input placeholder="不超过12个字，仅作标识，不展示在前端页面" />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='视频简介'
        >
            { getFieldDecorator( 'describe', {
            rules: [{ required: true, validator: this.checkSubTitle }],
            initialValue: editData ? editData.describe : ''
          } )(
            <TextArea placeholder="不少于30个字" />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='视频缩略图'
          extra="图片尺寸330*214，大小不超过500k，图片格式为：jpg，png每次仅上传1张图片"
        >
            { getFieldDecorator( 'iconUrl', {
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
                 this.state.iconUrl ?
                   <img src={this.state.iconUrl} alt="" className="avatar" /> :
                   <Icon type="plus" className="avatar-uploader-trigger" />
               }
            </Upload>
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='视频'
          extra="视频格式为:MP4,视频大小不超过100M，每次仅上传1个视频"
        >
            { getFieldDecorator( 'videoUrl', {
            rules: [{ required: true, validator: this.checkVideoUrl }],
          } )(
            <Upload
               name="uploadFiles"
               showUploadList
               action={uploadData.url}
               data={{
                 key: uploadData.key
               }}
               beforeUpload={this.beforeVideoUpload}
               onChange={this.handleVideoChange}
             >
              <Button>
                <Icon type="upload" />上传视频
              </Button>
              <div style={{ wordBreak: 'break-all' }}>
                {this.state.videoName}
              </div>
            </Upload>
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='排序'
        >
            { getFieldDecorator( 'weight', {
            rules: [{ required: true, validator: this.checkNumber }],
            initialValue: editData ? editData.weight : ''
          } )(
            <Input placeholder="请输入正整数,数字越小,在前端先展示" disabled={this.state.flag === '0'} />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='状态'
        >
            { getFieldDecorator( 'flag', {
            initialValue: editData ? editData.flag.toString() : '1'
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

VideoCard.propTypes = {
  appActions: PropTypes.object,
  contentManageActions: PropTypes.object,
  contentManage: PropTypes.object,
  modalChange: PropTypes.func,
  form: PropTypes.object,
  modalVisible: PropTypes.bool,
  pageSize: PropTypes.number,
  editData: PropTypes.object,
  pageNum: PropTypes.number
}

const mapStateToProps = ( state, ownProps ) => {
  const contentManage = state.get( 'contentManage' );
  console.log(contentManage);
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

export default connect( mapStateToProps, mapDispatchToProps )(Form.create()( VideoCard ))
