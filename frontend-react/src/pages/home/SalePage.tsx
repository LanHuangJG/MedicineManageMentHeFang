import React, {useEffect, useState} from "react";
import {
    Button,
    ConfigProvider,
    DatePicker,
    Flex,
    Form,
    InputNumber,
    message,
    Modal,
    Segmented,
    Select,
    Space,
    Table
} from "antd";
import locale from "antd/locale/zh_CN";
import dayjs from 'dayjs';
import {Pie} from '@ant-design/charts';
import 'dayjs/locale/zh-cn';
import axios from "axios";
import {EditOutlined, ExportOutlined, PieChartOutlined, TableOutlined} from "@ant-design/icons";
import {ColumnsType} from "antd/es/table";

const SalePage = () => {
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
    type Sale = {
        id: string,
        rid: string;
        saleVolume: string;
        saleDate: string;
        restock?: Restock;
    }
    const [dataSource, setDataSource] = useState<Restock[]>([]);
    useEffect(() => {
        axios.get("/api/sale/list").then(r => {
            //给数据加上key就是他的id
            const data = r.data.sales.map((item: Sale) => {
                return {
                    ...item,
                    key: item.id
                }
            })
            data.forEach((item: Sale) => {
                item.saleDate = dayjs(item.saleDate).format("YYYY/MM/DD")
            })
            setChartData(data.map((item: Sale) => {
                    return {
                        type: item.restock.name,
                        value: parseInt(item.saleVolume)
                    }
                }
            ))
            setSaleSelectData(
                data.map((item: Sale) => {
                    return {
                        label: item.restock.name,
                        value: item.id
                    }
                })
            )
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
            dataIndex: 'restock',
            key: 'restock',
            render: (restock: Restock) => (
                <span>{restock.name}</span>
            )
        },
        {
            title: '出货数量',
            dataIndex: 'saleVolume',
            key: 'saleVolume',
        },
        {
            title: '剂量',
            dataIndex: 'restock',
            key: 'restock',
            render: (restock: Restock) => (
                <span>{restock.dosage}</span>
            )
        },
        {
            title: '用法',
            dataIndex: 'restock',
            key: 'restock',
            render: (restock: Restock) => (
                <span>{restock.usage}</span>
            )
        },
        {
            title: '生产厂家',
            dataIndex: 'restock',
            key: 'restock',
            render: (restock: Restock) => (
                <span>{restock.factory}</span>
            )
        },
        {
            title: '购买单价',
            dataIndex: 'restock',
            key: 'restock',
            render: (restock: Restock) => (
                <span>{restock.sellingPrice}</span>
            )
        },
        {
            title: '出货日期',
            dataIndex: 'saleDate',
            key: 'saleDate',
        },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 100,
            render: (record: Sale) => (
                <Space size="middle">
                    <Button type="primary" icon={<EditOutlined/>} onClick={() => {

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
        data.saleDate = dayjs(data.saleDate).format("YYYY/MM/DD")
        axios.post("/api/sale/add", data).then(r => {
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
    type SaleType = {
        rid?: string;
        saleVolume?: string;
        saleDate?: string;
    };
    type EditType = {
        saleDate?: string;
    };
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const handleEditOk = () => {
        const data: Restock = {
            ...editForm.getFieldsValue(),
            id,
        }
        //修改日期格式
        data.purchaseDate = dayjs(data.purchaseDate).format("YYYY/MM/DD")
        axios.post("/api/sale/update", data).then(r => {
            if (r.data.code !== "200") {
                messageApi.open({
                    type: 'error',
                    content: '编辑失败',
                }).then(r => {
                    console.log(r);
                });
            } else {
                messageApi.open({
                    type: 'success',
                    content: '编辑成功!',
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
    const [saleSelectData, setSaleSelectData] = useState<SelectData[]>([]);
    type ChartData = {
        type: string;
        value: number;
    }
    type SelectData = {
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
    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
    };
    return (
        <ConfigProvider locale={locale}>
            <Modal
                title="药品出货"
                centered={true}
                open={open}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                {contextHolder}
                <Form
                    name="basic"
                    labelCol={{span: 4}}
                    form={form}
                    wrapperCol={{span: 24}}
                    style={{maxWidth: 600}}
                    initialValues={{remember: true}}
                    autoComplete="off"
                >
                    <Form.Item<SaleType>
                        name="rid"
                        label={"药品名"}
                        labelAlign={"left"}
                        rules={[{required: true, message: '药品名不能为空'}]}
                    >
                        <Select
                            placeholder={"请选择药品"}
                            className={"w-full"}
                            onChange={handleChange}
                            options={saleSelectData}
                        />
                    </Form.Item>
                    <Form.Item<SaleType>
                        name="saleVolume"
                        labelAlign={"left"}
                        label={"出货数量"}
                        rules={[{required: true, message: '出货数量不能为空'}]}
                    >
                        <InputNumber placeholder="请输入出货数量" size={"large"} className={"w-full"}/>

                    </Form.Item>
                    <Form.Item<SaleType>
                        name="saleDate"
                        labelAlign={"left"}
                        label={"出货日期"}
                        rules={[{required: true, message: '出货日期不能为空'}]}
                    >
                        <DatePicker className={"w-full"} format={"YYYY/MM/DD"}/>
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
                    <Form.Item<EditType>
                        name="saleDate"
                        labelAlign={"left"}
                        label={"出货日期"}
                        rules={[{required: true, message: '出货日期不能为空'}]}
                    >
                        <DatePicker className={"w-full"} format={"YYYY/MM/DD"}/>
                    </Form.Item>
                </Form>
            </Modal>

            <Flex className={"mb-2"} justify={"space-between"}>
                {
                    dataType === "table" &&
                    <Button type="primary" onClick={showModal} icon={<ExportOutlined/>}>出货</Button>
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

export default SalePage;