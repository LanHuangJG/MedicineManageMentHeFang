import {Button, Card, Flex, Form, Input, Layout, notification} from "antd";
import {Header} from "antd/lib/layout/layout";
import {LockOutlined, LoginOutlined, MailOutlined, MedicineBoxTwoTone, UserOutlined} from "@ant-design/icons";
import {Content} from "antd/es/layout/layout";
import {Link} from "react-router-dom";
import React from "react";
import axios from "axios";

const RegisterPage = () => {
    type FieldType = {
        username?: string;
        email?: string;
        password?: string;
    };
    const onFinish = (values: FieldType) => {
        axios.post("/api/auth/register", values).then(r => {
            if (r.data.code !== "200") {
                api.error({
                    message: `提示`,
                    description: '注册失败,请检查用户是否已存在',
                    placement: 'topRight',
                });
            } else {
                api.success({
                    message: `提示`,
                    description: "注册成功",
                    placement: "topRight",
                });
            }
        })
    };
    const [api, contextHolder] = notification.useNotification();
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
                    <Card title="注册" style={{width: 500}}>
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
                                       autoComplete={"username"}
                                />
                            </Form.Item>
                            <Form.Item<FieldType>
                                name="email"
                                rules={[{required: true, message: '邮箱不能为空'}]}
                            >
                                <Input placeholder="请输入邮箱" addonBefore={<MailOutlined/>} size={"large"} allowClear
                                       autoComplete={"email"}
                                />
                            </Form.Item>
                            <Form.Item<FieldType>
                                name="password"
                                rules={[{required: true, message: '密码不能为空'}]}
                            >
                                <Input.Password placeholder="请输密码" addonBefore={<LockOutlined/>} size={"large"}
                                                autoComplete={"new-password"}
                                                allowClear/>

                            </Form.Item>

                            <Form.Item wrapperCol={{span: 24}}>
                                <Button type="primary" icon={<LoginOutlined/>} block htmlType={"submit"}>
                                    注册
                                </Button>
                            </Form.Item>
                            <Form.Item wrapperCol={{span: 24}}>
                                <Link to={`/login`} replace={true}>
                                    <Button type="link" block>已有账号?</Button>
                                </Link>
                            </Form.Item>
                        </Form>
                    </Card>
                </Flex>
            </Content>
        </Layout>
    </>

}
export default RegisterPage;