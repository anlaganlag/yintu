import React, { useState } from 'react';
import { Layout, Menu, ConfigProvider } from 'antd';
import {
  DashboardOutlined,
  DatabaseOutlined,
  PartitionOutlined,
  DollarOutlined,
  ProjectOutlined
} from '@ant-design/icons';
import zhCN from 'antd/locale/zh_CN';
import AgingAnalysis from './pages/AgingAnalysis';
import BOMMatching from './pages/BOMMatching';
import CostAnalysis from './pages/CostAnalysis';
import ProductionBoard from './pages/ProductionBoard';
import './App.css';

const { Header, Sider, Content } = Layout;

function App() {
  const [selectedKey, setSelectedKey] = useState('1');

  const menuItems = [
    {
      key: '1',
      icon: <DatabaseOutlined />,
      label: '库龄分析',
    },
    {
      key: '2',
      icon: <PartitionOutlined />,
      label: 'BOM匹配',
    },
    {
      key: '3',
      icon: <ProjectOutlined />,
      label: '生产看板',
    },
    {
      key: '4',
      icon: <DollarOutlined />,
      label: '成本分析',
    },
  ];

  const renderContent = () => {
    switch (selectedKey) {
      case '1':
        return <AgingAnalysis />;
      case '2':
        return <BOMMatching />;
      case '3':
        return <ProductionBoard />;
      case '4':
        return <CostAnalysis />;
      default:
        return <AgingAnalysis />;
    }
  };

  return (
    <ConfigProvider locale={zhCN}>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
            <DashboardOutlined style={{ marginRight: '10px' }} />
            银途工厂管理系统
          </div>
        </Header>
        <Layout>
          <Sider width={200} style={{ background: '#fff' }}>
            <Menu
              mode="inline"
              selectedKeys={[selectedKey]}
              style={{ height: '100%', borderRight: 0 }}
              items={menuItems}
              onClick={(e) => setSelectedKey(e.key)}
            />
          </Sider>
          <Layout style={{ padding: '24px' }}>
            <Content
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
                background: '#fff',
                borderRadius: '8px',
              }}
            >
              {renderContent()}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default App;