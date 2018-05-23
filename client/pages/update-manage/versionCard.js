import React, { Component, } from 'react'
import {Modal, Button, Input, Form, Select, message, Radio, Icon, Upload } from 'antd'
const { TextArea } = Input;
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux';

import appActions from '../app/action'
import systemManageActions from './action'
import {uploadData} from '../../utils/uploadData'
import contentManageActions from '../content-manage/action'

const FormItem = Form.Item
const { Option } = Select;
const RadioGroup = Radio.Group;

class VersionCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appUrl: '',
      fileName: '',
      disabled: false
    }
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.checkUrl = this.checkUrl.bind(this);
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
    const {form, appActions, systemManageActions, pageSize, pageNum, contentManage} = this.props;
    form.validateFieldsAndScroll(( err, values ) => {
      if ( !err ) {
        values.appUrl = this.state.appUrl;
        //城市
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

        this.setState({disabled: true});
        appActions.loading(true).then(() => {
          return systemManageActions.addVersion({
            ...values
          })
        }).then(() => {
          return systemManageActions.getVersionList({
            pageNum,
            pageSize
          })
        }).then(() => {
          appActions.loading(false);
          this.setState({disabled: false})
          message.success('添加成功')
          this.afterSubmit();
        }).catch(() => {
          appActions.loading(false);
          this.setState({disabled: false})
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
        this.setState({appUrl: url, fileName: url});
        message.success(`${info.file.name}上传成功`);
      } else {
        message.error(`${info.file.name}上传失败`);
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name}上传失败`);
    }
  }

  checkUrl(rule, value, callback) {
    if (this.state.appUrl === '') {
      callback('请上传安装包');
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
    const { contentManage } = this.props;
    const cityList = contentManage.get('cityList') && contentManage.get('cityList') || [];
    const cityChildren = [];
    cityList.map((v, k) => {
      return cityChildren.push(<Option key={v.cityCode} value={v.cityCode}>{v.cityName}</Option>)
    })
    cityChildren.push(<Option key={'000000'} value={'000000'}>全国</Option>)
    return (
      <Modal
        title={'上传安装包'}
        visible={this.props.modalVisible}
        onCancel={this.handleCancel}
        footer={null}
      >
        <Form onSubmit={this.handleSubmit} style={{paddingTop: '20px'}} id="versionCard-area">
          <FormItem
          {...formItemLayout}
          label='项目名称'
        >
            { getFieldDecorator( 'project', {
              rules: [{ required: true, message: '请选择分类' }],
              initialValue: '0'
            } )(
              <Select getPopupContainer={this.getArea()}>
                <Option value="0">雅典娜</Option>
                <Option value="1">阿波罗</Option>
              </Select>
            ) }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='适用城市'
          >
            { getFieldDecorator( 'cityCode', {
              rules: [{ required: true, message: '请选择适用城市' }],
              initialValue: []
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
          label='版本号'
        >
            { getFieldDecorator( 'appVersion', {
            rules: [{ required: true, message: '请输入版本号' }],
            initialValue: ''
          } )(
            <Input placeholder="VX.X.X" />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='更新内容'
        >
            { getFieldDecorator( 'versionContent', {
            rules: [{ required: true, message: '请输入更新内容' }],
            initialValue: ''
          } )(
            <TextArea />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='适用系统'
        >
            { getFieldDecorator( 'appSystem', {
            rules: [{ required: true, message: '请选择系统' }],
            initialValue: ''
          } )(
            <RadioGroup>
              <Radio value="200">iOS</Radio>
              <Radio value="100">Android</Radio>
            </RadioGroup>
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          style={{wordWrap: 'break-word'}}
          label='安装包'
          extra={this.state.fileName}
        >
            { getFieldDecorator( 'appUrl', {
            rules: [{ required: true, validator: this.checkUrl }]
          } )(
            <Upload
              name="uploadFiles"
              action=''
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
          label='强制更新'
        >
            { getFieldDecorator( 'type', {
            initialValue: '702'
          } )(
            <RadioGroup>
              <Radio value="702">非强制更新</Radio>
              <Radio value="701">强制更新</Radio>
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

VersionCard.propTypes = {
  appActions: PropTypes.object,
  systemManageActions: PropTypes.object,
  contentManageActions: PropTypes.object,
  contentManage: PropTypes.object,
  modalChange: PropTypes.func,
  form: PropTypes.object,
  modalVisible: PropTypes.bool,
  pageSize: PropTypes.number,
  pageNum: PropTypes.number,
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
    systemManageActions: bindActionCreators(systemManageActions, dispatch),
    contentManageActions: bindActionCreators(contentManageActions, dispatch)
  }
}

export default connect( mapStateToProps, mapDispatchToProps )(Form.create()( VersionCard ))
