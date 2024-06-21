import {Button, Card, Flex, Form, Input, Layout, notification} from "antd";
import {Header} from "antd/lib/layout/layout";
import {LockOutlined, LoginOutlined, MedicineBoxTwoTone, UserOutlined} from "@ant-design/icons";
import {Content} from "antd/es/layout/layout";
import React from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
    type FieldType = {
        username?: string;
        password?: string;
    };
    const onFinish = (values: FieldType) => {
        axios.post("/api/auth/login", values).then(r => {
            if (r.data.code !== "200") {
                api.error({
                    message: `提示`,
                    description: '登录失败,请检查账号密码是否正确',
                    placement: 'topRight',
                });
            } else {
                navigate("/", {
                    replace: true
                })
            }
        })
    };
    const [api, contextHolder] = notification.useNotification();

    const navigate = useNavigate()
    return <>
        {contextHolder}
        <Layout className={"h-full"}>
            <Header className="bg-zinc-50 px-8">
                <Flex vertical={false} align={"center"} className={"h-full"}>
                    <MedicineBoxTwoTone className={"text-xl mr-4"}/>
                    <p className={"text-base"}>药品管理系统</p>
                </Flex>
            </Header>
            <Content className={"h-full"}>
                <Flex justify={"center"} align={"center"} className={"h-full"}>
                    <Card title="登录" style={{width: 500}}>
                        <Form
                            name="basic"
                            labelCol={{span: 4}}
                            wrapperCol={{span: 24}}
                            style={{maxWidth: 600}}
                            initialValues={{remember: true}}
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item<FieldType>
                                name="username"
                                rules={[{required: true, message: '用户名不能为空'}]}
                            >
                                <Input placeholder="请输入账号" addonBefore={<UserOutlined/>} size={"large"} allowClear
                                       autoComplete="off"
                                />
                            </Form.Item>

                            <Form.Item<FieldType>
                                name="password"
                                rules={[{required: true, message: '密码不能为空'}]}
                            >
                                <Input.Password placeholder="请输密码" addonBefore={<LockOutlined/>} size={"large"}
                                                autoComplete="off"
                                                allowClear/>

                            </Form.Item>

                            <Form.Item wrapperCol={{span: 24}}>
                                <Button type="primary" icon={<LoginOutlined/>} block htmlType={"submit"}>
                                    登录
                                </Button>
                            </Form.Item>
                            <Form.Item wrapperCol={{span: 24}}>
                                <Link to={`/register`} replace={true}>
                                    <Button type="link" block>还没有账号?</Button>
                                </Link>
                            </Form.Item>
                        </Form>
                    </Card>
                </Flex>
            </Content>
        </Layout>

    </>
}
export default LoginPage;