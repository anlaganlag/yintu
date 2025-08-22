import React, { useState } from 'react';
import { Card, Row, Col, Progress, Tag, List, Timeline, Statistic, Badge } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, SyncOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const ProductionBoard = () => {
  const [orders] = useState([
    {
      id: 'PO001',
      product: '成品A',
      quantity: 100,
      completed: 65,
      status: 'in_progress',
      deadline: '2025-01-15',
      priority: 'high',
    },
    {
      id: 'PO002',
      product: '成品B',
      quantity: 50,
      completed: 20,
      status: 'in_progress',
      deadline: '2025-01-20',
      priority: 'medium',
    },
    {
      id: 'PO003',
      product: '成品C',
      quantity: 75,
      completed: 0,
      status: 'pending',
      deadline: '2025-01-25',
      priority: 'low',
    },
    {
      id: 'PO004',
      product: '成品D',
      quantity: 30,
      completed: 30,
      status: 'completed',
      deadline: '2025-01-10',
      priority: 'high',
    },
  ]);

  const getStatusTag = (status) => {
    const statusMap = {
      pending: { color: 'default', text: '待生产', icon: <ClockCircleOutlined /> },
      in_progress: { color: 'processing', text: '生产中', icon: <SyncOutlined spin /> },
      completed: { color: 'success', text: '已完成', icon: <CheckCircleOutlined /> },
      delayed: { color: 'error', text: '延期', icon: <ExclamationCircleOutlined /> },
    };
    const config = statusMap[status] || statusMap.pending;
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  const getPriorityBadge = (priority) => {
    const colorMap = {
      high: '#f5222d',
      medium: '#fa8c16',
      low: '#52c41a',
    };
    return <Badge color={colorMap[priority]} text={priority.toUpperCase()} />;
  };

  const KanbanColumn = ({ title, status, orders, color }) => (
    <Card
      title={
        <span>
          <Badge color={color} />
          {title} ({orders.length})
        </span>
      }
      bodyStyle={{ padding: '12px' }}
    >
      <List
        dataSource={orders}
        renderItem={(order) => (
          <Card
            size="small"
            style={{ marginBottom: 8 }}
            hoverable
          >
            <div style={{ marginBottom: 8 }}>
              <strong>{order.id}</strong> - {order.product}
            </div>
            <div style={{ marginBottom: 8 }}>
              数量: {order.completed}/{order.quantity}
            </div>
            <Progress
              percent={Math.round((order.completed / order.quantity) * 100)}
              size="small"
              strokeColor={order.completed === order.quantity ? '#52c41a' : '#1890ff'}
            />
            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
              <span>截止: {order.deadline}</span>
              {getPriorityBadge(order.priority)}
            </div>
          </Card>
        )}
      />
    </Card>
  );

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="今日计划" value={4} suffix="单" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="生产中"
              value={2}
              suffix="单"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已完成"
              value={1}
              suffix="单"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="完成率"
              value={65}
              suffix="%"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <KanbanColumn
            title="待生产"
            status="pending"
            orders={orders.filter(o => o.status === 'pending')}
            color="#d9d9d9"
          />
        </Col>
        <Col span={6}>
          <KanbanColumn
            title="备料中"
            status="preparing"
            orders={[]}
            color="#fa8c16"
          />
        </Col>
        <Col span={6}>
          <KanbanColumn
            title="生产中"
            status="in_progress"
            orders={orders.filter(o => o.status === 'in_progress')}
            color="#1890ff"
          />
        </Col>
        <Col span={6}>
          <KanbanColumn
            title="已完成"
            status="completed"
            orders={orders.filter(o => o.status === 'completed')}
            color="#52c41a"
          />
        </Col>
      </Row>

      <Card title="生产进度时间线">
        <Timeline mode="left">
          <Timeline.Item color="green">
            08:00 - PO004 成品D 生产完成
          </Timeline.Item>
          <Timeline.Item color="blue">
            10:30 - PO001 成品A 开始生产
          </Timeline.Item>
          <Timeline.Item color="blue">
            14:00 - PO002 成品B 开始生产
          </Timeline.Item>
          <Timeline.Item color="gray">
            16:00 - PO003 成品C 计划生产
          </Timeline.Item>
        </Timeline>
      </Card>
    </div>
  );
};

export default ProductionBoard;