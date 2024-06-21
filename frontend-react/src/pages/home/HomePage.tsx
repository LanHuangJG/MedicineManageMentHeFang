import React, {useEffect, useState} from "react";
import {
    Button,
    ConfigProvider,
    DatePicker,
    Flex,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    Segmented,
    Space,
    Table
} from "antd";
import locale from "antd/locale/zh_CN";
import dayjs from 'dayjs';
import {Pie} from '@ant-design/charts';
import 'dayjs/locale/zh-cn';
import axios from "axios";
import {EditOutlined, ForkOutlined, PieChartOutlined, TableOutlined} from "@ant-design/icons";
import {ColumnsType} from "antd/es/table";

const HomePage = () => {
    type Restock = {
        id?: string;
        name?: string;
        dosage?: string;
        usage?: string;
        stock?: string;
        factory?: string;
        purchasePrice?: string;
        sellingPrice?: string;
        purchaseDate?: string;
    };

    const [dataSource, setDataSource] = useState<Restock[]>([]);
    useEffect(() => {
        axios.get("/api/restock/list").then(r => {
            //给数据加上key就是他的id
            const data = r.data.restocks.map((item: Restock, index: number) => {
                return {
                    ...item,
                    key: index
                }
            })
            //设置日期格式
            data.forEach((item: Restock) => {
                item.purchaseDate = dayjs(item.purchaseDate).format("YYYY/MM/DD")
            })
            setChartData(data.map((item: Restock) => {
                    return {
                        type: item.name,
                        value: parseInt(item.stock)
                    }
                }
            ))
            setDataSource(data)
        })
    }, []);
    const [messageApi, contextHolder] = message.useMessage();
    const columns: ColumnsType<Restock> = [
        {
            title: '药品id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '药品名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '剂量',
            dataIndex: 'dosage',
            key: 'dosage',
        },
        {
            title: '用法',
            dataIndex: 'usage',
            key: 'usage',
        },
        {
            title: '存量',
            dataIndex: 'stock',
            key: 'stock',
        },
        {
            title: '厂家',
            dataIndex: 'factory',
            key: 'factory',
        },
        {
            title: '进价',
            dataIndex: 'purchasePrice',
            key: 'purchasePrice',
        },
        {
            title: '售价',
            dataIndex: 'sellingPrice',
            key: 'sellingPrice',
        },
        {
            title: '进货日期',
            dataIndex: 'purchaseDate',
            key: 'purchaseDate',
        },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 100,
            render: (record: Restock) => (
                <Space size="middle">
                    <Button type="primary" icon={<EditOutlined/>} onClick={() => {
                        editForm.setFieldValue("name", record.name)
                        editForm.setFieldValue("dosage", record.dosage)
                        editForm.setFieldValue("usage", record.usage)
                        editForm.setFieldValue("stock", record.stock)
                        editForm.setFieldValue("factory", record.factory)
                        editForm.setFieldValue("purchasePrice", record.purchasePrice)
                        editForm.setFieldValue("sellingPrice", record.sellingPrice)
                        editForm.setFieldValue("purchaseDate", dayjs(record.purchaseDate))
                        setId(record.id)
                        setEditOpen(true);
                    }}>
                        编辑
                    </Button>
                </Space>
            ),
        },
    ];
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [dataType, setDataType] = useState("table");
    const [id, setId] = useState("");
    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        const data = form.getFieldsValue();
        data.purchaseDate = dayjs(data.purchaseDate).format("YYYY/MM/DD")
        axios.post("/api/restock/add", data).then(r => {
            if (r.data.code !== "200") {
                messageApi.open({
                    type: 'error',
                    content: '进货失败,请检查数据是否正确',
                }).then(r => {
                    console.log(r);
                });
            } else {
                messageApi.open({
                    type: 'success',
                    content: '进货成功',
                }).then(r => {
                    console.log(r);
                });
                setDataSource([...dataSource, form.getFieldsValue()])
            }
        })
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };
    type FieldType = {
        name?: string;
        dosage?: string;
        usage?: string;
        stock?: string;
        factory?: string;
        purchasePrice?: string;
        sellingPrice?: string;
        purchaseDate?: string;
    };
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const handleEditOk = () => {
        //带上id
        const data: Restock = {
            ...editForm.getFieldsValue(),
            id,
        }
        //修改日期格式
        data.purchaseDate = dayjs(data.purchaseDate).format("YYYY/MM/DD")
        axios.post("/api/restock/update", data).then(r => {
            if (r.data.code !== "200") {
                messageApi.open({
                    type: 'error',
                    content: '编辑失败,请检查数据是否正确',
                }).then(r => {
                    console.log(r);
                });
            } else {
                messageApi.open({
                    type: 'success',
                    content: '编辑成功',
                }).then(r => {
                    console.log(r);

                });
                const index = dataSource.findIndex(item => item.id === id);
                //添加key
                const newData = {
                    ...data,
                    key: index
                }
                //修改日期为yyy/mm/dd格式
                newData.purchaseDate = dayjs(newData.purchaseDate).format("YYYY/MM/DD")
                //替换
                dataSource.splice(index, 1, newData)
                setDataSource([...dataSource])
                setEditOpen(false);
            }
        })
    };
    dayjs.locale('zh-cn');
    const data: ChartData[] = [
        {type: '分类一', value: 27},
        {type: '分类二', value: 25},
        {type: '分类三', value: 18},
        {type: '分类四', value: 15},
        {type: '分类五', value: 10},
        {type: '其他', value: 5},
    ];
    const [chartData, setChartData] = useState<ChartData[]>(data);
    type ChartData = {
        type: string;
        value: number;
    }
    const config = {
        data: chartData,
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,
        label: {
            text: (d: ChartData) => `${d.type} ${d.value}`,
            position: 'spider',
        },
        legend: {
            color: {
                title: false,
                position: 'left',
                rowPadding: 5,
            },
        },
        interactions: [
            {
                type: 'element-active',
            },
        ],
    };
    return (
        <ConfigProvider locale={locale}>
            {contextHolder}
            <Modal
                title="药品进货"
                centered={true}
                open={open}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form
                    name="basic"
                    labelCol={{span: 4}}
                    form={form}
                    wrapperCol={{span: 24}}
                    style={{maxWidth: 600}}
                    initialValues={{remember: true}}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        name="name"
                        label={"药品名"}
                        labelAlign={"left"}
                        rules={[{required: true, message: '药品名不能为空'}]}
                    >
                        <Input placeholder="请输入药品名" size={"large"} allowClear
                               autoComplete="off"
                        />
                    </Form.Item>
                    <Form.Item<FieldType>
                        name="dosage"
                        labelAlign={"left"}
                        label={"药品剂量"}
                        rules={[{required: true, message: '药品剂量不能为空'}]}
                    >
                        <Input placeholder="请输入药品剂量" size={"large"} allowClear
                               autoComplete="off"
                        />
                    </Form.Item>
                    <Form.Item<FieldType>
                        name="usage"
                        labelAlign={"left"}
                        label={"药品用法"}
                        rules={[{required: true, message: '药品用法不能为空'}]}
                    >
                        <Input placeholder="请输入药品用法" size={"large"}
                               autoComplete="off"
                               allowClear/>

                    </Form.Item>
                    <Form.Item<FieldType>
                        name="stock"
                        labelAlign={"left"}
                        label={"药品存量"}
                        rules={[{required: true, message: '药品存量不能为空'}]}
                    >
                        <InputNumber placeholder="请输入药品存量" size={"large"} className={"w-full"}/>

                    </Form.Item>
                    <Form.Item<FieldType>
                        name="factory"
                        labelAlign={"left"}
                        label={"生产厂家"}
                        rules={[{required: true, message: '生产厂家不能为空'}]}
                    >
                        <Input placeholder="请输入生产厂家" size={"large"} allowClear
                               autoComplete="off"
                        />
                    </Form.Item>
                    <Form.Item<FieldType>
                        name="purchasePrice"
                        labelAlign={"left"}
                        label={"进货价格"}
                        rules={[{required: true, message: '进货价格不能为空'}]}
                    >
                        <InputNumber placeholder="请输入进货价格" size={"large"} className={"w-full"}/>
                    </Form.Item>
                    <Form.Item<FieldType>
                        name="sellingPrice"
                        labelAlign={"left"}
                        label={"售价"}
                        rules={[{required: true, message: '售价不能为空'}]}
                    >
                        <InputNumber placeholder="请输入售价" size={"large"} className={"w-full"}/>
                    </Form.Item>
                    <Form.Item<FieldType>
                        name="purchaseDate"
                        labelAlign={"left"}
                        label={"进货日期"}
                        rules={[{required: true, message: '进货日期不能为空'}]}
                    >
                        <DatePicker className={"w-full"}/>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="药品编辑"
                centered={true}
                open={editOpen}
                onOk={handleEditOk}
                onCancel={() => setEditOpen(false)}
            >
                {contextHolder}
                <Form
                    name="basic"
                    labelCol={{span: 4}}
                    form={editForm}
                    wrapperCol={{span: 24}}
                    style={{maxWidth: 600}}
                    initialValues={{remember: true}}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        name="name"
                        label={"药品名"}
                        labelAlign={"left"}
                        rules={[{required: true, message: '药品名不能为空'}]}
                    >
                        <Input placeholder="请输入药品名" size={"large"} allowClear
                               autoComplete="off"
                        />
                    </Form.Item>
                    <Form.Item<FieldType>
                        name="dosage"
                        labelAlign={"left"}
                        label={"药品剂量"}
                        rules={[{required: true, message: '药品剂量不能为空'}]}
                    >
                        <Input placeholder="请输入药品剂量" size={"large"} allowClear
                               autoComplete="off"
                        />
                    </Form.Item>
                    <Form.Item<FieldType>
                        name="usage"
                        labelAlign={"left"}
                        label={"药品用法"}
                        rules={[{required: true, message: '药品用法不能为空'}]}
                    >
                        <Input placeholder="请输入药品用法" size={"large"}
                               autoComplete="off"
                               allowClear/>

                    </Form.Item>
                    <Form.Item<FieldType>
                        name="stock"
                        labelAlign={"left"}
                        label={"药品存量"}
                        rules={[{required: true, message: '药品存量不能为空'}]}
                    >
                        <InputNumber placeholder="请输入药品存量" size={"large"} className={"w-full"}/>

                    </Form.Item>
                    <Form.Item<FieldType>
                        name="factory"
                        labelAlign={"left"}
                        label={"生产厂家"}
                        rules={[{required: true, message: '生产厂家不能为空'}]}
                    >
                        <Input placeholder="请输入生产厂家" size={"large"} allowClear
                               autoComplete="off"
                        />
                    </Form.Item>
                    <Form.Item<FieldType>
                        name="purchasePrice"
                        labelAlign={"left"}
                        label={"进货价格"}
                        rules={[{required: true, message: '进货价格不能为空'}]}
                    >
                        <InputNumber placeholder="请输入进货价格" size={"large"} className={"w-full"}/>
                    </Form.Item>
                    <Form.Item<FieldType>
                        name="sellingPrice"
                        labelAlign={"left"}
                        label={"售价"}
                        rules={[{required: true, message: '售价不能为空'}]}
                    >
                        <InputNumber placeholder="请输入售价" size={"large"} className={"w-full"}/>
                    </Form.Item>
                    <Form.Item<FieldType>
                        name="purchaseDate"
                        labelAlign={"left"}
                        label={"进货日期"}
                        rules={[{required: true, message: '进货日期不能为空'}]}
                    >
                        <DatePicker className={"w-full"} format={"YYYY/MM/DD"}/>
                    </Form.Item>
                </Form>
            </Modal>

            <Flex className={"mb-2"} justify={"space-between"}>
                {
                    dataType === "table" &&
                    <Button type="primary" onClick={showModal} icon={<ForkOutlined/>}>进货</Button>
                }
                <div/>
                <Segmented<string>
                    size={"large"}
                    options={[{label: '表格', value: 'table', icon: <TableOutlined/>},
                        {label: '图表', value: 'chart', icon: <PieChartOutlined/>}]}
                    onChange={(value) => {
                        setDataType(value);
                    }}
                />
            </Flex>
            {
                dataType === "table" ? <Table dataSource={dataSource} columns={columns} bordered/> :
                    <>
                        <Pie {...config} />
                    </>
            }
        </ConfigProvider>
    )
}

export default HomePage;