import React, {useState} from "react";
import {Avatar, Button, Dropdown, Flex, Layout, Menu, MenuProps, Space, theme} from "antd";
import {Header} from "antd/lib/layout/layout";
import {
    ExportOutlined,
    ForkOutlined,
    LogoutOutlined,
    MedicineBoxTwoTone,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined
} from "@ant-design/icons";
import {Content} from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";

const HomePage = () => {
    const [collapsed, setCollapsed] = useState(true);
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <Link to={`/login`}>
                    <Space>
                        <LogoutOutlined/>
                        <span>退出登录</span>
                    </Space>
                </Link>
            ),
        },
    ];
    const navigate = useNavigate()
    const location = useLocation()
    const onMenuClick = (key: string) => {
        navigate(key, {replace: true})
    }
    return <>
        <Layout className={"h-full"}>
            <Header className="bg-zinc-50 px-8">
                <Flex vertical={false} align={"center"} className={"h-full"}>
                    <MedicineBoxTwoTone className={"text-xl mr-4"}/>
                    <p className={"text-base"}>药品管理系统</p>
                    <div className={"flex-1"}/>
                    <Dropdown menu={{items}} placement="bottom">
                        <Avatar style={{ backgroundColor: '#5fa6ed' }} icon={<UserOutlined />} />
                    </Dropdown>
                </Flex>
            </Header>
            <Layout className={"h-full"}>
                <Sider trigger={null} collapsible collapsed={collapsed} style={{background: colorBgContainer}}>
                    <div className="demo-logo-vertical"/>
                    <Menu
                        theme="light"
                        mode="inline"
                        onClick={({key}) => onMenuClick(key.toString())}
                        defaultSelectedKeys={[location.pathname]}
                        items={[
                            {
                                key: '/',
                                icon: <ForkOutlined/>,
                                label: '药品进货',
                            },
                            {
                                key: '/sale',
                                icon: <ExportOutlined/>,
                                label: '药品出货',
                            }]
                        }
                    />
                </Sider>
                <Layout>
                    <Header style={{padding: 0, background: colorBgContainer}}>
                        <Flex vertical={false} align={"center"} className={"h-full"}>
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: '16px',
                                    width: 64,
                                    height: 64,
                                }}
                            />
                            <p className={"text-base"}>{
                                location.pathname === '/' ? '药品进货' : '药品出货'
                            }</p>
                        </Flex>
                    </Header>
                    <Content
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: 280,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Outlet/>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    </>
}
export default HomePage;