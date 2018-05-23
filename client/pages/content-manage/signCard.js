import React, { Component, } from 'react'
import {Modal, Button, Input, Form, Select, message, Radio, Icon } from 'antd'
const { TextArea } = Input;
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux';

import appActions from '../app/action'
import contentManageActions from './action'

const FormItem = Form.Item
const { Option } = Select;
const RadioGroup = Radio.Group;

class SignCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      flag: props.editData && props.editData.flag.toString() || '1',
    }
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkNumber = this.checkNumber.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
  }

  componentDidMount() {
    this.props.contentManageActions.getSignNumber();
    this.props.contentManageActions.getCityList()
  }

  handleCancel() {
    this.props.modalChange();
    this.props.form.resetFields();
  }

  handleSubmit(e) {
    e.preventDefault();
    const {form, appActions, contentManageActions, pageSize, editData, pageNum, contentManage} = this.props;
    form.validateFieldsAndScroll(( err, values ) => {
      if ( !err ) {
        const id = editData ? editData.id : null;   //id存在更新 不存在新增
        //城市
        const cityList = contentManage.get('cityList') && contentManage.get('cityList') || [];
        if (values.cityName && values.cityName === '全国') {
          values.cityCode = '000000'
        } else if (values.cityName) {
          const selectCity = cityList.filter(v => v.cityName === values.cityName).get('0');
          values.cityCode = selectCity.cityCode;
        }
        this.setState({disabled: true})
        appActions.loading(true).then(() => {
          return contentManageActions.addSign({
            id,
            ...values
          })
        }).then(() => {
          return Promise.all([
            contentManageActions.getSignList({
              pageNum,
              pageSize
            }),
            contentManageActions.getSignNumber()
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
          console.log(err);
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
    const { contentManage, editData } = this.props;
    const signSort = contentManage && contentManage.get('signSort') && contentManage.get('signSort');
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
    if (signSort.indexOf(Number(value)) !== -1 && Number(value) !== isEditNumber) {
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
    this.setState({ flag: e.target.value })
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
    let firstCity = '';
    if (cityList && cityList.size > 0) {
      firstCity = cityList.get('0').cityName
    }
    return (
      <Modal
        title={editData ? '编辑外出签到标签' : '新增外出签到标签'}
        visible={this.props.modalVisible}
        onCancel={this.handleCancel}
        footer={null}
      >
        <Form onSubmit={this.handleSubmit} style={{paddingTop: '20px'}}>
          <FormItem
          {...formItemLayout}
          label='标签名称'
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
          label='排序'
        >
            { getFieldDecorator( 'weight', {
            rules: [{ required: true, validator: this.checkNumber }],
            initialValue: editData ? editData.weight : ''
          } )(
            <Input placeholder="请输入正整数,数字越小,在前端先展示" disabled={this.state.flag === '0'}/>
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='必关联'
        >
            { getFieldDecorator( 'relevantCustomer', {
            initialValue: editData ? editData.relevantCustomer.toString() : '2'
          } )(
            <RadioGroup>
              <Radio value="2">是</Radio>
              <Radio value="1">否</Radio>
            </RadioGroup>
          ) }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='适用城市'
          >
            { getFieldDecorator( 'cityName', {
              rules: [{ required: true, message: '请选择适用城市' }],
              initialValue: editData && editData.cityName ? editData.cityName : firstCity
            } )(
              <Select>
                {
                  cityList.map((v, k) => (
                    <Option key={v.cityCode} value={v.cityName}>{v.cityName}</Option>
                  ))
                }
                <Option key='全国' value='全国'>全国</Option>
              </Select>
            ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='新增入口状态'
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

SignCard.propTypes = {
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

export default connect( mapStateToProps, mapDispatchToProps )(Form.create()( SignCard ))
