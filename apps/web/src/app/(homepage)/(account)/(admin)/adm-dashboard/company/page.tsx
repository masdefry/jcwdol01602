'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '@/lib/axios';
import useAuthStore from '@/stores/authStores';
import { ICompanyById } from '@/lib/interface';

interface EditedData {
  name: string;
  phone: string;
  address: string;
  website: string;
  description: string;
}

const CompanyPage = () => {
  const account = useAuthStore((state) => state.account);
  const [company, setCompany] = useState<ICompanyById>();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<EditedData>({
    name: '',
    phone: '',
    address: '',
    website: '',
    description: '',
  });

  useEffect(() => {
    const getCompanyDataById = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/api/company/data/admin/${account?.id}`
        );
        setCompany(data.company);
        setEditedData({
          name: data.company?.account.name || '',
          phone: data.company?.phone || '',
          address: data.company?.address || '',
          website: data.company?.website || '',
          description: data.company?.description || '',
        });
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || 'Something went wrong!';
        toast.error(errorMessage);
      }
    };
    getCompanyDataById();
  }, [account?.id]);

  const handleEdit = () => {
    if (!company) return;
    setIsEditing(true);
    setEditedData({
      name: company.account.name || '',
      phone: company.phone || '',
      address: company.address || '',
      website: company.website || '',
      description: company.description || '',
    });
  };

  const handleSave = async () => {
    try {
      if (!account || !company) return;

      await axiosInstance.patch(`/api/company/edit/${account.id}`, {
        name: editedData.name,
        phone: editedData.phone,
        address: editedData.address,
        website: editedData.website,
        desc: editedData.description,
      });

      const { data } = await axiosInstance.get(
        `/api/company/data/admin/${account?.id}`
      );
      setCompany(data.company);
      setIsEditing(false);
      toast.success('Company updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update company');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      {!company ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-md"> {/* Increased max-w-6xl */}
          <div className="flex gap-6 items-start">
            <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-purple-300">
              <Image
                src={company.account.avatar}
                alt={`${company.account.name}' avatar`}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    value={editedData.name}
                    onChange={handleInputChange}
                    placeholder="Company Name"
                    className="w-full p-3 border rounded-md focus:ring focus:ring-purple-200"
                  />
                  <input
                    type="text"
                    name="phone"
                    value={editedData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone"
                    className="w-full p-3 border rounded-md focus:ring focus:ring-purple-200"
                  />
                  <input
                    type="text"
                    name="address"
                    value={editedData.address}
                    onChange={handleInputChange}
                    placeholder="Address"
                    className="w-full p-3 border rounded-md focus:ring focus:ring-purple-200"
                  />
                  <input
                    type="text"
                    name="website"
                    value={editedData.website}
                    onChange={handleInputChange}
                    placeholder="Website"
                    className="w-full p-3 border rounded-md focus:ring focus:ring-purple-200"
                  />
                  <textarea
                    name="description"
                    value={editedData.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                    className="w-full p-3 border rounded-md focus:ring focus:ring-purple-200"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="bg-purple-600 text-white p-3 rounded-md hover:bg-purple-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-300 p-3 rounded-md hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <h1 className="text-2xl font-semibold text-purple-800">{company.account.name}</h1>
                  <p className="text-gray-600">{company.account.email}</p>
                  <p className="text-gray-700">{company.phone || 'No phone number provided'}</p>
                  <p className="text-gray-700">{company.address || 'No address provided'}</p>
                  <p className="text-gray-700">{company.website || 'No website provided'}</p>
                  <p className="text-gray-700">{company.description || 'No description provided'}</p>
                  <button
                    onClick={handleEdit}
                    className="bg-purple-500 text-white p-3 rounded-md hover:bg-purple-600 transition-colors"
                  >
                    Edit Company
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompanyPage;
