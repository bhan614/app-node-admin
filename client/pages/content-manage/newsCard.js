import React, { Component, } from 'react'
import {Modal, Button, Input, Form, Select, message } from 'antd'
const { TextArea } = Input;
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux';

import appActions from '../app/action'
import contentManageActions from './action'

const FormItem = Form.Item
const { Option } = Select;

class NewsCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false
    }
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
        this.setState({disabled: true});
        appActions.loading(true).then(() => {
          return contentManageActions.addNews({
            id,
            ...values
          })
        }).then(() => {
          return contentManageActions.getNewsList({
            pageNum,
            pageSize
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

  checkPrice(rule, value, callback) {
    if (value === '') {
      callback('请输入本单业绩');
      return;
    }
    if (isNaN(value) || value <= 0) {
      callback('请输入数字');
      return;
    }
    callback();
  }

  checkAmount(rule, value, callback) {
    if (value === '') {
      callback('请输入签单金额');
      return;
    }
    if (isNaN(value) || value <= 0) {
      callback('请输入数字');
      return;
    }
    callback();
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
        title={editData ? '修改战报' : '新增战报'}
        visible={this.props.modalVisible}
        onCancel={this.handleCancel}
        footer={null}
      >
        <Form onSubmit={this.handleSubmit} style={{paddingTop: '20px'}}>
          <FormItem
          {...formItemLayout}
          label='中心'
        >
            { getFieldDecorator( 'orgName', {
            rules: [{ required: true, message: '请输入中心名称!' }],
            initialValue: editData ? editData.orgName : ''
          } )(
            <Input />
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
            label='分类'
          >
            { getFieldDecorator( 'type', {
              rules: [{ required: true, message: '请选择分类' }],
              initialValue: editData && editData.type ? editData.type.toString() : '1'
            } )(
              <Select>
                <Option key={1} value={'1'}>装修金融</Option>
                <Option key={2} value={'2'}>房产金融</Option>
                <Option key={3} value={'3'}>直客</Option>
              </Select>
            ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='经理'
        >
            { getFieldDecorator( 'manager', {
            rules: [{ required: true, message: '请输入经理名称!' }],
            initialValue: editData ? editData.manager : ''
          } )(
            <Input style={{width: '130px', marginRight: '5px'}} />
          ) }
            <span>团队</span>
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='金融顾问'
        >
            { getFieldDecorator( 'adviser', {
            rules: [{ required: true, message: '请输入金融顾问名称!' }],
            initialValue: editData ? editData.adviser : ''
          } )(
            <Input />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='产品名称'
        >
            { getFieldDecorator( 'product', {
            rules: [{ required: true, message: '请输入产品名称!' }],
            initialValue: editData ? editData.product : ''
          } )(
            <Input />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='签单金额'
        >
            { getFieldDecorator( 'amount', {
            rules: [{ required: true, validator: this.checkAmount }],
            initialValue: editData ? editData.amount : ''
          } )(
            <Input style={{width: '130px', marginRight: '5px'}} />
          ) }
            <span>元</span>
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='本单业绩'
        >
            { getFieldDecorator( 'achieve', {
            rules: [{ required: true, validator: this.checkPrice }],
            initialValue: editData ? editData.achieve : ''
          } )(
            <Input style={{width: '130px', marginRight: '5px'}} />
          ) }
            <span>元</span>
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

NewsCard.propTypes = {
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

export default connect( mapStateToProps, mapDispatchToProps )(Form.create()( NewsCard ))
