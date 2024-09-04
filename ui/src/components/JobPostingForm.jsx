import React from 'react';
import { Form, Input, Button, DatePicker, message } from 'antd';

const { TextArea } = Input;

const JobPostingForm = ({ onJobPosted }) => {
  const onFinish = async (values) => {
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: values.description,
          requirements: values.requirements,
          poster_id: 1, // Replace with actual poster ID
          expiration_date: values.expiration_date.toISOString(),
        }),
      });

      if (response.ok) {
        message.success('Job posted successfully!');
        onJobPosted();
      } else {
        message.error('Failed to post job.');
      }
    } catch (err) {
      message.error('Failed to post job.');
    }
  };

  return (
    <div>
      <h2>Post a New Job</h2>
      <Form onFinish={onFinish} layout="vertical">
        <Form.Item
          name="description"
          label="Job Description"
          rules={[{ required: true, message: 'Please enter the job description' }]}
        >
          <TextArea rows={4} maxLength={16384} />
        </Form.Item>
        <Form.Item
          name="requirements"
          label="Job Requirements"
          rules={[{ required: true, message: 'Please enter the job requirements' }]}
        >
          <TextArea rows={4} maxLength={16384} />
        </Form.Item>
        <Form.Item
          name="expiration_date"
          label="Expiration Date"
          rules={[{ required: true, message: 'Please select the expiration date' }]}
        >
          <DatePicker showTime />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Post Job
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default JobPostingForm;