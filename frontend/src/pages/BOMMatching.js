import React, { useState } from 'react';
import { Card, Table, Button, Upload, message, Tag, Row, Col, Progress, List, Space, Badge } from 'antd';
import { UploadOutlined, ThunderboltOutlined, ShoppingCartOutlined } from '@ant-design/icons';

const BOMMatching = () => {
  const [loading, setLoading] = useState(false);
  const [matchResults, setMatchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const columns = [
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      render: (priority) => {
        const color = priority === 1 ? 'red' : priority === 2 ? 'orange' : 'blue';
        return <Badge count={priority} style={{ backgroundColor: color }} />;
      },
    },
    {
      title: '成品编号',
      dataIndex: 'product_code',
      key: 'product_code',
    },
    {
      title: '成品名称',
      dataIndex: 'product_name',
      key: 'product_name',
    },
    {
      title: '消耗呆滞料',
      dataIndex: 'stagnant_consumed',
      key: 'stagnant_consumed',
      render: (items) => items.join(', '),
    },
    {
      title: '清理价值',
      dataIndex: 'stagnant_value_cleared',
      key: 'stagnant_value_cleared',
      render: (val) => `¥${val?.toLocaleString()}`,
    },
    {
      title: '可生产数量',
      dataIndex: 'producible_quantity',
      key: 'producible_quantity',
    },
    {
      title: '预估利润',
      dataIndex: 'profit_estimate',
      key: 'profit_estimate',
      render: (val) => <span style={{ color: 'green' }}>¥{val?.toLocaleString()}</span>,
    },
    {
      title: '缺料情况',
      dataIndex: 'missing_materials',
      key: 'missing_materials',
      render: (items) => {
        if (!items || items.length === 0) {
          return <Tag color="green">无缺料</Tag>;
        }
        return <Tag color="red">缺料{items.length}项</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" size="small">查看详情</Button>
          <Button type="primary" size="small" icon={<ShoppingCartOutlined />}>
            生产
          </Button>
        </Space>
      ),
    },
  ];

  const mockMatchResults = [
    {
      key: '1',
      priority: 1,
      product_code: 'FG001',
      product_name: '成品A',
      stagnant_consumed: ['RM001', 'RM003'],
      stagnant_value_cleared: 80000,
      producible_quantity: 100,
      profit_estimate: 120000,
      missing_materials: [],
    },
    {
      key: '2',
      priority: 2,
      product_code: 'FG002',
      product_name: '成品B',
      stagnant_consumed: ['RM002'],
      stagnant_value_cleared: 30000,
      producible_quantity: 50,
      profit_estimate: 45000,
      missing_materials: ['RM010'],
    },
    {
      key: '3',
      priority: 3,
      product_code: 'FG003',
      product_name: '成品C',
      stagnant_consumed: ['RM004', 'RM005'],
      stagnant_value_cleared: 55000,
      producible_quantity: 75,
      profit_estimate: 68000,
      missing_materials: [],
    },
  ];

  const handleMatch = () => {
    setLoading(true);
    message.loading('正在进行BOM匹配分析...');
    setTimeout(() => {
      setLoading(false);
      setMatchResults(mockMatchResults);
      setSuggestions([
        {
          title: '最优方案',
          description: '生产100件成品A，可消耗80%呆滞料，预计利润12万元',
          type: 'success',
        },
        {
          title: '次优方案',
          description: '同时生产成品A和B，需少量采购，但可完全清理呆滞库存',
          type: 'warning',
        },
      ]);
      message.success('BOM匹配完成！找到3个可行方案');
    }, 2000);
  };

  const uploadProps = {
    accept: '.xlsx,.xls',
    showUploadList: false,
    customRequest: ({ onSuccess }) => {
      setTimeout(() => onSuccess("ok"), 0);
    },
    onChange: (info) => {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`);
      }
    },
  };

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Progress
              type="circle"
              percent={75}
              format={() => '75%'}
              strokeColor="#52c41a"
            />
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <h4>呆滞料匹配率</h4>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Progress
              type="circle"
              percent={60}
              format={() => '¥23万'}
              strokeColor="#1890ff"
            />
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <h4>可清理价值</h4>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Progress
              type="circle"
              percent={85}
              format={() => '85%'}
              strokeColor="#faad14"
            />
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <h4>预期利润率</h4>
            </div>
          </Card>
        </Col>
      </Row>

      <Card
        title="BOM智能匹配"
        extra={
          <Space>
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>上传呆滞料清单</Button>
            </Upload>
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>上传BOM数据</Button>
            </Upload>
            <Button type="primary" icon={<ThunderboltOutlined />} onClick={handleMatch}>
              开始匹配
            </Button>
          </Space>
        }
      >
        {suggestions.length > 0 && (
          <List
            header={<h4>匹配建议</h4>}
            bordered
            dataSource={suggestions}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={<Tag color={item.type === 'success' ? 'green' : 'orange'}>{item.title}</Tag>}
                  description={item.description}
                />
              </List.Item>
            )}
            style={{ marginBottom: 24 }}
          />
        )}

        <Table
          columns={columns}
          dataSource={matchResults}
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 个匹配方案`,
          }}
        />
      </Card>
    </div>
  );
};

export default BOMMatching;