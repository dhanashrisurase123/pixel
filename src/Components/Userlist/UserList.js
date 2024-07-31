import React, { useEffect, useState } from 'react';
import userService from '../../services/userService';
import axios from 'axios';
import './UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]); // State to store users
  const [currentPage, setCurrentPage] = useState(1); // State to track the current page
  const [totalUsers, setTotalUsers] = useState(0); // State to store total number of users
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' }); // State to handle sorting
  const [filters, setFilters] = useState({ gender: '', country: '' }); // State to handle filters
  const usersPerPage = 10; // Number of users to display per page

  // Effect to fetch users when the component mounts or when currentPage, sortConfig, or filters change
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getUsers(currentPage, usersPerPage);
        setUsers(data);
      } catch (error) {
        console.error('There was an error fetching the user data!', error);
      }
    };

    fetchUsers();
  }, [currentPage, sortConfig, filters]);

  // Effect to fetch total number of users when the component mounts
  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const response = await axios.get('https://dummyjson.com/users');
        setTotalUsers(response.data.total);
      } catch (error) {
        console.error('There was an error fetching the total user count!', error);
      }
    };

    fetchTotalUsers();
  }, []);

  // Function to handle sorting by a specified key
  const handleSort = (key) => {
    const direction = sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
    setSortConfig({ key, direction });
  };

  // Sort users based on sortConfig
  const sortedUsers = [...users].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
    return 0;
  });

  // Filter users based on gender and country
  const filteredUsers = sortedUsers.filter(user => {
    return (!filters.gender || user.gender === filters.gender) &&
           (!filters.country || user.address.country.toLowerCase() === filters.country.toLowerCase());
  });

  // Function to handle pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Get unique countries for the country filter dropdown
  const uniqueCountries = Array.from(new Set(users.map(user => user.address.country)));

  return (
    <div className="user-list-container">
      <h1>Employees</h1>
      <div className="filters">
        <label>Gender:
          <select onChange={(e) => setFilters({ ...filters, gender: e.target.value })} value={filters.gender}>
            <option value="">All</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
        <label>Country:
          <select onChange={(e) => setFilters({ ...filters, country: e.target.value })} value={filters.country}>
            <option value="">All</option>
            {uniqueCountries.map((country, index) => (
              <option key={index} value={country}>{country}</option>
            ))}
          </select>
        </label>
      </div>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('id')}>ID</th>
            <th>Image</th>
            <th onClick={() => handleSort('firstName')}>Full Name</th>
            <th>Demography</th>
            <th onClick={() => handleSort('age')}>Age</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td><img src={user.image} alt={`${user.firstName} ${user.lastName}`} /></td>
              <td>{`${user.firstName} ${user.lastName}`}</td>
              <td>{`${user.gender[0].toUpperCase()}/${user.age}`}</td>
              <td>{user.company.title}</td>
              <td>{`${user.address.state}, ${user.address.country}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: Math.ceil(totalUsers / usersPerPage) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserList;
