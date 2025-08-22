import React, { useState } from 'react';
import { Card, Table, Button, Input, Form, Modal, Row, Col, Statistic, Progress, message } from 'antd';
import { PlusOutlined, EditOutlined, BarChartOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';

const CostAnalysis = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [costData, setCostData] = useState([
    {
      key: '1',
      product_code: 'FG001',
      product_name: '成品A',
      bom_material_cost: 80,
      bom_labor_cost: 30,
      bom_overhead_cost: 20,
      bom_total_cost: 130,
      actual_material_cost: 85,
      actual_labor_cost: 35,
      actual_overhead_cost: 25,
      actual_total_cost: 145,
      variance: 15,
      variance_rate: 11.5,
    },
    {
      key: '2',
      product_code: 'FG002',
      product_name: '成品B',
      bom_material_cost: 60,
      bom_labor_cost: 25,
      bom_overhead_cost: 15,
      bom_total_cost: 100,
      actual_material_cost: 58,
      actual_labor_cost: 28,
      actual_overhead_cost: 18,
      actual_total_cost: 104,
      variance: 4,
      variance_rate: 4.0,
    },
  ]);

  const columns = [
    {
      title: '产品编号',
      dataIndex: 'product_code',
      key: 'product_code',
      fixed: 'left',
    },
    {
      title: '产品名称',
      dataIndex: 'product_name',
      key: 'product_name',
    },
    {
      title: 'BOM成本',
      children: [
        {
          title: '材料',
          dataIndex: 'bom_material_cost',
          key: 'bom_material_cost',
          render: (val) => `¥${val}`,
        },
        {
          title: '人工',
          dataIndex: 'bom_labor_cost',
          key: 'bom_labor_cost',
          render: (val) => `¥${val}`,
        },
        {
          title: '制费',
          dataIndex: 'bom_overhead_cost',
          key: 'bom_overhead_cost',
          render: (val) => `¥${val}`,
        },
        {
          title: '合计',
          dataIndex: 'bom_total_cost',
          key: 'bom_total_cost',
          render: (val) => <strong>¥{val}</strong>,
        },
      ],
    },
    {
      title: '实际成本',
      children: [
        {
          title: '材料',
          dataIndex: 'actual_material_cost',
          key: 'actual_material_cost',
          render: (val) => `¥${val}`,
        },
        {
          title: '人工',
          dataIndex: 'actual_labor_cost',
          key: 'actual_labor_cost',
          render: (val) => `¥${val}`,
        },
        {
          title: '制费',
          dataIndex: 'actual_overhead_cost',
          key: 'actual_overhead_cost',
          render: (val) => `¥${val}`,
        },
        {
          title: '合计',
          dataIndex: 'actual_total_cost',
          key: 'actual_total_cost',
          render: (val) => <strong>¥{val}</strong>,
        },
      ],
    },
    {
      title: '差异',
      dataIndex: 'variance',
      key: 'variance',
      render: (val) => (
        <span style={{ color: val > 0 ? '#cf1322' : '#3f8600' }}>
          {val > 0 ? '+' : ''}¥{val}
        </span>
      ),
    },
    {
      title: '差异率',
      dataIndex: 'variance_rate',
      key: 'variance_rate',
      render: (val) => (
        <span style={{ color: val > 10 ? '#cf1322' : val > 5 ? '#faad14' : '#3f8600' }}>
          {val > 0 ? '+' : ''}{val}%
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => showModal(record)}
        >
          编辑
        </Button>
      ),
    },
  ];

  const showModal = (record) => {
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      message.success('成本数据更新成功');
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const getCostComparisonChart = () => {
    return {
      title: {
        text: '成本结构对比',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: ['BOM成本', '实际成本'],
        top: 30,
      },
      xAxis: {
        type: 'category',
        data: costData.map(item => item.product_code),
      },
      yAxis: {
        type: 'value',
        name: '成本(元)',
      },
      series: [
        {
          name: 'BOM成本',
          type: 'bar',
          data: costData.map(item => item.bom_total_cost),
          itemStyle: {
            color: '#5470c6',
          },
        },
        {
          name: '实际成本',
          type: 'bar',
          data: costData.map(item => item.actual_total_cost),
          itemStyle: {
            color: '#fc8452',
          },
        },
      ],
    };
  };

  const getCostStructureChart = () => {
    return {
      title: {
        text: '成本结构饼图',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 10,
        data: ['材料成本', '人工成本', '制造费用'],
      },
      series: [
        {
          name: '成本构成',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 143, name: '材料成本' },
            { value: 63, name: '人工成本' },
            { value: 43, name: '制造费用' },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
  };

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="总产品数" value={costData.length} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均差异率"
              value={7.75}
              suffix="%"
              precision={2}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="超差产品"
              value={1}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="成本控制率"
              value={50}
              suffix="%"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card title="成本对比分析">
            <ReactECharts option={getCostComparisonChart()} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="整体成本结构">
            <ReactECharts option={getCostStructureChart()} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      <Card
        title="成本差异分析"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            录入实际成本
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={costData}
          scroll={{ x: 1200 }}
          pagination={false}
        />
      </Card>

      <Modal
        title="录入/编辑实际成本"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="product_code" label="产品编号">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="product_name" label="产品名称">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="actual_material_cost"
                label="实际材料成本"
                rules={[{ required: true, message: '请输入材料成本' }]}
              >
                <Input prefix="¥" type="number" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="actual_labor_cost"
                label="实际人工成本"
                rules={[{ required: true, message: '请输入人工成本' }]}
              >
                <Input prefix="¥" type="number" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="actual_overhead_cost"
                label="实际制造费用"
                rules={[{ required: true, message: '请输入制造费用' }]}
              >
                <Input prefix="¥" type="number" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default CostAnalysis;