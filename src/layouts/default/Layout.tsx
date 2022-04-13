import styles from './Layout.module.scss'
import { FunctionComponent, useEffect, useState } from 'react';

import { Layout, Nav, Button, Breadcrumb, Avatar, Dropdown } from '@douyinfe/semi-ui';
import { IconBell, IconMoon, IconGithubLogo, IconLanguage, IconSun } from '@douyinfe/semi-icons';

import { routes, RouteType } from '@/routes';
import { useRouter } from 'next/router';
import { useAppContext } from '@/provider/app.provider';
import Head from 'next/head';

export const siteTitle = 'Next.js Sample Website'

type LayoutProps = {
  title?: string;
}

export const ProLayout: FunctionComponent<LayoutProps> = function ({children, ...props}) {
  const router = useRouter();
  const [defaultSelectedKeys, setSelectedKeys] = useState([]);
  const appContext = useAppContext();

  useEffect(() => {
    // console.log('#router', router);
    setSelectedKeys([router.pathname]);
  }, []);

  /**
   * 生成导航菜单项
   * @param routes
   * @param parent
   */
  function createNavItems(routes: RouteType[], parent?: RouteType) {
    return routes?.map((route) => {
      return {
        // itemKey: route.id,
        itemKey: `${(parent && parent.path) || ''}/${route.path}`.replace('//', '/'),
        text: route.name,
        icon: route.icon,
        items: createNavItems(route.children, route),
      }
    });
  }

  /**
   * 切换菜单
   * @param item
   */
  async function onSelectItem(item) {
    await router.push(item.itemKey);
    // console.log('#onSelectItem', item);
    setSelectedKeys(item.selectedKeys);
  }

  /**
   * 退出
   */
  async function onLogout() {
    await router.replace('/login');
  }

  const {Header, Footer, Sider, Content} = Layout;
  return (
    <Layout className={styles.layout}>
      <Head>
        {props.title && <title>{props.title}</title>}
      </Head>
      <Sider className={styles.sidebar}>
        <Nav
          defaultSelectedKeys={defaultSelectedKeys}
          className={styles.nav}
          items={createNavItems(routes)}
          header={{
            logo: <img src="//lf1-cdn-tos.bytescm.com/obj/ttfe/ies/semi/webcast_logo.svg"/>,
            text: 'Next Admin',
            link: '/'
          }}
          footer={{
            collapseButton: true,
          }}
          onSelect={onSelectItem}
        />
      </Sider>
      <Layout>
        <Header className={styles.header}>
          <Nav
            mode="horizontal"
            footer={
              <>
                <Button
                  theme="borderless"
                  icon={<IconBell size="large"/>}
                  style={{
                    color: 'var(--semi-color-text-2)',
                    marginRight: '12px',
                  }}
                />
                <Button
                  theme="borderless"
                  icon={appContext.themeMode === 'dark' ? <IconSun size="large"/> : <IconMoon size="large"/>}
                  style={{
                    color: 'var(--semi-color-text-2)',
                    marginRight: '12px',
                  }}
                  onClick={() => appContext.updateThemeMode(appContext.themeMode === 'dark' ? 'light' : 'dark')}
                />
                <Button
                  theme="borderless"
                  icon={<IconLanguage size="large" />}
                  style={{
                    color: 'var(--semi-color-text-2)',
                    marginRight: '12px',
                  }}
                  onClick={() => appContext.updateLanguage(appContext.language.code.toLowerCase().startsWith('zh') ? 'en_US' : 'zh_CN')}
                >{appContext.language.code.slice(0, 2).toUpperCase()}</Button>
                <Dropdown
                  trigger={'click'}
                  position={'bottomLeft'}
                  render={
                    <Dropdown.Menu>
                      <Dropdown.Item>账号信息</Dropdown.Item>
                      <Dropdown.Item>设置</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={onLogout}>退出</Dropdown.Item>
                    </Dropdown.Menu>
                  }
                >

                  <Avatar color="orange" size="small">
                    YJ
                  </Avatar>
                </Dropdown>
              </>
            }
          />
        </Header>
        <Content className={styles.content}>
          <Breadcrumb
            aria-label='breadcrumb'
            style={{
              marginBottom: '24px',
            }}
            routes={['首页', '当这个页面标题很长时需要省略', '上一页', '详情页']}
          />
          <div
            style={{
              borderRadius: '10px',
              border: '1px solid var(--semi-color-border)',
              padding: '32px',
            }}
          >
            {children}
          </div>
        </Content>
        <Footer className={styles.footer}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'center'
            }}
          >
              <IconGithubLogo size="large" style={{marginRight: '8px'}}/>
              <span>Copyright © 2022 Anguer. All Rights Reserved. </span>
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};