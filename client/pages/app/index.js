import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { Link } from 'react-router';
import {bindActionCreators} from 'redux';
import appActions from './action'

import 'antd/dist/antd.css';  // or 'antd/dist/antd.less'
import './styles.less';

import { Layout, Menu, Breadcrumb, Icon, Spin, Avatar, message, Alert } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
import { menuConfig } from './menuConfig';
import GlobalModal from '../../components/globalModal';
const centerLogo = require('./center.png');

function itemRender(route, params, routes, paths) {
  const last = routes.indexOf(route) === routes.length - 1;
  //paths.unshift('/');
  return last ?
    <span><Icon type={route.icon} style={{marginRight: '3px'}} />{route.breadcrumbName}</span> :
    <Link to={paths.join('/')}><Icon type={route.icon} style={{marginRight: '3px'}} />{route.breadcrumbName}</Link>;
}

export class App extends Component {

  static propTypes = {
    children: PropTypes.node,
    routes: PropTypes.array,
    location: PropTypes.object,
    router: PropTypes.object,
    app: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {}
  }


  componentDidMount() {
    window.GlobalModal = new GlobalModal();
  }


  goHome = () => {
    this.props.router.push({ pathname: '/' });
  }

  menuHandleClick = (item) => {
    const pathname = this.props.location.pathname || '';

    if (item && item.keyPath) {
      const curPath = item.keyPath.reverse().join('/');
      if (pathname !== curPath) {
        this.props.router.push({
          pathname: curPath
        })
      } else {
        window.location.href = `/${pathname}`;
      }
    }
  }

  renderSubMenu = (subData, menuList) => {
    const subItems = Object.keys(subData).filter(v => menuList.includes(v));

    return subItems.map(item => {
      const data = subData[item];
      if (data) {
        return <Menu.Item key={data.key}>{data.name}</Menu.Item>
      }
      return null;
    })
  }
  renderMenu(menuName, key) {
    const { AUTH_LIST } = window.INIT_DATA;
    const menuList = AUTH_LIST.menuList && AUTH_LIST.menuList.length > 0 && AUTH_LIST.menuList.split(',') || [];
    return menuList.map(item => {
      const menuData = menuConfig[item];
      if (menuData) {
        return (
          <SubMenu
              key={menuData.key}
              title={<span><Icon type={menuData.icon} /><span>{menuData.name}</span></span>}
          >
            {this.renderSubMenu(menuData.sub, menuList)}
          </SubMenu>
        )
      }
      return null;
    })
  }

  returnUrl() {
    const path = location.pathname;
    if (path.indexOf('no-permission') > -1 || path.indexOf('no-server') > -1) {
      return location.origin;
    }
    return location.href;
  }

  render() {
    const { AUTH_LIST, USER_INFO } = window.INIT_DATA;
    const {routes, app} = this.props;
    const port = location.port ? ':8888' : '';
    const returnUrl = encodeURIComponent(this.returnUrl());
    const LOG_OUT_URL = '';
    const path = routes[routes.length - 1].path;
    const openKey = routes[routes.length - 2].path || 'Base';
    const loading = this.props.app.get('loading');
    const name = USER_INFO && USER_INFO.name && USER_INFO.name
    const avatar = USER_INFO && USER_INFO.avatar && USER_INFO.avatar || 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png';
    return (
      <Layout>
        <Sider width={180}>
          <div className="logo" onClick={this.goHome} />
          <Menu theme="light"
                selectedKeys={[path]}
                mode="inline"
                defaultOpenKeys={[openKey]}
                onClick={this.menuHandleClick} >
            {
              this.renderMenu()
            }
          </Menu>
        </Sider>
        <Layout style={{ overflow: 'auto'}}>
          <Header style={{ background: '#fff', padding: 0 }} >
            <img src={centerLogo} style={{ height: '50px', marginTop: '7px' }} />
            <Menu
              mode="horizontal"
              className="ant-avatar-wrap"
            >
              <SubMenu title={<span className="ant-avatar-wraper"><Avatar src={avatar} className="ant-avatar" />{name}</span>}>
                {
                  //  <Menu.Item key="user">
                  //    <a href=""><Icon type="user" />用户中心</a>
                  //  </Menu.Item>
                }
                <Menu.Item key="logout">
                  <a href={LOG_OUT_URL}><Icon type="logout" />退出</a>
                </Menu.Item>
              </SubMenu>
            </Menu>

          </Header>
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '12px 0' }} routes={routes} itemRender={itemRender} />
            <div style={{ padding: 24, background: '#fff', minHeight: 360, overflow: 'auto', flex: 1 }}>
              {
                this.props.children
              }
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            ©2017 贝壳金控提供技术支持
          </Footer>
        </Layout>
        {
          loading && <div className="ant-layout-loading">
            <div className="ant-layout-loading-wrap">
              <Spin size="large"/>
            </div>
          </div>
         }
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return {
    toast: state.get('toast'),
    routing: state.get('routing'),
    app: state.get('app')
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    appActions: bindActionCreators(appActions, dispatch)
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(App);
