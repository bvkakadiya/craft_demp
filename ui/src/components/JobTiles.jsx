import React, { useEffect, useState } from 'react';
import { Table, message } from 'antd';
import JobPostingForm from './JobPostingForm';

const JobTiles = () => {
  const [recentJobs, setRecentJobs] = useState([]);
  const [activeJobs, setActiveJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = async () => {
    try {
      const recentResponse = await fetch('/api/jobs/recent');
      const activeResponse = await fetch('/api/jobs/active');
      const recentData = await recentResponse.json();
      const activeData = await activeResponse.json();
      setRecentJobs(recentData);
      setActiveJobs(activeData);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const columns = [
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Requirements',
      dataIndex: 'requirements',
      key: 'requirements',
    },
    {
      title: 'Posted By',
      dataIndex: 'poster_id',
      key: 'poster_id',
    },
    {
      title: 'Lowest Bid',
      dataIndex: 'lowest_bid_amount',
      key: 'lowest_bid_amount',
      render: (text) => `$${text}`,
    },
    {
      title: 'Number of Bids',
      dataIndex: 'number_of_bids',
      key: 'number_of_bids',
    },
    {
      title: 'Expiration Date',
      dataIndex: 'expiration_date',
      key: 'expiration_date',
      render: (text) => new Date(text).toLocaleString(),
    },
  ];

  return (
    <div>
      <h2>Recent Jobs</h2>
      <Table columns={columns} dataSource={recentJobs} rowKey="id" />

      <h2>Active Jobs</h2>
      <Table columns={columns} dataSource={activeJobs} rowKey="id" />

      <JobPostingForm onJobPosted={fetchJobs} />
    </div>
  );
};

export default JobTiles;