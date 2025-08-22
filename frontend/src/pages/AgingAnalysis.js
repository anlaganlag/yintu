import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Upload, message, Tag, Row, Col, Statistic, Space } from 'antd';
import { UploadOutlined, DownloadOutlined, WarningOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import axios from 'axios';

const AgingAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    normal: 0,
    warning: 0,
    stagnant: 0,
    critical: 0
  });

  const columns = [
    {
      title: '物料编号',
      dataIndex: 'item_code',
      key: 'item_code',
      fixed: 'left',
      width: 120,
    },
    {
      title: '物料名称',
      dataIndex: 'item_name',
      key: 'item_name',
      width: 200,
    },
    {
      title: '库存数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      align: 'right',
    },
    {
      title: '库存价值',
      dataIndex: 'value',
      key: 'value',
      width: 120,
      align: 'right',
      render: (val) => `¥${val?.toLocaleString() || 0}`,
    },
    {
      title: '库龄(天)',
      dataIndex: 'aging_days',
      key: 'aging_days',
      width: 100,
      align: 'center',
      sorter: (a, b) => a.aging_days - b.aging_days,
    },
    {
      title: '库龄状态',
      dataIndex: 'aging_status',
      key: 'aging_status',
      width: 100,
      render: (status) => {
        const colorMap = {
          '正常': 'green',
          '关注': 'orange',
          '呆滞': 'red',
          '严重呆滞': 'red',
        };
        return <Tag color={colorMap[status] || 'default'}>{status}</Tag>;
      },
    },
    {
      title: '仓库',
      dataIndex: 'warehouse',
      key: 'warehouse',
      width: 100,
    },
    {
      title: '建议操作',
      dataIndex: 'suggested_action',
      key: 'suggested_action',
      width: 120,
      render: (action) => {
        if (action === '生产成品') {
          return <Tag color="blue">生产成品</Tag>;
        } else if (action === '清理销毁') {
          return <Tag color="volcano">清理销毁</Tag>;
        }
        return action;
      },
    },
  ];

  const mockData = [
    {
      key: '1',
      item_code: 'RM001',
      item_name: '原材料A',
      quantity: 1000,
      value: 50000,
      aging_days: 120,
      aging_status: '呆滞',
      warehouse: 'SP01',
      suggested_action: '生产成品',
    },
    {
      key: '2',
      item_code: 'RM002',
      item_name: '原材料B',
      quantity: 500,
      value: 30000,
      aging_days: 200,
      aging_status: '严重呆滞',
      warehouse: 'SP02',
      suggested_action: '清理销毁',
    },
    {
      key: '3',
      item_code: 'RM003',
      item_name: '原材料C',
      quantity: 2000,
      value: 40000,
      aging_days: 45,
      aging_status: '关注',
      warehouse: 'SP01',
      suggested_action: '',
    },
  ];

  useEffect(() => {
    setTableData(mockData);
    setSummary({
      total: 3,
      normal: 0,
      warning: 1,
      stagnant: 1,
      critical: 1,
    });
  }, []);

  const getChartOption = () => {
    return {
      title: {
        text: '库龄分布图',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: ['数量', '价值'],
        top: 30,
      },
      xAxis: {
        type: 'category',
        data: ['0-30天', '30-90天', '90-180天', '>180天'],
      },
      yAxis: [
        {
          type: 'value',
          name: '数量',
          position: 'left',
        },
        {
          type: 'value',
          name: '价值(万元)',
          position: 'right',
        },
      ],
      series: [
        {
          name: '数量',
          type: 'bar',
          data: [2000, 3000, 1500, 500],
          itemStyle: {
            color: '#5470c6',
          },
        },
        {
          name: '价值',
          type: 'bar',
          yAxisIndex: 1,
          data: [50, 80, 60, 40],
          itemStyle: {
            color: '#91cc75',
          },
        },
      ],
    };
  };

  const handleUpload = async (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 文件上传成功`);
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        message.success('库龄分析完成');
      }, 2000);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上传失败`);
    }
  };

  const handleExport = async () => {
    message.loading('正在生成报表...');
    setTimeout(() => {
      message.success('报表导出成功');
    }, 1500);
  };

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="总物料数" value={summary.total} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="正常库存"
              value={summary.normal}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="呆滞物料"
              value={summary.stagnant}
              valueStyle={{ color: '#cf1322' }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="严重呆滞"
              value={summary.critical}
              valueStyle={{ color: '#cf1322' }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="库龄分析"
        extra={
          <Space>
            <Upload
              onChange={handleUpload}
              showUploadList={false}
              accept=".xlsx,.xls"
              customRequest={({ file, onSuccess }) => {
                setTimeout(() => onSuccess("ok"), 0);
              }}
            >
              <Button icon={<UploadOutlined />}>上传库存数据</Button>
            </Upload>
            <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>
              导出报表
            </Button>
          </Space>
        }
      >
        <ReactECharts option={getChartOption()} style={{ height: 300, marginBottom: 24 }} />
        
        <Table
          columns={columns}
          dataSource={tableData}
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </div>
  );
};

export default AgingAnalysis;