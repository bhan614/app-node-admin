import React, { Component, } from 'react'
import {Modal, Button, Input, Form, Select, message, Radio, Col, Checkbox, Upload, Icon } from 'antd'
const { TextArea } = Input;
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux';
import {uploadData} from '../../utils/uploadData'
import {formatDate} from '../../utils/perfect'

import appActions from '../app/action'
import contentManageActions from './action'
import './noticeCard.less'

const FormItem = Form.Item
const { Option } = Select;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const confirm = Modal.confirm;

let ck = null;
let instance = null;

const type = {
  1: '公司新闻',
  2: '制度专栏'
}

const serType = {
  3: '人事',
  4: '财务',
  5: '风控',
  6: '品控',
  7: '客服',
  8: '合规',
  9: '行政',
  10: '其他'
}

class Notice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: props.editData && props.editData.type.toString() || '0',
      editorContent: props.editData && props.editData.content || '',
      disabled: false,
      showIframe: false,
      status: props.editData && props.editData.status.toString() || '1'
    }
    this.formHtml = props.editData && props.editData.content || null;
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleUploadImg = this.handleUploadImg.bind(this);
    this.handleUploadFile = this.handleUploadFile.bind(this);
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.handleShowIframe = this.handleShowIframe.bind(this);
    this.handleCancelIframe = this.handleCancelIframe.bind(this);
    this.renderIframeHeader = this.renderIframeHeader.bind(this);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
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

  componentDidMount() {
    // 从 CDN 库加载CK
    //this.loadJs('//cdn.ckeditor.com/4.7.1/full/ckeditor.js');
    if (window.CKEDITOR) {
      this.onLoadEditor()
    }
  }

  handleCancel() {
    this.props.modalChange();
    this.props.form.resetFields();
  }

  handleSubmit(e) {
    e.preventDefault();
    const {form, appActions, contentManageActions, pageSize, editData, pageNum, contentManage, title, status, cityCode} = this.props;
    form.validateFieldsAndScroll(( err, values ) => {
      if (this.state.editorContent === '') {
        return;
      }
      if ( !err ) {
        const id = editData ? editData.id : null;   //id存在更新 不存在新增
        const content = instance.getData();
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

        values.content = content;
        if (values.label) {
          values.label = values.label.join(',');
        }
        if (values.status === '0') {
          values.isTop = '0';
        }
        this.setState({disabled: true});
        appActions.loading(true).then(() => {
          return contentManageActions.addNotice({
            id,
            ...values
          })
          .then(() => {
            return contentManageActions.getNoticeList({
              pageNum,
              pageSize,
              title,
              status,
              cityCode
            })
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
        })
      }
    })
  }

  afterSubmit() {
    this.props.modalChange();
    this.props.form.resetFields();
  }

  checkTitle(rule, value, callback) {
    if (value === '') {
      callback('请输入公告标题');
      return;
    }
    if (value.length > 20) {
      callback('超过20个字');
      return;
    }
    callback();
  }

  checkAbstract(rule, value, callback) {
    if (value === '') {
      callback('请输入概要');
      return;
    }
    if (value == null || value.length > 60 || value.length < 30) {
      callback('字数不在30-60之间');
      return;
    }
    callback();
  }

  checkContent(rule, value, callback) {
    const content = instance.getData();
    if (content === '') {
      callback('请输入内容');
      return;
    }
    callback();
  }

  checkEditor(rule, value, callback) {
    callback();
  }

  handleTypeChange(v) {
    this.setState({ type: v });
  }

  /**
   *  加载 CK 完成后进行编辑器初始化
   */
  onLoadEditor = (e) => {
    ck = window.CKEDITOR;

    const ckOptions = {
      language: 'zh-cn',
      height: '5cm',
      width: '12.7cm',
      allowedContent: {
        $1: {
          elements: ck.dtd,
          attributes: true,
          styles: true,
          classes: true,
        },
      },
      disallowedContent: 'script; *[on*]',
      removePlugins: 'elementspath',
      toolbar: [
        { name: 'colors', items: ['TextColor'] },
        { name: 'style', items: ['FontSize'] },
        { name: 'basicstyles', items: ['Bold', 'Italic'] },
        { name: 'links', items: ['Link'] },
        { name: 'clipboard', items: ['PasteText', 'PasteFromWord'] },
        { name: 'insert', items: ['CodeSnippet'] },
        { name: 'paragraph', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
        { name: 'tools', items: ['Maximize'] }
      ],
      filebrowserUploadUrl: uploadData.url
    };

    // 给正文部分添加样式支持
    ck.addCss(`
      .pager { border: 1px solid #999; border-left: 0; border-right: 0; height: 1px; }
      .circlearea { border:2px dashed #108EE9; padding: 5px; }
      .cke_editable { margin: 0; padding: 0.5cm; }
    `);

    instance = ck.replace('editor', ckOptions);

    // 向编辑器赋值，如果有
    if (this.formHtml) {
      instance.setData(this.formHtml);
    }

    instance.on('change', (e) => {
      this.handleEditorChange(instance.getData());
    })
    instance.on('paste', (e) => {
      e.stop();
      const { contentManageActions } = this.props;
      const pasteData = e.data.dataTransfer._;
      if (e.data.dataValue && e.data.dataValue.length > 0) {
        //如果同时复制图片和文字
        const value = e.data.dataValue;
        if (value.indexOf('</img>') > 0) {
          message.error('请单独复制文字或图片');
          return false;
        }
        instance.insertHtml(e.data.dataValue);
      } else if (pasteData.files && pasteData.files.length > 0) {
        const formData = new FormData();
        formData.append('uploadFiles', pasteData.files[0]);
        formData.append('key', uploadData.key);
        contentManageActions.uploadFiles(formData).then(v => {
          instance.insertHtml(`<img src=${v.data.url} style="width: 100%; height: auto; display: block; margin: 0px auto;" />`)
        })
        .catch(() => {
          message.error('上传失败');
        })
      }
    })
  }

  handleEditorChange(v) {
    const { contentManageActions } = this.props;
    this.setState({
      editorContent: v
    })
  }

  handleChangeStatus(e) {
    this.setState({
      status: e.target.value
    })
  }

  loadJs(url) {
    const script = document.createElement('script');
    script.src = url;
    script.onload = this.onLoadEditor;
    document.body.appendChild(script);
  }

  handleUploadImg(info) {
    if (info.file.status !== 'uploading') {
      console.log('uploading');
    }
    if (info.file.status === 'done') {
      const url = info.file.response.data.url;
      console.log(info);
      this.setState({url});
      instance.insertHtml(`<img src=${url} style="width: 100%; height: auto; display: block; margin: 0px auto;" />`)
      message.success(`${info.file.name}上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name}上传失败`);
    }
  }

  handleUploadFile(info) {
    if (info.file.status !== 'uploading') {
      console.log('uploading');
    }
    if (info.file.status === 'done') {
      const url = info.file.response.data.url;
      const name = info.file.response.data.originName;
      console.log(info);
      // Get this url from response in real world.
      //getBase64(info.file.originFileObj, imgUrl => this.setState({ imgUrl }));
      instance.insertHtml(`<a href=${url}>${name}</a>`)
      message.success(`${info.file.name}上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name}上传失败`);
    }
  }

  handleShowIframe() {
    this.setState({showIframe: true});
  }

  handleCancelIframe() {
    this.setState({showIframe: false});
  }

  renderIframeHeader() {
    const { form } = this.props;
    let headerType = '';
    if (type[form.getFieldValue('type')] === '公司新闻') {
      headerType = type[form.getFieldValue('type')]
    }
    if (type[form.getFieldValue('type')] === '制度专栏') {
      headerType = `${type[form.getFieldValue('type')]}-${serType[form.getFieldValue('serType')]}`
    }
    const time = formatDate({time: new Date().getTime(), showYear: true, showHms: true});
    const html = `<div><div style="border-bottom:1px solid rgba(151, 151, 151, .21);height: auto;position: relative;padding: 10px 10px 5px 10px;font-size:13px">
    <div><div style="margin-bottom: 5px;">${form.getFieldValue('title')}</div><span style="color:#999">${time}</span>
    <span style="color:black;position: absolute;right: 20px;bottom: 5px">${headerType}</span></div>
    </div><div style="padding: 10px">${this.state.editorContent}</div></div>
    <script>window.onload=function(){
      var img=document.getElementsByTagName('img');
      var table=document.getElementsByTagName('table');
      var span = document.getElementsByTagName('span');
      var body = document.getElementsByTagName('body');
      var p = document.getElementsByTagName('p');
      body[0].style.fontSize = '13px';
      if(img) {
        for(i=0;i<img.length;i++){
          if(img[i].naturalWidth<window.innerWidth) {
            img[i].style.width=img[i].naturalWidth;
          }else{
            img[i].style.width='100%';
          }
          img[i].style.height='auto';img[i].style.margin='0 auto';img[i].style.display='block';
        }
      }
      if(table) {
        for(i=0;i<table.length;i++){
          table[i].style.width='100%';table[i].style.margin='0 auto';table[i].style.display='block';table[i].style.border='none';
        }
      }
      if(p) {
        for(i=0;i<p.length;i++){
          p[i].style.wordWrap='break-word';
        }
      }
      if(span) {
        for(i=0;i<span.length;i++){
          var fontSize = span[i].style.fontSize;
          if(fontSize && fontSize.indexOf('pt') !== -1){
            var sizeNumber = fontSize.substring(0, fontSize.length-2);
            var pxNumber = Number(sizeNumber)*1.1;
            var newSize = pxNumber + 'px';
            span[i].style.fontSize = newSize;
          }
        }
      }}
    </script>`
    return html;
  }

  getArea() {
    return () => document.getElementById('noticeCard-area')
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 14 },
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
    const buttonList = window.INIT_DATA.AUTH_LIST.buttonList;
    const { editData, contentManage } = this.props;
    const cityList = contentManage.get('cityList') && contentManage.get('cityList') || [];
    const cityChildren = [];
    cityList.map((v, k) => {
      return cityChildren.push(<Option key={v.cityCode} value={v.cityCode}>{v.cityName}</Option>)
    })
    cityChildren.push(<Option key={'000000'} value={'000000'}>全国</Option>)
    return (
      <Modal
        title={editData ? '编辑公告' : '新增公告'}
        visible={this.props.modalVisible}
        onCancel={this.handleCancel}
        width={860}
        footer={null}
      >
        <Form onSubmit={this.handleSubmit} style={{paddingTop: '20px'}} id="noticeCard-area">
          <FormItem
          {...formItemLayout}
          label='分类'
        >
            { getFieldDecorator( 'type', {
              rules: [{ required: true, message: '请选择分类' }],
              initialValue: editData && editData.type ? editData.type.toString() : '1'
            } )(
              <Select onChange={this.handleTypeChange} getPopupContainer={this.getArea()}>
                <Option value="1">{type[1]}</Option>
                <Option value="2">{type[2]}</Option>
              </Select>
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
          {
            this.state.type === '2' ?
              <div>
                <FormItem
                  label='子分类'
                {...formItemLayout}
              >
                  { getFieldDecorator( 'serType', {
                rules: [{ required: true, message: '请选择子分类' }],
                initialValue: editData && editData.serType ? editData.serType.toString() : '3'
              } )(
                <Select getPopupContainer={this.getArea()}>
                  <Option value="3">{serType[3]}</Option>
                  <Option value="4">{serType[4]}</Option>
                  <Option value="5">{serType[5]}</Option>
                  <Option value="6">{serType[6]}</Option>
                  <Option value="7">{serType[7]}</Option>
                  <Option value="8">{serType[8]}</Option>
                  <Option value="9">{serType[9]}</Option>
                  <Option value="10">{serType[10]}</Option>
                </Select>
              ) }
                </FormItem>
                <FormItem
                {...formItemLayout}
                label='适用范围'
              >
                  { getFieldDecorator( 'label', {
                  rules: [{ required: true, message: '请选择适用范围' }],
                  initialValue: editData && editData.label ? editData.label.split(',') : []
                } )(
                  <CheckboxGroup options={['房产业务', '房产直客', '装修', '全员']} />
                ) }
                </FormItem>
                <FormItem
                {...formItemLayout}
                label='反馈意见接收邮箱'
              >
                  { getFieldDecorator( 'feedbackEmail', {
                  rules: [{type: 'email', message: '请输入正确的邮箱'}, { required: true, message: '请输入反馈意见接收邮箱' }],
                  initialValue: editData ? editData.feedbackEmail : ''
                } )(
                  <Input />
                ) }
                </FormItem>
              </div> : null
            }

          <FormItem
          {...formItemLayout}
          label='标题'
        >
            { getFieldDecorator( 'title', {
            rules: [{ required: true, validator: this.checkTitle }],
            initialValue: editData ? editData.title : ''
          } )(
            <Input />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='概要'
        >
            { getFieldDecorator( 'description', {
            rules: [{ required: true, validator: this.checkAbstract }],
            initialValue: editData ? editData.description : ''
          } )(
            <Input placeholder="字数在30-60之间" />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='内容'
        >
            { getFieldDecorator( 'content', {
              rules: [{ required: true, validator: this.checkEditor }],
          //  initialValue: editData ? editData.content : ''
          } )(
            <div>
              <TextArea id="editor" />
              <Upload
                name="uploadFiles"
                action={uploadData.url}
                data={{
                  key: uploadData.key
                }}
                showUploadList={false}
                onChange={this.handleUploadImg}
                >
                <Button>
                  <Icon type="upload" />上传图片
                </Button>
              </Upload>
              <Upload
                name="uploadFiles"
                action={uploadData.url}
                data={{
                  key: uploadData.key
                }}
                showUploadList={false}
                onChange={this.handleUploadFile}
                style={{ margin: '10px' }}
                >
                <Button>
                  <Icon type="upload" />上传文件
                </Button>
              </Upload>
              {
                this.state.editorContent === '' ? <div style={{color: 'red'}}>请输入内容</div> : null
              }
            </div>
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='状态'
        >
            { getFieldDecorator( 'status', {
            initialValue: editData ? editData.status.toString() : '1'
          } )(
            <RadioGroup onChange={this.handleChangeStatus}>
              <Radio value="1">生效</Radio>
              <Radio value="0">未生效</Radio>
            </RadioGroup>
          ) }
          </FormItem>
          {buttonList && buttonList.includes('bkgj_stage_btn_Top') && this.state.status === '1' ? (
            <FormItem
            {...formItemLayout}
            label='置顶'
          >
              { getFieldDecorator( 'isTop', {
              initialValue: editData ? editData.isTop.toString() : '0'
            } )(
              <RadioGroup>
                <Radio value="1">置顶</Radio>
                <Radio value="0">不置顶</Radio>
              </RadioGroup>
            ) }
            </FormItem>
          ) : null}
          <FormItem
           {...tailFormItemLayout}
         >
            <Button style={{float: 'right'}} type='primary' size='default' htmlType='submit' disabled={this.state.disabled}>保存</Button>
            <Button style={{float: 'right', marginRight: '10px'}} type='primary' size='default' onClick={this.handleShowIframe} >预览</Button>
          </FormItem>
          {
            this.state.showIframe ?
              <Modal width='310' visible={this.state.showIframe} footer={null} className="iframeModal" onCancel={this.handleCancelIframe}
              >
                <iframe title="myiframe" frameBorder='0' srcDoc={this.renderIframeHeader()} width="280px" height="490px"></iframe>
              </Modal> : null
          }
        </Form>
      </Modal>
    )
  }
}

Notice.propTypes = {
  appActions: PropTypes.object,
  contentManage: PropTypes.object,
  contentManageActions: PropTypes.object,
  modalChange: PropTypes.func,
  form: PropTypes.object,
  modalVisible: PropTypes.bool,
  pageSize: PropTypes.number,
  editData: PropTypes.object,
  pageNum: PropTypes.number,
  title: PropTypes.string,
  cityCode: PropTypes.string,
  status: PropTypes.string
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

export default connect( mapStateToProps, mapDispatchToProps )(Form.create()( Notice ))
