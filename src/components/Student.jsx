import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Student = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch leads on component mount
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get('http://localhost:5023/api/Students');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const handleAdd = () => {
    setIsEditMode(false);
    setCurrentRecord({});
    setShowModal(true);
  };

  const handleEdit = (record) => {
    setIsEditMode(true);
    setCurrentRecord(record);
    setShowModal(true);
  };

  const handleDelete = async (studentId) => {
    try {
      await axios.delete(`http://localhost:5023/api/Students/${studentId}`);
      setData(data.filter(record => record.id !== studentId));
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        // Update existing record
        await axios.put(`http://localhost:5023/api/Students/${currentRecord.studentId}`, currentRecord);
        setData(data.map(item => (item.studentId === currentRecord.studentId ? currentRecord : item)));
      } else {
        // Add new record
        const response = await axios.post('http://localhost:5023/api/Students', currentRecord);
        setData([...data, response.data]);
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error saving lead:', error);
    }
  };

  return (
    <div className="bg-white p-4">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">User Records</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAdd}>Add Record</button>
      </div>
      <table className="table-auto w-full mt-4 border">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">First Name</th>
            <th className="px-4 py-2">Last Name</th>
            <th className="px-4 py-2">Age</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Phone</th>
            <th className="px-4 py-2">EnrollmentDate</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((record) => (
            <tr key={record.id} className="border-t">
              <td className="px-4 py-2">{record.firstName}</td>
              <td className="px-4 py-2">{record.lastName}</td>
              <td className="px-4 py-2">{record.age}</td>
              <td className="px-4 py-2">{record.email}</td>
              <td className="px-4 py-2">{record.phoneNumber}</td>
              <td className="px-4 py-2">{record.enrollmentDate}</td>
              <td className="px-4 py-2">
                <button className="bg-green-500 text-white px-2 py-1 mr-2 rounded" onClick={() => handleEdit(record)}>Edit</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(record.studentId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popup Form */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-4 md:mx-auto">
            <h2 className="text-xl mb-4">{isEditMode ? 'Edit Record' : 'Add Record'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">First Name</label>
                <input
                  type="text"
                  value={currentRecord.firstName || ''}
                  onChange={(e) => setCurrentRecord({ ...currentRecord, firstName: e.target.value })}
                  className="border rounded w-full py-2 px-3"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Last Name</label>
                <input
                  type="text"
                  value={currentRecord.lastName || ''}
                  onChange={(e) => setCurrentRecord({ ...currentRecord, lastName: e.target.value })}
                  className="border rounded w-full py-2 px-3"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Age</label>
                <input
                  type="text"
                  value={currentRecord.age || ''}
                  onChange={(e) => setCurrentRecord({ ...currentRecord, age: e.target.value })}
                  className="border rounded w-full py-2 px-3"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  value={currentRecord.email || ''}
                  onChange={(e) => setCurrentRecord({ ...currentRecord, email: e.target.value })}
                  className="border rounded w-full py-2 px-3"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Phone</label>
                <input
                  type="text"
                  value={currentRecord.phoneNumber || ''}
                  onChange={(e) => setCurrentRecord({ ...currentRecord, phoneNumber: e.target.value })}
                  className="border rounded w-full py-2 px-3"
                />
              </div>
              
              
              <div className="mb-4">
                <label className="block text-gray-700">Enrollment Date</label>
                <input
                  type="date"
                  value={currentRecord.enrollmentDate || ''}
                  onChange={(e) => setCurrentRecord({ ...currentRecord, enrollmentDate: e.target.value })}
                  className="border rounded w-full py-2 px-3"
                />
              </div>
              <div className="flex justify-end">
                <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded mr-2" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">{isEditMode ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Student;
