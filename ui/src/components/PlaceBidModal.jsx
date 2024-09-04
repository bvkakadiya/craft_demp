import React from 'react';
import { Modal, Form, Input, Button, message } from 'antd';

const PlaceBidModal = ({ visible, onCancel, jobId, onBidPlaced }) => {
  const handleBidSubmit = async (values) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/bids`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: values.amount,
        }),
      });

      if (response.ok) {
        message.success('Bid placed successfully!');
        onBidPlaced();
        onCancel();
      } else {
        message.error('Failed to place bid.');
      }
    } catch (err) {
      message.error('Failed to place bid.');
    }
  };

  return (
    <Modal
      title="Place a Bid"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form onFinish={handleBidSubmit} layout="vertical">
        <Form.Item
          name="amount"
          label="Bid Amount"
          rules={[{ required: true, message: 'Please enter your bid amount' }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit Bid
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PlaceBidModal;