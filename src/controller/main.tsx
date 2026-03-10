import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Card, Input, Button, Typography, Space, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { findFiberByComponentName, getFiberInfo, getComponentName, getTargetFiberRoot, traverseFiberTree } from '../shared/fiber-utils';

const { Title, Text } = Typography;

function ControllerApp() {
  const [searchName, setSearchName] = useState('Counter');
  const [foundName, setFoundName] = useState('');
  const [fiberInfo, setFiberInfo] = useState('');
  const [components, setComponents] = useState<string[]>([]);

  useEffect(() => {
    const rootFiber = getTargetFiberRoot();
    if (rootFiber) {
      const list: string[] = [];
      traverseFiberTree(rootFiber, (f) => {
        const name = f.type ? getComponentName(f.type) : null;
        if (name && !list.includes(name)) list.push(name);
      });
      setComponents(list);
    }
  }, []);

  const handleFind = () => {
    const rootFiber = getTargetFiberRoot();
    if (!rootFiber) {
      message.error('找不到 fiber 根节点');
      return;
    }
    const fiber = findFiberByComponentName(rootFiber, searchName);
    if (fiber) {
      const info = getFiberInfo(fiber);
      setFoundName(info.name);
      setFiberInfo(JSON.stringify(info, null, 2));
      message.success(`找到组件: ${info.name}`);
    } else {
      setFoundName('');
      setFiberInfo('');
      message.error(`未找到组件: ${searchName}`);
    }
  };

  return (
    <div>
      <Title level={2}>控制面板</Title>
      <Text type="secondary">通过组件名称查找左侧目标应用中的组件</Text>

      <Card title="查找组件" style={{ marginTop: 16 }}>
        <Space.Compact style={{ width: '100%', marginBottom: 16 }}>
          <Input
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
            placeholder="输入组件名称"
            prefix={<SearchOutlined />}
            onPressEnter={handleFind}
          />
          <Button type="primary" onClick={handleFind}>查找</Button>
        </Space.Compact>
        <Text type="secondary">可用组件: {components.filter(c => !['div', 'span', 'button'].includes(c)).join(', ')}</Text>
      </Card>

      {foundName && (
        <Card title="组件信息" style={{ marginTop: 16 }}>
          <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: 12, borderRadius: 4, fontSize: 12 }}>
            {fiberInfo}
          </pre>
        </Card>
      )}
    </div>
  );
}

const controllerRootElement = document.getElementById('controller-root');
if (controllerRootElement) {
  const root = createRoot(controllerRootElement);
  root.render(<ControllerApp />);
}
