import React, { Component, } from 'react'
import {Modal, Button, Input, Form, Select, message, DatePicker } from 'antd'
import moment from 'moment';
const { TextArea } = Input;
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux';
import { formatDate } from '../../utils/perfect';

import appActions from '../app/action'
import marketManageActions from './action'

const FormItem = Form.Item
const { Option } = Select;

const dateFormat = 'YYYY-MM-DD';
const today = new Date().getTime();

class HolidayCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false
    }
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkName = this.checkName.bind(this);
  }

  componentDidMount() {
    this.props.marketManageActions.getHolidayName();
  }

  handleCancel() {
    this.props.modalChange();
    this.props.form.resetFields();
  }

  handleSubmit(e) {
    e.preventDefault();
    const {form, appActions, marketManageActions, pageSize, editData, pageNum} = this.props;
    form.validateFieldsAndScroll(( err, values ) => {
      if ( !err ) {
        const id = editData ? editData.id : null;   //id存在更新 不存在新增
        values.time = values.time.format(dateFormat);
        this.setState({disabled: true});
        appActions.loading(true).then(() => {
          return marketManageActions.addHoliday({
            id,
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

  checkName(rule, value, callback) {
    const { marketManage, editData } = this.props;
    const holidayNameList = marketManage && marketManage.get('holidayNameList') && marketManage.get('holidayNameList');
    console.log(holidayNameList);
    const isEditName = editData && editData.name || -1;
    if (value === '') {
      callback('请输入节日名称');
      return;
    }
    if (holidayNameList.indexOf(value) !== -1 && value !== isEditName) {
      callback('节日名称重复');
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
    const { editData } = this.props;
    return (
      <Modal
        title={editData ? '修改节日' : '新增节日'}
        visible={this.props.modalVisible}
        onCancel={this.handleCancel}
        footer={null}
      >
        <Form onSubmit={this.handleSubmit} style={{paddingTop: '20px'}}>
          <FormItem
          {...formItemLayout}
          label='节日名称'
        >
            { getFieldDecorator( 'name', {
            rules: [{ required: true, validator: this.checkName }],
            initialValue: editData ? editData.name : ''
          } )(
            <Input />
          ) }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label='节日时间'
        >
            { getFieldDecorator( 'time', {
            rules: [{ required: true, message: '请选择节日时间!' }],
            initialValue: editData ?
              moment(formatDate({time: editData.time, showYear: true, showHms: false}), dateFormat)
              : moment(formatDate({time: today, showYear: true, showHms: false}), dateFormat)
          } )(
            <DatePicker format={dateFormat} />
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

HolidayCard.propTypes = {
  appActions: PropTypes.object,
  marketManageActions: PropTypes.object,
  modalChange: PropTypes.func,
  form: PropTypes.object,
  modalVisible: PropTypes.bool,
  pageSize: PropTypes.number,
  editData: PropTypes.object,
  marketManage: PropTypes.object,
  pageNum: PropTypes.number
}

const mapStateToProps = ( state, ownProps ) => {
  const marketManage = state.get( 'marketManage' );
  return {
    marketManage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    appActions: bindActionCreators(appActions, dispatch),
    marketManageActions: bindActionCreators(marketManageActions, dispatch)
  }
}

export default connect( mapStateToProps, mapDispatchToProps )(Form.create()( HolidayCard ))
