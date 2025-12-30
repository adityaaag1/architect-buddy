import { ExampleScenario } from '@/types/architecture';

export const exampleScenarios: ExampleScenario[] = [
  {
    id: 'video-streaming',
    title: 'Video Streaming Platform',
    description: 'Netflix-like service with millions of concurrent users',
    icon: '🎬',
    requirements: [
      { id: '1', type: 'functional', text: 'Users can stream video content in real-time', priority: 'high' },
      { id: '2', type: 'functional', text: 'Support for multiple video quality levels (480p, 720p, 1080p, 4K)', priority: 'high' },
      { id: '3', type: 'functional', text: 'Personalized content recommendations', priority: 'medium' },
      { id: '4', type: 'non-functional', text: 'Support 10 million concurrent users globally', priority: 'high' },
      { id: '5', type: 'non-functional', text: 'Video start time < 2 seconds', priority: 'high' },
      { id: '6', type: 'non-functional', text: '99.99% availability', priority: 'high' },
    ],
  },
  {
    id: 'e-commerce',
    title: 'E-Commerce Platform',
    description: 'High-traffic online marketplace with payment processing',
    icon: '🛒',
    requirements: [
      { id: '1', type: 'functional', text: 'Product catalog with search and filters', priority: 'high' },
      { id: '2', type: 'functional', text: 'Shopping cart and checkout flow', priority: 'high' },
      { id: '3', type: 'functional', text: 'Payment processing with multiple providers', priority: 'high' },
      { id: '4', type: 'non-functional', text: 'Handle Black Friday traffic (100x normal load)', priority: 'high' },
      { id: '5', type: 'non-functional', text: 'Checkout latency < 500ms', priority: 'high' },
      { id: '6', type: 'non-functional', text: 'PCI DSS compliance for payment data', priority: 'high' },
    ],
  },
  {
    id: 'real-time-chat',
    title: 'Real-Time Chat System',
    description: 'Slack-like messaging with presence and notifications',
    icon: '💬',
    requirements: [
      { id: '1', type: 'functional', text: 'Real-time message delivery', priority: 'high' },
      { id: '2', type: 'functional', text: 'User presence indicators (online/offline)', priority: 'medium' },
      { id: '3', type: 'functional', text: 'Push notifications for mentions', priority: 'medium' },
      { id: '4', type: 'non-functional', text: 'Message delivery < 100ms', priority: 'high' },
      { id: '5', type: 'non-functional', text: 'Support 1 million concurrent WebSocket connections', priority: 'high' },
      { id: '6', type: 'non-functional', text: 'Message history retention for 7 years', priority: 'medium' },
    ],
  },
  {
    id: 'iot-platform',
    title: 'IoT Data Platform',
    description: 'Process millions of sensor readings per second',
    icon: '📡',
    requirements: [
      { id: '1', type: 'functional', text: 'Ingest data from IoT sensors', priority: 'high' },
      { id: '2', type: 'functional', text: 'Real-time anomaly detection', priority: 'high' },
      { id: '3', type: 'functional', text: 'Historical data analytics dashboard', priority: 'medium' },
      { id: '4', type: 'non-functional', text: 'Process 1 million events per second', priority: 'high' },
      { id: '5', type: 'non-functional', text: 'Data ingestion latency < 50ms', priority: 'high' },
      { id: '6', type: 'non-functional', text: 'Store 5 years of time-series data', priority: 'medium' },
    ],
  },
];
